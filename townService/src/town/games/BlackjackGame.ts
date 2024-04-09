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


  private _next: SeatNumber;

  private _betAmt: number;

  private _firstPlayer: number;

  private _doubled: Map<SeatNumber, boolean> = new Map<SeatNumber, boolean>();


  /**
   * Creates a new BlackjackGame.
   * @param deck Provides the deck object to be used for this poker game
   * @param priorGame If provided, the new game will be created such that if any player from
   * the previous blackjack game joins the new game they will be seated at the same seat as before,
   * & their balance from the previous game will carry over.
   */
  public constructor(deck?: DeckOfCards, priorGame?: BlackjackGame) {
    const initialOccupiedSeats = new Array<PlayerID | undefined>();
    const initialReadyPlayers = new Array<boolean | undefined>();
    const initialPlayerBalances = new Array<number | undefined>();

    const initialStandPlayers = new Array<boolean>();
    const initialBustedPlayers = new Array<boolean>();
    const dealerMoves: BlackjackMove[] = [];


    for (let i = 0; i < 8; i++) {
      initialOccupiedSeats[i] = undefined;
      initialReadyPlayers[i] = undefined;
      initialPlayerBalances[i] = undefined;

      initialStandPlayers[i] = false;
      initialBustedPlayers[i] = false;

    }

    super({
      moves: [],
      dealerMoves: [],

      winners: [],

      status: 'WAITING_FOR_PLAYERS',
      occupiedSeats: initialOccupiedSeats,
      readyPlayers: initialReadyPlayers,
      playerBalances: initialPlayerBalances,

      bustedPlayers: initialBustedPlayers,
      standPlayers: initialStandPlayers,
    });

    for (let i = 0; i < 8; i++) {
      this.state.bustedPlayers[i] = false;
      this.state.standPlayers[i] = false;
    }

    if (deck) {
      this._deck = deck;
    } else {
      this._deck = new BasicDeck();
    }

    if (priorGame) {
      this._oldBalances = new Map<PlayerID, number>();
      for (let i = 0; i < 8; i++) {
        const p = priorGame.state.occupiedSeats[i];
        if (p) {
          this._oldBalances.set(p, priorGame.state.playerBalances[i] as number);
        }
      }
    }
    this._next = 0 as SeatNumber;
    this._firstPlayer = 0;
    this._betAmt = 100; // default bet amount for now
  }

  /**
   * Gets the next occupied seat in the turn order
   */
  private _getNextSeat(from: SeatNumber): SeatNumber {
    let current: SeatNumber;
    if (from === 7) return 8 as SeatNumber;
    current = (from + 1) as SeatNumber;
    while (
      this.state.occupiedSeats[current] === undefined ||

      this.state.bustedPlayers[current] ||
      this.state.standPlayers[current]

    ) {
      if (current === 7) return 8 as SeatNumber;
      current += 1;
    }
    return current;
  }

  private _getNextOpenSeat(): SeatNumber | undefined {
    let current = 0 as SeatNumber;
    while (this.state.occupiedSeats[current] !== undefined) {
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
      if (this.state.occupiedSeats[i] === playerID) return i as SeatNumber;
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
    if (this.state.status !== 'WAITING_TO_START' && this.state.status !== 'WAITING_FOR_PLAYERS') {
      throw new InvalidParametersError(GAME_NOT_STARTABLE_MESSAGE);
    }
    const seat = this._getPlayerSeat(player.id);
    if (seat === undefined) throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);

    this.state.readyPlayers[seat] = true;

    for (let i = 0; i < this.state.occupiedSeats.length; i++) {
      if (this.state.readyPlayers[i] === false) return;
    }

    this.state.status = 'IN_PROGRESS';

    for (let i = 0; i < 8; i++) {
      const p = this.state.occupiedSeats[i];
      if (p) {
        const newMoves = [
          ...this.state.moves,
          {
            moveType: 'DEAL' as BlackjackAction,
            card: this._deck.drawCard(),
            player: i as SeatNumber,
          },
          {
            moveType: 'DEAL' as BlackjackAction,
            card: this._deck.drawCard(),
            player: i as SeatNumber,
          },
        ];
        const newState: BlackjackGameState = {
          ...this.state,
          moves: newMoves,
        };
        this.state = newState;
      }
    }
    const dealerMoves = [

      // dealer's first cards
      ...this.state.dealerMoves,
      { moveType: 'DEAL' as BlackjackAction, card: this._deck.drawCard(), player: undefined },
      { moveType: 'DEAL' as BlackjackAction, card: this._deck.drawCard(), player: undefined },

    ];

    const newState: BlackjackGameState = {
      ...this.state,
      dealerMoves,
    };
    this.state = newState;
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
    const bal = this.state.playerBalances[seat];
    switch (move.move.moveType) {
      case 'BET': {
        if (bal && bal < this._betAmt) {
          break;
        } else if (bal) {
          this.state.playerBalances[seat] = bal - this._betAmt;
        }
        break;
      }
      case 'STAND': {

        this.state.standPlayers[seat] = true;

        this._next = this._getNextSeat(this._next);
        break;
      }
      case 'HIT': {
        const newCard = this._deck.drawCard();
        const newMoves = [
          ...this.state.moves,
          { moveType: 'DEAL' as BlackjackAction, card: newCard, player: seat },
        ];
        const newState: BlackjackGameState = {
          ...this.state,
          moves: newMoves,
        };
        this.state = newState;
        if (this._checkValue(seat) > 21) {

          this.state.bustedPlayers[seat] = true;

          this._next = this._getNextSeat(this._next);
        }
        break;
      }
      case 'DOUBLE': {
        this._next = this._getNextSeat(this._next);
        if (bal && bal < this._betAmt) {
          throw new InvalidParametersError('Not enough money to double down');
        }
        const newCard = this._deck.drawCard();
        const newMoves = [
          ...this.state.moves,
          { moveType: 'DEAL' as BlackjackAction, card: newCard, player: seat },
        ];
        const newState: BlackjackGameState = {
          ...this.state,
          moves: newMoves,
        };
        this.state = newState;

        this.state.standPlayers[seat] = true;

        this._doubled.set(seat, true);
        break;
      }
      default:
        throw new InvalidParametersError(BOARD_POSITION_NOT_VALID_MESSAGE);
    }

    const newMoves = [...this.state.moves, move.move];
    const newState: BlackjackGameState = {
      ...this.state,
      moves: newMoves,
    };
    this.state = newState;

    if (
      this._getNextSeat(seat) === (8 as SeatNumber) &&

      (this.state.standPlayers[seat] === true || this.state.bustedPlayers[seat] === true)

    ) {
      this._endGame();
    }
  }

  private _endGame() {
    let dealerTotal = this._checkValue(8 as SeatNumber);
    while (dealerTotal < 17) {
      const newMoves = [
        ...this.state.dealerMoves,
        {
          moveType: 'DEAL' as BlackjackAction,
          card: this._deck.drawCard(),

          player: undefined,

        },
      ];
      const newState: BlackjackGameState = {
        ...this.state,
        dealerMoves: newMoves,
      };
      this.state = newState;
      dealerTotal = this._checkValue(8 as SeatNumber);
    }
    for (let i = 0; i < 8; i++) {
      if (this.state.occupiedSeats[i]) {
        const prev = this.state.playerBalances[i] as number;
        const playerTotal = this._checkValue(i as SeatNumber);
        if (playerTotal > 21) {

          this.state.winners[i] = false;

          if (this._doubled.get(i as SeatNumber)) {
            this.state.playerBalances[i] = prev - this._betAmt * 2;
          } else {
            this.state.playerBalances[i] = prev - this._betAmt;
          }
        } else if (dealerTotal > 21) {

          this.state.winners[i] = true;

          if (this._doubled.get(i as SeatNumber)) {
            this.state.playerBalances[i] = prev + this._betAmt * 2;
          } else {
            this.state.playerBalances[i] = prev + this._betAmt;
          }
        } else if (playerTotal > dealerTotal) {

          this.state.winners[i] = true;

          if (this._doubled.get(i as SeatNumber)) {
            this.state.playerBalances[i] = prev + this._betAmt * 2;
          } else {
            this.state.playerBalances[i] = prev + this._betAmt;
          }
        } else if (playerTotal < dealerTotal) {

          this.state.winners[i] = false;

          if (this._doubled.get(i as SeatNumber)) {
            this.state.playerBalances[i] = prev - this._betAmt * 2;
          } else {
            this.state.playerBalances[i] = prev - this._betAmt;
          }
        }
      }
    }
    this.state.status = 'OVER';
  }

  private _checkValue(seat: SeatNumber): number {
    let total = 0;
    let aces = 0;
    if (seat !== (8 as SeatNumber)) {
      for (const move of this.state.moves) {

        if (move.player === seat && move.moveType === 'DEAL' && move.card) {
          if (move.card.face === 1) {
            aces += 1;
          } else if (move.card.face >= 11) {
            total += 10;
          } else {
            total += move.card.face;
          }
        }
      }
    } else {
      for (const move of this.state.dealerMoves) {
        if (move.card) {
          if (move.card && move.card.face === 1) {
            aces += 1;
          } else if (move.card && move.card.face >= 11) {
            total += 10;
          } else {
            total += move.card.face;
          }
        }
      }
    }
    for (let i = 0; i < aces; i++) {
      if (total + 11 > 21) {
        total += 1;
      } else {
        total += 11;
      }
    }
    return total;
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
    const p = player;
    if (this._getPlayerSeat(p.id) !== undefined) {
      throw new InvalidParametersError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    }
    const nextOpen = this._getNextOpenSeat();
    if (nextOpen === undefined) throw new InvalidParametersError(GAME_FULL_MESSAGE);
    if (this.state.status !== 'WAITING_FOR_PLAYERS')
      throw new InvalidParametersError(GAME_FULL_MESSAGE);

    this.state.occupiedSeats[nextOpen] = player.id;
    this.state.readyPlayers[nextOpen] = false;
    this.state.bustedPlayers[nextOpen] = false;

    if (this._oldBalances && this._oldBalances.get(player.id))
      this.state.playerBalances[nextOpen] = this._oldBalances.get(player.id);
    else this.state.playerBalances[nextOpen] = 1000 /** default for now */;
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
    for (let i = 0; i < 8; i++) {
      if (this.state.occupiedSeats[i] === player.id) {
        isInGame = true;
        playerIdSeat = i as SeatNumber;
      }
    }
    if (!isInGame) {
      throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    }
    const newMoves = [
      ...this.state.moves,
      { moveType: 'STAND' as BlackjackAction, player: playerIdSeat },
    ];
    const newState: BlackjackGameState = {
      ...this.state,
      moves: newMoves,
    };
    this.state = newState;

    this.state.occupiedSeats[playerIdSeat] = undefined;
    this.state.readyPlayers[playerIdSeat] = undefined;
    this.state.playerBalances[playerIdSeat] = 0;
    let anyoneLeft = false;
    for (let i = 0; i < 8; i++) {
      if (this.state.occupiedSeats[i] !== undefined) {
        anyoneLeft = true;
      }
    }
    if (!anyoneLeft) {
      this.state.status = 'OVER';
    } else if (this.state.status === 'IN_PROGRESS') {
      this.state.standPlayers[playerIdSeat] = true;
    } else if (this.state.status === 'WAITING_TO_START') {
      this.state.status = 'WAITING_FOR_PLAYERS';
    }
  }
}
