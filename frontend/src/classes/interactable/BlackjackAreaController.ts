import _ from 'lodash';
import {
  BlackjackAction,
  GameArea,
  GameStatus,
  BlackjackGameState,
  BlackjackMove,
} from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import GameAreaController, {
  GameEventTypes,
  NO_GAME_IN_PROGRESS_ERROR,
  NO_GAME_STARTABLE,
  PLAYER_NOT_IN_GAME_ERROR,
} from './GameAreaController';

export type BlackjackCell = BlackjackMove | integer | undefined;
export type BlackjackEvents = GameEventTypes & {
  boardChanged: (board: BlackjackCell[][]) => void;
  turnChanged: (isOurTurn: boolean) => void;
};
export const BLACKJACK_ROWS = 4;
export const BLACKJACK_COLS = 8;

function createEmptyBoard(): BlackjackCell[][] {
  const board = new Array(BLACKJACK_ROWS);
  for (let i = 0; i < BLACKJACK_ROWS; i++) {
    board[i] = new Array(BLACKJACK_COLS).fill(undefined);
  }
  return board;
}

/**
 * This class is responsible for managing the state of the Blackjack game, and for sending commands to the server
 */
export default class BlackjackAreaController extends GameAreaController<
  BlackjackGameState,
  BlackjackEvents
> {
  protected _board: BlackjackCell[][] = createEmptyBoard();

  /**
   * Returns the current state of the board.
   *
   * The board is a 4x8 array of BlackjackCell.
   *
   * The 2-dimensional array is indexed by row and then column, so board[0][0] is the top-left cell,
   */
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

  /**
   * Returns the player whose turn it is, if the game is in progress
   * Returns undefined if the game is not in progress
   *
   * Follows the same logic as the backend, respecting the firstPlayer field of the gameState
   */
  get whoseTurn(): PlayerController | undefined {
    //Not implemented
    return undefined;
  }

  private _updateTurn(): void {
    //Not implemented
  }

  /**
   * Returns true if the game is empty - no occupants in the area
   *
   */
  isEmpty(): boolean {
    return this.occupants.length === 0;
  }

  /**
   * Returns true if the game is not empty and the game is not waiting for players
   */
  public isActive(): boolean {
    return !this.isEmpty() && this.status !== 'WAITING_FOR_PLAYERS';
  }

  /**
   * Updates the internal state of this BlackjackAreaController based on the new model.
   *
   * Calls super._updateFrom, which updates the occupants of this game area and other
   * common properties (including this._model)
   *
   * If the board has changed, emits a boardChanged event with the new board.
   * If the board has not changed, does not emit a boardChanged event.
   *
   * If the turn has changed, emits a turnChanged event with the new turn (true if our turn, false otherwise)
   * If the turn has not changed, does not emit a turnChanged event.
   */
  protected _updateFrom(newModel: GameArea<BlackjackGameState>): void {
    const wasOurTurn = this.isOurTurn;
    super._updateFrom(newModel);
    const newGame = newModel.game;
    if (newGame) {
      const newBoard = createEmptyBoard();
      newGame.state.moves.forEach(move => {
        if (move.moveType == 'BET') {
          
        } else if (move.moveType == 'HIT') {
        } else if (move.moveType == 'STAND') {
        } else if (move.moveType == 'DOUBLE') {
        } else if (move.moveType == 'DEAL') {
        } else {
          throw new Error(`Unknown move type: ${move.moveType}`);
        });
      if (!_.isEqual(newBoard, this._board)) {
        this._board = newBoard;
        this.emit('boardChanged', this._board);
      }
    }
    this._updateTurn();
  }

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

  /**
   * Sends a request to the server to place the current move in the Blackjack game.
   *
   * @param col Column to place the game piece in
   */
  public async makeMove(move: BlackjackMove): Promise<void> {
    //not implemented
  }
}
