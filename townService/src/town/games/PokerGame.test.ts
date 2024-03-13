import { createPlayerForTesting } from '../../TestUtils';
import {
  BOARD_POSITION_NOT_VALID_MESSAGE,
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  GAME_NOT_STARTABLE_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import {
  Card,
  DEFAULT_BIG_BLIND,
  DEFAULT_BUY_IN,
  DEFAULT_SMALL_BLIND,
  SeatNumber,
} from '../../types/CoveyTownSocket';
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
  public addNextDraw(card: Card): void {
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
        game.startGame(players[0]);

        const game2 = new PokerGame(new TestDeck(), game);

        game2.join(players[0]);
        game2.join(players[1]);

        expect(game.state.playerBalances.get(seats[0])).toBe(DEFAULT_BUY_IN - DEFAULT_SMALL_BLIND);
        expect(game.state.playerBalances.get(seats[1])).toBe(DEFAULT_BUY_IN - DEFAULT_BIG_BLIND);
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
        it('should properly adjust the balances of the big and small blinds', () => {
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

          expect(game.state.playerBalances.get(seats[0])).toBe(
            DEFAULT_BUY_IN - DEFAULT_SMALL_BLIND,
          );
          expect(game.state.playerBalances.get(seats[1])).toBe(DEFAULT_BUY_IN - DEFAULT_BIG_BLIND);
          expect(game.state.playerBalances.get(seats[2])).toBe(DEFAULT_BUY_IN);
          expect(game.state.playerBalances.get(seats[3])).toBe(DEFAULT_BUY_IN);
          expect(game.state.playerBalances.get(seats[4])).toBe(DEFAULT_BUY_IN);
          expect(game.state.playerBalances.get(seats[5])).toBe(DEFAULT_BUY_IN);
          expect(game.state.playerBalances.get(seats[6])).toBe(DEFAULT_BUY_IN);
          expect(game.state.playerBalances.get(seats[7])).toBe(DEFAULT_BUY_IN);

          const game2 = new PokerGame(new TestDeck(), game);

          game2.join(players[0]);
          game2.join(players[1]);
          game2.join(players[2]);
          game2.join(players[3]);
          game2.join(players[4]);
          game2.join(players[5]);
          game2.join(players[6]);
          game2.join(players[7]);

          game2.startGame(players[0]);
          game2.startGame(players[1]);
          game2.startGame(players[2]);
          game2.startGame(players[3]);
          game2.startGame(players[4]);
          game2.startGame(players[5]);
          game2.startGame(players[6]);
          game2.startGame(players[7]);

          expect(game2.state.playerBalances.get(seats[0])).toBe(
            DEFAULT_BUY_IN - DEFAULT_SMALL_BLIND,
          );
          expect(game2.state.playerBalances.get(seats[1])).toBe(
            DEFAULT_BUY_IN - DEFAULT_BIG_BLIND - DEFAULT_SMALL_BLIND,
          );
          expect(game2.state.playerBalances.get(seats[2])).toBe(DEFAULT_BUY_IN - DEFAULT_BIG_BLIND);
          expect(game2.state.playerBalances.get(seats[3])).toBe(DEFAULT_BUY_IN);
          expect(game2.state.playerBalances.get(seats[4])).toBe(DEFAULT_BUY_IN);
          expect(game2.state.playerBalances.get(seats[5])).toBe(DEFAULT_BUY_IN);
          expect(game2.state.playerBalances.get(seats[6])).toBe(DEFAULT_BUY_IN);
          expect(game2.state.playerBalances.get(seats[7])).toBe(DEFAULT_BUY_IN);
        });
      });
      describe('should deal 2 cards to each player in the game at the start of the game', () => {
        it('should deal 2 cards to each player in a two-player game', () => {
          game.startGame(players[0]);
          game.startGame(players[1]);

          const cardsDealt = game.state.moves.filter(m => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(4);
          expect(cardsDealt.filter(m => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[1]).length).toBe(2);
        });
        it('should deal 2 cards to each player in a three-player game', () => {
          game.join(players[2]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);

          const cardsDealt = game.state.moves.filter(m => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(6);
          expect(cardsDealt.filter(m => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[1]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[2]).length).toBe(2);
        });
        it('should deal 2 cards to each player in a four-player game', () => {
          game.join(players[2]);
          game.join(players[3]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);
          game.startGame(players[3]);

          const cardsDealt = game.state.moves.filter(m => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(8);
          expect(cardsDealt.filter(m => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[1]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[2]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[3]).length).toBe(2);
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

          const cardsDealt = game.state.moves.filter(m => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(10);
          expect(cardsDealt.filter(m => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[1]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[2]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[3]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[4]).length).toBe(2);
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

          const cardsDealt = game.state.moves.filter(m => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(12);
          expect(cardsDealt.filter(m => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[1]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[2]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[3]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[4]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[5]).length).toBe(2);
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

          const cardsDealt = game.state.moves.filter(m => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(14);
          expect(cardsDealt.filter(m => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[1]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[2]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[3]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[4]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[5]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[6]).length).toBe(2);
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

          const cardsDealt = game.state.moves.filter(m => m.moveType === 'DEAL');

          expect(cardsDealt.length).toBe(16);
          expect(cardsDealt.filter(m => m.player === seats[0]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[1]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[2]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[3]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[4]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[5]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[6]).length).toBe(2);
          expect(cardsDealt.filter(m => m.player === seats[7]).length).toBe(2);
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

          const cardsDealt = game.state.moves.filter(m => m.moveType === 'DEAL');

          const zeroCards = cardsDealt.filter(m => m.player === seats[0]);
          expect(zeroCards.length).toBe(2);
          expect(zeroCards.filter(m => m.card?.face === 1 && m.card.suite === 'CLUBS').length).toBe(
            1,
          );
          expect(
            zeroCards.filter(m => m.card?.face === 1 && m.card.suite === 'SPADES').length,
          ).toBe(1);

          const oneCards = cardsDealt.filter(m => m.player === seats[1]);
          expect(oneCards.length).toBe(2);
          expect(oneCards.filter(m => m.card?.face === 2 && m.card.suite === 'CLUBS').length).toBe(
            1,
          );
          expect(oneCards.filter(m => m.card?.face === 2 && m.card.suite === 'SPADES').length).toBe(
            1,
          );

          const threeCards = cardsDealt.filter(m => m.player === seats[2]);
          expect(threeCards.length).toBe(2);
          expect(
            threeCards.filter(m => m.card?.face === 3 && m.card.suite === 'CLUBS').length,
          ).toBe(1);
          expect(
            threeCards.filter(m => m.card?.face === 3 && m.card.suite === 'SPADES').length,
          ).toBe(1);

          const fourCards = cardsDealt.filter(m => m.player === seats[3]);
          expect(fourCards.length).toBe(2);
          expect(fourCards.filter(m => m.card?.face === 4 && m.card.suite === 'CLUBS').length).toBe(
            1,
          );
          expect(
            fourCards.filter(m => m.card?.face === 4 && m.card.suite === 'SPADES').length,
          ).toBe(1);

          const fiveCards = cardsDealt.filter(m => m.player === seats[4]);
          expect(fiveCards.length).toBe(2);
          expect(fiveCards.filter(m => m.card?.face === 5 && m.card.suite === 'CLUBS').length).toBe(
            1,
          );
          expect(
            fiveCards.filter(m => m.card?.face === 5 && m.card.suite === 'SPADES').length,
          ).toBe(1);

          const sixCards = cardsDealt.filter(m => m.player === seats[5]);
          expect(sixCards.length).toBe(2);
          expect(sixCards.filter(m => m.card?.face === 6 && m.card.suite === 'CLUBS').length).toBe(
            1,
          );
          expect(sixCards.filter(m => m.card?.face === 6 && m.card.suite === 'SPADES').length).toBe(
            1,
          );

          const sevenCards = cardsDealt.filter(m => m.player === seats[6]);
          expect(sevenCards.length).toBe(2);
          expect(
            sevenCards.filter(m => m.card?.face === 7 && m.card.suite === 'CLUBS').length,
          ).toBe(1);
          expect(
            sevenCards.filter(m => m.card?.face === 7 && m.card.suite === 'SPADES').length,
          ).toBe(1);

          const eightCards = cardsDealt.filter(m => m.player === seats[7]);
          expect(eightCards.length).toBe(2);
          expect(
            eightCards.filter(m => m.card?.face === 8 && m.card.suite === 'CLUBS').length,
          ).toBe(1);
          expect(
            eightCards.filter(m => m.card?.face === 8 && m.card.suite === 'SPADES').length,
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
          expect(game.state.playerBalances.get(seats[2])).toBe(
            DEFAULT_BUY_IN + DEFAULT_BIG_BLIND + DEFAULT_SMALL_BLIND,
          );
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

          expect(game.state.playerBalances.get(seats[1])).toBe(
            DEFAULT_BUY_IN + DEFAULT_SMALL_BLIND,
          );
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
          move: { moveType: 'CALL', raiseAmount: undefined },
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
          move: { moveType: 'CALL', raiseAmount: undefined },
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
          move: { moveType: 'CALL', raiseAmount: undefined },
        }),
      ).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
    });
    it('should throw an error if a player attempts to check when they need to bet more', () => {
      game.join(players[2]);
      game.join(players[3]);

      game.startGame(players[0]);
      game.startGame(players[1]);
      game.startGame(players[2]);
      game.startGame(players[3]);

      expect(() =>
        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CHECK', raiseAmount: undefined },
        }),
      ).toThrowError(BOARD_POSITION_NOT_VALID_MESSAGE);

      game.applyMove({
        gameID: game.id,
        playerID: players[2].id,
        move: { moveType: 'CALL', raiseAmount: undefined },
      });

      game.applyMove({
        gameID: game.id,
        playerID: players[3].id,
        move: { moveType: 'CHECK', raiseAmount: undefined },
      });

      game.applyMove({
        gameID: game.id,
        playerID: players[0].id,
        move: { moveType: 'RAISE', raiseAmount: 100 },
      });

      expect(() =>
        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CHECK', raiseAmount: undefined },
        }),
      ).toThrowError(BOARD_POSITION_NOT_VALID_MESSAGE);
    });
    it('should throw an error if a player attempts to raise more than they have', () => {
      game.join(players[2]);

      game.startGame(players[0]);
      game.startGame(players[1]);
      game.startGame(players[2]);

      expect(() =>
        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'RAISE', raiseAmount: 2010 },
        }),
      ).toThrowError(BOARD_POSITION_NOT_VALID_MESSAGE);
    });
    describe('if a valid move is made which does not end the game', () => {
      it('should correctly adjust the players balance if a call is made', () => {
        game.join(players[2]);

        game.startGame(players[0]);
        game.startGame(players[1]);
        game.startGame(players[2]);

        expect(game.state.playerBalances.get(seats[2])).toBe(DEFAULT_BUY_IN);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CALL' },
        });

        expect(game.state.playerBalances.get(seats[2])).toBe(DEFAULT_BUY_IN - DEFAULT_BIG_BLIND);
      });
      it('should correctly adjust the players balance if a raise is made, first adding the amount to call and then raising by the desired amount', () => {
        game.join(players[2]);

        game.startGame(players[0]);
        game.startGame(players[1]);
        game.startGame(players[2]);

        expect(game.state.playerBalances.get(seats[2])).toBe(DEFAULT_BUY_IN);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'RAISE', raiseAmount: 100 },
        });

        expect(game.state.playerBalances.get(seats[2])).toBe(
          DEFAULT_BUY_IN - DEFAULT_BIG_BLIND - 100,
        );
      });
      it('should modify the balance the correct amount to call based on the current pot vs a players current stake', () => {
        game.join(players[2]);

        game.startGame(players[0]);
        game.startGame(players[1]);
        game.startGame(players[2]);

        expect(game.state.playerBalances.get(seats[2])).toBe(DEFAULT_BUY_IN);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'RAISE', raiseAmount: 100 },
        });

        expect(game.state.playerBalances.get(seats[2])).toBe(
          DEFAULT_BUY_IN - DEFAULT_BIG_BLIND - 100,
        );

        expect(game.state.playerBalances.get(seats[0])).toBe(DEFAULT_BUY_IN - DEFAULT_SMALL_BLIND);

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CALL' },
        });

        expect(game.state.playerBalances.get(seats[2])).toBe(
          DEFAULT_BUY_IN - DEFAULT_BIG_BLIND - 100,
        );
      });
      it('should allow a player to fold without modifying their balance', () => {
        game.join(players[2]);

        game.startGame(players[0]);
        game.startGame(players[1]);
        game.startGame(players[2]);

        expect(game.state.playerBalances.get(seats[2])).toBe(DEFAULT_BUY_IN);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'RAISE', raiseAmount: 100 },
        });

        expect(game.state.playerBalances.get(seats[2])).toBe(
          DEFAULT_BUY_IN - DEFAULT_BIG_BLIND - 100,
        );

        expect(game.state.playerBalances.get(seats[0])).toBe(DEFAULT_BUY_IN - DEFAULT_SMALL_BLIND);

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'FOLD' },
        });

        expect(game.state.playerBalances.get(seats[0])).toBe(DEFAULT_BUY_IN - DEFAULT_SMALL_BLIND);
      });
      it('should allow a player to check without modyfing their balance', () => {
        game.join(players[2]);

        game.startGame(players[0]);
        game.startGame(players[1]);
        game.startGame(players[2]);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CALL' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CALL' },
        });

        expect(game.state.playerBalances.get(seats[1])).toBe(DEFAULT_BUY_IN - DEFAULT_BIG_BLIND);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CHECK' },
        });

        expect(game.state.playerBalances.get(seats[1])).toBe(DEFAULT_BUY_IN - DEFAULT_BIG_BLIND);
      });
      it('when the entire table goes around and either checks or calls, cards should be dealt to the pool - three, then one, then one', () => {
        game.join(players[2]);
        game.join(players[3]);

        game.startGame(players[0]);
        game.startGame(players[1]);
        game.startGame(players[2]);
        game.startGame(players[3]);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CALL' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[3].id,
          move: { moveType: 'CALL' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CALL' },
        });

        let cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(0);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CHECK' },
        });

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(3);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CHECK' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[3].id,
          move: { moveType: 'CHECK' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CHECK' },
        });

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(3);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CHECK' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(4);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CHECK' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[3].id,
          move: { moveType: 'CHECK' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CHECK' },
        });
        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(4);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CHECK' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(5);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CHECK' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[3].id,
          move: { moveType: 'CHECK' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CHECK' },
        });
      });
      it('should remove a player from the turn order when they fold', () => {
        game.join(players[2]);
        game.join(players[3]);

        game.startGame(players[0]);
        game.startGame(players[1]);
        game.startGame(players[2]);
        game.startGame(players[3]);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CALL' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[3].id,
          move: { moveType: 'FOLD' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CALL' },
        });

        let cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(0);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CHECK' },
        });

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(3);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CHECK' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CHECK' },
        });

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(3);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CHECK' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(4);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CHECK' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CHECK' },
        });
        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(4);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CHECK' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(5);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CHECK' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CHECK' },
        });
      });
      it('should not deal a new card after a round if at least one player raised during the round', () => {
        game.join(players[2]);

        game.startGame(players[0]);
        game.startGame(players[1]);
        game.startGame(players[2]);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'RAISE', raiseAmount: 100 },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'RAISE', raiseAmount: 100 },
        });

        let cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(0);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CALL' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(0);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'RAISE', raiseAmount: 100 },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CALL' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(0);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CALL' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(0);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CHECK' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CHECK' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(0);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CHECK' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(3);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CHECK' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CHECK' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(3);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'RAISE', raiseAmount: 100 },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(3);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CALL' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CALL' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(3);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CHECK' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(4);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'RAISE', raiseAmount: 100 },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CALL' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(4);

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CALL' },
        });

        cardsDrawn = game.state.moves.filter(m => m.moveType === 'DEAL');

        expect(cardsDrawn.filter(m => m.player === undefined).length).toBe(4);
      });
      it('should allow a player to all-in: they may call with their remaining balance if it is not enough, and can always check or call that round', () => {
        game.join(players[2]);

        game.startGame(players[0]);
        game.startGame(players[1]);
        game.startGame(players[2]);

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'RAISE', raiseAmount: 500 },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'FOLD' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CALL' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'FOLD' },
        });

        expect(game.state.playerBalances.get(seats[1])).toBe(
          DEFAULT_BUY_IN + DEFAULT_SMALL_BLIND + 500,
        );

        const game2 = new PokerGame(new TestDeck(), game);

        game2.join(players[0]);
        game2.join(players[1]);
        game2.join(players[2]);

        game2.startGame(players[0]);
        game2.startGame(players[1]);
        game2.startGame(players[2]);

        expect(game2.state.playerBalances.get(seats[1])).toBe(DEFAULT_BUY_IN + 500);
        expect(game2.state.playerBalances.get(seats[2])).toBe(
          DEFAULT_BUY_IN - 500 - DEFAULT_BIG_BLIND,
        );

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'RAISE', raiseAmount: 1600 },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'CALL' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CALL' },
        });

        expect(game2.state.playerBalances.get(seats[2])).toBe(0);

        game.applyMove({
          gameID: game.id,
          playerID: players[0].id,
          move: { moveType: 'CALL' },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[1].id,
          move: { moveType: 'RAISE', raiseAmount: 100 },
        });

        game.applyMove({
          gameID: game.id,
          playerID: players[2].id,
          move: { moveType: 'CALL' },
        });

        expect(game2.state.playerBalances.get(seats[2])).toBe(0);
      });
    });
    describe('if a valid move is made which ends the game', () => {
      describe('if the game is ended by all players except one folding', () => {
        it('should end the game and assign a winner if all players but one fold', () => {
          game.join(players[2]);
          game.join(players[3]);
          game.join(players[4]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);
          game.startGame(players[3]);
          game.startGame(players[4]);

          game.applyMove({
            gameID: game.id,
            playerID: players[2].id,
            move: { moveType: 'FOLD' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[3].id,
            move: { moveType: 'FOLD' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[4].id,
            move: { moveType: 'FOLD' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[0].id,
            move: { moveType: 'FOLD' },
          });

          expect(game.state.status).toBe('OVER');
          expect(game.state.winner).toBe(players[1].id);
          expect(game.state.playerBalances.get(seats[1])).toBe(
            DEFAULT_BUY_IN + DEFAULT_SMALL_BLIND,
          );
        });
        it('should assign a winner properly after actions have been taken', () => {
          game.join(players[2]);

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);

          game.applyMove({
            gameID: game.id,
            playerID: players[2].id,
            move: { moveType: 'CALL' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[0].id,
            move: { moveType: 'FOLD' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[1].id,
            move: { moveType: 'CHECK' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[2].id,
            move: { moveType: 'RAISE', raiseAmount: 100 },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[1].id,
            move: { moveType: 'FOLD' },
          });

          expect(game.state.status).toBe('OVER');
          expect(game.state.winner).toBe(players[1].id);
          expect(game.state.playerBalances.get(seats[1])).toBe(
            DEFAULT_BUY_IN + DEFAULT_SMALL_BLIND + DEFAULT_BIG_BLIND,
          );
        });
        it('should assign the winner as the last player still in even if that player does not have the best hand', () => {
          game.join(players[2]);

          deck.addNextDraw({ face: 3, suite: 'CLUBS' });
          deck.addNextDraw({ face: 4, suite: 'CLUBS' });
          deck.addNextDraw({ face: 5, suite: 'CLUBS' });
          deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
          deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

          deck.addNextDraw({ face: 3, suite: 'HEARTS' });
          deck.addNextDraw({ face: 12, suite: 'SPADES' });
          deck.addNextDraw({ face: 1, suite: 'CLUBS' });
          deck.addNextDraw({ face: 2, suite: 'CLUBS' });
          deck.addNextDraw({ face: 9, suite: 'HEARTS' });
          deck.addNextDraw({ face: 7, suite: 'DIAMONDS' });

          game.startGame(players[0]);
          game.startGame(players[1]);
          game.startGame(players[2]);

          game.applyMove({
            gameID: game.id,
            playerID: players[2].id,
            move: { moveType: 'CALL' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[0].id,
            move: { moveType: 'FOLD' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[1].id,
            move: { moveType: 'CHECK' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[2].id,
            move: { moveType: 'CHECK' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[1].id,
            move: { moveType: 'CHECK' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[2].id,
            move: { moveType: 'CHECK' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[1].id,
            move: { moveType: 'FOLD' },
          });

          expect(game.state.status).toBe('OVER');
          expect(game.state.winner).toBe(players[2].id);
          expect(game.state.playerBalances.get(seats[2])).toBe(
            DEFAULT_BUY_IN + DEFAULT_BIG_BLIND + DEFAULT_SMALL_BLIND,
          );
        });
      });
      describe('if the game is ended by checking players hands', () => {
        function testPlayerOneWinning() {
          game.startGame(players[0]);
          game.startGame(players[1]);

          game.applyMove({
            gameID: game.id,
            playerID: players[0].id,
            move: { moveType: 'CALL' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[1].id,
            move: { moveType: 'CHECK' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[0].id,
            move: { moveType: 'CHECK' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[1].id,
            move: { moveType: 'CHECK' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[0].id,
            move: { moveType: 'CHECK' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[1].id,
            move: { moveType: 'CHECK' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[0].id,
            move: { moveType: 'CHECK' },
          });

          game.applyMove({
            gameID: game.id,
            playerID: players[1].id,
            move: { moveType: 'CHECK' },
          });

          expect(game.state.status).toBe('OVER');
          expect(game.state.winner).toBe(players[1].id);
          expect(game.state.playerBalances.get(seats[1])).toBe(
            DEFAULT_BUY_IN + DEFAULT_SMALL_BLIND,
          );
        }
        describe('hands should beat the hands below them', () => {
          it('one pair should beat high card', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 7, suite: 'CLUBS' });
            deck.addNextDraw({ face: 7, suite: 'HEARTS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 12, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('two pair should beat high card', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 3, suite: 'SPADES' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 12, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('two pair should beat one pair', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 3, suite: 'SPADES' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('three of a kind should beat high card', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 3, suite: 'SPADES' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 12, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('three of a kind should beat one pair', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 3, suite: 'SPADES' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('three of a kind should beat two pair', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 3, suite: 'SPADES' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 3, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 4, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('straight should beat high card', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 1, suite: 'SPADES' });
            deck.addNextDraw({ face: 2, suite: 'HEARTS' });
            deck.addNextDraw({ face: 12, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('straight should beat one pair', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 1, suite: 'SPADES' });
            deck.addNextDraw({ face: 2, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('straight should beat two pair', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 1, suite: 'SPADES' });
            deck.addNextDraw({ face: 2, suite: 'HEARTS' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('straight should beat three of a kind', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 1, suite: 'SPADES' });
            deck.addNextDraw({ face: 2, suite: 'HEARTS' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 3, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('flush should beat high card', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 10, suite: 'CLUBS' });
            deck.addNextDraw({ face: 9, suite: 'CLUBS' });
            deck.addNextDraw({ face: 12, suite: 'SPADES' });
            deck.addNextDraw({ face: 2, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          it('flush should beat one pair', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 10, suite: 'CLUBS' });
            deck.addNextDraw({ face: 9, suite: 'CLUBS' });
            deck.addNextDraw({ face: 11, suite: 'SPADES' });
            deck.addNextDraw({ face: 2, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          it('flush should beat two pair', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 10, suite: 'CLUBS' });
            deck.addNextDraw({ face: 9, suite: 'CLUBS' });
            deck.addNextDraw({ face: 11, suite: 'SPADES' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          it('flush should beat three of a kind', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 10, suite: 'CLUBS' });
            deck.addNextDraw({ face: 9, suite: 'CLUBS' });
            deck.addNextDraw({ face: 3, suite: 'SPADES' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          it('flush should beat straight', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 10, suite: 'CLUBS' });
            deck.addNextDraw({ face: 9, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'SPADES' });
            deck.addNextDraw({ face: 2, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          // Cannot have full house and high card
          it('full house should beat one pair', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 3, suite: 'SPADES' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 10, suite: 'CLUBS' });
            deck.addNextDraw({ face: 9, suite: 'DIAMONDS' });

            testPlayerOneWinning();
          });
          it('full house should beat two pair', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 3, suite: 'SPADES' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 10, suite: 'CLUBS' });
            deck.addNextDraw({ face: 10, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('full house should beat three of a kind', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 3, suite: 'SPADES' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 10, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          it('full house should beat straight', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 3, suite: 'SPADES' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 2, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          it('full house should beat flush', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 3, suite: 'SPADES' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 2, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'CLUBS' });

            testPlayerOneWinning();
          });
          it('four of a kind should beat one pair', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 4, suite: 'SPADES' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 2, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'DIAMONDS' });

            testPlayerOneWinning();
          });
          it('four of a kind should beat two pair', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 4, suite: 'SPADES' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 6, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'DIAMONDS' });

            testPlayerOneWinning();
          });
          it('four of a kind should beat three of a kind', () => {
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 4, suite: 'SPADES' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 6, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'DIAMONDS' });

            testPlayerOneWinning();
          });
          it('four of a kind should beat straight', () => {
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 4, suite: 'SPADES' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 2, suite: 'CLUBS' });
            deck.addNextDraw({ face: 3, suite: 'DIAMONDS' });

            testPlayerOneWinning();
          });
          it('four of a kind should beat flush', () => {
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'CLUBS' });

            deck.addNextDraw({ face: 4, suite: 'SPADES' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 1, suite: 'CLUBS' });
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });

            testPlayerOneWinning();
          });
          it('four of a kind should beat full house', () => {
            deck.addNextDraw({ face: 5, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'CLUBS' });

            deck.addNextDraw({ face: 4, suite: 'SPADES' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 11, suite: 'CLUBS' });

            testPlayerOneWinning();
          });
          it('straight flush should beat high card', () => {
            deck.addNextDraw({ face: 5, suite: 'HEARTS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'HEARTS' });
            deck.addNextDraw({ face: 2, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'CLUBS' });

            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 1, suite: 'CLUBS' });
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });

            testPlayerOneWinning();
          });
          it('straight flush should beat one pair', () => {
            deck.addNextDraw({ face: 5, suite: 'HEARTS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'HEARTS' });
            deck.addNextDraw({ face: 2, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'CLUBS' });

            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'CLUBS' });
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });

            testPlayerOneWinning();
          });
          it('straight flush should beat two pair', () => {
            deck.addNextDraw({ face: 5, suite: 'HEARTS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'HEARTS' });
            deck.addNextDraw({ face: 2, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'CLUBS' });

            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'CLUBS' });
            deck.addNextDraw({ face: 2, suite: 'CLUBS' });

            testPlayerOneWinning();
          });
          it('straight flush should beat three of a kind', () => {
            deck.addNextDraw({ face: 5, suite: 'HEARTS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'HEARTS' });
            deck.addNextDraw({ face: 2, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'CLUBS' });

            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'CLUBS' });
            deck.addNextDraw({ face: 7, suite: 'DIAMONDS' });

            testPlayerOneWinning();
          });
          it('straight flush should beat straight', () => {
            deck.addNextDraw({ face: 5, suite: 'HEARTS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'HEARTS' });
            deck.addNextDraw({ face: 2, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'CLUBS' });

            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });

            testPlayerOneWinning();
          });
          it('straight flush should beat flush', () => {
            deck.addNextDraw({ face: 5, suite: 'HEARTS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'HEARTS' });
            deck.addNextDraw({ face: 2, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'CLUBS' });

            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 10, suite: 'HEARTS' });
            deck.addNextDraw({ face: 12, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          it('straight flush should beat full house', () => {
            deck.addNextDraw({ face: 5, suite: 'HEARTS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'HEARTS' });
            deck.addNextDraw({ face: 2, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 7, suite: 'CLUBS' });

            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 5, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 5, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('straight flush should beat four of a kind', () => {
            deck.addNextDraw({ face: 5, suite: 'HEARTS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'HEARTS' });
            deck.addNextDraw({ face: 2, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });

            deck.addNextDraw({ face: 3, suite: 'HEARTS' });
            deck.addNextDraw({ face: 4, suite: 'HEARTS' });
            deck.addNextDraw({ face: 5, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 5, suite: 'SPADES' });

            testPlayerOneWinning();
          });
        });
        describe('in the case of ties', () => {
          it('high card of the higher rank should win', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 6, suite: 'HEARTS' });
            deck.addNextDraw({ face: 12, suite: 'SPADES' });
            deck.addNextDraw({ face: 7, suite: 'CLUBS' });
            deck.addNextDraw({ face: 9, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          it('pair of higher rank should win', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 12, suite: 'HEARTS' });
            deck.addNextDraw({ face: 12, suite: 'SPADES' });
            deck.addNextDraw({ face: 6, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          it('two pair of higher rank should win', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 12, suite: 'HEARTS' });
            deck.addNextDraw({ face: 12, suite: 'SPADES' });
            deck.addNextDraw({ face: 6, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          it('three of a kind of higher rank should win', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 12, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 12, suite: 'HEARTS' });
            deck.addNextDraw({ face: 12, suite: 'SPADES' });
            deck.addNextDraw({ face: 6, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          it('straight of higher rank should win', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 12, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 12, suite: 'HEARTS' });
            deck.addNextDraw({ face: 7, suite: 'SPADES' });
            deck.addNextDraw({ face: 6, suite: 'CLUBS' });
            deck.addNextDraw({ face: 2, suite: 'HEARTS' });

            testPlayerOneWinning();
          });
          it('flush with higher card should win', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 12, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 12, suite: 'CLUBS' });
            deck.addNextDraw({ face: 11, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'CLUBS' });
            deck.addNextDraw({ face: 7, suite: 'CLUBS' });

            testPlayerOneWinning();
          });
          it('full house with higher triple should win', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 3, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 3, suite: 'HEARTS' });

            deck.addNextDraw({ face: 12, suite: 'CLUBS' });
            deck.addNextDraw({ face: 12, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 6, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('four of a kind with higher rank should win', () => {
            deck.addNextDraw({ face: 12, suite: 'SPADES' });
            deck.addNextDraw({ face: 12, suite: 'HEARTS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 6, suite: 'HEARTS' });

            deck.addNextDraw({ face: 12, suite: 'CLUBS' });
            deck.addNextDraw({ face: 12, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 6, suite: 'CLUBS' });
            deck.addNextDraw({ face: 6, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('straight flush with higher rank should win', () => {
            deck.addNextDraw({ face: 3, suite: 'SPADES' });
            deck.addNextDraw({ face: 4, suite: 'SPADES' });
            deck.addNextDraw({ face: 5, suite: 'SPADES' });
            deck.addNextDraw({ face: 10, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 10, suite: 'HEARTS' });

            deck.addNextDraw({ face: 6, suite: 'SPADES' });
            deck.addNextDraw({ face: 7, suite: 'SPADES' });
            deck.addNextDraw({ face: 1, suite: 'SPADES' });
            deck.addNextDraw({ face: 2, suite: 'SPADES' });

            testPlayerOneWinning();
          });
          it('should distribute winnings equally otherwise', () => {
            deck.addNextDraw({ face: 3, suite: 'CLUBS' });
            deck.addNextDraw({ face: 4, suite: 'CLUBS' });
            deck.addNextDraw({ face: 5, suite: 'CLUBS' });
            deck.addNextDraw({ face: 1, suite: 'DIAMONDS' });
            deck.addNextDraw({ face: 11, suite: 'DIAMONDS' });

            deck.addNextDraw({ face: 12, suite: 'HEARTS' });
            deck.addNextDraw({ face: 12, suite: 'SPADES' });
            deck.addNextDraw({ face: 12, suite: 'CLUBS' });
            deck.addNextDraw({ face: 12, suite: 'DIAMONDS' });

            game.startGame(players[0]);
            game.startGame(players[1]);

            game.applyMove({
              gameID: game.id,
              playerID: players[0].id,
              move: { moveType: 'CALL' },
            });

            game.applyMove({
              gameID: game.id,
              playerID: players[1].id,
              move: { moveType: 'CHECK' },
            });

            game.applyMove({
              gameID: game.id,
              playerID: players[0].id,
              move: { moveType: 'CHECK' },
            });

            game.applyMove({
              gameID: game.id,
              playerID: players[1].id,
              move: { moveType: 'CHECK' },
            });

            game.applyMove({
              gameID: game.id,
              playerID: players[0].id,
              move: { moveType: 'CHECK' },
            });

            game.applyMove({
              gameID: game.id,
              playerID: players[1].id,
              move: { moveType: 'CHECK' },
            });

            game.applyMove({
              gameID: game.id,
              playerID: players[0].id,
              move: { moveType: 'CHECK' },
            });

            game.applyMove({
              gameID: game.id,
              playerID: players[1].id,
              move: { moveType: 'CHECK' },
            });

            expect(game.state.status).toBe('OVER');
            expect(game.state.winner).toBeUndefined();
            expect(game.state.playerBalances.get(seats[0])).toBe(DEFAULT_BUY_IN);
            expect(game.state.playerBalances.get(seats[1])).toBe(DEFAULT_BUY_IN);
          });
        });
      });
    });
  });
});
