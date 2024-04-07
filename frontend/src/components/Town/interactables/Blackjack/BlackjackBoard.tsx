import BlackjackAreaController, {
  BlackjackCell,
} from '../../../../classes/interactable/BlackjackAreaController';
import { Box, Button, chakra, Container, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useTownController from '../../../../hooks/useTownController';
import CardToImage from '../Poker/CardToImages';
import * as firebaseUtils from '../../../../firebaseUtils';
import { Image, Text } from '@chakra-ui/react';

export type BlackjackGameProps = {
  gameAreaController: BlackjackAreaController;
};
const StyledBlackjackBoard = chakra(Container, {
  baseStyle: {
    display: 'flex',
    width: '100%',
    height: '400px',
    padding: '5px',
    flexWrap: 'nowrap',
    bgImage: '/assets/cardTables/blackjackFelt.jpg',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
const StyledBlackjackSquare = chakra(Box, {
  baseStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1px',
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
  const [activeSkin, setActiveSkin] = useState<string>('SKIN1');
  const townController = useTownController();
  const toast = useToast();
  const cardMap: CardToImage = new CardToImage('SKIN1');

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
    <StyledBlackjackBoard aria-label='Poker Board'>
      <Box
        alignSelf='flex-start'
        width='100%'
        display={board.length > 8 && board[8].length > 0 ? 'flex' : 'none'} // Display only if rowIndex === 8 has cards
        flexDirection='row'
        padding='5px'>
        <Text fontSize='md'>Dealers Cards: </Text>
        <Box display='flex' flexDirection='row' justifyContent='space-around'>
          {/* Render community cards here */}
          {board.length > 8 &&
            board[8].map((cell, colIndex) => (
              <StyledBlackjackSquare
                key={`8.${colIndex}`}
                aria-label={`Cell 8,${colIndex} (${cell ? 'Filled' : 'Empty'})`}>
                {cell ? (
                  <Image
                    h='50px'
                    w='25px'
                    src={`/assets/cards/${activeSkin}/aceOfSpades.png`} // Adjust according to your logic
                  />
                ) : (
                  'Empty'
                )}
              </StyledBlackjackSquare>
            ))}
        </Box>
      </Box>
      {board.map((row, rowIndex) => {
        if (rowIndex === 8) return null; // Skip rowIndex === 8 since it's handled separately as the tables cards
        return (
          <Box
            // alignSelf={rowIndex === 8 ? 'flex-start' : 'auto'}
            padding='5px'
            key={`row-${rowIndex}`}
            display='flex'
            flexDirection='column'>
            <Box display='flex' flexDirection='column'>
              {row.map((cell, colIndex) => {
                return (
                  <StyledBlackjackSquare
                    key={`${rowIndex}.${colIndex}`}
                    aria-label={`Cell ${rowIndex},${colIndex} (${cell ? 'Filled' : 'Empty'})`}>
                    {cell ? (
                      cell.player === gameAreaController.playerSeat(townController.ourPlayer) ||
                      !gameAreaController.isPlayer ? (
                        <Image
                          h='50px'
                          w='25px'
                          src={`/assets/cards/${activeSkin}/aceOfSpades.png`}
                        />
                      ) : cell.player !== undefined ? (
                        <Image
                          h='50px'
                          w='25px'
                          src={`/assets/cards/${activeSkin}/backOfCard.png`}
                        />
                      ) : (
                        <Image
                          h='50px'
                          w='25px'
                          src={`/assets/cards/${activeSkin}/aceOfSpades.png`}
                        />
                      )
                    ) : (
                      'Empty'
                    )}
                  </StyledBlackjackSquare>
                );
              })}
            </Box>
            {row.some(cell => cell && cell.player !== undefined) && (
              <Box display='flex' flexDirection='row' justifyContent='center' paddingTop='5px'>
                <Text
                  key={`${rowIndex}-name`}
                  fontSize='sm'
                  width='50px'
                  textAlign='center'
                  whiteSpace='nowrap'
                  overflow='hidden'
                  textOverflow='ellipsis'
                  title={
                    gameAreaController.occupiedSeats[rowIndex]
                      ? gameAreaController.occupiedSeats[rowIndex].userName
                      : ''
                  }>
                  {gameAreaController.occupiedSeats[rowIndex]
                    ? gameAreaController.occupiedSeats[rowIndex].userName
                    : ''}
                </Text>
              </Box>
            )}
          </Box>
        );
      })}
    </StyledBlackjackBoard>
  );
}
