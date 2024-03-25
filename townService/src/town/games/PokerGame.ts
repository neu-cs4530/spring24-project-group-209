import InvalidParametersError, {
  BOARD_POSITION_NOT_VALID_MESSAGE,
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  GAME_NOT_STARTABLE_MESSAGE,
  MOVE_NOT_YOUR_TURN_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import {
  Card,
  DeckOfCards,
  GameMove,
  PlayerID,
  PokerAction,
  PokerGameState,
  PokerMove,
  SeatNumber,
} from '../../types/CoveyTownSocket';
import BasicDeck from './BasicDeck';
import Game from './Game';
import { DEFAULT_BIG_BLIND, DEFAULT_BUY_IN, DEFAULT_SMALL_BLIND } from './PokerGameDefaults';

/**
 * A PokerGame is a game which implements the rules of poker.
 */
export default class PokerGame extends Game<PokerGameState, PokerMove> {
  protected _deck: DeckOfCards;

  protected _preferredSeats?: Map<PlayerID, SeatNumber>;

  protected _oldBalances?: Map<PlayerID, number>;

  protected _foldedPlayers: Map<SeatNumber, boolean> = new Map<SeatNumber, boolean>();

  private _pot: number;

  private _firstPlayer: SeatNumber;

  private _next: SeatNumber;

  private _currentBets: Map<SeatNumber, number> = new Map<SeatNumber, number>();

  private _maxBets: Map<SeatNumber, number> = new Map<SeatNumber, number>();

  private _maxBetsCapped: Map<SeatNumber, boolean> = new Map<SeatNumber, boolean>();

  private _round = 0;

  /**
   * Creates a new PokerGame.
   * @param deck If provided, the new game will be created with the specified deck object as
   * the deck it uses, otherwise, it will instantiate a new BasicDeck object and use that instead.
   * @param priorGame If provided, the new game will be created such that if any player from
   * the previous poker game joins the new game they will be seated at the same seat as before,
   * their balance from the previous game will carry over,
   * and the blind will be the next seat after the previous blind.
   */
  public constructor(deck?: DeckOfCards, priorGame?: PokerGame) {
    const initialOccupiedSeats = new Map<SeatNumber, PlayerID | undefined>();
    const initialReadyPlayers = new Map<SeatNumber, boolean | undefined>();
    const initialPlayerBalances = new Map<SeatNumber, number | undefined>();
    for (let i = 0; i < 8; i++) {
      initialOccupiedSeats.set(i as SeatNumber, undefined);
      initialReadyPlayers.set(i as SeatNumber, undefined);
      initialPlayerBalances.set(i as SeatNumber, undefined);
    }

    let priorSmallBlind = 0 as SeatNumber;
    if (priorGame) priorSmallBlind = priorGame.state.smallBlind;

    super({
      moves: [],
      smallBlind: priorSmallBlind,
      status: 'WAITING_FOR_PLAYERS',
      occupiedSeats: initialOccupiedSeats,
      readyPlayers: initialReadyPlayers,
      playerBalances: initialPlayerBalances,
    });

    for (let i = 0; i < 8; i++) {
      this._foldedPlayers.set(i as SeatNumber, false);
      this._currentBets.set(i as SeatNumber, 0);
    }

    if (deck) {
      this._deck = deck;
    } else {
      this._deck = new BasicDeck();
    }

    if (priorGame) {
      this._preferredSeats = new Map<PlayerID, SeatNumber>();
      this._oldBalances = new Map<PlayerID, number>();
      for (let i = 0; i < 8; i++) {
        const p = priorGame.state.occupiedSeats.get(i as SeatNumber);
        if (p) {
          this._preferredSeats.set(p, i as SeatNumber);
          this._oldBalances.set(p, priorGame.state.playerBalances.get(i as SeatNumber));
        }
      }
    }

    this._pot = 0;
    this._next = 0;
    this._firstPlayer = 0;
  }

  /**
   * Gets the next occupied seat in the turn order
   */
  private _getNextSeat(from: SeatNumber): SeatNumber {
    let current: SeatNumber;
    if (from === 7) current = 0;
    else current = (from + 1) as SeatNumber;

    while (
      this.state.occupiedSeats.get(current) === undefined ||
      this._foldedPlayers.get(current)
    ) {
      if (current === 7) current = 0;
      else current += 1;
    }

    return current;
  }

  /**
   * Gets the first available open seat for a player
   * @returns SeatNumber corresponding to the next open seat, or undefined if all seats are full
   */
  private _getNextOpenSeat(): SeatNumber | undefined {
    let current = 0 as SeatNumber;

    while (this.state.occupiedSeats.get(current) !== undefined) {
      if (current === 7) return undefined;
      current += 1;
    }

    return current;
  }

  /**
   * Given a player ID, returns the seat that that player is sitting at, or undefined if they are not in the game
   * @param playerID The player ID to find the seat of
   * @returns a SeatNumber representing the player seat, or undefined if the player is not in the game
   */
  private _getPlayerSeat(playerID: string): SeatNumber | undefined {
    for (let i = 0; i < 8; i++) {
      if (this.state.occupiedSeats.get(i as SeatNumber) === playerID) return i as SeatNumber;
    }
    return undefined;
  }

  /**
   * Get's the current wager a player would need to match to call in the current round
   * @returns A number representing the amount of the current bet
   */
  private _getMaxBet(): number {
    let currentMax = 0;
    for (let i = 0; i < 8; i++) {
      const bet = this._currentBets.get(i as SeatNumber);
      if (bet && bet > currentMax) currentMax = bet;
    }
    return currentMax;
  }

  /**
   * Indicates a player is ready to start the game.
   *
   * Updates the game state to indicate the player is ready to start the game.
   *
   * If there are at least two players in the game, and all players are ready, the game will start.
   *
   * The blind is determined as follows:
   *  - If no players in the game were in the previous game, or if there was no previous game, the blind is the first occupied seat.
   *  - If any players in the game were in the previous game, the blind will be the next occupied seat after the blind from the previous game.
   *  - If a player from the previous game left the game and then joined this one, they will be treated as a new player.
   *
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   * @throws InvalidParametersError if the game is not in the WAITING_TO_START or WAITING_FOR_PLAYERS state (GAME_NOT_STARTABLE_MESSAGE)
   *
   * @param player The player who is ready to start the game
   */
  public startGame(player: Player): void {
    const seat = this._getPlayerSeat(player.id);
    if (seat === undefined) throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    if (
      (this.state.status !== 'WAITING_TO_START' && this.state.status !== 'WAITING_FOR_PLAYERS') ||
      (this.state.status === 'WAITING_FOR_PLAYERS' && this._players.length === 1)
    )
      throw new InvalidParametersError(GAME_NOT_STARTABLE_MESSAGE);

    this.state.readyPlayers.set(seat, true);

    for (let i = 0; i < 8; i++) {
      if (this.state.readyPlayers.get(i as SeatNumber) === false) return;
    }

    if (!this._preferredSeats || this._preferredSeats.size === 0) this.state.smallBlind = 0;
    else this.state.smallBlind = this._getNextSeat(this.state.smallBlind);
    this.state.status = 'IN_PROGRESS';

    this.state.playerBalances.set(
      this.state.smallBlind,
      this.state.playerBalances.get(this.state.smallBlind) - DEFAULT_SMALL_BLIND,
    );
    this.state.playerBalances.set(
      this._getNextSeat(this.state.smallBlind),
      this.state.playerBalances.get(this._getNextSeat(this.state.smallBlind)) - DEFAULT_BIG_BLIND,
    );

    this._pot = DEFAULT_SMALL_BLIND + DEFAULT_BIG_BLIND;
    this._next = this._getNextSeat(this._getNextSeat(this.state.smallBlind));
    this._firstPlayer = this._next;
    this._currentBets.set(this.state.smallBlind, DEFAULT_SMALL_BLIND);
    this._currentBets.set(this._getNextSeat(this.state.smallBlind), DEFAULT_BIG_BLIND);

    this._deck.shuffle();

    for (let i = 0; i < 8; i++) {
      const p = this.state.occupiedSeats.get(i as SeatNumber);
      if (p) {
        const newMoves = [
          ...this.state.moves,
          { moveType: 'DEAL' as PokerAction, card: this._deck.drawCard(), player: i as SeatNumber },
          { moveType: 'DEAL' as PokerAction, card: this._deck.drawCard(), player: i as SeatNumber },
        ];
        const newState: PokerGameState = {
          ...this.state,
          moves: newMoves,
        };
        this.state = newState;
      }
    }
  }

  /**
   * Applies a move to the game.
   * Uses the player's id to determine which seat they are sitting at.
   *
   * Validates the move, and if it is valid, applies it to the game state.
   *
   * If the move ends the game, updates the game state to reflect the end of the game,
   * setting the status to "OVER" and the winner to the player who won the pot, or to a tie if
   * two or more players tied the game.
   *
   * @param move The move to attempt to apply
   *
   * @throws InvalidParametersError if the game is not in progress (GAME_NOT_IN_PROGRESS_MESSAGE)
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   * @throws INvalidParametersError if the move is not the player's turn (MOVE_NOT_YOUR_TURN_MESSAGE)
   * @throws InvalidParametersError if the move is invalid per the rules of poker (BOARD_POSITION_NOT_VALID_MESSAGE)
   */
  public applyMove(move: GameMove<PokerMove>): void {
    if (this.state.status !== 'IN_PROGRESS')
      throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
    const seat = this._getPlayerSeat(move.playerID);
    if (seat === undefined) throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    if (seat !== this._next) throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    move.move.player = seat;

    switch (move.move.moveType) {
      case 'CALL': {
        const curBet = this._currentBets.get(seat);
        if (curBet === undefined) throw new Error('Issue with recording bets');
        if (
          this.state.playerBalances.get(seat) < this._getMaxBet() - curBet &&
          !this._maxBetsCapped.get(seat)
        ) {
          this._pot += curBet;
          this.state.playerBalances.set(seat, 0);
          this._maxBets.set(seat, this._pot);
          this._maxBetsCapped.set(seat, false);
        } else if (this.state.playerBalances.get(seat) === 0) {
          break;
        } else {
          this.state.playerBalances.set(
            seat,
            this.state.playerBalances.get(seat) - (this._getMaxBet() - curBet),
          );
          this._pot += this._getMaxBet() - curBet;
          this._currentBets.set(seat, this._getMaxBet());
          for (let i = 0; i < 8; i++) {
            const maxBet = this._maxBets.get(i as SeatNumber);
            if (maxBet && !this._maxBetsCapped.get(i as SeatNumber))
              this._maxBets.set(i as SeatNumber, maxBet + curBet);
          }
        }
        break;
      }
      case 'CHECK': {
        if (this._currentBets.get(seat) !== this._getMaxBet()) {
          if (this.state.playerBalances.get(seat) === 0) {
            // All in
          } else {
            throw new InvalidParametersError(BOARD_POSITION_NOT_VALID_MESSAGE);
          }
        }
        break;
      }
      case 'FOLD': {
        this._foldedPlayers.set(seat, true);
        const remaining = this._oneRemainingPlayer();
        if (remaining) {
          this._payOut([remaining]);
          return;
        }
        if (this._firstPlayer === seat) this._firstPlayer = this._getNextSeat(this._firstPlayer);
        break;
      }
      case 'RAISE': {
        const curBet = this._currentBets.get(seat);
        if (curBet === undefined) throw new Error('Issue with recording bets');
        if (
          move.move.raiseAmount === undefined ||
          this.state.playerBalances.get(seat) < this._getMaxBet() - curBet + move.move.raiseAmount
        )
          throw new InvalidParametersError(BOARD_POSITION_NOT_VALID_MESSAGE);
        this.state.playerBalances.set(
          seat,
          this.state.playerBalances.get(seat) -
            (this._getMaxBet() - curBet + move.move.raiseAmount),
        );
        this._pot += this._getMaxBet() - curBet + move.move.raiseAmount;
        this._currentBets.set(seat, this._getMaxBet() + move.move.raiseAmount);

        for (let i = 0; i < 8; i++) {
          const maxBet = this._maxBets.get(i as SeatNumber);
          if (maxBet && !this._maxBetsCapped.get(i as SeatNumber)) {
            this._maxBets.set(i as SeatNumber, maxBet + curBet);
            this._maxBetsCapped.set(i as SeatNumber, true);
          }
        }

        if (this.state.playerBalances.get(seat) === 0) {
          this._maxBets.set(seat, this._pot);
          this._maxBetsCapped.set(seat, false);
        }
        break;
      }
      default:
        throw new InvalidParametersError(BOARD_POSITION_NOT_VALID_MESSAGE);
    }

    this._next = this._getNextSeat(this._next);

    const newMoves = [...this.state.moves, move.move];
    const newState: PokerGameState = {
      ...this.state,
      moves: newMoves,
    };
    this.state = newState;

    if (this._next !== this._firstPlayer) return;

    const movesThisRound: Array<PokerMove> = [];
    let i = this.state.moves.length - 1;
    while (i >= 0) {
      if (this.state.moves[i].moveType === 'DEAL') break;
      movesThisRound.push(this.state.moves[i]);
      if (this.state.moves[i].player === this._firstPlayer) break;
      i -= 1;
    }

    if (movesThisRound.filter(m => m.moveType !== 'RAISE').length === movesThisRound.length) {
      if (this._round === 0) {
        const deal = [
          ...this.state.moves,
          { moveType: 'DEAL' as PokerAction, card: this._deck.drawCard() },
          { moveType: 'DEAL' as PokerAction, card: this._deck.drawCard() },
          { moveType: 'DEAL' as PokerAction, card: this._deck.drawCard() },
        ];
        const dealState: PokerGameState = {
          ...this.state,
          moves: deal,
        };
        this.state = dealState;
        this._round += 1;
      } else if (this._round > 0 && this._round < 3) {
        const deal = [
          ...this.state.moves,
          { moveType: 'DEAL' as PokerAction, card: this._deck.drawCard() },
        ];
        const dealState: PokerGameState = {
          ...this.state,
          moves: deal,
        };
        this.state = dealState;
        this._round += 1;
      } else {
        const winners = this._determineWinner();
        this._payOut(winners);
      }
    }
  }

  /**
   * Given a set of winning players, pays them out based on dividing the pot and handling all-in maximum wins.
   * @param winners The player(s) who won the hand
   */
  private _payOut(winners: Array<SeatNumber>): void {
    if (winners.length === 1) {
      this.state.status = 'OVER';
      this.state.winner = this.state.occupiedSeats.get(winners[0]);
      const maxWin = this._maxBets.get(winners[0]);
      if (maxWin) {
        this.state.playerBalances.set(
          winners[0],
          this.state.playerBalances.get(winners[0]) + maxWin,
        );
        this._pot -= maxWin;
        let playersToRefund: Array<SeatNumber> = [];
        for (let i = 0; i < 8; i++) {
          const pbet = this._currentBets.get(i as SeatNumber);
          if (pbet) playersToRefund.push(i as SeatNumber);
        }

        playersToRefund = playersToRefund.filter(p => p !== winners[0]);
        for (let i = 0; i < playersToRefund.length; i++) {
          this.state.playerBalances.set(
            playersToRefund[i],
            this.state.playerBalances.get(playersToRefund[i]) +
              Math.floor(this._pot / playersToRefund.length),
          );
        }
      } else {
        this.state.playerBalances.set(
          winners[0],
          this.state.playerBalances.get(winners[0]) + this._pot,
        );
      }
    } else {
      this.state.status = 'OVER';
      this.state.winner = undefined;
      for (let win = 0; win < winners.length; win++) {
        this.state.playerBalances.set(
          winners[win],
          this.state.playerBalances.get(winners[win]) + this._pot / winners.length,
        );
      }
    }
  }

  /**
   * Given a player, gets the value of their poker hand and returns it as a pair of numbers,
   * where the first number represents the value of the hand (with straight flush being 8, and high card being 0),
   * while the second value is the rank of the highest card used to make that hand for brekaing ties.
   * @param seat The player to get the value of their hand
   * @returns Two numbers representing the value of their hand
   */
  private _getHandValue(seat: SeatNumber): [number, number] {
    const handMoves = this.state.moves.filter(
      m => m.moveType === 'DEAL' && (m.player === seat || m.player === undefined),
    );

    const hand: Array<Card> = [];
    for (let i = 0; i < handMoves.length; i++) {
      const { card } = handMoves[i];
      if (card !== undefined) hand.push(card);
    }

    hand.sort((a, b) => {
      if (a.face < b.face) return -1;
      if (b.face < a.face) return 1;
      return 0;
    });

    const isStraightFlush = (h: Array<Card>) => {
      for (let i = 0; i < h.length; i++) {
        if (
          h.filter(c => c.face === h[i].face + 1 && c.suite === h[i].suite).length > 0 &&
          h.filter(c => c.face === h[i].face + 2 && c.suite === h[i].suite).length > 0 &&
          h.filter(c => c.face === h[i].face + 3 && c.suite === h[i].suite).length > 0 &&
          h.filter(
            c =>
              (c.face === h[i].face + 4 || (c.face === 1 && h[i].face + 3 === 13)) &&
              c.suite === h[i].suite,
          ).length > 0
        )
          return h[i + 4].face as number;
      }
      return 0;
    };

    const isFourOfAKind = (h: Array<Card>) => {
      for (let i = 0; i < h.length; i++) {
        if (h.filter(c => c.face === h[i].face).length === 4) return h[i].face as number;
      }
      return 0;
    };

    const isFullHouse = (h: Array<Card>) => {
      for (let i = 0; i < h.length; i++) {
        if (h.filter(c => c.face === h[i].face).length === 3) {
          for (let j = 0; j < h.length; j++) {
            if (h[j].face !== h[i].face && h.filter(c => c.face === h[j].face).length === 2)
              return h[i].face;
          }
        }
      }
      return 0;
    };

    const isFlush = (h: Array<Card>) => {
      const diamonds = h.filter(c => c.suite === 'DIAMONDS');
      const clubs = h.filter(c => c.suite === 'CLUBS');
      const hearts = h.filter(c => c.suite === 'HEARTS');
      const spades = h.filter(c => c.suite === 'SPADES');

      if (diamonds.length > 4) return diamonds[diamonds.length - 1].face;
      if (clubs.length > 4) return clubs[clubs.length - 1].face;
      if (hearts.length > 4) return hearts[hearts.length - 1].face;
      if (spades.length > 4) return spades[spades.length - 1].face;

      return 0;
    };

    const isStraight = (h: Array<Card>) => {
      for (let i = 0; i < h.length; i++) {
        if (
          h.filter(c => c.face === h[i].face + 1).length > 0 &&
          h.filter(c => c.face === h[i].face + 2).length > 0 &&
          h.filter(c => c.face === h[i].face + 3).length > 0 &&
          h.filter(c => c.face === h[i].face + 4 || (c.face === 1 && h[i].face + 3 === 13)).length >
            0
        )
          return h[i + 4].face as number;
      }
      return 0;
    };

    const isThreeOfAKind = (h: Array<Card>) => {
      for (let i = 0; i < h.length; i++) {
        if (h.filter(c => c.face === h[i].face).length === 3) return h[i].face as number;
      }
      return 0;
    };

    const isTwoPair = (h: Array<Card>) => {
      for (let i = 0; i < h.length; i++) {
        if (h.filter(c => c.face === h[i].face).length === 2) {
          for (let j = 0; j < h.length; j++) {
            if (h[j].face !== h[i].face && h.filter(c => c.face === h[j].face).length === 2)
              if (h[i].face > h[j].face) return h[i].face;
              else return h[j].face;
          }
        }
      }
      return 0;
    };

    const isPair = (h: Array<Card>) => {
      for (let i = 0; i < h.length; i++) {
        if (h.filter(c => c.face === h[i].face).length === 2) return h[i].face as number;
      }
      return 0;
    };

    if (isStraightFlush(hand)) {
      return [8, isStraightFlush(hand)];
    }
    if (isFourOfAKind(hand)) {
      return [7, isFourOfAKind(hand)];
    }
    if (isFullHouse(hand)) {
      return [6, isFullHouse(hand)];
    }
    if (isFlush(hand)) {
      return [5, isFlush(hand)];
    }
    if (isStraight(hand)) {
      return [4, isStraight(hand)];
    }
    if (isThreeOfAKind(hand)) {
      return [3, isThreeOfAKind(hand)];
    }
    if (isTwoPair(hand)) {
      return [2, isTwoPair(hand)];
    }
    if (isPair(hand)) {
      return [1, isPair(hand)];
    }
    return [0, hand[hand.length - 1].face];
  }

  private _determineWinner(): Array<SeatNumber> {
    let seat = this._next;
    let currentWinners = [seat];
    let currentMax = this._getHandValue(seat);
    while (this._getNextSeat(seat) !== this._next) {
      seat = this._getNextSeat(seat);
      const curValue = this._getHandValue(seat);
      if (
        curValue[0] > currentMax[0] ||
        (curValue[0] === currentMax[0] &&
          (curValue[1] > currentMax[1] || (curValue[1] === 1 && currentMax[1] !== 1)))
      ) {
        currentWinners = [seat];
        currentMax = curValue;
      } else if (curValue[0] === currentMax[0] && curValue[1] === currentMax[1]) {
        currentWinners.push(seat);
      }
    }

    return currentWinners;
  }

  private _oneRemainingPlayer(): SeatNumber | undefined {
    let numberInGame = 0;
    let lastPlayer;
    for (let i = 0; i < 8; i++) {
      const folded = this._foldedPlayers.get(i as SeatNumber);
      if (!folded && this.state.occupiedSeats.get(i as SeatNumber)) {
        numberInGame += 1;
        lastPlayer = i as SeatNumber;
      }
    }
    if (numberInGame === 1) return lastPlayer;
    return undefined;
  }

  /**
   * Joins a player to the game.
   * - Assigns the player to a seat. If the player was in the prior game,
   * assigns them to the same seat if it is not in use, and keeps their balance from the previous game.
   * Otherwise, assigns them to the first available seat with the default buy-in amount as their balance.
   * - If all seats are assigned, updates the game to WAITING_TO_START.
   *
   * @throws InvalidParametersError if the player is already in the game (PLAYER_ALREADY_IN_GAME_MESSAGE)
   * @throws InvalidParametersError if the game is full (GAME_FULL_MESSAGE)
   *
   * @param player the player to join the game
   */
  protected _join(player: Player): void {
    if (this._getPlayerSeat(player.id) !== undefined) {
      throw new InvalidParametersError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    }
    const nextOpen = this._getNextOpenSeat();
    if (nextOpen === undefined) throw new InvalidParametersError(GAME_FULL_MESSAGE);
    if (this.state.status !== 'WAITING_FOR_PLAYERS')
      throw new InvalidParametersError(GAME_FULL_MESSAGE);
    if (this._preferredSeats && this._oldBalances) {
      const preferred = this._preferredSeats.get(player.id);
      if (preferred && this.state.occupiedSeats.get(preferred) === undefined) {
        this.state.occupiedSeats.set(preferred, player.id);
        this.state.readyPlayers.set(preferred, false);
        this.state.playerBalances.set(preferred, this._oldBalances.get(player.id));
        return;
      }
    }
    this.state.occupiedSeats.set(nextOpen, player.id);
    this.state.readyPlayers.set(nextOpen, false);
    this._foldedPlayers.set(nextOpen, false);

    if (this._oldBalances && this._oldBalances.get(player.id))
      this.state.playerBalances.set(nextOpen, this._oldBalances.get(player.id));
    else this.state.playerBalances.set(nextOpen, DEFAULT_BUY_IN);
    if (this._getNextOpenSeat() === undefined) this.state.status = 'WAITING_TO_START';
  }

  /**
   * Removes a player from the game.
   *
   * Updates the game's state to represent the player leaving.
   *
   * If the game's state is currently "IN_PROGRESS" and the player has not folded, automatically folds the player. If only one player is
   * left in the hand, updates the game status to OVER and sets the winner to that player.
   *
   * If the game state is currently "WAITING_TO_START", updates the game's status to WAITING_FOR_PLAYERS.
   *
   * If the game state is currently "WAITING_FOR_PLAYERS" or "OVER", the game state is unchanged.
   *
   * @param player The player to remove from the game
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   */
  protected _leave(player: Player): void {
    const seat = this._getPlayerSeat(player.id);
    if (seat === undefined) throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    switch (this.state.status) {
      case 'IN_PROGRESS': {
        const newMoves = [...this.state.moves, { moveType: 'FOLD' as PokerAction, player: seat }];
        const newState: PokerGameState = {
          ...this.state,
          moves: newMoves,
        };
        this.state = newState;

        this.state.occupiedSeats.set(seat, undefined);
        this.state.playerBalances.set(seat, undefined);
        this.state.readyPlayers.set(seat, undefined);
        this._foldedPlayers.set(seat, false);

        if (this._firstPlayer === seat) this._firstPlayer = this._getNextSeat(this._firstPlayer);

        const remaining = this._oneRemainingPlayer();
        if (remaining) {
          this._payOut([remaining]);
        }
        return;
      }
      case 'WAITING_TO_START': {
        this.state.occupiedSeats.set(seat, undefined);
        this.state.playerBalances.set(seat, undefined);
        this.state.readyPlayers.set(seat, undefined);
        this._foldedPlayers.set(seat, false);

        this.state.status = 'WAITING_FOR_PLAYERS';
        return;
      }
      case 'WAITING_FOR_PLAYERS': {
        this.state.occupiedSeats.set(seat, undefined);
        this.state.playerBalances.set(seat, undefined);
        this.state.readyPlayers.set(seat, undefined);
        this._foldedPlayers.set(seat, false);
        return;
      }
      case 'OVER': {
        return;
      }
      default:
        throw new Error('Method not implemented.');
    }
  }
}
