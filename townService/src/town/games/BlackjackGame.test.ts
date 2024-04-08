import { createPlayerForTesting } from '../../TestUtils';
import {
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  GAME_NOT_STARTABLE_MESSAGE,
  MOVE_NOT_YOUR_TURN_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import { Card, SeatNumber, BlackjackMove } from '../../types/CoveyTownSocket';
import BasicDeck from './BasicDeck';
import BlackjackGame from './BlackjackGame';

/**
 * Mock deck which allows rigged draws for testing
 */
class TestDeck extends BasicDeck {
  private _nextCardQueue: Array<Card> = [];

  /**
   * Pushes to a list of rigged draws to rig a variable number of the next draws, used to create
   * predictable hands - the last card pushed to the draw list will be the first one drawn
   * @param card The card to be added to the queue of cards to be drawn
   */
  public addNextDraw(card: Card): void {
    this._nextCardQueue.push(card);
  }

  drawCard(): Card {
    const cardToReturn: Card | undefined = this._nextCardQueue.pop();
    if (cardToReturn) {
      this._cardsRemaining.filter(
        c => c.face !== cardToReturn.face && c.suite !== cardToReturn.suite,
      );
      return cardToReturn;
    }
    return super.drawCard();
  }
}

describe('BlackjackGame', () => {
  let game: BlackjackGame;
  let deck: TestDeck;
  beforeEach(() => {
    deck = new TestDeck();
    game = new BlackjackGame(deck);
  });
  describe('_join', () => {
    it('should throw an error if the player is already in the game', () => {
      const player = createPlayerForTesting();
      game.join(player);
      expect(() => game.join(player)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
      const player2 = createPlayerForTesting();
      game.join(player2);
      expect(() => game.join(player2)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
      const player3 = createPlayerForTesting();
      game.join(player3);
      expect(() => game.join(player3)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
      const player4 = createPlayerForTesting();
      game.join(player4);
      expect(() => game.join(player4)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
      const player5 = createPlayerForTesting();
      game.join(player5);
      expect(() => game.join(player5)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
      const player6 = createPlayerForTesting();
      game.join(player6);
      expect(() => game.join(player6)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
      const player7 = createPlayerForTesting();
      game.join(player7);
      expect(() => game.join(player7)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
      const player8 = createPlayerForTesting();
      game.join(player8);
      expect(() => game.join(player8)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    });
    it('should throw an error if the game is full', () => {
      const player = createPlayerForTesting();
      game.join(player);
      const player2 = createPlayerForTesting();
      game.join(player2);
      const player3 = createPlayerForTesting();
      game.join(player3);
      const player4 = createPlayerForTesting();
      game.join(player4);
      const player5 = createPlayerForTesting();
      game.join(player5);
      const player6 = createPlayerForTesting();
      game.join(player6);
      const player7 = createPlayerForTesting();
      game.join(player7);
      const player8 = createPlayerForTesting();
      game.join(player8);
      const player9 = createPlayerForTesting();
      expect(() => game.join(player9)).toThrowError(GAME_FULL_MESSAGE);
    });
    it('should throw an error if the game is in progress, even if it has space', () => {
      const player = createPlayerForTesting();
      game.join(player);
      const player2 = createPlayerForTesting();
      game.join(player2);
      game.startGame(player);
      game.startGame(player2);
      const player3 = createPlayerForTesting();
      expect(() => game.join(player3)).toThrowError(GAME_FULL_MESSAGE);
    });
    describe('if the player is not in the game and the game is not full', () => {
      it('should add the player to the next avaiable seat  with the default balance', () => {
        const seats: Array<SeatNumber> = [0, 1, 2, 3, 4, 5, 6, 7];
        const players: Array<Player> = [
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
        ];

        game.join(players[0]);
        for (let i = 0; i < 1; i++) {
          expect(game.state.occupiedSeats[i]).toBe(players[i].id);
          expect(game.state.readyPlayers[i]).toBe(false);
          expect(game.state.playerBalances[i]).toBe(1000);
        }
        for (let i = 1; i < 8; i++) {
          expect(game.state.occupiedSeats[i]).toBeUndefined();
          expect(game.state.readyPlayers[i]).toBeUndefined();
          expect(game.state.playerBalances[i]).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[1]);
        for (let i = 0; i < 2; i++) {
          expect(game.state.occupiedSeats[i]).toBe(players[i].id);
          expect(game.state.readyPlayers[i]).toBe(false);
          expect(game.state.playerBalances[i]).toBe(1000);
        }
        for (let i = 2; i < 8; i++) {
          expect(game.state.occupiedSeats[i]).toBeUndefined();
          expect(game.state.readyPlayers[i]).toBeUndefined();
          expect(game.state.playerBalances[i]).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[2]);
        for (let i = 0; i < 3; i++) {
          expect(game.state.occupiedSeats[i]).toBe(players[i].id);
          expect(game.state.readyPlayers[i]).toBe(false);
          expect(game.state.playerBalances[i]).toBe(1000);
        }
        for (let i = 3; i < 8; i++) {
          expect(game.state.occupiedSeats[i]).toBeUndefined();
          expect(game.state.readyPlayers[i]).toBeUndefined();
          expect(game.state.playerBalances[i]).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[3]);
        for (let i = 0; i < 4; i++) {
          expect(game.state.occupiedSeats[i]).toBe(players[i].id);
          expect(game.state.readyPlayers[i]).toBe(false);
          expect(game.state.playerBalances[i]).toBe(1000);
        }
        for (let i = 4; i < 8; i++) {
          expect(game.state.occupiedSeats[i]).toBeUndefined();
          expect(game.state.readyPlayers[i]).toBeUndefined();
          expect(game.state.playerBalances[i]).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[4]);
        for (let i = 0; i < 5; i++) {
          expect(game.state.occupiedSeats[i]).toBe(players[i].id);
          expect(game.state.readyPlayers[i]).toBe(false);
          expect(game.state.playerBalances[i]).toBe(1000);
        }
        for (let i = 5; i < 8; i++) {
          expect(game.state.occupiedSeats[i]).toBeUndefined();
          expect(game.state.readyPlayers[i]).toBeUndefined();
          expect(game.state.playerBalances[i]).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[5]);
        for (let i = 0; i < 6; i++) {
          expect(game.state.occupiedSeats[i]).toBe(players[i].id);
          expect(game.state.readyPlayers[i]).toBe(false);
          expect(game.state.playerBalances[i]).toBe(1000);
        }
        for (let i = 6; i < 8; i++) {
          expect(game.state.occupiedSeats[i]).toBeUndefined();
          expect(game.state.readyPlayers[i]).toBeUndefined();
          expect(game.state.playerBalances[i]).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[6]);
        for (let i = 0; i < 7; i++) {
          expect(game.state.occupiedSeats[i]).toBe(players[i].id);
          expect(game.state.readyPlayers[i]).toBe(false);
          expect(game.state.playerBalances[i]).toBe(1000);
        }
        for (let i = 7; i < 8; i++) {
          expect(game.state.occupiedSeats[i]).toBeUndefined();
          expect(game.state.readyPlayers[i]).toBeUndefined();
          expect(game.state.playerBalances[i]).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[7]);
        for (let i = 0; i < 8; i++) {
          expect(game.state.occupiedSeats[i]).toBe(players[i].id);
          expect(game.state.readyPlayers[i]).toBe(false);
          expect(game.state.playerBalances[i]).toBe(1000);
        }
        expect(game.state.status).toBe('WAITING_TO_START');
      });
      it('should update the game status to WAITING_TO_START if 8 players have joined', () => {
        const players: Array<Player> = [
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
        ];

        game.join(players[0]);
        game.join(players[1]);
        game.join(players[2]);
        game.join(players[3]);
        game.join(players[4]);
        game.join(players[5]);
        game.join(players[6]);
        game.join(players[7]);

        expect(game.state.status).toBe('WAITING_TO_START');
      });
      it('should carry the balance of players between games if they rejoin', () => {
        const seats: Array<SeatNumber> = [0, 1, 2, 3, 4, 5, 6, 7];
        const players: Array<Player> = [
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
          createPlayerForTesting(),
        ];

        game.join(players[0]);
        game.join(players[1]);

        game.startGame(players[0]);
        game.startGame(players[1]);

        const game2 = new BlackjackGame(new TestDeck(), game);

        game2.join(players[0]);
        game2.join(players[1]);

        expect(game2.state.playerBalances[0]).toBe(1000);
        expect(game2.state.playerBalances[1]).toBe(1000);
      });
    });
  });
  describe('_startGame', () => {
    it('should throw an error if the status is not WAITING TO START or WAITING_FOR_PLAYERS', () => {
      const player1 = createPlayerForTesting();
      const player2 = createPlayerForTesting();
      game.join(player1);
      game.join(player2);

      game.startGame(player1);
      game.startGame(player2);

      expect(() => game.startGame(player1)).toThrowError(GAME_NOT_STARTABLE_MESSAGE);
    });
    it('should throw an error if the player is not in the game', () => {
      const player1 = createPlayerForTesting();
      expect(() => game.startGame(player1)).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
    });
    describe('if the player is in the game, and there are at least two players', () => {
      const seats: Array<SeatNumber> = [0, 1, 2, 3, 4, 5, 6, 7];
      const players: Array<Player> = [
        createPlayerForTesting(),
        createPlayerForTesting(),
        createPlayerForTesting(),
        createPlayerForTesting(),
        createPlayerForTesting(),
        createPlayerForTesting(),
        createPlayerForTesting(),
        createPlayerForTesting(),
      ];
      beforeEach(() => {
        game.join(players[0]);
        game.join(players[1]);
      });
      it('should set the first player to ready correctly', () => {
        game.join(players[2]);
        game.join(players[3]);
        game.join(players[4]);
        game.join(players[5]);
        game.join(players[6]);
        game.join(players[7]);

        game.startGame(players[0]);

        expect(game.state.readyPlayers[0]).toBe(true);
        expect(game.state.readyPlayers[1]).toBe(false);
        expect(game.state.readyPlayers[2]).toBe(false);
        expect(game.state.readyPlayers[3]).toBe(false);
        expect(game.state.readyPlayers[4]).toBe(false);
        expect(game.state.readyPlayers[5]).toBe(false);
        expect(game.state.readyPlayers[6]).toBe(false);
        expect(game.state.readyPlayers[7]).toBe(false);

        expect(game.state.status).toBe('WAITING_TO_START');
      });
      it('should set the second player to ready correctly', () => {
        game.join(players[2]);
        game.join(players[3]);
        game.join(players[4]);
        game.join(players[5]);
        game.join(players[6]);
        game.join(players[7]);

        game.startGame(players[1]);

        expect(game.state.readyPlayers[0]).toBe(false);
        expect(game.state.readyPlayers[1]).toBe(true);
        expect(game.state.readyPlayers[2]).toBe(false);
        expect(game.state.readyPlayers[3]).toBe(false);
        expect(game.state.readyPlayers[4]).toBe(false);
        expect(game.state.readyPlayers[5]).toBe(false);
        expect(game.state.readyPlayers[6]).toBe(false);
        expect(game.state.readyPlayers[7]).toBe(false);

        expect(game.state.status).toBe('WAITING_TO_START');
      });
      it('should set the third player to ready correctly', () => {
        game.join(players[2]);
        game.join(players[3]);
        game.join(players[4]);
        game.join(players[5]);
        game.join(players[6]);
        game.join(players[7]);

        game.startGame(players[2]);

        expect(game.state.readyPlayers[0]).toBe(false);
        expect(game.state.readyPlayers[1]).toBe(false);
        expect(game.state.readyPlayers[2]).toBe(true);
        expect(game.state.readyPlayers[3]).toBe(false);
        expect(game.state.readyPlayers[4]).toBe(false);
        expect(game.state.readyPlayers[5]).toBe(false);
        expect(game.state.readyPlayers[6]).toBe(false);
        expect(game.state.readyPlayers[7]).toBe(false);

        expect(game.state.status).toBe('WAITING_TO_START');
      });
      it('should set the fourth player to ready correctly', () => {
        game.join(players[2]);
        game.join(players[3]);
        game.join(players[4]);
        game.join(players[5]);
        game.join(players[6]);
        game.join(players[7]);

        game.startGame(players[3]);

        expect(game.state.readyPlayers[0]).toBe(false);
        expect(game.state.readyPlayers[1]).toBe(false);
        expect(game.state.readyPlayers[2]).toBe(false);
        expect(game.state.readyPlayers[3]).toBe(true);
        expect(game.state.readyPlayers[4]).toBe(false);
        expect(game.state.readyPlayers[5]).toBe(false);
        expect(game.state.readyPlayers[6]).toBe(false);
        expect(game.state.readyPlayers[7]).toBe(false);

        expect(game.state.status).toBe('WAITING_TO_START');
      });
      it('should set the fifth player to ready correctly', () => {
        game.join(players[2]);
        game.join(players[3]);
        game.join(players[4]);
        game.join(players[5]);
        game.join(players[6]);
        game.join(players[7]);

        game.startGame(players[4]);

        expect(game.state.readyPlayers[0]).toBe(false);
        expect(game.state.readyPlayers[1]).toBe(false);
        expect(game.state.readyPlayers[2]).toBe(false);
        expect(game.state.readyPlayers[3]).toBe(false);
        expect(game.state.readyPlayers[4]).toBe(true);
        expect(game.state.readyPlayers[5]).toBe(false);
        expect(game.state.readyPlayers[6]).toBe(false);
        expect(game.state.readyPlayers[7]).toBe(false);

        expect(game.state.status).toBe('WAITING_TO_START');
      });
      it('should set the sixth player to ready correctly', () => {
        game.join(players[2]);
        game.join(players[3]);
        game.join(players[4]);
        game.join(players[5]);
        game.join(players[6]);
        game.join(players[7]);

        game.startGame(players[5]);

        expect(game.state.readyPlayers[0]).toBe(false);
        expect(game.state.readyPlayers[1]).toBe(false);
        expect(game.state.readyPlayers[2]).toBe(false);
        expect(game.state.readyPlayers[3]).toBe(false);
        expect(game.state.readyPlayers[4]).toBe(false);
        expect(game.state.readyPlayers[5]).toBe(true);
        expect(game.state.readyPlayers[6]).toBe(false);
        expect(game.state.readyPlayers[7]).toBe(false);

        expect(game.state.status).toBe('WAITING_TO_START');
      });
      it('should set the seventh player to ready correctly', () => {
        game.join(players[2]);
        game.join(players[3]);
        game.join(players[4]);
        game.join(players[5]);
        game.join(players[6]);
        game.join(players[7]);

        game.startGame(players[6]);

        expect(game.state.readyPlayers[0]).toBe(false);
        expect(game.state.readyPlayers[1]).toBe(false);
        expect(game.state.readyPlayers[2]).toBe(false);
        expect(game.state.readyPlayers[3]).toBe(false);
        expect(game.state.readyPlayers[4]).toBe(false);
        expect(game.state.readyPlayers[5]).toBe(false);
        expect(game.state.readyPlayers[6]).toBe(true);
        expect(game.state.readyPlayers[7]).toBe(false);

        expect(game.state.status).toBe('WAITING_TO_START');
      });
      it('should set the eigth player to ready correctly', () => {
        game.join(players[2]);
        game.join(players[3]);
        game.join(players[4]);
        game.join(players[5]);
        game.join(players[6]);
        game.join(players[7]);

        game.startGame(players[7]);

        expect(game.state.readyPlayers[0]).toBe(false);
        expect(game.state.readyPlayers[1]).toBe(false);
        expect(game.state.readyPlayers[2]).toBe(false);
        expect(game.state.readyPlayers[3]).toBe(false);
        expect(game.state.readyPlayers[4]).toBe(false);
        expect(game.state.readyPlayers[5]).toBe(false);
        expect(game.state.readyPlayers[6]).toBe(false);
        expect(game.state.readyPlayers[7]).toBe(true);

        expect(game.state.status).toBe('WAITING_TO_START');
      });
      describe('should set the status to IN_PROGRESS if there are 2 or more players, and all players are ready', () => {
        it('should update the status with 2 players', () => {
          game.startGame(players[0]);

          expect(game.state.status).toBe('WAITING_FOR_PLAYERS');
          game.startGame(players[1]);

          expect(game.state.status).toBe('IN_PROGRESS');
        });
        it('should update the status with 3 players', () => {
          game.join(players[2]);

          game.startGame(players[0]);
          game.startGame(players[1]);

          expect(game.state.status).toBe('WAITING_FOR_PLAYERS');
          game.startGame(players[2]);

          expect(game.state.status).toBe('IN_PROGRESS');
        });
        it('should update the status with 4 players', () => {
          game.join(players[2]);
          game.join(players[3]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);

          expect(game.state.status).toBe('WAITING_FOR_PLAYERS');
          game.startGame(players[3]);

          expect(game.state.status).toBe('IN_PROGRESS');
        });
        it('should update the status with 5 players', () => {
          game.join(players[2]);
          game.join(players[3]);
          game.join(players[4]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);
          game.startGame(players[3]);

          expect(game.state.status).toBe('WAITING_FOR_PLAYERS');
          game.startGame(players[4]);

          expect(game.state.status).toBe('IN_PROGRESS');
        });
        it('should update the status with 6 players', () => {
          game.join(players[2]);
          game.join(players[3]);
          game.join(players[4]);
          game.join(players[5]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);
          game.startGame(players[3]);
          game.startGame(players[4]);

          expect(game.state.status).toBe('WAITING_FOR_PLAYERS');
          game.startGame(players[5]);

          expect(game.state.status).toBe('IN_PROGRESS');
        });
        it('should update the status with 7 players', () => {
          game.join(players[2]);
          game.join(players[3]);
          game.join(players[4]);
          game.join(players[5]);
          game.join(players[6]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);
          game.startGame(players[3]);
          game.startGame(players[4]);
          game.startGame(players[5]);

          expect(game.state.status).toBe('WAITING_FOR_PLAYERS');
          game.startGame(players[6]);

          expect(game.state.status).toBe('IN_PROGRESS');
        });
        it('should update the status with 8 players', () => {
          game.join(players[2]);
          game.join(players[3]);
          game.join(players[4]);
          game.join(players[5]);
          game.join(players[6]);
          game.join(players[7]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);
          game.startGame(players[3]);
          game.startGame(players[4]);
          game.startGame(players[5]);
          game.startGame(players[6]);

          expect(game.state.status).toBe('WAITING_TO_START');
          game.startGame(players[7]);

          expect(game.state.status).toBe('IN_PROGRESS');
        });
      });
      it('should not throw an error if the player is in the game and already ready', () => {
        game.startGame(players[0]);
        game.startGame(players[0]);

        expect(game.state.readyPlayers[0]).toBe(true);
        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');
      });
      describe('should deal 2 cards to each player in the game at the start of the game', () => {
        it('should deal 2 cards to each player in a two-player game', () => {
          game.startGame(players[0]);
          game.startGame(players[1]);

          const cardsDealt = game.state.moves.filter((m: BlackjackMove) => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(4);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[1]).length).toBe(2);
        });
        it('should deal 2 cards to each player in a three-player game', () => {
          game.join(players[2]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);

          const cardsDealt = game.state.moves.filter((m: BlackjackMove) => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(6);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[1]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[2]).length).toBe(2);
        });
        it('should deal 2 cards to each player in a four-player game', () => {
          game.join(players[2]);
          game.join(players[3]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);
          game.startGame(players[3]);

          const cardsDealt = game.state.moves.filter((m: BlackjackMove) => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(8);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[1]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[2]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[3]).length).toBe(2);
        });
        it('should deal 2 cards to each player in a five-player game', () => {
          game.join(players[2]);
          game.join(players[3]);
          game.join(players[4]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);
          game.startGame(players[3]);
          game.startGame(players[4]);

          const cardsDealt = game.state.moves.filter((m: BlackjackMove) => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(10);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[1]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[2]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[3]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[4]).length).toBe(2);
        });
        it('should deal 2 cards to each player in a six-player game', () => {
          game.join(players[2]);
          game.join(players[3]);
          game.join(players[4]);
          game.join(players[5]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);
          game.startGame(players[3]);
          game.startGame(players[4]);
          game.startGame(players[5]);

          const cardsDealt = game.state.moves.filter((m: BlackjackMove) => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(12);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[1]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[2]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[3]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[4]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[5]).length).toBe(2);
        });
        it('should deal 2 cards to each player in a seven-player game', () => {
          game.join(players[2]);
          game.join(players[3]);
          game.join(players[4]);
          game.join(players[5]);
          game.join(players[6]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);
          game.startGame(players[3]);
          game.startGame(players[4]);
          game.startGame(players[5]);
          game.startGame(players[6]);

          const cardsDealt = game.state.moves.filter((m: BlackjackMove) => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(14);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[1]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[2]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[3]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[4]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[5]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[6]).length).toBe(2);
        });
        it('should deal 2 cards to each player in an 8-player game', () => {
          game.join(players[2]);
          game.join(players[3]);
          game.join(players[4]);
          game.join(players[5]);
          game.join(players[6]);
          game.join(players[7]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);
          game.startGame(players[3]);
          game.startGame(players[4]);
          game.startGame(players[5]);
          game.startGame(players[6]);
          game.startGame(players[7]);
          const cardsDealt = game.state.moves.filter((m: BlackjackMove) => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(16);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[1]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[2]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[3]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[4]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[5]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[6]).length).toBe(2);
          expect(cardsDealt.filter((m: BlackjackMove) => m.player === seats[7]).length).toBe(2);
        });
        it('should deal cards in the order of seat index', () => {
          game.join(players[2]);
          game.join(players[3]);
          game.join(players[4]);
          game.join(players[5]);
          game.join(players[6]);
          game.join(players[7]);

          deck.addNextDraw({ face: 8, suite: 'CLUBS' });
          deck.addNextDraw({ face: 8, suite: 'SPADES' });
          deck.addNextDraw({ face: 7, suite: 'CLUBS' });
          deck.addNextDraw({ face: 7, suite: 'SPADES' });
          deck.addNextDraw({ face: 6, suite: 'CLUBS' });
          deck.addNextDraw({ face: 6, suite: 'SPADES' });
          deck.addNextDraw({ face: 5, suite: 'CLUBS' });
          deck.addNextDraw({ face: 5, suite: 'SPADES' });
          deck.addNextDraw({ face: 4, suite: 'CLUBS' });
          deck.addNextDraw({ face: 4, suite: 'SPADES' });
          deck.addNextDraw({ face: 3, suite: 'CLUBS' });
          deck.addNextDraw({ face: 3, suite: 'SPADES' });
          deck.addNextDraw({ face: 2, suite: 'CLUBS' });
          deck.addNextDraw({ face: 2, suite: 'SPADES' });
          deck.addNextDraw({ face: 1, suite: 'CLUBS' });
          deck.addNextDraw({ face: 1, suite: 'SPADES' });

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);
          game.startGame(players[3]);
          game.startGame(players[4]);
          game.startGame(players[5]);
          game.startGame(players[6]);
          game.startGame(players[7]);

          const cardsDealt = game.state.moves.filter((m: BlackjackMove) => m.moveType === 'DEAL');

          const zeroCards = cardsDealt.filter((m: BlackjackMove) => m.player === seats[0]);
          expect(zeroCards.length).toBe(2);
          expect(
            zeroCards.filter((m: BlackjackMove) => m.card?.face === 1 && m.card.suite === 'CLUBS')
              .length,
          ).toBe(1);
          expect(
            zeroCards.filter((m: BlackjackMove) => m.card?.face === 1 && m.card.suite === 'SPADES')
              .length,
          ).toBe(1);

          const oneCards = cardsDealt.filter((m: BlackjackMove) => m.player === seats[1]);
          expect(oneCards.length).toBe(2);
          expect(
            oneCards.filter((m: BlackjackMove) => m.card?.face === 2 && m.card.suite === 'CLUBS')
              .length,
          ).toBe(1);
          expect(
            oneCards.filter((m: BlackjackMove) => m.card?.face === 2 && m.card.suite === 'SPADES')
              .length,
          ).toBe(1);

          const threeCards = cardsDealt.filter((m: BlackjackMove) => m.player === seats[2]);
          expect(threeCards.length).toBe(2);
          expect(
            threeCards.filter((m: BlackjackMove) => m.card?.face === 3 && m.card.suite === 'CLUBS')
              .length,
          ).toBe(1);
          expect(
            threeCards.filter((m: BlackjackMove) => m.card?.face === 3 && m.card.suite === 'SPADES')
              .length,
          ).toBe(1);

          const fourCards = cardsDealt.filter((m: BlackjackMove) => m.player === seats[3]);
          expect(fourCards.length).toBe(2);
          expect(
            fourCards.filter((m: BlackjackMove) => m.card?.face === 4 && m.card.suite === 'CLUBS')
              .length,
          ).toBe(1);
          expect(
            fourCards.filter((m: BlackjackMove) => m.card?.face === 4 && m.card.suite === 'SPADES')
              .length,
          ).toBe(1);

          const fiveCards = cardsDealt.filter((m: BlackjackMove) => m.player === seats[4]);
          expect(fiveCards.length).toBe(2);
          expect(
            fiveCards.filter((m: BlackjackMove) => m.card?.face === 5 && m.card.suite === 'CLUBS')
              .length,
          ).toBe(1);
          expect(
            fiveCards.filter((m: BlackjackMove) => m.card?.face === 5 && m.card.suite === 'SPADES')
              .length,
          ).toBe(1);

          const sixCards = cardsDealt.filter((m: BlackjackMove) => m.player === seats[5]);
          expect(sixCards.length).toBe(2);
          expect(
            sixCards.filter((m: BlackjackMove) => m.card?.face === 6 && m.card.suite === 'CLUBS')
              .length,
          ).toBe(1);
          expect(
            sixCards.filter((m: BlackjackMove) => m.card?.face === 6 && m.card.suite === 'SPADES')
              .length,
          ).toBe(1);

          const sevenCards = cardsDealt.filter((m: BlackjackMove) => m.player === seats[6]);
          expect(sevenCards.length).toBe(2);
          expect(
            sevenCards.filter((m: BlackjackMove) => m.card?.face === 7 && m.card.suite === 'CLUBS')
              .length,
          ).toBe(1);
          expect(
            sevenCards.filter((m: BlackjackMove) => m.card?.face === 7 && m.card.suite === 'SPADES')
              .length,
          ).toBe(1);

          const eightCards = cardsDealt.filter((m: BlackjackMove) => m.player === seats[7]);
          expect(eightCards.length).toBe(2);
          expect(
            eightCards.filter((m: BlackjackMove) => m.card?.face === 8 && m.card.suite === 'CLUBS')
              .length,
          ).toBe(1);
          expect(
            eightCards.filter((m: BlackjackMove) => m.card?.face === 8 && m.card.suite === 'SPADES')
              .length,
          ).toBe(1);
        });
      });
    });
  });
  describe('_leave', () => {
    const seats: Array<SeatNumber> = [0, 1, 2, 3, 4, 5, 6, 7];
    const players: Array<Player> = [
      createPlayerForTesting(),
      createPlayerForTesting(),
      createPlayerForTesting(),
      createPlayerForTesting(),
      createPlayerForTesting(),
      createPlayerForTesting(),
      createPlayerForTesting(),
      createPlayerForTesting(),
    ];
    it('should throw an error if the player is not in the game', () => {
      expect(() => game.leave(players[0])).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
      game.join(players[0]);
      expect(() => game.leave(players[1])).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
    });
    describe('when the player is in the game', () => {
      describe('if the game is in progress', () => {
        it('should leave the player but leave the state unchanged if more than one player is still in the hand', () => {
          game.join(players[0]);
          game.join(players[1]);
          game.join(players[2]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);

          expect(game.state.status).toBe('IN_PROGRESS');
          game.leave(players[0]);

          expect(game.state.status).toBe('IN_PROGRESS');
          expect(game.state.occupiedSeats[0]).toBeUndefined();
        });
      });
      it('should not update the state if the game is already over', () => {
        game.join(players[0]);
        game.join(players[1]);
        game.join(players[2]);

        game.startGame(players[0]);
        game.startGame(players[1]);
        game.startGame(players[2]);

        expect(game.state.status).toBe('IN_PROGRESS');
        game.leave(players[0]);
        game.leave(players[1]);
        game.leave(players[2]);

        expect(game.state.status).toBe('OVER');
      });
      it('should change the status if a player leaves while the game is WAITING_TO_START', () => {
        game.join(players[0]);
        game.join(players[1]);
        game.join(players[2]);
        game.join(players[3]);
        game.join(players[4]);
        game.join(players[5]);
        game.join(players[6]);
        game.join(players[7]);

        expect(game.state.status).toBe('WAITING_TO_START');

        game.leave(players[3]);

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');
      });
      it('should not change the status of the game if the game is WAITING_FOR_PLAYERS', () => {
        game.join(players[0]);
        game.join(players[1]);

        game.startGame(players[0]);

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.leave(players[1]);
        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');
      });
      it('should remove both a player and their ready status from any position', () => {
        game.join(players[0]);
        game.join(players[1]);
        game.join(players[2]);
        game.join(players[3]);
        game.join(players[4]);
        game.join(players[5]);
        game.join(players[6]);
        game.join(players[7]);

        game.startGame(players[0]);
        expect(game.state.occupiedSeats[0]).toBe(players[0].id);
        expect(game.state.readyPlayers[0]).toBe(true);
        game.leave(players[0]);
        expect(game.state.occupiedSeats[0]).toBeUndefined();
        expect(game.state.readyPlayers[0]).toBeUndefined();

        game.startGame(players[1]);
        expect(game.state.occupiedSeats[1]).toBe(players[1].id);
        expect(game.state.readyPlayers[1]).toBe(true);
        game.leave(players[1]);
        expect(game.state.occupiedSeats[1]).toBeUndefined();
        expect(game.state.readyPlayers[1]).toBeUndefined();

        game.startGame(players[2]);
        expect(game.state.occupiedSeats[2]).toBe(players[2].id);
        expect(game.state.readyPlayers[2]).toBe(true);
        game.leave(players[2]);
        expect(game.state.occupiedSeats[2]).toBeUndefined();
        expect(game.state.readyPlayers[2]).toBeUndefined();

        game.startGame(players[3]);
        expect(game.state.occupiedSeats[3]).toBe(players[3].id);
        expect(game.state.readyPlayers[3]).toBe(true);
        game.leave(players[3]);
        expect(game.state.occupiedSeats[3]).toBeUndefined();
        expect(game.state.readyPlayers[3]).toBeUndefined();

        game.startGame(players[4]);
        expect(game.state.occupiedSeats[4]).toBe(players[4].id);
        expect(game.state.readyPlayers[4]).toBe(true);
        game.leave(players[4]);
        expect(game.state.occupiedSeats[4]).toBeUndefined();
        expect(game.state.readyPlayers[4]).toBeUndefined();

        game.startGame(players[5]);
        expect(game.state.occupiedSeats[5]).toBe(players[5].id);
        expect(game.state.readyPlayers[5]).toBe(true);
        game.leave(players[5]);
        expect(game.state.occupiedSeats[5]).toBeUndefined();
        expect(game.state.readyPlayers[5]).toBeUndefined();

        game.startGame(players[6]);
        expect(game.state.occupiedSeats[6]).toBe(players[6].id);
        expect(game.state.readyPlayers[6]).toBe(true);
        game.leave(players[6]);
        expect(game.state.occupiedSeats[6]).toBeUndefined();
        expect(game.state.readyPlayers[6]).toBeUndefined();

        game.join(players[0]);
        game.startGame(players[7]);
        expect(game.state.occupiedSeats[7]).toBe(players[7].id);
        expect(game.state.readyPlayers[7]).toBe(true);
        game.leave(players[7]);
        expect(game.state.occupiedSeats[7]).toBeUndefined();
        expect(game.state.readyPlayers[7]).toBeUndefined();
      });
    });
  });
  describe('applyMove', () => {
    const seats: Array<SeatNumber> = [0, 1, 2, 3, 4, 5, 6, 7];
    const players: Array<Player> = [
      createPlayerForTesting(),
      createPlayerForTesting(),
      createPlayerForTesting(),
      createPlayerForTesting(),
      createPlayerForTesting(),
      createPlayerForTesting(),
      createPlayerForTesting(),
      createPlayerForTesting(),
    ];
    beforeEach(() => {
      game.join(players[0]);
      game.join(players[1]);
    });
    it('should throw an error if the game is not in progress', () => {
      expect(() =>
        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'HIT' },
        }),
      ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
    });
    it('should throw an error if the player is not in the game', () => {
      game.startGame(players[0]);
      game.startGame(players[1]);

      expect(() =>
        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'HIT' },
        }),
      ).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
    });
    it('should throw an error if it is not the players turn', () => {
      game.join(players[2]);

      game.startGame(players[0]);
      game.startGame(players[1]);
      game.startGame(players[2]);

      expect(() =>
        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'HIT' },
        }),
      ).toThrowError(MOVE_NOT_YOUR_TURN_MESSAGE);
    });
    it('should throw an error if a player attempts to double when they dont have the funds', () => {
      game.join(players[2]);

      game.startGame(players[0]);
      game.startGame(players[1]);
      game.startGame(players[2]);
      game.state.playerBalances[0] = 1;
      expect(() =>
        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'DOUBLE' },
        }),
      ).toThrowError('Not enough money to double down');
    });
    it('should end game and deduct money if dealer wins', () => {
      game.join(players[2]);
      game.join(players[3]);
      game.join(players[4]);
      game.join(players[5]);
      game.join(players[6]);
      game.join(players[7]);

      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      deck.addNextDraw({ face: 10, suite: 'SPADES' });
      deck.addNextDraw({ face: 8, suite: 'CLUBS' });
      deck.addNextDraw({ face: 8, suite: 'SPADES' });
      deck.addNextDraw({ face: 7, suite: 'CLUBS' });
      deck.addNextDraw({ face: 7, suite: 'SPADES' });
      deck.addNextDraw({ face: 6, suite: 'CLUBS' });
      deck.addNextDraw({ face: 6, suite: 'SPADES' });
      deck.addNextDraw({ face: 5, suite: 'CLUBS' });
      deck.addNextDraw({ face: 5, suite: 'SPADES' });
      deck.addNextDraw({ face: 4, suite: 'CLUBS' });
      deck.addNextDraw({ face: 4, suite: 'SPADES' });
      deck.addNextDraw({ face: 3, suite: 'CLUBS' });
      deck.addNextDraw({ face: 3, suite: 'SPADES' });
      deck.addNextDraw({ face: 2, suite: 'CLUBS' });
      deck.addNextDraw({ face: 2, suite: 'SPADES' });
      deck.addNextDraw({ face: 1, suite: 'CLUBS' });
      deck.addNextDraw({ face: 1, suite: 'SPADES' });
      expect(game.state.playerBalances[0]).toBe(1000);
      game.startGame(players[0]);
      game.startGame(players[1]);
      game.startGame(players[2]);
      game.startGame(players[3]);
      game.startGame(players[4]);
      game.startGame(players[5]);
      game.startGame(players[6]);
      game.startGame(players[7]);
      const dealerCardsBefore = game.state.dealerMoves;
      expect(dealerCardsBefore.length).toBe(1);
      for (let i = 0; i < 8; i++) {
        game.applyMove({
          gameID: game.id,
          playerID: players[i].id,
          move: { moveType: 'STAND' },
        });
      }
      const dealerCards = game.state.dealerMoves;
      expect(game.state.status).toBe('OVER');
      expect(dealerCards.length).toBe(2);
      expect(game.state.playerBalances[0]).toBe(1000 - 100);
      expect(game.state.playerBalances[1]).toBe(1000 - 100);
      const game2 = new BlackjackGame(new TestDeck(), game);
      game2.join(players[0]);
      game2.join(players[1]);
      expect(game2.state.playerBalances[0]).toBe(900);
      expect(game2.state.playerBalances[1]).toBe(900);
    });
    it('should end game and add money if player wins', () => {
      deck.addNextDraw({ face: 9, suite: 'HEARTS' });
      deck.addNextDraw({ face: 9, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 13, suite: 'CLUBS' });
      deck.addNextDraw({ face: 13, suite: 'SPADES' });
      expect(game.state.playerBalances[0]).toBe(1000);
      game.startGame(players[0]);
      game.startGame(players[1]);
      const dealerCardsBefore = game.state.dealerMoves;
      expect(dealerCardsBefore.length).toBe(1);
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'STAND' },
      });
      expect(game.state.status).toBe('IN_PROGRESS');
      game.applyMove({
        gameID: game.id,
        playerID: players[1].id,
        move: { moveType: 'STAND' },
      });
      const dealerCards = game.state.dealerMoves;
      expect(game.state.status).toBe('OVER');
      expect(dealerCards.length).toBe(2);
      expect(game.state.playerBalances[0]).toBe(1000 + 100);
      expect(game.state.playerBalances[1]).toBe(1000 + 100);
      const game2 = new BlackjackGame(new TestDeck(), game);
      game2.join(players[0]);
      game2.join(players[1]);
      expect(game2.state.playerBalances[0]).toBe(1100);
      expect(game2.state.playerBalances[1]).toBe(1100);
    });
    it('should end game and keep money if tie', () => {
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      deck.addNextDraw({ face: 10, suite: 'SPADES' });
      expect(game.state.playerBalances[0]).toBe(1000);
      game.startGame(players[0]);
      game.startGame(players[1]);
      const dealerCardsBefore = game.state.dealerMoves;
      expect(dealerCardsBefore.length).toBe(1);
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'STAND' },
      });
      expect(game.state.status).toBe('IN_PROGRESS');
      game.applyMove({
        gameID: game.id,
        playerID: players[1].id,
        move: { moveType: 'STAND' },
      });
      const dealerCards = game.state.dealerMoves;
      expect(game.state.status).toBe('OVER');
      expect(dealerCards.length).toBe(2);
      expect(game.state.playerBalances[0]).toBe(1000);
      expect(game.state.playerBalances[1]).toBe(1000);
      const game2 = new BlackjackGame(new TestDeck(), game);
      game2.join(players[0]);
      game2.join(players[1]);
      expect(game2.state.playerBalances[0]).toBe(1000);
      expect(game2.state.playerBalances[1]).toBe(1000);
    });
    it('should treat aces as 11', () => {
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      deck.addNextDraw({ face: 1, suite: 'SPADES' });
      expect(game.state.playerBalances[0]).toBe(1000);
      game.startGame(players[0]);
      game.startGame(players[1]);
      const dealerCardsBefore = game.state.dealerMoves;
      expect(dealerCardsBefore.length).toBe(1);
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'STAND' },
      });
      expect(game.state.status).toBe('IN_PROGRESS');
      game.applyMove({
        gameID: game.id,
        playerID: players[1].id,
        move: { moveType: 'STAND' },
      });
      const dealerCards = game.state.dealerMoves;
      expect(game.state.status).toBe('OVER');
      expect(dealerCards.length).toBe(2);
      expect(game.state.playerBalances[0]).toBe(1100);
      expect(game.state.playerBalances[1]).toBe(1000);
      const game2 = new BlackjackGame(new TestDeck(), game);
      game2.join(players[0]);
      game2.join(players[1]);
      expect(game2.state.playerBalances[0]).toBe(1100);
      expect(game2.state.playerBalances[1]).toBe(1000);
    });
    it('should treat aces as 1 if bust', () => {
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 1, suite: 'SPADES' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      expect(game.state.playerBalances[0]).toBe(1000);
      game.startGame(players[0]);
      game.startGame(players[1]);
      const dealerCardsBefore = game.state.dealerMoves;
      expect(dealerCardsBefore.length).toBe(1);
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'HIT' },
      });
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'STAND' },
      });
      expect(game.state.status).toBe('IN_PROGRESS');
      game.applyMove({
        gameID: game.id,
        playerID: players[1].id,
        move: { moveType: 'STAND' },
      });
      const dealerCards = game.state.dealerMoves;
      expect(game.state.status).toBe('OVER');
      expect(dealerCards.length).toBe(2);
      expect(game.state.playerBalances[0]).toBe(1100);
      expect(game.state.playerBalances[1]).toBe(1000);
      const game2 = new BlackjackGame(new TestDeck(), game);
      game2.join(players[0]);
      game2.join(players[1]);
      expect(game2.state.playerBalances[0]).toBe(1100);
      expect(game2.state.playerBalances[1]).toBe(1000);
    });
    it('should double wins with double', () => {
      deck.addNextDraw({ face: 8, suite: 'HEARTS' });
      deck.addNextDraw({ face: 1, suite: 'SPADES' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 8, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      expect(game.state.playerBalances[0]).toBe(1000);
      game.startGame(players[0]);
      game.startGame(players[1]);
      const dealerCardsBefore = game.state.dealerMoves;
      expect(dealerCardsBefore.length).toBe(1);
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'DOUBLE' },
      });
      expect(game.state.status).toBe('IN_PROGRESS');
      game.applyMove({
        gameID: game.id,
        playerID: players[1].id,
        move: { moveType: 'STAND' },
      });
      const dealerCards = game.state.dealerMoves;
      expect(game.state.status).toBe('OVER');
      expect(dealerCards.length).toBe(2);
      expect(game.state.playerBalances[0]).toBe(1200);
      expect(game.state.playerBalances[1]).toBe(1000);
      const game2 = new BlackjackGame(new TestDeck(), game);
      game2.join(players[0]);
      game2.join(players[1]);
      expect(game2.state.playerBalances[0]).toBe(1200);
      expect(game2.state.playerBalances[1]).toBe(1000);
    });
    it('should double losses with double', () => {
      deck.addNextDraw({ face: 8, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'SPADES' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 8, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      deck.addNextDraw({ face: 2, suite: 'CLUBS' });
      expect(game.state.playerBalances[0]).toBe(1000);
      game.startGame(players[0]);
      game.startGame(players[1]);
      const dealerCardsBefore = game.state.dealerMoves;
      expect(dealerCardsBefore.length).toBe(1);
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'DOUBLE' },
      });
      expect(game.state.status).toBe('IN_PROGRESS');
      game.applyMove({
        gameID: game.id,
        playerID: players[1].id,
        move: { moveType: 'STAND' },
      });
      const dealerCards = game.state.dealerMoves;
      expect(game.state.status).toBe('OVER');
      expect(dealerCards.length).toBe(2);
      expect(game.state.playerBalances[0]).toBe(800);
      expect(game.state.playerBalances[1]).toBe(1000);
      const game2 = new BlackjackGame(new TestDeck(), game);
      game2.join(players[0]);
      game2.join(players[1]);
      expect(game2.state.playerBalances[0]).toBe(800);
      expect(game2.state.playerBalances[1]).toBe(1000);
    });
    it('should be able to hit many times', () => {
      deck.addNextDraw({ face: 8, suite: 'HEARTS' });
      deck.addNextDraw({ face: 2, suite: 'CLUBS' });
      deck.addNextDraw({ face: 2, suite: 'CLUBS' });
      deck.addNextDraw({ face: 2, suite: 'CLUBS' });
      deck.addNextDraw({ face: 2, suite: 'CLUBS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 8, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      deck.addNextDraw({ face: 2, suite: 'CLUBS' });
      expect(game.state.playerBalances[0]).toBe(1000);
      game.startGame(players[0]);
      game.startGame(players[1]);
      const dealerCardsBefore = game.state.dealerMoves;
      expect(dealerCardsBefore.length).toBe(1);
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'HIT' },
      });
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'HIT' },
      });
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'HIT' },
      });
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'HIT' },
      });
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'STAND' },
      });
      expect(game.state.status).toBe('IN_PROGRESS');
      game.applyMove({
        gameID: game.id,
        playerID: players[1].id,
        move: { moveType: 'STAND' },
      });
      const dealerCards = game.state.dealerMoves;
      expect(game.state.status).toBe('OVER');
      expect(dealerCards.length).toBe(2);
      expect(game.state.playerBalances[0]).toBe(1100);
      expect(game.state.playerBalances[1]).toBe(1000);
      const game2 = new BlackjackGame(new TestDeck(), game);
      game2.join(players[0]);
      game2.join(players[1]);
      expect(game2.state.playerBalances[0]).toBe(1100);
      expect(game2.state.playerBalances[1]).toBe(1000);
    });
    it('should stop busted players', () => {
      deck.addNextDraw({ face: 8, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 8, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      deck.addNextDraw({ face: 2, suite: 'CLUBS' });
      expect(game.state.playerBalances[0]).toBe(1000);
      game.startGame(players[0]);
      game.startGame(players[1]);
      const dealerCardsBefore = game.state.dealerMoves;
      expect(dealerCardsBefore.length).toBe(1);
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'HIT' },
      });
      expect(game.state.status).toBe('IN_PROGRESS');
      game.applyMove({
        gameID: game.id,
        playerID: players[1].id,
        move: { moveType: 'STAND' },
      });
      const dealerCards = game.state.dealerMoves;
      expect(game.state.status).toBe('OVER');
      expect(dealerCards.length).toBe(2);
      expect(game.state.playerBalances[0]).toBe(900);
      expect(game.state.playerBalances[1]).toBe(1000);
      const game2 = new BlackjackGame(new TestDeck(), game);
      game2.join(players[0]);
      game2.join(players[1]);
      expect(game2.state.playerBalances[0]).toBe(900);
      expect(game2.state.playerBalances[1]).toBe(1000);
    });
    it('should stop Dealer if bust', () => {
      deck.addNextDraw({ face: 6, suite: 'HEARTS' });
      deck.addNextDraw({ face: 6, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 8, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'HEARTS' });
      deck.addNextDraw({ face: 10, suite: 'CLUBS' });
      deck.addNextDraw({ face: 2, suite: 'CLUBS' });
      expect(game.state.playerBalances[0]).toBe(1000);
      game.startGame(players[0]);
      game.startGame(players[1]);
      const dealerCardsBefore = game.state.dealerMoves;
      expect(dealerCardsBefore.length).toBe(1);
      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'HIT' },
      });
      expect(game.state.status).toBe('IN_PROGRESS');
      game.applyMove({
        gameID: game.id,
        playerID: players[1].id,
        move: { moveType: 'STAND' },
      });
      const dealerCards = game.state.dealerMoves;
      expect(game.state.status).toBe('OVER');
      expect(dealerCards.length).toBe(3);
      expect(game.state.playerBalances[0]).toBe(900);
      expect(game.state.playerBalances[1]).toBe(1100);
      const game2 = new BlackjackGame(new TestDeck(), game);
      game2.join(players[0]);
      game2.join(players[1]);
      expect(game2.state.playerBalances[0]).toBe(900);
      expect(game2.state.playerBalances[1]).toBe(1100);
    });
  });
});
