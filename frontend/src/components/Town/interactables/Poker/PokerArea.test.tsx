import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { mock, mockReset } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { act } from 'react-dom/test-utils';
import React from 'react';
import PokerAreaController from '../../../../classes/interactable/PokerAreaController';
import PlayerController from '../../../../classes/PlayerController';
import TownController, * as TownControllerHooks from '../../../../classes/TownController';
import TownControllerContext from '../../../../contexts/TownControllerContext';
import { randomLocation } from '../../../../TestUtils';
import {
  PokerMove,
  PokerGameState,
  GameArea,
  GameStatus,
} from '../../../../types/CoveyTownSocket';
import PhaserGameArea from '../GameArea';
import PokerArea from './PokerArea';
import * as PokerBoard from './PokerBoard';

const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => {
  const ui = jest.requireActual('@chakra-ui/react');
  const mockUseToast = () => mockToast;
  return {
    ...ui,
    useToast: mockUseToast,
  };
});
const mockGameArea = mock<PhaserGameArea>();
mockGameArea.getData.mockReturnValue('Poker');
jest.spyOn(TownControllerHooks, 'useInteractable').mockReturnValue(mockGameArea);
const useInteractableAreaControllerSpy = jest.spyOn(
  TownControllerHooks,
  'useInteractableAreaController',
);

const boardComponentSpy = jest.spyOn(PokerBoard, 'default');
boardComponentSpy.mockReturnValue(<div data-testid='board' />);