import { Card, CardFace, CardSuite, DeckOfCards } from '../../types/CoveyTownSocket';

// This should probably be moved, not sure where to keep errors
export const NO_CARDS_TO_DRAW_MESSAGE = 'No more cards to draw from the deck';

/**
 * Basic implementation for a deck of cards, which draws from a fixed pool of 52 cards in one deck.
 */
export default class BasicDeck implements DeckOfCards {
  protected _cardsRemaining: Array<Card> = [];

  public constructor() {
    const faces: Array<CardFace> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const suites: Array<CardSuite> = ['CLUBS', 'SPADES', 'DIAMONDS', 'HEARTS'];

    for (let i = 0; i < faces.length; i++) {
      for (let j = 0; j < suites.length; j++) {
        this._cardsRemaining.push({ suite: suites[j], face: faces[i] });
      }
    }
  }

  /**
   * Draws a card which has not already been drawn from the deck.
   *
   * @throws Error if there are no cards left in the deck (NO_CARDS_TO_DRAW_MESSAGE)
   * @returns A card object with a face and suite not drawn since the last time this deck was shuffled
   */
  drawCard(): Card {
    if (this._cardsRemaining.length === 0) throw new Error(NO_CARDS_TO_DRAW_MESSAGE);

    return this._cardsRemaining.splice(
      Math.floor(Math.random() * this._cardsRemaining.length),
      1,
    )[0];
  }

  /**
   * Resets the memory of this deck, so that cards which were previously drawn can be drawn again.
   */
  shuffle(): void {
    this._cardsRemaining = [];

    const faces: Array<CardFace> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const suites: Array<CardSuite> = ['CLUBS', 'SPADES', 'DIAMONDS', 'HEARTS'];

    for (let i = 0; i < faces.length; i++) {
      for (let j = 0; j < suites.length; j++) {
        this._cardsRemaining.push({ suite: suites[j], face: faces[i] });
      }
    }
  }

  /**
   * Gets the remaining number of cards which can be drawn from this deck before an error is thrown,
   * equal to 52 - the number of cards drawn since the last shuffle.
   *
   * @returns An integer representing the number of cards left in the deck.
   */
  remainingCards() {
    return this._cardsRemaining.length;
  }
}
