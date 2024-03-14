import _ from 'lodash';
import {
  BlackjackColIndex,
  BlackjackColor,
  BlackjackGameState,
  BlackjackMove,
  BlackjackRowIndex,
  GameArea,
  GameStatus,
} from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import GameAreaController, {
  GameEventTypes,
  NO_GAME_IN_PROGRESS_ERROR,
  NO_GAME_STARTABLE,
  PLAYER_NOT_IN_GAME_ERROR,
} from './GameAreaController';

export type BlackjackCell = BlackjackColor | undefined;
export type BlackjackEvents = GameEventTypes & {
  boardChanged: (board: BlackjackCell[][]) => void;
  turnChanged: (isOurTurn: boolean) => void;
};

// function createEmptyBoard(): BlackjackCell[][] {
//   return [0]
// }

/**
 * This class is responsible for managing the state of the Connect Four game, and for sending commands to the server
 */
export default class BlackjackAreaController extends GameAreaController<
  BlackjackGameState,
  BlackjackEvents
> {
  protected _board: BlackjackCell[][] = createEmptyBoard();

  get board(): BlackjackCell[][] {
    return this._board;
  }

  /**
   * Returns the player who won the game, if there is one, or undefined otherwise
   */
  get winner(): PlayerController | undefined {
    const winner = this._model.game?.state.winner;
    if (winner) {
      return this.occupants.find(eachOccupant => eachOccupant.id === winner);
    }
    return undefined;
  }

  /**
   * Returns the number of moves that have been made in the game
   */
  get moveCount(): number {
    return this._model.game?.state.moves.length || 0;
  }

  /**
   * Returns true if it is our turn to make a move, false otherwise
   */
  get isOurTurn(): boolean {
    return this.whoseTurn?.id === this._townController.ourPlayer.id;
  }

  /**
   * Returns true if the current player is in the game, false otherwise
   */
  get isPlayer(): boolean {
    return this._model.game?.players.includes(this._townController.ourPlayer.id) ?? false;
  }

  get gamePiece(): BlackjackColor {
    return 'Seat1';
  }

  /**
   * Returns the status of the game
   * If there is no game, returns 'WAITING_FOR_PLAYERS'
   */
  get status(): GameStatus {
    const status = this._model.game?.state.status;
    if (!status) {
      return 'WAITING_FOR_PLAYERS';
    }
    return status;
  }

  get whoseTurn(): PlayerController | undefined {
    return undefined;
  }

  isEmpty(): boolean {
    return false;
  }

  /**
   * Returns true if the game is not empty and the game is not waiting for players
   */
  public isActive(): boolean {
    return !this.isEmpty() && this.status !== 'WAITING_FOR_PLAYERS';
  }

  protected _updateFrom(newModel: GameArea<BlackjackGameState>): void {}

  /**
   * Sends a request to the server to start the game.
   *
   * If the game is not in the WAITING_TO_START state, throws an error.
   *
   * @throws an error with message NO_GAME_STARTABLE if there is no game waiting to start
   */
  public async startGame(): Promise<void> {
    const instanceID = this._instanceID;
    if (!instanceID || this._model.game?.state.status !== 'WAITING_TO_START') {
      throw new Error(NO_GAME_STARTABLE);
    }
    await this._townController.sendInteractableCommand(this.id, {
      gameID: instanceID,
      type: 'StartGame',
    });
  }

  public async makeMove(col: BlackjackColIndex): Promise<void> {
    return;
  }
}
