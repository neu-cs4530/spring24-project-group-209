import PokerAreaController, {
  PokerCell,
} from '../../../../classes/interactable/PokerAreaController';
import { Box, chakra, Container } from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import useTownController from '../../../../hooks/useTownController';
export type PokerGameProps = {
  gameAreaController: PokerAreaController;
};
const StyledPokerBoard = chakra(Container, {
  baseStyle: {
    display: 'flex',
    width: '350px',
    height: '350px',
    padding: '5px',
    flexWrap: 'wrap',
  },
});
const StyledPokerSquare = chakra(Box, {
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

export default function PokerBoard({ gameAreaController }: PokerGameProps): JSX.Element {
  const [board, setBoard] = useState<PokerCell[][]>(gameAreaController.board);
  const townController = useTownController();
  useEffect(() => {
    gameAreaController.addListener('boardChanged', setBoard);
    return () => {
      gameAreaController.removeListener('boardChanged', setBoard);
    };
  }, [gameAreaController]);
  return (
    <StyledPokerBoard aria-label='Poker Board'>
      {board.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          return (
            <StyledPokerSquare
              key={`${rowIndex}.${colIndex}`}
              backgroundColor={'green'}
              aria-label={`Cell ${rowIndex},${colIndex} (${cell || 'Empty'})`}>
              {cell ? (
                cell.player === gameAreaController.playerSeat(townController.ourPlayer) ? (
                  <Image src={cardMap.get(cell)} alt={`Card ${cell}`} />
                ) : (
                  <Image src={'cardBack.png'} alt={`Card ${cell}`} />
                )
              ) : undefined}
            </StyledPokerSquare>
          );
        });
      })}
    </StyledPokerBoard>
  );
}
