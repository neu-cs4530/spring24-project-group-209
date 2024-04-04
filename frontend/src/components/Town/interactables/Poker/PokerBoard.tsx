import PokerAreaController, {
  PokerCell,
} from '../../../../classes/interactable/PokerAreaController';
import { Box, chakra, Container } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useTownController from '../../../../hooks/useTownController';
import CardToImage from './CardToImages';
import * as firebaseUtils from '../../../../firebaseUtils';
import { Image } from '@chakra-ui/react';

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

export default function PokerBoard({ gameAreaController }: PokerGameProps): JSX.Element {
  const [board, setBoard] = useState<PokerCell[][]>(gameAreaController.board);
  const townController = useTownController();
  const [activeSkin, setActiveSkin] = useState<string>('SKIN1');
  const cardMap: CardToImage = new CardToImage('default');
  useEffect(() => {
    async function fetchData() {
      const fetchedSkin = await firebaseUtils.getActiveSkin(townController.ourPlayer.userName);
      setActiveSkin(fetchedSkin);
    }
    fetchData();
    gameAreaController.addListener('boardChanged', setBoard);
    return () => {
      gameAreaController.removeListener('boardChanged', setBoard);
    };
  }, [gameAreaController, townController]);
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
                  <Image
                    h='20px'
                    w='10px'
                    // src={cardMap.getCardUrl(cell.card)}
                    src={`/assets/cards/${activeSkin}/aceOfSpades.png`}
                    alt={`Card ${cell.card.face} of ${cell.card.suite}`}
                  />
                ) : cell.player !== undefined ? (
                  <Image src={`/assets/cards/${activeSkin}/cardBack.png`} alt={`Card ${cell}`} />
                ) : (
                  <Image
                    h='20px'
                    w='10px'
                    // src={cardMap.getCardUrl(cell.card)}
                    src={`/assets/cards/${activeSkin}/aceOfSpades.png`}
                    alt={`Card ${cell.card.face} of ${cell.card.suite}`}
                  />
                )
              ) : undefined}
            </StyledPokerSquare>
          );
        });
      })}
    </StyledPokerBoard>
  );
}
