import CardToImage from './CardToImage';

describe('it should output the correct path for two different decks', () => {
  test('should output the correct path for a mock deck test0', () => {
    const test = 'test0';

    const testCardToImage = new CardToImage(test);

    expect(testCardToImage.getCardUrl({ face: 1, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/aceOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/twoOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/threeOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/fourOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/fiveOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/sixOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/sevenOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/eightOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/nineOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/tenOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/jackOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/queenOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test0/kingOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 1, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/aceOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/twoOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/threeOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/fourOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/fiveOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/sixOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/sevenOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/eightOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/nineOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/tenOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/jackOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/queenOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test0/kingOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 1, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/aceOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/twoOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/threeOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/fourOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/fiveOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/sixOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/sevenOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/eightOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/nineOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/tenOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/jackOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/queenOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test0/kingOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 1, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/aceOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/twoOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/threeOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/fourOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/fiveOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/sixOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/sevenOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/eightOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/nineOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/tenOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/jackOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/queenOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test0/kingOfSpades',
    );
  });
  test('should output the correct path for a mock deck test1', () => {
    const test = 'test1';

    const testCardToImage = new CardToImage(test);

    expect(testCardToImage.getCardUrl({ face: 1, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/aceOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/twoOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/threeOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/fourOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/fiveOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/sixOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/sevenOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/eightOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/nineOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/tenOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/jackOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/queenOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'CLUBS' })).toBe(
      '../../../../public/assets/cards/test1/kingOfClubs',
    );
    expect(testCardToImage.getCardUrl({ face: 1, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/aceOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/twoOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/threeOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/fourOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/fiveOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/sixOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/sevenOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/eightOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/nineOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/tenOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/jackOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/queenOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'DIAMONDS' })).toBe(
      '../../../../public/assets/cards/test1/kingOfDiamonds',
    );
    expect(testCardToImage.getCardUrl({ face: 1, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/aceOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/twoOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/threeOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/fourOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/fiveOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/sixOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/sevenOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/eightOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/nineOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/tenOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/jackOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/queenOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'HEARTS' })).toBe(
      '../../../../public/assets/cards/test1/kingOfHearts',
    );
    expect(testCardToImage.getCardUrl({ face: 1, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/aceOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 2, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/twoOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 3, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/threeOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 4, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/fourOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 5, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/fiveOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 6, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/sixOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 7, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/sevenOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 8, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/eightOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 9, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/nineOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 10, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/tenOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 11, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/jackOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 12, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/queenOfSpades',
    );
    expect(testCardToImage.getCardUrl({ face: 13, suite: 'SPADES' })).toBe(
      '../../../../public/assets/cards/test1/kingOfSpades',
    );
  });
});
