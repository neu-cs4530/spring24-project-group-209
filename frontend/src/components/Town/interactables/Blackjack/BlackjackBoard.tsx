import BlackjackAreaController, {
  BlackjackCell,
} from '../../../../classes/interactable/BlackjackAreaController';
import { Box, Button, chakra, Container, useToast } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { SeatNumber } from '../../../../types/CoveyTownSocket';

export type BlackjackGameProps = {
  gameAreaController: BlackjackAreaController;
};
const StyledBlackjackBoard = chakra(Container, {
  baseStyle: {
    display: 'flex',
    width: '350px',
    height: '350px',
    padding: '5px',
    flexWrap: 'wrap',
  },
});
const StyledBlackjackSquare = chakra(Box, {
  baseStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: '14%',
    border: '1px solid black',
    height: '14%',
    fontSize: '50px',
    _disabled: {
      opacity: '100%',
    },
  },
});
/**
 * A component that renders the ConnectFour board
 *
 * Renders the ConnectFour board as a "StyledConnectFourBoard", which consists of "StyledConnectFourSquare"s
 * (one for each cell in the board, starting from the top left and going left to right, top to bottom).
 *
 * Each StyledConnectFourSquare has an aria-label property that describes the cell's position in the board,
 * formatted as `Cell ${rowIndex},${colIndex} (Red|Yellow|Empty)`.
 *
 * The background color of each StyledConnectFourSquare is determined by the value of the cell in the board, either
 * 'red', 'yellow', or '' (an empty for an empty square).
 *
 * The board is re-rendered whenever the board changes, and each cell is re-rendered whenever the value
 * of that cell changes.
 *
 * If the current player is in the game, then each StyledConnectFourSquare is clickable, and clicking
 * on it will make a move in that column. If there is an error making the move, then a toast will be
 * displayed with the error message as the description of the toast. If it is not the current player's
 * turn, then the StyledConnectFourSquare will be disabled.
 *
 * @param gameAreaController the controller for the ConnectFour game
 */
export default function BlackjackBoard({ gameAreaController }: BlackjackGameProps): JSX.Element {
  const [board, setBoard] = useState<BlackjackCell[][]>(gameAreaController.board);
  const toast = useToast();
  useEffect(() => {
    gameAreaController.addListener('boardChanged', setBoard);
    return () => {
      gameAreaController.removeListener('boardChanged', setBoard);
    };
  }, [gameAreaController]);
  return (
    <StyledBlackjackBoard aria-label='Blackjack Board'>
      {board.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          return (
            <StyledBlackjackSquare
              key={`${rowIndex}.${colIndex}`}
              backgroundColor={'green'}
              aria-label={`Cell ${rowIndex},${colIndex} (${cell || 'Empty'})`}>
              {cell ? <Image src={cardMap.get(cell)} alt={`Card ${cell}`} /> : undefined}
            </StyledBlackjackSquare>
          );
        });
      })}
    </StyledBlackjackBoard>
  );
}
