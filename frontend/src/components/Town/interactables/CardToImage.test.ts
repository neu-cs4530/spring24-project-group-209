import CardToImage from './CardToImage';

describe('it should output the correct path for two different decks', () => {
  test('should output the correct path for a mock deck test0', () => {
    const test = 'test0';

    const testCardToImage = new CardToImage(test);

    expect(testCardToImage.getCardUrl({ face: 1, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/aceOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/twoOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/threeOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/fourOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/fiveOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/sixOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/sevenOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/eightOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/nineOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/tenOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/jackOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/queenOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/kingOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 1, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/aceOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/twoOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/threeOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/fourOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/fiveOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/sixOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/sevenOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/eightOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/nineOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/tenOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/jackOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/queenOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/kingOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 1, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/aceOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/twoOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/threeOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/fourOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/fiveOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/sixOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/sevenOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/eightOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/nineOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/tenOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/jackOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/queenOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/kingOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 1, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/aceOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/twoOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/threeOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/fourOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/fiveOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/sixOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/sevenOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/eightOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/nineOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/tenOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/jackOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/queenOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/kingOfSpades.png',
    );
  });
  test('should output the correct path for a mock deck test1', () => {
    const test = 'test1';

    const testCardToImage = new CardToImage(test);

    expect(testCardToImage.getCardUrl({ face: 1, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/aceOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/twoOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/threeOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/fourOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/fiveOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/sixOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/sevenOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/eightOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/nineOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/tenOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/jackOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/queenOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/kingOfClubs.png',
    );
    expect(testCardToImage.getCardUrl({ face: 1, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/aceOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/twoOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/threeOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/fourOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/fiveOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/sixOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/sevenOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/eightOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/nineOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/tenOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/jackOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/queenOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/kingOfDiamonds.png',
    );
    expect(testCardToImage.getCardUrl({ face: 1, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/aceOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/twoOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/threeOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/fourOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/fiveOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/sixOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/sevenOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/eightOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/nineOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/tenOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/jackOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/queenOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/kingOfHearts.png',
    );
    expect(testCardToImage.getCardUrl({ face: 1, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/aceOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/twoOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/threeOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/fourOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/fiveOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/sixOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/sevenOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/eightOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/nineOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/tenOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/jackOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/queenOfSpades.png',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/kingOfSpades.png',
    );
  });
});
