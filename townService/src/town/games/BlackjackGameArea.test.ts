import { nanoid } from 'nanoid';
import { mock } from 'jest-mock-extended';
import { createPlayerForTesting } from '../../TestUtils';
import Player from '../../lib/Player';
import {
  GameInstanceID,
  GameMove,
  PlayerID,
  BlackjackGameState,
  BlackjackMove,
  SeatNumber,
  TownEmitter,
} from '../../types/CoveyTownSocket';
import Game from './Game';
import BlackjackGame from './BlackjackGame';
import * as BlackjackGameModule from './BlackjackGame';
import BlackjackGameArea from './BlackjackGameArea';
import {
  GAME_ID_MISSMATCH_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  INVALID_COMMAND_MESSAGE,
} from '../../lib/InvalidParametersError';

// mostly copied from ConnectFourGameArea.test.ts, might need to be changed

class TestingGame extends Game<BlackjackGameState, BlackjackMove> {
  public constructor(priorGame?: BlackjackGame) {
    super({
      moves: [],
      status: 'WAITING_TO_START', // Might need to be WAITING_FOR_PLAYERS
      occupiedSeats: new Map<SeatNumber, PlayerID | undefined>(),
      readyPlayers: new Map<SeatNumber, boolean | undefined>(),
      playerBalances: new Map<SeatNumber, number | undefined>(),
      dealerMoves: [],
    });
  }

  public applyMove(move: GameMove<BlackjackMove>): void {}

  public endGame(winner?: string) {
    this.state = {
      ...this.state,
      status: 'OVER',
      winner,
    };
  }

  public startGame(player: Player) {
    for (let i = 0; i < 8; i++) {
      if (this.state.occupiedSeats.get(i as SeatNumber) === player.id) {
        this.state.readyPlayers.set(i as SeatNumber, true);
        return;
      }
    }
  }

  protected _join(player: Player): void {
    for (let i = 0; i < 8; i++) {
      if (this.state.occupiedSeats.get(i as SeatNumber) === undefined) {
        this.state.occupiedSeats.set(i as SeatNumber, player.id);
        return;
      }
    }
    this._players.push(player);
  }

  protected _leave(player: Player): void {}
}
describe('BlackjackGameArea', () => {
  let gameArea: BlackjackGameArea;
  let zero: Player;
  let one: Player;
  let two: Player;
  let three: Player;
  let four: Player;
  let five: Player;
  let six: Player;
  let seven: Player;

  let seatToPlayer: Array<Player>;

  let interactableUpdateSpy: jest.SpyInstance;
  const gameConstructorSpy = jest.spyOn(BlackjackGameModule, 'default');
  let game: TestingGame;

  beforeEach(() => {
    gameConstructorSpy.mockClear();
    game = new TestingGame();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (Testing without using the real game class)
    gameConstructorSpy.mockReturnValue(game);

    zero = createPlayerForTesting();
    one = createPlayerForTesting();
    two = createPlayerForTesting();
    three = createPlayerForTesting();
    four = createPlayerForTesting();
    five = createPlayerForTesting();
    six = createPlayerForTesting();
    seven = createPlayerForTesting();

    seatToPlayer = [zero, one, two, three, four, five, six, seven];

    gameArea = new BlackjackGameArea(
      nanoid(),
      { x: 0, y: 0, width: 100, height: 100 },
      mock<TownEmitter>(),
    );

    gameArea.add(zero);
    game.join(zero);
    gameArea.add(one);
    game.join(one);
    gameArea.add(two);
    game.join(two);
    gameArea.add(three);
    game.join(three);
    gameArea.add(four);
    game.join(four);
    gameArea.add(five);
    game.join(five);
    gameArea.add(six);
    game.join(six);
    gameArea.add(seven);
    game.join(seven);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (Test requires access to protected method)
    interactableUpdateSpy = jest.spyOn(gameArea, '_emitAreaChanged');
  });

  describe('[T3.1] JoinGame command', () => {
    test('when there is no existing game, it should create a new game and call _emitAreaChanged', () => {
      expect(gameArea.game).toBeUndefined();
      const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, zero);
      expect(gameArea.game).toBeDefined();
      expect(gameID).toEqual(game.id);
      expect(interactableUpdateSpy).toHaveBeenCalled();
    });
    test('when there is a game that just ended, it should create a new game and call _emitAreaChanged', () => {
      expect(gameArea.game).toBeUndefined();

      gameConstructorSpy.mockClear();
      const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, zero);
      expect(gameArea.game).toBeDefined();
      expect(gameID).toEqual(game.id);
      expect(interactableUpdateSpy).toHaveBeenCalled();
      expect(gameConstructorSpy).toHaveBeenCalledTimes(1);
      game.endGame();

      gameConstructorSpy.mockClear();
      const { gameID: newGameID } = gameArea.handleCommand({ type: 'JoinGame' }, zero);
      expect(gameArea.game).toBeDefined();
      expect(newGameID).toEqual(game.id);
      expect(interactableUpdateSpy).toHaveBeenCalled();
      expect(gameConstructorSpy).toHaveBeenCalledTimes(1);
    });
    describe('when there is a game in progress', () => {
      it('should call join on the game and call _emitAreaChanged', () => {
        const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, zero);
        if (!game) {
          throw new Error('Game was not created by the first call to join');
        }
        expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);

        const joinSpy = jest.spyOn(game, 'join');
        const gameID2 = gameArea.handleCommand({ type: 'JoinGame' }, one).gameID;
        expect(joinSpy).toHaveBeenCalledWith(one);
        expect(gameID).toEqual(gameID2);
        expect(interactableUpdateSpy).toHaveBeenCalledTimes(2);
      });
      it('should not call _emitAreaChanged if the game throws an error', () => {
        gameArea.handleCommand({ type: 'JoinGame' }, zero);
        if (!game) {
          throw new Error('Game was not created by the first call to join');
        }
        interactableUpdateSpy.mockClear();

        const joinSpy = jest.spyOn(game, 'join').mockImplementationOnce(() => {
          throw new Error('Test Error');
        });
        expect(() => gameArea.handleCommand({ type: 'JoinGame' }, one)).toThrowError('Test Error');
        expect(joinSpy).toHaveBeenCalledWith(one);
        expect(interactableUpdateSpy).not.toHaveBeenCalled();
      });
    });
  });
  describe('[T3.2] StartGame command', () => {
    it('when there is no game, it should throw an error and not call _emitAreaChanged', () => {
      expect(() =>
        gameArea.handleCommand({ type: 'StartGame', gameID: nanoid() }, zero),
      ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
    });
    describe('when there is a game in progress', () => {
      it('should call startGame on the game and call _emitAreaChanged', () => {
        const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, zero);
        interactableUpdateSpy.mockClear();
        gameArea.handleCommand({ type: 'StartGame', gameID }, one);
        expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
      });
      it('should not call _emitAreaChanged if the game throws an error', () => {
        gameArea.handleCommand({ type: 'JoinGame' }, zero);
        if (!game) {
          throw new Error('Game was not created by the first call to join');
        }
        interactableUpdateSpy.mockClear();

        const startSpy = jest.spyOn(game, 'startGame').mockImplementationOnce(() => {
          throw new Error('Test Error');
        });
        expect(() =>
          gameArea.handleCommand({ type: 'StartGame', gameID: game.id }, one),
        ).toThrowError('Test Error');
        expect(startSpy).toHaveBeenCalledWith(one);
        expect(interactableUpdateSpy).not.toHaveBeenCalled();
      });
      test('when the game ID mismatches, it should throw an error and not call _emitAreaChanged', () => {
        gameArea.handleCommand({ type: 'JoinGame' }, zero);
        if (!game) {
          throw new Error('Game was not created by the first call to join');
        }
        expect(() =>
          gameArea.handleCommand({ type: 'StartGame', gameID: nanoid() }, zero),
        ).toThrowError(GAME_ID_MISSMATCH_MESSAGE);
      });
    });
  });
  describe('[T3.3] GameMove command', () => {
    it('should throw an error if there is no game in progress and not call _emitAreaChanged', () => {
      interactableUpdateSpy.mockClear();

      expect(() =>
        gameArea.handleCommand(
          { type: 'GameMove', move: { col: 0, row: 0, gamePiece: 'X' }, gameID: nanoid() },
          zero,
        ),
      ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
      expect(interactableUpdateSpy).not.toHaveBeenCalled();
    });
    describe('when there is a game in progress', () => {
      let gameID: GameInstanceID;
      beforeEach(() => {
        gameID = gameArea.handleCommand({ type: 'JoinGame' }, zero).gameID;
        gameArea.handleCommand({ type: 'JoinGame' }, one);
        interactableUpdateSpy.mockClear();
      });
      it('should throw an error if the gameID does not match the game and not call _emitAreaChanged', () => {
        expect(() =>
          gameArea.handleCommand(
            { type: 'GameMove', move: { col: 0, row: 0, gamePiece: 'Yellow' }, gameID: nanoid() },
            zero,
          ),
        ).toThrowError(GAME_ID_MISSMATCH_MESSAGE);
      });
      it('should call applyMove on the game and call _emitAreaChanged', () => {
        const move: BlackjackMove = { moveType: 'DEAL' };
        const applyMoveSpy = jest.spyOn(game, 'applyMove');
        gameArea.handleCommand({ type: 'GameMove', move, gameID }, zero);
        expect(applyMoveSpy).toHaveBeenCalledWith({
          gameID: game.id,
          playerID: zero.id,
          move: {
            ...move,
          },
        });
        expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
      });
      it('should not call _emitAreaChanged if the game throws an error', () => {
        const move: BlackjackMove = { moveType: 'DEAL' };
        const applyMoveSpy = jest.spyOn(game, 'applyMove');
        applyMoveSpy.mockImplementationOnce(() => {
          throw new Error('Test Error');
        });
        expect(() => gameArea.handleCommand({ type: 'GameMove', move, gameID }, zero)).toThrowError(
          'Test Error',
        );
        expect(applyMoveSpy).toHaveBeenCalledWith({
          gameID: game.id,
          playerID: zero.id,
          move: {
            ...move,
          },
        });
        expect(interactableUpdateSpy).not.toHaveBeenCalled();
      });
      describe('when the game ends', () => {
        test.each<SeatNumber>([0, 1, 2, 3, 4, 5, 6, 7])(
          'when the game is won by %p',
          (winner: SeatNumber) => {
            const finalMove: BlackjackMove = { moveType: 'DEAL' };
            jest.spyOn(game, 'applyMove').mockImplementationOnce(() => {
              game.endGame(seatToPlayer[winner].id);
            });
            gameArea.handleCommand({ type: 'GameMove', move: finalMove, gameID }, zero);
            expect(game.state.status).toEqual('OVER');
            expect(gameArea.history.length).toEqual(1);
            const winningUsername = seatToPlayer[winner].userName;
            expect(gameArea.history[0]).toEqual({
              gameID: game.id,
              scores: {
                [winningUsername]: 1,
              },
            });
            expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
          },
        );
        test('when the game results in a tie', () => {
          const finalMove: BlackjackMove = { moveType: 'DEAL' };
          jest.spyOn(game, 'applyMove').mockImplementationOnce(() => {
            game.endGame();
          });
          gameArea.handleCommand({ type: 'GameMove', move: finalMove, gameID }, zero);
          expect(game.state.status).toEqual('OVER');
          expect(gameArea.history.length).toEqual(1);
          expect(gameArea.history[0]).toEqual({
            gameID: game.id,
            scores: {},
          });
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
  describe('[T3.4] LeaveGame command', () => {
    it('should throw an error if there is no game in progress and not call _emitAreaChanged', () => {
      expect(() =>
        gameArea.handleCommand({ type: 'LeaveGame', gameID: nanoid() }, zero),
      ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
      expect(interactableUpdateSpy).not.toHaveBeenCalled();
    });
    describe('when there is a game in progress', () => {
      it('should throw an error if the gameID does not match the game and not call _emitAreaChanged', () => {
        gameArea.handleCommand({ type: 'JoinGame' }, zero);
        interactableUpdateSpy.mockClear();
        expect(() =>
          gameArea.handleCommand({ type: 'LeaveGame', gameID: nanoid() }, zero),
        ).toThrowError(GAME_ID_MISSMATCH_MESSAGE);
        expect(interactableUpdateSpy).not.toHaveBeenCalled();
      });
      it('should call leave on the game and call _emitAreaChanged', () => {
        const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, zero);
        if (!game) {
          throw new Error('Game was not created by the first call to join');
        }
        expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
        const leaveSpy = jest.spyOn(game, 'leave');
        gameArea.handleCommand({ type: 'LeaveGame', gameID }, zero);
        expect(leaveSpy).toHaveBeenCalledWith(zero);
        expect(interactableUpdateSpy).toHaveBeenCalledTimes(2);
      });
      it('should not call _emitAreaChanged if the game throws an error', () => {
        gameArea.handleCommand({ type: 'JoinGame' }, zero);
        if (!game) {
          throw new Error('Game was not created by the first call to join');
        }
        interactableUpdateSpy.mockClear();
        const leaveSpy = jest.spyOn(game, 'leave').mockImplementationOnce(() => {
          throw new Error('Test Error');
        });
        expect(() =>
          gameArea.handleCommand({ type: 'LeaveGame', gameID: game.id }, zero),
        ).toThrowError('Test Error');
        expect(leaveSpy).toHaveBeenCalledWith(zero);
        expect(interactableUpdateSpy).not.toHaveBeenCalled();
      });
      test.each<SeatNumber>([0, 1, 2, 3, 4, 5, 6, 7])(
        'when the game is won by %p, it updates the history',
        (playerThatWins: SeatNumber) => {
          const leavingPlayer = playerThatWins === 0 ? seatToPlayer[1] : seatToPlayer[0];
          const winningPlayer = seatToPlayer[playerThatWins];

          const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, zero);
          gameArea.handleCommand({ type: 'JoinGame' }, one);

          interactableUpdateSpy.mockClear();

          jest.spyOn(game, 'leave').mockImplementationOnce(() => {
            game.endGame(winningPlayer.id);
          });
          gameArea.handleCommand({ type: 'LeaveGame', gameID }, leavingPlayer);
          expect(game.state.status).toEqual('OVER');
          expect(gameArea.history.length).toEqual(1);
          const winningUsername = winningPlayer.userName;

          expect(gameArea.history[0]).toEqual({
            gameID: game.id,
            scores: {
              [winningUsername]: 1,
            },
          });
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
        },
      );
    });
  });
  test('[T3.5] When given an invalid command it should throw an error', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (Testing an invalid command, only possible at the boundary of the type system)
    expect(() => gameArea.handleCommand({ type: 'InvalidCommand' }, zero)).toThrowError(
      INVALID_COMMAND_MESSAGE,
    );
    expect(interactableUpdateSpy).not.toHaveBeenCalled();
  });
});
