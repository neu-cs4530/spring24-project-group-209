import { nanoid } from 'nanoid';
import PokerAreaController, {
  PokerCell,
} from '../../../../classes/interactable/PokerAreaController';
import { render, screen } from '@testing-library/react';
import { mock } from 'jest-mock-extended';
import {
  GameArea,
  GameStatus,
  PokerGameState,
  SeatNumber,
} from '../../../../types/CoveyTownSocket';
import TownController from '../../../../classes/TownController';
import PlayerController from '../../../../classes/PlayerController';
import React from 'react';
import PokerBoard from './PokerBoard';

class MockPokerAreaController extends PokerAreaController {
  mockBoard: PokerCell[][] = [];

  mockIsPlayer = false;

  mockIsOurTurn = false;

  mockSeat: SeatNumber = 0;

  mockStatus: GameStatus = 'WAITING_TO_START';

  public constructor() {
    super(nanoid(), mock<GameArea<PokerGameState>>(), mock<TownController>());
    this.mockClear();
  }

  get status(): GameStatus {
    return this.mockStatus;
  }

  /*
    For ease of testing, we will mock the board property
    to return a copy of the mockBoard property, so that
    we can change the mockBoard property and then check
    that the board property is updated correctly.
    */
  get board() {
    const copy = this.mockBoard.concat([]);
    for (let i = 0; i < copy.length; i++) {
      copy[i] = copy[i].concat([]);
    }
    return copy;
  }

  get isOurTurn() {
    return this.mockIsOurTurn;
  }

  get isPlayer() {
    return this.mockIsPlayer;
  }

  mockClear() {
    this.mockBoard = new Array(9);
    for (let i = 0; i < 8; i++) {
      this.mockBoard[i].push({ card: { suite: 'CLUBS', face: 2 }, player: i as SeatNumber });
      this.mockBoard[i].push({ card: { suite: 'HEARTS', face: 3 }, player: i as SeatNumber });
    }
    this.mockBoard[8].push({ card: { suite: 'DIAMONDS', face: 6 }, player: undefined });
    this.mockBoard[8].push({ card: { suite: 'DIAMONDS', face: 7 }, player: undefined });
    this.mockBoard[8].push({ card: { suite: 'DIAMONDS', face: 8 }, player: undefined });

    this.mockStatus = 'WAITING_TO_START';
  }
  //No other method shoudl be callable

  get winner(): PlayerController | undefined {
    throw new Error('Method should not be called within this component');
  }

  get moveCount(): number {
    throw new Error('Method should not be called within this component');
  }

  get whoseTurn(): PlayerController | undefined {
    throw new Error('Method should not be called within this component');
  }

  isEmpty(): boolean {
    throw new Error('Method should not be called within this component');
  }

  public isActive(): boolean {
    throw new Error('Method should not be called within this component');
  }

  public startGame(): Promise<void> {
    throw new Error('Method should not be called within this component');
  }
}
describe('PokerBoard', () => {
  const gameAreaController = new MockPokerAreaController();
  beforeEach(() => {
    gameAreaController.mockClear();
  });
  it('should show each players hand when cards are dealt, with opponent cards face down', () => {
    gameAreaController.mockIsPlayer = true;
    gameAreaController.mockStatus = 'IN_PROGRESS';
    gameAreaController.mockSeat = 0;

    render(<PokerBoard gameAreaController={gameAreaController} />);
    const cards = screen.getAllByRole('StyledPokerSquare');
    expect(cards.length).toBe(19);
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (card.getAttribute('key') === '0.0') {
        expect(
          card.getElementsByTagName('Image')[0].getAttribute('src')?.includes(`twoOfClubs.png`),
        ).toBe(true);
      } else if (card.getAttribute('key') === '0.1') {
        expect(
          card.getElementsByTagName('Image')[0].getAttribute('src')?.includes(`threeOfHearts.png`),
        ).toBe(true);
      } else if (card.getAttribute('key') === '8.0') {
        expect(
          card.getElementsByTagName('Image')[0].getAttribute('src')?.includes(`sixOfDiamonds.png`),
        ).toBe(true);
      } else if (card.getAttribute('key') === '8.1') {
        expect(
          card
            .getElementsByTagName('Image')[0]
            .getAttribute('src')
            ?.includes(`sevenOfDiamonds.png`),
        ).toBe(true);
      } else if (card.getAttribute('key') === '8.2') {
        expect(
          card
            .getElementsByTagName('Image')[0]
            .getAttribute('src')
            ?.includes(`eightOfDiamonds.png`),
        ).toBe(true);
      } else {
        expect(
          card.getElementsByTagName('Image')[0].getAttribute('src')?.includes(`backOfCard.png`),
        ).toBe(true);
      }
    }
  });
  it('should show each players hand after the game is over', () => {
    gameAreaController.mockIsPlayer = true;
    gameAreaController.mockStatus = 'OVER';
    gameAreaController.mockSeat = 0;

    render(<PokerBoard gameAreaController={gameAreaController} />);
    const cards = screen.getAllByRole('StyledPokerSquare');
    expect(cards.length).toBe(19);
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (card.getAttribute('key') === '0.0') {
        expect(
          card.getElementsByTagName('Image')[0].getAttribute('src')?.includes(`twoOfClubs.png`),
        ).toBe(true);
      } else if (card.getAttribute('key') === '0.1') {
        expect(
          card.getElementsByTagName('Image')[0].getAttribute('src')?.includes(`threeOfHearts.png`),
        ).toBe(true);
      } else if (card.getAttribute('key') === '8.0') {
        expect(
          card.getElementsByTagName('Image')[0].getAttribute('src')?.includes(`sixOfDiamonds.png`),
        ).toBe(true);
      } else if (card.getAttribute('key') === '8.1') {
        expect(
          card
            .getElementsByTagName('Image')[0]
            .getAttribute('src')
            ?.includes(`sevenOfDiamonds.png`),
        ).toBe(true);
      } else if (card.getAttribute('key') === '8.2') {
        expect(
          card
            .getElementsByTagName('Image')[0]
            .getAttribute('src')
            ?.includes(`eightOfDiamonds.png`),
        ).toBe(true);
      } else {
        expect(
          card.getElementsByTagName('Image')[0].getAttribute('src')?.includes(`backOfCard.png`),
        ).toBe(false);
      }
    }
  });
});
