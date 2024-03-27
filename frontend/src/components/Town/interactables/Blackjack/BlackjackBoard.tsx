import BlackjackAreaController, {
  BlackjackCell,
} from '../../../../classes/interactable/BlackjackAreaController';
import { Box, Button, chakra, Container, useToast } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
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

// const cardMap: Map<Card, string> = 

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
