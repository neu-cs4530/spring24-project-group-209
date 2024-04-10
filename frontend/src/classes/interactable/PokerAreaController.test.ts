import assert from 'assert';
import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
// import {
//   PokerColIndex,
//   PokerColor,
//   PokerMove,
//   PokerRowIndex,
//   GameResult,
//   GameStatus,
// } from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import TownController from '../TownController';
import PokerAreaController, { POKER_ROWS } from './PokerAreaController';
import { NO_GAME_IN_PROGRESS_ERROR } from './GameAreaController';
import { PokerMove, GameResult, GameStatus } from '../../types/CoveyTownSocket';

describe('PokerAreaController', () => {
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

  function PokerAreaControllerWithProps({
    _id,
    history,
    undefinedGame,
    status,
    moves,
    gameInstanceID,
    observers,
  }: {
    _id?: string;
    history?: GameResult[];
    undefinedGame?: boolean;
    gameInstanceID?: string;
    status?: GameStatus;
    moves?: PokerMove[];
    observers?: string[];
  }) {
    const id = _id || `INTERACTABLE-ID-${nanoid()}`;
    const instanceID = gameInstanceID || `GAME-INSTANCE-ID-${nanoid()}`;
    const players = [];
    if (observers) players.push(...observers);
    const ret = new PokerAreaController(
      id,
      {
        id,
        occupants: players,
        history: history || [],
        type: 'PokerArea',
        game: undefinedGame
          ? undefined
          : {
              id: instanceID,
              players: players,
              state: {
                status: status || 'IN_PROGRESS',
                moves: moves || [],
                occupiedSeats: [],
                readyPlayers: [],
                playerBalances: [],
                foldedPlayers: [],
                smallBlind: 0,
                pot: 0,
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
        const controller = PokerAreaControllerWithProps({ status: 'IN_PROGRESS', moves: [] });
        expect(controller.board.length).toEqual(POKER_ROWS);
        //Expect no cards drawn
      });
      describe('emptySeats', () => {
        it('returns the correct amount of empty seats', () => {
          const controller = PokerAreaControllerWithProps({ status: 'IN_PROGRESS', moves: [] });
          expect(controller.numActivePlayers).toBe(0);
        });
      });
      describe('occupiedSeats', () => {
        it('returns the correct amount of occupied seats', () => {
          const controller = PokerAreaControllerWithProps({ status: 'IN_PROGRESS' });
          expect(controller.occupiedSeats[0]).toBe(undefined);
        });
      });
      describe('moveCount', () => {
        it('returns the number of moves from the game state', () => {
          const controller = PokerAreaControllerWithProps({
            moves: [
              { moveType: 'DEAL', card: { face: 1, suite: 'SPADES' }, player: 0 },
              { moveType: 'DEAL', card: { face: 3, suite: 'SPADES' }, player: 0 },
              { moveType: 'DEAL', card: { face: 2, suite: 'SPADES' }, player: 1 },
              { moveType: 'DEAL', card: { face: 4, suite: 'SPADES' }, player: 1 },
            ],
          });
          expect(controller.moveCount).toBe(4);
        });
      });
    });
  });

  describe('[T1.3] startGame', () => {
    it('sends a StartGame command to the server', async () => {
      const controller = PokerAreaControllerWithProps({
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
      const controller = PokerAreaControllerWithProps({
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
      const controller = PokerAreaControllerWithProps({
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
        const controller = PokerAreaControllerWithProps({
          undefinedGame: true,
        });
        await expect(() =>
          controller.makeMove({
            card: undefined,
            moveType: 'FOLD',
            player: controller.playerSeat(ourPlayer),
          }),
        ).rejects.toThrowError(NO_GAME_IN_PROGRESS_ERROR);
      });
      it('Throws an error if game status is not IN_PROGRESS', async () => {
        const controller = PokerAreaControllerWithProps({
          status: 'WAITING_TO_START',
        });
        await expect(() =>
          controller.makeMove({
            card: undefined,
            moveType: 'FOLD',
            player: controller.playerSeat(ourPlayer),
          }),
        ).rejects.toThrowError(NO_GAME_IN_PROGRESS_ERROR);
      });
    });
  });
});
