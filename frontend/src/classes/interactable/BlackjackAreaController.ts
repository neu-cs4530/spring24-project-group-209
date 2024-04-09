import _ from 'lodash';
import {
  GameArea,
  GameStatus,
  BlackjackGameState,
  BlackjackMove,
  SeatNumber,
  Card,
} from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import GameAreaController, {
  GameEventTypes,
  NO_GAME_IN_PROGRESS_ERROR,
  NO_GAME_STARTABLE,
} from './GameAreaController';

export type BlackjackCell = { card: Card; player: SeatNumber | undefined };
export type BlackjackEvents = GameEventTypes & {
  boardChanged: (board: BlackjackCell[][]) => void;
  turnChanged: (isOurTurn: boolean) => void;
};
export const BLACKJACK_ROWS = 9;

function createEmptyBoard(): BlackjackCell[][] {
  const board = new Array(BLACKJACK_ROWS).fill(undefined).map(() => []);
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
   * Returns the number of moves that have been made in the game
   */
  get moveCount(): number {
    return this._model.game?.state.moves.length || 0;
  }

  get moves(): Array<BlackjackMove> {
    const moves = new Array<BlackjackMove>();
    this._model.game?.state.moves.forEach((move: BlackjackMove) => {
      moves.push({ moveType: move.moveType, player: move.player, card: move.card });
    });
    return moves;
  }

  get occupiedSeats(): Array<PlayerController> {
    const occupiedSeats = new Array(8).fill(undefined);
    this._model.game?.state.occupiedSeats.forEach((playerID, seat) => {
      const player = this.occupants.find(eachOccupant => eachOccupant.id === playerID);
      if (player) {
        occupiedSeats[seat] = player;
      }
    });
    return occupiedSeats;
  }

  /**
   * Returns the player who won the game, if there is one, or undefined otherwise
   */
  get winners(): Array<boolean | undefined> {
    const winners = new Array(8).fill(undefined);
    this._model.game?.state.winners.forEach((isWinner, seat) => {
      winners[seat] = isWinner;
    });
    return winners;
  }

  get bustedPlayers(): Array<boolean> {
    const bustedSeats = new Array(8).fill(undefined);
    this._model.game?.state.bustedPlayers.forEach((isBusted, seat) => {
      bustedSeats[seat] = isBusted;
    });
    return bustedSeats;
  }

  get standPlayers(): Array<boolean> {
    const standSeats = new Array(8).fill(undefined);
    this._model.game?.state.standPlayers.forEach((isStanding, seat) => {
      standSeats[seat] = isStanding;
    });
    return standSeats;
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

  get balances(): Array<number> {
    const balances = new Array(8).fill(0);
    this._model.game?.state.playerBalances.forEach((balance, seat) => {
      balances[seat] = balance;
    });
    return balances;
  }

  /**
   * Returns the player whose turn it is, if the game is in progress
   * Returns undefined if the game is not in progress
   *
   * Follows the same logic as the backend, respecting the firstPlayer field of the gameState
   */
  get whoseTurn(): PlayerController | undefined {
    const occupiedSeats = this.occupiedSeats;
    for (let i = 0; i < 8; i++) {
      if (occupiedSeats[i] && !this.standPlayers[i] && !this.bustedPlayers[i]) {
        return occupiedSeats[i];
      }
    }
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

  /**
   * Returns true if the game is not empty and the game is not waiting for players
   */
  public isActive(): boolean {
    return !this.isEmpty() && this.status !== 'WAITING_FOR_PLAYERS';
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
        if (move.moveType == 'DEAL') {
          if (move.player !== undefined && move.card) {
            newBoard[move.player].push({ card: move.card, player: move.player });
          }
        }
      });
      newGame.state.dealerMoves.forEach(move => {
        if (move.moveType == 'DEAL' && move.card) {
          newBoard[8].push({ card: move.card, player: move.player });
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
    if (!instanceID) {
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
    const instanceID = this._instanceID;
    if (!instanceID || this._model.game?.state.status !== 'IN_PROGRESS') {
      throw new Error(NO_GAME_IN_PROGRESS_ERROR);
    }

    await this._townController.sendInteractableCommand(this.id, {
      gameID: instanceID,
      type: 'GameMove',
      move,
    });
  }
}
