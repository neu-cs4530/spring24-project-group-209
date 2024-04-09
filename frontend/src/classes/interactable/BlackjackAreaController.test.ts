import assert from 'assert';
import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
// import {
//   BlackjackColIndex,
//   BlackjackColor,
//   BlackjackMove,
//   BlackjackRowIndex,
//   GameResult,
//   GameStatus,
// } from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import TownController from '../TownController';
import BlackjackAreaController, { BLACKJACK_ROWS } from './BlackjackAreaController';
import GameAreaController, { NO_GAME_IN_PROGRESS_ERROR } from './GameAreaController';
import { BlackjackMove, GameResult, GameStatus } from '../../types/CoveyTownSocket';
import { common } from '@material-ui/core/colors';
import { POKER_ROWS } from './PokerAreaController';

describe('BlackjackAreaController', () => {
  const ourPlayer = new PlayerController(nanoid(), 'TestUser', {
    x: 0,
    y: 0,
    moving: false,
    rotation: 'front',
  });
  const otherPlayers = [
    new PlayerController(nanoid(), 'NewUser', { x: 0, y: 0, moving: false, rotation: 'front' }),
    new PlayerController(nanoid(), 'DevUser', { x: 0, y: 0, moving: false, rotation: 'front' }),
  ];

  const mockTownController = mock<TownController>();
  Object.defineProperty(mockTownController, 'ourPlayer', {
    get: () => ourPlayer,
  });
  Object.defineProperty(mockTownController, 'players', {
    get: () => [ourPlayer, ...otherPlayers],
  });
  mockTownController.getPlayer.mockImplementation(playerID => {
    const p = mockTownController.players.find(player => player.id === playerID);
    assert(p);
    return p;
  });

  function updateGameWithMove(controller: BlackjackAreaController, nextMove: BlackjackMove): void {
    const nextState = Object.assign({}, controller.toInteractableAreaModel());
    const nextGame = Object.assign({}, nextState.game);
    nextState.game = nextGame;
    const newState = Object.assign({}, nextGame.state);
    nextGame.state = newState;
    newState.moves = newState.moves.concat([nextMove]);
    controller.updateFrom(nextState, controller.occupants);
  }
  function BlackjackAreaControllerWithProps({
    _id,
    history,
    undefinedGame,
    status,
    moves,
    gameInstanceID,
    winners,
    observers,
  }: {
    _id?: string;
    history?: GameResult[];
    undefinedGame?: boolean;
    status?: GameStatus;
    gameInstanceID?: string;
    moves?: BlackjackMove[];
    winners?: Array<boolean | undefined>;
    observers?: string[];
  }) {
    const id = _id || `INTERACTABLE-ID-${nanoid()}`;
    const instanceID = gameInstanceID || `GAME-INSTANCE-ID-${nanoid()}`;
    const players = [];
    if (observers) players.push(...observers);
    const ret = new BlackjackAreaController(
      id,
      {
        id,
        occupants: players,
        history: history || [],
        type: 'BlackjackArea',
        game: undefinedGame
          ? undefined
          : {
              id: instanceID,
              players: players,
              state: {
                status: status || 'IN_PROGRESS',
                moves: moves || [],
                winners: winners || [],
                dealerMoves: [],
                occupiedSeats: [],
                readyPlayers: [],
                playerBalances: [],
                bustedPlayers: [],
                standPlayers: [],
              },
            },
      },
      mockTownController,
    );
    if (players) {
      ret.occupants = players
        .map(eachID => mockTownController.players.find(eachPlayer => eachPlayer.id === eachID))
        .filter(eachPlayer => eachPlayer) as PlayerController[];
    }
    return ret;
  }
  describe('[T1.1] Properties at the start of the game', () => {
    describe('board', () => {
      it('returns an empty board if there are no moves yet', () => {
        const controller = BlackjackAreaControllerWithProps({ status: 'IN_PROGRESS', moves: [] });
        expect(controller.board.length).toEqual(BLACKJACK_ROWS);
        //Expect no cards drawn
      });
      describe('emptySeats', () => {
        it('returns the correct amount of empty seats', () => {
          const controller = BlackjackAreaControllerWithProps({ status: 'IN_PROGRESS', moves: [] });
          expect(controller.numActivePlayers).toBe(0);
        });
      });
      describe('occupiedSeats', () => {
        it('returns the correct amount of occupied seats', () => {
          const controller = BlackjackAreaControllerWithProps({ status: 'IN_PROGRESS' });
          expect(controller.occupiedSeats[0]).toBe(undefined);
        });
      });
      describe('winners', () => {
        it('returns the winners if there is a winners', () => {
          const controller = BlackjackAreaControllerWithProps({
            winners: [true],
          });
          expect(controller.winners[0]).toBe(true);
        });
        it('returns undefined if there is no winners', () => {
          const controller = BlackjackAreaControllerWithProps({ winners: undefined });
          controller.winners.forEach(winner => {
            expect(winner).toBe(undefined);
          });
        });
      });
      describe('moveCount', () => {
        it('returns the number of moves from the game state', () => {
          const controller = BlackjackAreaControllerWithProps({
            moves: [
              { moveType: 'DEAL', card: { face: 1, suite: 'SPADES' }, player: 0 },
              { moveType: 'DEAL', card: { face: 2, suite: 'SPADES' }, player: 1 },
            ],
          });
          expect(controller.moveCount).toBe(2);
        });
      });
    });
    describe('[T1.2] Properties during the game, modified by _updateFrom ', () => {
      let controller: BlackjackAreaController;
      beforeEach(() => {
        controller = BlackjackAreaControllerWithProps({
          status: 'IN_PROGRESS',
        });
      });
      it('returns the correct board after a move', () => {
        updateGameWithMove(controller, {
          moveType: 'DEAL',
          card: { face: 1, suite: 'SPADES' },
          player: 0,
        });
        expect(controller.board[0][0]).toStrictEqual({
          card: { face: 1, suite: 'SPADES' },
          player: 0,
        });
        for (let i = 1; i < POKER_ROWS - 1; i++) {
          expect(controller.board[i].length).toBe(0);
        }
      });
      it('emits a boardChange event if the board has changed', () => {
        const spy = jest.fn();
        controller.addListener('boardChanged', spy);
        updateGameWithMove(controller, {
          moveType: 'DEAL',
          card: { face: 1, suite: 'SPADES' },
          player: 0,
        });
        expect(spy).toHaveBeenCalledWith(controller.board);
      });
      it('does not emit a boardChange event if the board has not changed', () => {
        const spy = jest.fn();
        controller.addListener('boardChanged', spy);
        controller.updateFrom(
          { ...controller.toInteractableAreaModel() },
          otherPlayers.concat(ourPlayer),
        );
        expect(spy).not.toHaveBeenCalled();
      });
      it('Calls super.updateFrom with the correct parameters', () => {
        //eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore - we are testing spying on a private method
        const spy = jest.spyOn(GameAreaController.prototype, '_updateFrom');
        const model = controller.toInteractableAreaModel();
        controller.updateFrom(model, otherPlayers.concat(ourPlayer));
        expect(spy).toHaveBeenCalledWith(model);
      });
      describe('updating whoseTurn', () => {
        it('updates whoseTurn correctly after a move', () => {
          expect(controller.whoseTurn).toBe(controller.occupiedSeats[0]);
          expect(controller.whoseTurn).toBe(controller.occupiedSeats[1]);
        });
      });
    });

    describe('[T1.3] startGame', () => {
      it('sends a StartGame command to the server', async () => {
        const controller = BlackjackAreaControllerWithProps({
          status: 'WAITING_TO_START',
        });
        const instanceID = nanoid();
        mockTownController.sendInteractableCommand.mockImplementationOnce(async () => {
          return { gameID: instanceID };
        });
        await controller.joinGame();

        mockTownController.sendInteractableCommand.mockClear();
        mockTownController.sendInteractableCommand.mockImplementationOnce(async () => {});
        await controller.startGame();
        expect(mockTownController.sendInteractableCommand).toHaveBeenCalledWith(controller.id, {
          type: 'StartGame',
          gameID: instanceID,
        });
      });
      it('Does not catch any errors from the server', async () => {
        const controller = BlackjackAreaControllerWithProps({
          status: 'WAITING_TO_START',
        });
        const instanceID = nanoid();
        mockTownController.sendInteractableCommand.mockImplementationOnce(async () => {
          return { gameID: instanceID };
        });
        await controller.joinGame();

        mockTownController.sendInteractableCommand.mockClear();
        const uniqueError = `Test Error ${nanoid()}`;
        mockTownController.sendInteractableCommand.mockImplementationOnce(async () => {
          throw new Error(uniqueError);
        });
        await expect(() => controller.startGame()).rejects.toThrowError(uniqueError);
        expect(mockTownController.sendInteractableCommand).toHaveBeenCalledWith(controller.id, {
          type: 'StartGame',
          gameID: instanceID,
        });
      });
      it('throws an error if there is no instanceid', async () => {
        const controller = BlackjackAreaControllerWithProps({
          status: 'WAITING_TO_START',
        });
        mockTownController.sendInteractableCommand.mockClear();
        await expect(controller.startGame()).rejects.toThrowError();
        expect(mockTownController.sendInteractableCommand).not.toHaveBeenCalled();
      });
    });
    describe('[T1.4] makeMove', () => {
      describe('With no game in progress', () => {
        it('Throws an error if there is no game', async () => {
          const controller = BlackjackAreaControllerWithProps({
            undefinedGame: true,
          });
          await expect(() =>
            controller.makeMove({
              card: undefined,
              moveType: 'HIT',
              player: controller.playerSeat(ourPlayer),
            }),
          ).rejects.toThrowError(NO_GAME_IN_PROGRESS_ERROR);
        });
        it('Throws an error if game status is not IN_PROGRESS', async () => {
          const controller = BlackjackAreaControllerWithProps({
            status: 'WAITING_TO_START',
          });
          await expect(() =>
            controller.makeMove({
              card: undefined,
              moveType: 'HIT',
              player: controller.playerSeat(ourPlayer),
            }),
          ).rejects.toThrowError(NO_GAME_IN_PROGRESS_ERROR);
        });
      });
      describe('With a game in progress', () => {
        let controller: BlackjackAreaController;
        let instanceID: string;
        beforeEach(async () => {
          instanceID = `GameInstanceID.makeMove.${nanoid()}`;
          controller = BlackjackAreaControllerWithProps({
            status: 'IN_PROGRESS',
            gameInstanceID: instanceID,
          });
          mockTownController.sendInteractableCommand.mockImplementationOnce(async () => {
            return { gameID: instanceID };
          });
          await controller.joinGame();
        });
        describe('Setting the row of the move', () => {
          async function makeMoveAndExpectRowPlacement(expectedRow: number, move: BlackjackMove) {
            mockTownController.sendInteractableCommand.mockClear();
            await controller.makeMove({
              card: undefined,
              moveType: 'HIT',
              player: controller.playerSeat(ourPlayer),
            });
            expect(mockTownController.sendInteractableCommand).toHaveBeenCalledWith(controller.id, {
              type: 'GameMove',
              gameID: instanceID,
              move: move,
            });
            //Update the controller with the new move
            updateGameWithMove(controller, {
              moveType: 'DEAL',
              card: { face: 1, suite: 'SPADES' },
              player: 0,
            });
          }
          it('Places the move in the correct row for the player', async () => {
            await makeMoveAndExpectRowPlacement(0, {
              card: undefined,
              moveType: 'HIT',
              player: controller.playerSeat(ourPlayer),
            });
          });
        });
      });
    });
  });
});
