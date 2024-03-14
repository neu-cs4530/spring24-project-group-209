import { Card, DeckOfCards } from '../../types/CoveyTownSocket';

// This should probably be moved, not sure where to keep errors
export const NO_CARDS_TO_DRAW_MESSAGE = 'No more cards to draw from the deck';

/**
 * Basic implementation for a deck of cards, which draws from a fixed pool of 52 cards in one deck.
 */
export default class BasicDeck implements DeckOfCards {
  /**
   * Draws a card which has not already been drawn from the deck.
   *
   * @throws Error if there are no cards left in the deck (NO_CARDS_TO_DRAW_MESSAGE)
   * @returns A card object with a face and suite not drawn since the last time this deck was shuffled
   */
  drawCard(): Card {
    throw new Error('Method not implemented.');
  }

  /**
   * Resets the memory of this deck, so that cards which were previously drawn can be drawn again.
   */
  shuffle(): void {
    throw new Error('Method not implemented.');
  }

  /**
   * Gets the remaining number of cards which can be drawn from this deck before an error is thrown,
   * equal to 52 - the number of cards drawn since the last shuffle.
   *
   * @returns An integer representing the number of cards left in the deck.
   */
  remainingCards() {
    throw new Error('Method not implemented.');
  }
}