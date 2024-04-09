import InvalidParametersError, {
  GAME_ID_MISSMATCH_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  INVALID_COMMAND_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import {
  InteractableType,
  InteractableCommand,
  InteractableCommandReturnType,
  PokerMove,
  GameInstance,
  PokerGameState,
  PlayerID,
} from '../../types/CoveyTownSocket';
import GameArea from './GameArea';
import PokerGame from './PokerGame';

/**
 * The PokerGameArea class is responsible for managing the state of a single game area for poker.
 * Responsibilty for managing the state of the game itself is delegated to the PokerGame class.
 *
 * @see PokerGame
 * @see GameArea
 */
export default class PokerGameArea extends GameArea<PokerGame> {
  protected getType(): InteractableType {
    return 'PokerArea';
  }

  private _stateUpdated(updatedState: GameInstance<PokerGameState>) {
    if (updatedState.state.status === 'OVER') {
      const gameID = this._game?.id;
      if (gameID && !this._history.find(eachResult => eachResult.gameID === gameID)) {
        const players: Array<PlayerID> = [];
        for (let i = 0; i < 8; i++) {
          const player = updatedState.state.occupiedSeats[i];
          if (player) players.push(player);
        }
        if (players.length >= 2) {
          const playerNames = [];
          for (let i = 0; i < players.length; i++) {
            playerNames.push(
              this._occupants.find(eachPlayer => eachPlayer.id === players[i])?.userName ||
                players[i],
            );
          }
          if (updatedState.state.winner) {
            let winner = '';
            for (let i = 0; i < playerNames.length; i++) {
              if (updatedState.state.winner === players[i]) winner = playerNames[i];
            }
            this.history.push({
              gameID,
              scores: { [winner]: 1 },
            });
          } else {
            this.history.push({
              gameID,
              scores: {},
            });
          }
        }
      }
    }
    this._emitAreaChanged();
  }

  /**
   * Handle a command from a player in this game area.
   * Supported commands:
   * - JoinGame (joins the game `this._game`, or creates a new one if none is in progress)
   * - StartGame (indicates that the player is ready to start the game)
   * - GameMove (applies a move to the game)
   * - LeaveGame (leaves the game)
   *
   * If the command ended the game, records the outcome in this._history
   * If the command is successful (does not throw an error), calls this._emitAreaChanged (necessary
   * to notify any listeners of a state update, including any change to history)
   * If the command is unsuccessful (throws an error), the error is propagated to the caller
   *
   * @see InteractableCommand
   *
   * @param command command to handle
   * @param player player making the request
   * @returns response to the command, @see InteractableCommandResponse
   * @throws InvalidParametersError if the command is not supported or is invalid.
   * Invalid commands:
   * - GameMove, StartGame and LeaveGame: if the game is not in progress (GAME_NOT_IN_PROGRESS_MESSAGE) or if the game ID does not match the game in progress (GAME_ID_MISSMATCH_MESSAGE)
   * - Any command besides JoinGame, GameMove, StartGame and LeaveGame: INVALID_COMMAND_MESSAGE
   */
  public handleCommand<CommandType extends InteractableCommand>(
    command: CommandType,
    player: Player,
  ): InteractableCommandReturnType<CommandType> {
    if (command.type === 'GameMove') {
      const game = this._game;
      if (!game) {
        throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
      }
      if (game.id !== command.gameID) {
        throw new InvalidParametersError(GAME_ID_MISSMATCH_MESSAGE);
      }
      const moveAsPoker = command.move as PokerMove;
      if (!moveAsPoker.moveType) {
        throw new InvalidParametersError('Invalid move type');
      }
      game.applyMove({
        gameID: command.gameID,
        playerID: player.id,
        move: moveAsPoker,
      });
      this._stateUpdated(game.toModel());
      return undefined as InteractableCommandReturnType<CommandType>;
    }
    if (command.type === 'JoinGame') {
      let game = this._game;
      if (!game || game.state.status === 'OVER') {
        game = new PokerGame(undefined, game);
        this._game = game;
      }
      game.join(player);
      this._stateUpdated(game.toModel());
      return { gameID: game.id } as InteractableCommandReturnType<CommandType>;
    }
    if (command.type === 'LeaveGame') {
      const game = this._game;
      if (!game) throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
      if (game.id !== command.gameID) throw new InvalidParametersError(GAME_ID_MISSMATCH_MESSAGE);
      game.leave(player);
      this._stateUpdated(game.toModel());

      return undefined as InteractableCommandReturnType<CommandType>;
    }
    if (command.type === 'StartGame') {
      const game = this._game;
      if (!game) {
        throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
      }
      if (this._game?.id !== command.gameID) {
        throw new InvalidParametersError(GAME_ID_MISSMATCH_MESSAGE);
      }
      game.startGame(player);
      this._stateUpdated(game.toModel());
      return undefined as InteractableCommandReturnType<CommandType>;
    }
    throw new InvalidParametersError(INVALID_COMMAND_MESSAGE);
  }
}
