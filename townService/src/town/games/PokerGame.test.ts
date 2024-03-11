import { createPlayerForTesting } from '../../TestUtils';
import {
  GAME_FULL_MESSAGE,
  GAME_NOT_STARTABLE_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import { Card, DEFAULT_BUY_IN, SeatNumber } from '../../types/CoveyTownSocket';
import BasicDeck from './BasicDeck';
import PokerGame from './PokerGame';

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
  protected addNextDraw(card: Card): void {
    this._nextCardQueue.push(card);
  }

  drawCard(): Card {
    const cardToReturn: Card | undefined = this._nextCardQueue.pop();
    if (cardToReturn) {
      this._cardsDrawn.push(cardToReturn);
      return cardToReturn;
    }
    return super.drawCard();
  }
}

describe('PokerGame', () => {
  let game: PokerGame;
  let deck: TestDeck;
  beforeEach(() => {
    deck = new TestDeck();
    game = new PokerGame(deck);
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
      expect(() => game.join(player3)).toThrowError();
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
          expect(game.state.occupiedSeats.get(seats[i])).toBe(players[i].id);
          expect(game.state.readyPlayers.get(seats[i])).toBe(false);
          expect(game.state.playerBalances.get(seats[i])).toBe(DEFAULT_BUY_IN);
        }
        for (let i = 1; i < 8; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBeUndefined();
          expect(game.state.readyPlayers.get(seats[i])).toBeUndefined();
          expect(game.state.playerBalances.get(seats[i])).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[1]);
        for (let i = 0; i < 2; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBe(players[i].id);
          expect(game.state.readyPlayers.get(seats[i])).toBe(false);
          expect(game.state.playerBalances.get(seats[i])).toBe(DEFAULT_BUY_IN);
        }
        for (let i = 2; i < 8; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBeUndefined();
          expect(game.state.readyPlayers.get(seats[i])).toBeUndefined();
          expect(game.state.playerBalances.get(seats[i])).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[2]);
        for (let i = 0; i < 3; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBe(players[i].id);
          expect(game.state.readyPlayers.get(seats[i])).toBe(false);
          expect(game.state.playerBalances.get(seats[i])).toBe(DEFAULT_BUY_IN);
        }
        for (let i = 3; i < 8; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBeUndefined();
          expect(game.state.readyPlayers.get(seats[i])).toBeUndefined();
          expect(game.state.playerBalances.get(seats[i])).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[3]);
        for (let i = 0; i < 4; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBe(players[i].id);
          expect(game.state.readyPlayers.get(seats[i])).toBe(false);
          expect(game.state.playerBalances.get(seats[i])).toBe(DEFAULT_BUY_IN);
        }
        for (let i = 4; i < 8; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBeUndefined();
          expect(game.state.readyPlayers.get(seats[i])).toBeUndefined();
          expect(game.state.playerBalances.get(seats[i])).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[4]);
        for (let i = 0; i < 5; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBe(players[i].id);
          expect(game.state.readyPlayers.get(seats[i])).toBe(false);
          expect(game.state.playerBalances.get(seats[i])).toBe(DEFAULT_BUY_IN);
        }
        for (let i = 5; i < 8; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBeUndefined();
          expect(game.state.readyPlayers.get(seats[i])).toBeUndefined();
          expect(game.state.playerBalances.get(seats[i])).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[5]);
        for (let i = 0; i < 6; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBe(players[i].id);
          expect(game.state.readyPlayers.get(seats[i])).toBe(false);
          expect(game.state.playerBalances.get(seats[i])).toBe(DEFAULT_BUY_IN);
        }
        for (let i = 6; i < 8; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBeUndefined();
          expect(game.state.readyPlayers.get(seats[i])).toBeUndefined();
          expect(game.state.playerBalances.get(seats[i])).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[6]);
        for (let i = 0; i < 7; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBe(players[i].id);
          expect(game.state.readyPlayers.get(seats[i])).toBe(false);
          expect(game.state.playerBalances.get(seats[i])).toBe(DEFAULT_BUY_IN);
        }
        for (let i = 7; i < 8; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBeUndefined();
          expect(game.state.readyPlayers.get(seats[i])).toBeUndefined();
          expect(game.state.playerBalances.get(seats[i])).toBeUndefined();
        }

        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');

        game.join(players[7]);
        for (let i = 0; i < 8; i++) {
          expect(game.state.occupiedSeats.get(seats[i])).toBe(players[i].id);
          expect(game.state.readyPlayers.get(seats[i])).toBe(false);
          expect(game.state.playerBalances.get(seats[i])).toBe(DEFAULT_BUY_IN);
        }
        expect(game.state.status).toBe('WAITING_TO_START');
      });
      it('if possible, should add players to the seat they were in the previous game', () => {
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
        game.join(players[2]);
        game.join(players[3]);
        game.join(players[4]);
        game.join(players[5]);
        game.join(players[6]);
        game.join(players[7]);

        const secondGame = new PokerGame(new TestDeck(), game);
        expect(secondGame.state.occupiedSeats.get(seats[0])).toBeUndefined();
        expect(secondGame.state.occupiedSeats.get(seats[1])).toBeUndefined();
        expect(secondGame.state.occupiedSeats.get(seats[2])).toBeUndefined();
        expect(secondGame.state.occupiedSeats.get(seats[3])).toBeUndefined();
        expect(secondGame.state.occupiedSeats.get(seats[4])).toBeUndefined();
        expect(secondGame.state.occupiedSeats.get(seats[5])).toBeUndefined();
        expect(secondGame.state.occupiedSeats.get(seats[6])).toBeUndefined();
        expect(secondGame.state.occupiedSeats.get(seats[7])).toBeUndefined();

        game.join(players[1]);
        expect(secondGame.state.occupiedSeats.get(seats[1])).toBe(players[1]);

        game.join(players[2]);
        expect(secondGame.state.occupiedSeats.get(seats[2])).toBe(players[2]);

        game.join(players[3]);
        expect(secondGame.state.occupiedSeats.get(seats[3])).toBe(players[3]);

        game.join(players[4]);
        expect(secondGame.state.occupiedSeats.get(seats[4])).toBe(players[4]);

        game.join(players[5]);
        expect(secondGame.state.occupiedSeats.get(seats[5])).toBe(players[5]);

        game.join(players[6]);
        expect(secondGame.state.occupiedSeats.get(seats[6])).toBe(players[6]);

        game.join(players[7]);
        expect(secondGame.state.occupiedSeats.get(seats[7])).toBe(players[7]);

        game.join(players[0]);
        expect(secondGame.state.occupiedSeats.get(seats[0])).toBe(players[0]);
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
    it('should throw an error if the status is WAITING_FOR_PLAYERS but only one player is in the game', () => {
      const player1 = createPlayerForTesting();
      game.join(player1);
      expect(() => game.startGame(player1)).toThrowError(GAME_NOT_STARTABLE_MESSAGE);
    });
    it('should throw an error if the player is not in the game', () => {
      const player1 = createPlayerForTesting();
      expect(() => game.startGame(player1)).toThrowError(GAME_NOT_STARTABLE_MESSAGE);
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

        expect(game.state.readyPlayers.get(seats[0])).toBe(true);
        expect(game.state.readyPlayers.get(seats[1])).toBe(false);
        expect(game.state.readyPlayers.get(seats[2])).toBe(false);
        expect(game.state.readyPlayers.get(seats[3])).toBe(false);
        expect(game.state.readyPlayers.get(seats[4])).toBe(false);
        expect(game.state.readyPlayers.get(seats[5])).toBe(false);
        expect(game.state.readyPlayers.get(seats[6])).toBe(false);
        expect(game.state.readyPlayers.get(seats[7])).toBe(false);

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

        expect(game.state.readyPlayers.get(seats[0])).toBe(false);
        expect(game.state.readyPlayers.get(seats[1])).toBe(true);
        expect(game.state.readyPlayers.get(seats[2])).toBe(false);
        expect(game.state.readyPlayers.get(seats[3])).toBe(false);
        expect(game.state.readyPlayers.get(seats[4])).toBe(false);
        expect(game.state.readyPlayers.get(seats[5])).toBe(false);
        expect(game.state.readyPlayers.get(seats[6])).toBe(false);
        expect(game.state.readyPlayers.get(seats[7])).toBe(false);

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

        expect(game.state.readyPlayers.get(seats[0])).toBe(false);
        expect(game.state.readyPlayers.get(seats[1])).toBe(false);
        expect(game.state.readyPlayers.get(seats[2])).toBe(true);
        expect(game.state.readyPlayers.get(seats[3])).toBe(false);
        expect(game.state.readyPlayers.get(seats[4])).toBe(false);
        expect(game.state.readyPlayers.get(seats[5])).toBe(false);
        expect(game.state.readyPlayers.get(seats[6])).toBe(false);
        expect(game.state.readyPlayers.get(seats[7])).toBe(false);

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

        expect(game.state.readyPlayers.get(seats[0])).toBe(false);
        expect(game.state.readyPlayers.get(seats[1])).toBe(false);
        expect(game.state.readyPlayers.get(seats[2])).toBe(false);
        expect(game.state.readyPlayers.get(seats[3])).toBe(true);
        expect(game.state.readyPlayers.get(seats[4])).toBe(false);
        expect(game.state.readyPlayers.get(seats[5])).toBe(false);
        expect(game.state.readyPlayers.get(seats[6])).toBe(false);
        expect(game.state.readyPlayers.get(seats[7])).toBe(false);

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

        expect(game.state.readyPlayers.get(seats[0])).toBe(false);
        expect(game.state.readyPlayers.get(seats[1])).toBe(false);
        expect(game.state.readyPlayers.get(seats[2])).toBe(false);
        expect(game.state.readyPlayers.get(seats[3])).toBe(false);
        expect(game.state.readyPlayers.get(seats[4])).toBe(true);
        expect(game.state.readyPlayers.get(seats[5])).toBe(false);
        expect(game.state.readyPlayers.get(seats[6])).toBe(false);
        expect(game.state.readyPlayers.get(seats[7])).toBe(false);

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

        expect(game.state.readyPlayers.get(seats[0])).toBe(false);
        expect(game.state.readyPlayers.get(seats[1])).toBe(false);
        expect(game.state.readyPlayers.get(seats[2])).toBe(false);
        expect(game.state.readyPlayers.get(seats[3])).toBe(false);
        expect(game.state.readyPlayers.get(seats[4])).toBe(false);
        expect(game.state.readyPlayers.get(seats[5])).toBe(true);
        expect(game.state.readyPlayers.get(seats[6])).toBe(false);
        expect(game.state.readyPlayers.get(seats[7])).toBe(false);

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

        expect(game.state.readyPlayers.get(seats[0])).toBe(false);
        expect(game.state.readyPlayers.get(seats[1])).toBe(false);
        expect(game.state.readyPlayers.get(seats[2])).toBe(false);
        expect(game.state.readyPlayers.get(seats[3])).toBe(false);
        expect(game.state.readyPlayers.get(seats[4])).toBe(false);
        expect(game.state.readyPlayers.get(seats[5])).toBe(false);
        expect(game.state.readyPlayers.get(seats[6])).toBe(true);
        expect(game.state.readyPlayers.get(seats[7])).toBe(false);

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

        expect(game.state.readyPlayers.get(seats[0])).toBe(false);
        expect(game.state.readyPlayers.get(seats[1])).toBe(false);
        expect(game.state.readyPlayers.get(seats[2])).toBe(false);
        expect(game.state.readyPlayers.get(seats[3])).toBe(false);
        expect(game.state.readyPlayers.get(seats[4])).toBe(false);
        expect(game.state.readyPlayers.get(seats[5])).toBe(false);
        expect(game.state.readyPlayers.get(seats[6])).toBe(false);
        expect(game.state.readyPlayers.get(seats[7])).toBe(true);

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

        expect(game.state.readyPlayers.get(seats[0])).toBe(true);
        expect(game.state.status).toBe('WAITING_FOR_PLAYERS');
      });
      describe('should properly assign the blind based on players in the game', () => {
        it('should assign the first seat to be the blind if there was no previous game', () => {
          game.startGame(players[0]);
          game.startGame(players[1]);

          expect(game.state.smallBlind).toBe(seats[0]);
        });
        it('should assign the first seat to be the blind with more than 2 players', () => {
          game.join(players[2]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);

          expect(game.state.smallBlind).toBe(seats[0]);
        });
        it('should assign the blind to the next occupied seat with respect the previous games blind', () => {
          game.startGame(players[0]);
          game.startGame(players[1]);

          const game2 = new PokerGame(new TestDeck(), game);
          game2.join(players[0]);
          game2.join(players[1]);
          game2.startGame(players[0]);
          game2.startGame(players[1]);

          expect(game2.state.smallBlind).toBe(seats[1]);

          const game3 = new PokerGame(new TestDeck(), game2);
          game3.join(players[0]);
          game3.join(players[1]);
          game3.join(players[2]);

          game3.startGame(players[0]);
          game3.startGame(players[1]);
          game3.startGame(players[2]);

          expect(game3.state.smallBlind).toBe(seats[2]);

          const game4 = new PokerGame(new TestDeck(), game3);
          game4.join(players[0]);
          game4.join(players[1]);
          game4.join(players[2]);
          game4.join(players[3]);

          game4.startGame(players[0]);
          game4.startGame(players[1]);
          game4.startGame(players[2]);
          game4.startGame(players[3]);

          expect(game4.state.smallBlind).toBe(seats[3]);

          const game5 = new PokerGame(new TestDeck(), game4);
          game5.join(players[0]);
          game5.join(players[1]);
          game5.join(players[2]);
          game5.join(players[3]);
          game5.join(players[4]);

          game5.startGame(players[0]);
          game5.startGame(players[1]);
          game5.startGame(players[2]);
          game5.startGame(players[3]);
          game5.startGame(players[4]);

          expect(game5.state.smallBlind).toBe(seats[4]);

          const game6 = new PokerGame(new TestDeck(), game5);
          game6.join(players[0]);
          game6.join(players[1]);
          game6.join(players[2]);
          game6.join(players[3]);
          game6.join(players[4]);
          game6.join(players[5]);

          game6.startGame(players[0]);
          game6.startGame(players[1]);
          game6.startGame(players[2]);
          game6.startGame(players[3]);
          game6.startGame(players[4]);
          game6.startGame(players[5]);

          expect(game6.state.smallBlind).toBe(seats[5]);

          const game7 = new PokerGame(new TestDeck(), game6);
          game7.join(players[0]);
          game7.join(players[1]);
          game7.join(players[2]);
          game7.join(players[3]);
          game7.join(players[4]);
          game7.join(players[5]);
          game7.join(players[6]);

          game7.startGame(players[0]);
          game7.startGame(players[1]);
          game7.startGame(players[2]);
          game7.startGame(players[3]);
          game7.startGame(players[4]);
          game7.startGame(players[5]);
          game7.startGame(players[6]);

          expect(game7.state.smallBlind).toBe(seats[6]);

          const game8 = new PokerGame(new TestDeck(), game7);
          game8.join(players[0]);
          game8.join(players[1]);
          game8.join(players[2]);
          game8.join(players[3]);
          game8.join(players[4]);
          game8.join(players[5]);
          game8.join(players[6]);
          game8.join(players[7]);

          game8.startGame(players[0]);
          game8.startGame(players[1]);
          game8.startGame(players[2]);
          game8.startGame(players[3]);
          game8.startGame(players[4]);
          game8.startGame(players[5]);
          game8.startGame(players[6]);
          game8.startGame(players[7]);

          expect(game8.state.smallBlind).toBe(seats[7]);

          const game9 = new PokerGame(new TestDeck(), game7);
          game9.join(players[0]);
          game9.join(players[1]);
          game9.join(players[2]);
          game9.join(players[3]);
          game9.join(players[4]);
          game9.join(players[5]);
          game9.join(players[6]);
          game9.join(players[7]);

          game9.startGame(players[0]);
          game9.startGame(players[1]);
          game9.startGame(players[2]);
          game9.startGame(players[3]);
          game9.startGame(players[4]);
          game9.startGame(players[5]);
          game9.startGame(players[6]);
          game9.startGame(players[7]);

          expect(game9.state.smallBlind).toBe(seats[0]);
        });
        it('should be able to skip an empty seat in assigning the next blind', () => {
          game.join(players[2]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);

          expect(game.state.smallBlind).toBe(seats[0]);

          const game2 = new PokerGame(new TestDeck(), game);
          game2.join(players[0]);
          game2.join(players[2]);

          game.startGame(players[0]);
          game.startGame(players[2]);

          expect(game.state.smallBlind).toBe(seats[2]);
        });
        it('should be able to loop back to the first seat in games with less than 8 players', () => {
          game.startGame(players[0]);
          game.startGame(players[1]);

          expect(game.state.smallBlind).toBe(seats[0]);

          const game2 = new PokerGame(new TestDeck(), game);
          game2.join(players[0]);
          game2.join(players[1]);

          game2.startGame(players[0]);
          game2.startGame(players[1]);

          expect(game2.state.smallBlind).toBe(seats[1]);

          const game3 = new PokerGame(new TestDeck(), game2);
          game3.join(players[0]);
          game3.join(players[1]);

          game3.startGame(players[0]);
          game3.startGame(players[1]);

          expect(game3.state.smallBlind).toBe(seats[0]);
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
          expect(game.state.occupiedSeats.get(seats[0])).toBeUndefined();
        });
        it('should concede the game to the last player still in the hand, if only one player is left in the hand', () => {
          game.join(players[0]);
          game.join(players[1]);
          game.join(players[2]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);

          expect(game.state.status).toBe('IN_PROGRESS');
          game.leave(players[0]);

          expect(game.state.status).toBe('IN_PROGRESS');
          expect(game.state.occupiedSeats.get(seats[0])).toBeUndefined();

          game.leave(players[1]);
          expect(game.state.status).toBe('OVER');
          expect(game.state.occupiedSeats.get(seats[1])).toBeUndefined();
          expect(game.state.winner).toBe(players[2].id);
        });
        it('should concede to multiple different positions, if they are the last player still in the hand', () => {
          game.join(players[0]);
          game.join(players[1]);
          game.join(players[2]);
          game.join(players[4]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);

          expect(game.state.status).toBe('IN_PROGRESS');
          game.leave(players[0]);

          expect(game.state.status).toBe('IN_PROGRESS');
          expect(game.state.occupiedSeats.get(seats[0])).toBeUndefined();

          game.leave(players[2]);
          expect(game.state.status).toBe('IN_PROGRESS');
          expect(game.state.occupiedSeats.get(seats[2])).toBeUndefined();

          game.leave(players[4]);
          expect(game.state.status).toBe('OVER');
          expect(game.state.winner).toBe(players[1].id);
        });
      });
      it('should not update the state if the game is already over', () => {
        game.join(players[0]);
        game.join(players[1]);
        game.join(players[3]);

        game.startGame(players[0]);
        game.startGame(players[1]);
        game.startGame(players[2]);

        expect(game.state.status).toBe('IN_PROGRESS');
        game.leave(players[0]);
        game.leave(players[1]);

        expect(game.state.status).toBe('OVER');
        game.leave(players[2]);
        expect(game.state.status).toBe('OVER');
        expect(game.state.occupiedSeats.get(seats[2])).toBe(players[2].id);
        expect(game.state.winner).toBe(players[2].id);
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
        expect(game.state.occupiedSeats.get(seats[0])).toBe(players[0].id);
        expect(game.state.readyPlayers.get(seats[0])).toBe(true);
        game.leave(players[0]);
        expect(game.state.occupiedSeats.get(seats[0])).toBeUndefined();
        expect(game.state.readyPlayers.get(seats[0])).toBeUndefined();

        game.startGame(players[1]);
        expect(game.state.occupiedSeats.get(seats[1])).toBe(players[1].id);
        expect(game.state.readyPlayers.get(seats[1])).toBe(true);
        game.leave(players[1]);
        expect(game.state.occupiedSeats.get(seats[1])).toBeUndefined();
        expect(game.state.readyPlayers.get(seats[1])).toBeUndefined();

        game.startGame(players[2]);
        expect(game.state.occupiedSeats.get(seats[2])).toBe(players[2].id);
        expect(game.state.readyPlayers.get(seats[2])).toBe(true);
        game.leave(players[2]);
        expect(game.state.occupiedSeats.get(seats[2])).toBeUndefined();
        expect(game.state.readyPlayers.get(seats[2])).toBeUndefined();

        game.startGame(players[3]);
        expect(game.state.occupiedSeats.get(seats[3])).toBe(players[3].id);
        expect(game.state.readyPlayers.get(seats[0])).toBe(true);
        game.leave(players[3]);
        expect(game.state.occupiedSeats.get(seats[3])).toBeUndefined();
        expect(game.state.readyPlayers.get(seats[3])).toBeUndefined();

        game.startGame(players[4]);
        expect(game.state.occupiedSeats.get(seats[4])).toBe(players[4].id);
        expect(game.state.readyPlayers.get(seats[4])).toBe(true);
        game.leave(players[4]);
        expect(game.state.occupiedSeats.get(seats[4])).toBeUndefined();
        expect(game.state.readyPlayers.get(seats[4])).toBeUndefined();

        game.startGame(players[5]);
        expect(game.state.occupiedSeats.get(seats[5])).toBe(players[5].id);
        expect(game.state.readyPlayers.get(seats[5])).toBe(true);
        game.leave(players[5]);
        expect(game.state.occupiedSeats.get(seats[5])).toBeUndefined();
        expect(game.state.readyPlayers.get(seats[5])).toBeUndefined();

        game.startGame(players[6]);
        expect(game.state.occupiedSeats.get(seats[6])).toBe(players[6].id);
        expect(game.state.readyPlayers.get(seats[6])).toBe(true);
        game.leave(players[6]);
        expect(game.state.occupiedSeats.get(seats[6])).toBeUndefined();
        expect(game.state.readyPlayers.get(seats[6])).toBeUndefined();

        game.join(players[0]);
        game.startGame(players[7]);
        expect(game.state.occupiedSeats.get(seats[7])).toBe(players[7].id);
        expect(game.state.readyPlayers.get(seats[7])).toBe(true);
        game.leave(players[7]);
        expect(game.state.occupiedSeats.get(seats[7])).toBeUndefined();
        expect(game.state.readyPlayers.get(seats[7])).toBeUndefined();
      });
      it('should make a player lose their preferred position, if it was taken by another player', () => {
        game.join(players[0]);
        game.join(players[1]);

        const game2 = new PokerGame(new TestDeck(), game);
        game2.join(players[0]);

        game2.leave(players[0]);

        game2.join(players[2]);

        game2.join(players[0]);

        expect(game.state.occupiedSeats.get(seats[0])).toBe(players[2].id);
        expect(game.state.occupiedSeats.get(seats[1])).toBe(players[0].id);
      });
    });
  });
});
