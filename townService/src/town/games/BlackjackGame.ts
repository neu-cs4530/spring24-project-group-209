import InvalidParametersError, { GAME_FULL_MESSAGE, GAME_NOT_IN_PROGRESS_MESSAGE, GAME_NOT_STARTABLE_MESSAGE, PLAYER_ALREADY_IN_GAME_MESSAGE, PLAYER_NOT_IN_GAME_MESSAGE } from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import {
    BlackjackAction,
    BlackjackGameState,
    BlackjackMove,
    DeckOfCards,
  GameMove,
  PlayerID,
  SeatNumber,
} from '../../types/CoveyTownSocket';
import BasicDeck from './BasicDeck';
import Game from './Game';

/**
 * A Blackjack is a game which implements the rules of Blackjack.
 */
export default class BlackjackGame extends Game<BlackjackGameState, BlackjackMove> {
    protected _deck: DeckOfCards;

    protected _oldBalances?: Map<PlayerID, number>;

    protected _bustedPlayers: Map<SeatNumber, boolean> = new Map<SeatNumber, boolean>();

    private _next: SeatNumber;

    private _betAmt: number;
    private _firstPlayer: number;
  /**
   * Creates a new BlackjackGame.
   * @param deck Provides the deck object to be used for this poker game
   * @param priorGame If provided, the new game will be created such that if any player from
   * the previous blackjack game joins the new game they will be seated at the same seat as before,
   * & their balance from the previous game will carry over.
   */
  public constructor(deck: DeckOfCards, priorGame?: BlackjackGame) {
    const initialOccupiedSeats = new Map<SeatNumber, PlayerID | undefined>();
    const initialReadyPlayers = new Map<SeatNumber, boolean | undefined>();
    const initialPlayerBalances = new Map<SeatNumber, number | undefined>();
    const dealerMoves: BlackjackMove[] = [];
    for (let i = 0; i < 8; i++) {
      initialOccupiedSeats.set(i as SeatNumber, undefined);
      initialReadyPlayers.set(i as SeatNumber, undefined);
      initialPlayerBalances.set(i as SeatNumber, undefined);
    }

    super({
      moves: [],
      dealerMoves:[],
      status: 'WAITING_FOR_PLAYERS',
      occupiedSeats: initialOccupiedSeats,
      readyPlayers: initialReadyPlayers,
      playerBalances: initialPlayerBalances,
    }); // This is not necessarily accurate, written to get rid of syntax errors in shell file

    for (let i = 0; i < 8; i++) {
        this._bustedPlayers.set(i as SeatNumber, false);
    }
  
    if (deck) {
        this._deck = deck;
    } else {
        this._deck = new BasicDeck();
    }

    if (priorGame) {
        this._oldBalances = new Map<PlayerID, number>();
        for (let i = 0; i < 8; i++) {
            const p = priorGame.state.occupiedSeats.get(i as SeatNumber);
            if (p) {
                this._oldBalances.set(p, priorGame.state.playerBalances.get(i as SeatNumber));
            }
        }
    }
    this._next = 0;
    this._firstPlayer = 0;
    this._betAmt = 100;
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
          this._bustedPlayers.get(current)
        ) {
          if (current === 7) current = 0;
          else current += 1;
        }
    
        return current;
    }

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
   * Indicates a player is ready to start the game.
   *
   * Updates the game state to indicate the player is ready to start the game.
   *
   * If there are at least one player in the game, and all players are ready, the game will start.
   *
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   * @throws InvalidParametersError if the game is not in the WAITING_TO_START or WAITING_FOR_PLAYERS state (GAME_NOT_STARTABLE_MESSAGE)
   *
   * @param player The player who is ready to start the game
   */
  
  public startGame(player: Player): void {

    if (this.state.status !== 'WAITING_TO_START') {
        throw new InvalidParametersError(GAME_NOT_STARTABLE_MESSAGE);
    }
    const seat = this._getPlayerSeat(player);
    if (seat === undefined) throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    if (
      (this.state.status !== 'WAITING_TO_START' && this.state.status !== 'WAITING_FOR_PLAYERS')// ||
      //(this.state.status === 'WAITING_FOR_PLAYERS')
    ) throw new InvalidParametersError(GAME_NOT_STARTABLE_MESSAGE);
    
    this.state.readyPlayers.set(seat, true);

    for (let i = 0; i < this.state.occupiedSeats.size; i++) {
        if (this.state.readyPlayers.get(i as SeatNumber) === false) return;
    }

    this.state.status = 'IN_PROGRESS';
    
    for (let i = 0; i < 8; i++) {
        const p = this.state.occupiedSeats.get(i as SeatNumber);
        if (p) {
          const newMoves = [
            ...this.state.moves,
            { moveType: 'DEAL' as BlackjackAction, card: this._deck.drawCard(), player: i as SeatNumber },
            { moveType: 'DEAL' as BlackjackAction, card: this._deck.drawCard(), player: i as SeatNumber },
          ];
          const newState: BlackjackGameState = {
            ...this.state,
            moves: newMoves,
          };
          this.state = newState;
        }
    }
    const dealerMoves = [  // dealer's first card
        ...this.state.dealerMoves,
        { moveType: 'DEAL' as BlackjackAction, card: this._deck.drawCard(), player: 8 as SeatNumber },
    ];

    const newState: BlackjackGameState = {
        ...this.state,
        dealerMoves: dealerMoves,
      };
      this.state.dealerMoves = newState;

  }

  /**
   * Applies a move to the game.
   * Uses the player's id to determine which seat they are sitting at.
   *
   * Validates the move, and if it is valid, applies it to the game state.
   *
   * If the move ends the game, updates the game state to reflect the end of the game,
   * setting the status to "OVER" and the winner to the player(s) who won the hand
   *
   * @param move The move to attempt to apply
   *
   * @throws InvalidParametersError if the game is not in progress (GAME_NOT_IN_PROGRESS_MESSAGE)
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   * @throws INvalidParametersError if the move is not the player's turn (MOVE_NOT_YOUR_TURN_MESSAGE)
   * @throws InvalidParametersError if the move is invalid per the rules of blackjack (BOARD_POSITION_NOT_VALID_MESSAGE)
   */

  
  public applyMove(move: GameMove<BlackjackMove>): void {
    if (this.state.status !== 'IN_PROGRESS')
      throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
    const seat = this._getPlayerSeat(move.playerID);
    if (seat === undefined) throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    if (seat !== this._next) throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    move.move.player = seat;
    switch (move.move.moveType) {
      case 'BET': {
        const curBet = this._currentBets.get(seat);
        if (curBet === undefined) throw new Error('Issue with recording bets');
        if (this.state.playerBalances.get(seat) < this._getMaxBet() - curBet) {
          this._pot += curBet;
          this.state.playerBalances.set(seat, 0);
          // All in
        } else {
          this.state.playerBalances.set(
            seat,
            this.state.playerBalances.get(seat) - (this._getMaxBet() - curBet),
          );
          this._pot += this._getMaxBet() - curBet;
          this._currentBets.set(seat, this._getMaxBet());
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
          this.state.status = 'OVER';
          this.state.winner = this.state.occupiedSeats.get(remaining);
          this.state.playerBalances.set(
            remaining,
            this.state.playerBalances.get(remaining) + this._pot,
          );
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
        if (winners.length === 1) {
          this.state.status = 'OVER';
          this.state.winner = this.state.occupiedSeats.get(winners[0]);
          this.state.playerBalances.set(
            winners[0],
            this.state.playerBalances.get(winners[0]) + this._pot,
          );
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
    }
  }


  /**
   * Joins a player to the game.
   * - Assigns the player to a seat. If the player was in the prior game,
   * assigns them to the same seat if it is not in use, and keeps their balance from the previous game.
   * Otherwise, assigns them to the first available seat.
   * - If all seats are assigned, updates the game to WAITING_TO_START.
   *
   * @throws InvalidParametersError if the player is already in the game (PLAYER_ALREADY_IN_GAME_MESSAGE)
   * @throws InvalidParametersError if the game is full (GAME_FULL_MESSAGE)
   * @throws InvalidParametersError if the game is already in progress even with empty seats
   * 
   * @param player the player to join the game
   */
  protected _join(player: Player): void {
    if (this._getPlayerSeat(player) !== undefined) {
        throw new InvalidParametersError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    }
      const nextOpen = this._getNextOpenSeat();
      if (nextOpen === undefined) throw new InvalidParametersError(GAME_FULL_MESSAGE);
      if (this.state.status !== 'WAITING_FOR_PLAYERS')
        throw new InvalidParametersError(GAME_FULL_MESSAGE);
    this.state.occupiedSeats.set(nextOpen, player.id);

    this.state.occupiedSeats.set(nextOpen, player.id);
    this.state.readyPlayers.set(nextOpen, false);
    this._bustedPlayers.set(nextOpen, false);

    if (this._oldBalances && this._oldBalances.get(player.id))
      this.state.playerBalances.set(nextOpen, this._oldBalances.get(player.id));
    else this.state.playerBalances.set(nextOpen, 1000/**default for now*/);
    if (this._getNextOpenSeat() === undefined) this.state.status = 'WAITING_TO_START';

    
  }

  /**
   * Removes a player from the game.
   *
   * Updates the game's state to represent the player leaving.
   *
   * If the game's state is currently "IN_PROGRESS" and the player has bet, automatically stands the player.
   *
   * If the game state is currently "WAITING_TO_START", updates the game's status to WAITING_FOR_PLAYERS.
   *
   * If the game state is currently "WAITING_FOR_PLAYERS" or "OVER", the game state is unchanged.
   *
   * @param player The player to remove from the game
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   */
  protected _leave(player: Player): void {
    let isInGame = false;
    let playerIdSeat: SeatNumber = 0;
    if (this.state.occupiedSeats.get(0) == player.id) {
      isInGame = true;
    } else if (this.state.occupiedSeats.get(1) == player.id) {
      isInGame = true;
      playerIdSeat = 1;
    } else if (this.state.occupiedSeats.get(2) == player.id) {
      isInGame = true;
      playerIdSeat = 2;
    } else if (this.state.occupiedSeats.get(3) == player.id) {
      isInGame = true;
      playerIdSeat = 3;
    } else if (this.state.occupiedSeats.get(4) == player.id) {
      isInGame = true;
      playerIdSeat = 4;
    } else if (this.state.occupiedSeats.get(5) == player.id) {
      isInGame = true;
      playerIdSeat = 5;
    } else if (this.state.occupiedSeats.get(6) == player.id) {
      isInGame = true;
      playerIdSeat = 6;
    } else if (this.state.occupiedSeats.get(7) == player.id) {
      isInGame = true;
      playerIdSeat = 7;
    }
    if (!isInGame) {
        throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    }
    this.state.occupiedSeats.set(playerIdSeat, undefined);
    this.state.readyPlayers.set(playerIdSeat, undefined);
    this.state.playerBalances.set(playerIdSeat, 0);
  }
}

