import { Card } from '../../../types/CoveyTownSocket';

/**
 * Class to take a card object and return the path to the image asset to display it as -
 * the constructor takes a string which represents the deck skin the player is using, and uses that to
 * determine the path to the correct asset.
 */
export default class CardToImage {
  private _deck: string;

  public constructor(deck: string) {
    this._deck = deck;
  }

  /**
   * Takes a card object, and returns the image which represents it from the deck stored in
   * the constructor.
   */
  public getCardUrl(card: Card): string {
    const path = `../../../../public/assets/cards/${this._deck}/`;

    switch (card.suite) {
      case 'CLUBS': {
        switch (card.face) {
          case 1:
            return `${path}aceOfClubs.png`;
          case 2:
            return `${path}twoOfClubs.png`;
          case 3:
            return `${path}threeOfClubs.png`;
          case 4:
            return `${path}fourOfClubs.png`;
          case 5:
            return `${path}fiveOfClubs.png`;
          case 6:
            return `${path}sixOfClubs.png`;
          case 7:
            return `${path}sevenOfClubs.png`;
          case 8:
            return `${path}eightOfClubs.png`;
          case 9:
            return `${path}nineOfClubs.png`;
          case 10:
            return `${path}tenOfClubs.png`;
          case 11:
            return `${path}jackOfClubs.png`;
          case 12:
            return `${path}queenOfClubs.png`;
          case 13:
            return `${path}kingOfClubs.png`;
          default:
            throw new Error('Invalid Card');
        }
        break;
      }
      case 'HEARTS': {
        switch (card.face) {
          case 1:
            return `${path}aceOfHearts.png`;
          case 2:
            return `${path}twoOfHearts.png`;
          case 3:
            return `${path}threeOfHearts.png`;
          case 4:
            return `${path}fourOfHearts.png`;
          case 5:
            return `${path}fiveOfHearts.png`;
          case 6:
            return `${path}sixOfHearts.png`;
          case 7:
            return `${path}sevenOfHearts.png`;
          case 8:
            return `${path}eightOfHearts.png`;
          case 9:
            return `${path}nineOfHearts.png`;
          case 10:
            return `${path}tenOfHearts.png`;
          case 11:
            return `${path}jackOfHearts.png`;
          case 12:
            return `${path}queenOfHearts.png`;
          case 13:
            return `${path}kingOfHearts.png`;
          default:
            throw new Error('Invalid Card');
        }
        break;
      }
      case 'DIAMONDS': {
        switch (card.face) {
          case 1:
            return `${path}aceOfDiamonds.png`;
          case 2:
            return `${path}twoOfDiamonds.png`;
          case 3:
            return `${path}threeOfDiamonds.png`;
          case 4:
            return `${path}fourOfDiamonds.png`;
          case 5:
            return `${path}fiveOfDiamonds.png`;
          case 6:
            return `${path}sixOfDiamonds.png`;
          case 7:
            return `${path}sevenOfDiamonds.png`;
          case 8:
            return `${path}eightOfDiamonds.png`;
          case 9:
            return `${path}nineOfDiamonds.png`;
          case 10:
            return `${path}tenOfDiamonds.png`;
          case 11:
            return `${path}jackOfDiamonds.png`;
          case 12:
            return `${path}queenOfDiamonds.png`;
          case 13:
            return `${path}kingOfDiamonds.png`;
          default:
            throw new Error('Invalid Card');
        }
        break;
      }
      case 'SPADES': {
        switch (card.face) {
          case 1:
            return `${path}aceOfSpades.png`;
          case 2:
            return `${path}twoOfSpades.png`;
          case 3:
            return `${path}threeOfSpades.png`;
          case 4:
            return `${path}fourOfSpades.png`;
          case 5:
            return `${path}fiveOfSpades.png`;
          case 6:
            return `${path}sixOfSpades.png`;
          case 7:
            return `${path}sevenOfSpades.png`;
          case 8:
            return `${path}eightOfSpades.png`;
          case 9:
            return `${path}nineOfSpades.png`;
          case 10:
            return `${path}tenOfSpades.png`;
          case 11:
            return `${path}jackOfSpades.png`;
          case 12:
            return `${path}queenOfSpades.png`;
          case 13:
            return `${path}kingOfSpades.png`;
          default:
            throw new Error('Invalid Card');
        }
        break;
      }
      default:
        throw new Error('Invalid Card');
    }
  }
}
