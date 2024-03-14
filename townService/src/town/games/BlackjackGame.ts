import Player from '../../lib/Player';
import {
    BlackjackGameState,
    BlackjackMove,
    DeckOfCards,
  GameMove,
  PlayerID,
  SeatNumber,
} from '../../types/CoveyTownSocket';
import Game from './Game';

/**
 * A Blackjack is a game which implements the rules of Blackjack.
 */
export default class BlackjackGame extends Game<BlackjackGameState, BlackjackMove> {
  /**
   * Creates a new BlackjackGame.
   * @param deck Provides the deck object to be used for this poker game
   * @param priorGame If provided, the new game will be created such that if any player from
   * the previous blackjack game joins the new game they will be seated at the same seat as before,
   * & their balance from the previous game will carry over.
   */
  public constructor(deck: DeckOfCards, priorGame?: BlackjackGame) {
    super({
      moves: [],
      status: 'WAITING_FOR_PLAYERS',
      occupiedSeats: new Map<SeatNumber, PlayerID | undefined>(),
      readyPlayers: new Map<SeatNumber, boolean | undefined>(),
      playerBalances: new Map<SeatNumber, number | undefined>(),
    }); // This is not necessarily accurate, written to get rid of syntax errors in shell file
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
  }
}

