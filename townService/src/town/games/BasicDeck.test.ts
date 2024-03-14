import { CardFace, CardSuite } from '../../types/CoveyTownSocket';
import BasicDeck, { NO_CARDS_TO_DRAW_MESSAGE } from './BasicDeck';

describe('BasicDeck', () => {
  let deck: BasicDeck;
  beforeEach(() => {
    deck = new BasicDeck();
  });
  describe('drawCard', () => {
    // This test should cover drawing cards properly as well as not drawing duplicates of a card
    it('should draw every possible card in a deck once when drawing 52 cards exactly once', () => {
      const cardsDrawn = [];
      for (let i = 0; i < 52; i++) {
        cardsDrawn.push(deck.drawCard());
      }
      const suites: Array<CardSuite> = ['CLUBS', 'DIAMONDS', 'HEARTS', 'SPADES'];
      const faces: Array<CardFace> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

      // Iterates over every card
      for (let i = 0; i < suites.length; i++) {
        for (let j = 0; j < faces.length; j++) {
          expect(cardsDrawn.filter(c => c.face === faces[j] && c.suite === suites[i]).length).toBe(
            1,
          );
        }
      }
    });
    it('should throw an error when drawing a card after 52 cards have been drawn without shuffling', () => {
      for (let i = 0; i < 52; i++) {
        deck.drawCard();
      }
      expect(() => deck.drawCard()).toThrowError(NO_CARDS_TO_DRAW_MESSAGE);
    });
  });
  describe('shuffle', () => {
    it('should reset the cards drawn from the deck', () => {
      const cardsDrawn = [];
      for (let i = 0; i < 52; i++) {
        cardsDrawn.push(deck.drawCard());
      }
      deck.shuffle();
      for (let i = 0; i < 52; i++) {
        cardsDrawn.push(deck.drawCard());
      }

      const suites: Array<CardSuite> = ['CLUBS', 'DIAMONDS', 'HEARTS', 'SPADES'];
      const faces: Array<CardFace> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

      // Iterates over every card
      for (let i = 0; i < suites.length; i++) {
        for (let j = 0; j < faces.length; j++) {
          expect(cardsDrawn.filter(c => c.face === faces[j] && c.suite === suites[i]).length).toBe(
            2,
          );
        }
      }
    });
    describe('remainingCards', () => {
      it('should accurately reflect the number of cards remaining in the deck', () => {
        expect(deck.remainingCards()).toBe(52);
        for (let i = 0; i < 52; i++) {
          deck.drawCard();
          expect(deck.remainingCards()).toBe(52 - i - 1);
        }
      });
    });
  });
});