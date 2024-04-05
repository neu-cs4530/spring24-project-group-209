import _ from 'lodash';
import {
  GameArea,
  GameStatus,
  PokerGameState,
  PokerMove,
  SeatNumber,
  Card,
} from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import GameAreaController, {
  GameEventTypes,
  NO_GAME_IN_PROGRESS_ERROR,
  NO_GAME_STARTABLE,
} from './GameAreaController';
export type PokerCell = { card: Card; player: SeatNumber | undefined };
export type PokerEvents = GameEventTypes & {
  boardChanged: (board: PokerCell[][]) => void;
  turnChanged: (isOurTurn: boolean) => void;
};
export const POKER_ROWS = 9;

function createEmptyBoard(): PokerCell[][] {
  const board = new Array(POKER_ROWS).fill(undefined).map(() => []);
  return board;
}

/**
 * This class is responsible for managing the state of the Poker game, and for sending commands to the server
 */
export default class PokerAreaController extends GameAreaController<PokerGameState, PokerEvents> {
  protected _board: PokerCell[][] = createEmptyBoard();

  private _prevTurn: SeatNumber | undefined;

  /**
   * Returns the current state of the board.
   *
   * The board is a 4x8 array of PokerCell.
   *
   * The 2-dimensional array is indexed by row and then column, so board[0][0] is the top-left cell,
   */
  get board(): PokerCell[][] {
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

  get pot(): number {
    return this._model.game?.state.pot || 0;
  }

  /**
   * Returns the number of moves that have been made in the game
   */
  get moveCount(): number {
    return this._model.game?.state.moves.length || 0;
  }

  get occupiedSeats(): Array<PlayerController> {
    // const occupiedSeats = new Array(8).fill(undefined);
    // this.occupants.forEach(player => {
    //   const seat = this.playerSeat(player);
    //   if (seat !== undefined) {
    //     occupiedSeats[seat] = player;
    //   }
    // });
    // return occupiedSeats;
    const occupiedSeats = new Array(8).fill(undefined);
    this._model.game?.state.occupiedSeats.forEach((playerID, seat) => {
      const player = this.occupants.find(eachOccupant => eachOccupant.id === playerID);
      if (player) {
        occupiedSeats[seat] = player;
      }
    });
    return occupiedSeats;
  }

  get foldedPlayers(): Array<boolean> {
    const foldedSeats = new Array(8).fill(undefined);
    this._model.game?.state.foldedPlayers.forEach((isFolded, seat) => {
      foldedSeats[seat] = isFolded;
    });
    return foldedSeats;
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
    if (this._prevTurn) {
      return this._nextActivePlayer(this._prevTurn);
    }
    if (this._model.game?.state) {
      return this._nextActivePlayer(((this._model.game?.state.smallBlind + 2) % 8) as SeatNumber);
    }
    return undefined;
  }

  private _nextActivePlayer(seat: SeatNumber): PlayerController {
    let nextTurn: PlayerController | undefined = undefined;
    while (!nextTurn) {
      seat = (seat + 1) % 8;
      if (this.occupiedSeats[seat]) {
        nextTurn = this.occupiedSeats[seat];
      }
    }
    return nextTurn;
  }

  /**
   * Returns true if the game is empty - no occupants in the area
   *
   */
  isEmpty(): boolean {
    return this.occupants.length === 0;
  }

  playerSeat(player: PlayerController | undefined): SeatNumber | undefined {
    if (player) {
      for (let i = 0; i < 8; i++) {
        if (this._model.game?.state.occupiedSeats[i] === player.id) {
          return i as SeatNumber;
        }
      }
    }
    return undefined;
  }

  get numActivePlayers(): number {
    const occupiedSeats = this.occupiedSeats;
    const players = occupiedSeats;
    if (!players) return 0;
    let count = 0;
    for (let i = 0; i < 8; i++) {
      if (players[i] !== undefined) {
        count++;
      }
    }
    return count;
  }

  /**
   * Returns true if the game is not empty and the game is not waiting for players
   */
  public isActive(): boolean {
    return !this.isEmpty() && this.status !== 'WAITING_FOR_PLAYERS';
  }

  /**
   * Updates the internal state of this PokerAreaController based on the new model.
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
  protected _updateFrom(newModel: GameArea<PokerGameState>): void {
    const wasOurTurn = this.isOurTurn;
    super._updateFrom(newModel);
    const newGame = newModel.game;
    if (newGame) {
      const newBoard = createEmptyBoard();
      newGame.state.moves.forEach(move => {
        if (move.moveType == 'DEAL') {
          if (move.player !== undefined && move.card) {
            newBoard[move.player].push({ card: move.card, player: move.player });
          } else if (move.player === undefined && move.card) {
            newBoard[8].push({ card: move.card, player: undefined });
          }
        }
      });
      if (!_.isEqual(newBoard, this._board)) {
        this._board = newBoard;
        this.emit('boardChanged', this._board);
      }
    }
    const isOurTurn = this.isOurTurn;
    if (wasOurTurn !== isOurTurn) this.emit('turnChanged', isOurTurn);
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
    // if (!instanceID || this._model.game?.state.status !== 'WAITING_TO_START') {
    //   throw new Error(NO_GAME_STARTABLE);
    // }
    if (!instanceID) {
      throw new Error(NO_GAME_STARTABLE);
    }
    await this._townController.sendInteractableCommand(this.id, {
      gameID: instanceID,
      type: 'StartGame',
    });
  }

  /**
   * Sends a request to the server to place the current move in the Poker game.
   *
   * @param col Column to place the game piece in
   */
  public async makeMove(move: PokerMove): Promise<void> {
    const instanceID = this._instanceID;
    if (!instanceID || this._model.game?.state.status !== 'IN_PROGRESS') {
      throw new Error(NO_GAME_IN_PROGRESS_ERROR);
    }
    this._prevTurn = move.player;
    await this._townController.sendInteractableCommand(this.id, {
      gameID: instanceID,
      type: 'GameMove',
      move,
    });
  }
}
