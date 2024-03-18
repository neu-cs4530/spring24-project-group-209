import InvalidParametersError, {
  GAME_FULL_MESSAGE,
  GAME_NOT_STARTABLE_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import {
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

  /**
   * Creates a new PokerGame.
   * @param deck Provides the deck object to be used for this poker game
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

  private _getNextOpenSeat(): SeatNumber | undefined {
    let current = 0 as SeatNumber;

    while (this.state.occupiedSeats.get(current) !== undefined) {
      if (current === 7) return undefined;
      current += 1;
    }

    return current;
  }

  private _getPlayerSeat(player: Player): SeatNumber | undefined {
    for (let i = 0; i < 8; i++) {
      if (this.state.occupiedSeats.get(i as SeatNumber) === player.id) return i as SeatNumber;
    }
    return undefined;
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
   * Once the blind has been determined, the small and big blinds will be subtracted from the player's balances and hands will be dealt.
   * Hands should be dealt starting from seat zero to seat seven, dealing 2 to each at once.
   *
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   * @throws InvalidParametersError if the game is not in the WAITING_TO_START or WAITING_FOR_PLAYERS state (GAME_NOT_STARTABLE_MESSAGE)
   *
   * @param player The player who is ready to start the game
   */
  public startGame(player: Player): void {
    const seat = this._getPlayerSeat(player);
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
    throw new Error('Method not implemented.');
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
   * @throws InvalidParametersError if the game is full - maximum of 8 seats (GAME_FULL_MESSAGE)
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
   * If the game state is currently "OVER", leaving additionally does not remove the player from the list of players.
   *
   * @param player The player to remove from the game
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   */
  protected _leave(player: Player): void {
    const seat = this._getPlayerSeat(player);
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

        const remaining = this._oneRemainingPlayer();
        if (remaining) {
          this.state.winner = this.state.occupiedSeats.get(remaining);
          this.state.status = 'OVER';
          this.state.playerBalances.set(
            remaining,
            this.state.playerBalances.get(remaining) + this._pot,
          );
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
