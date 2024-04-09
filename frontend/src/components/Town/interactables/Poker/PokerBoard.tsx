import PokerAreaController, {
  PokerCell,
} from '../../../../classes/interactable/PokerAreaController';
import { Box, chakra, Container, Text } from '@chakra-ui/react';
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
    width: '100%',
    height: '400px',
    padding: '5px',
    flexWrap: 'nowrap',
    bgImage: '/assets/cardTables/pokerFelt.jpg',
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
});
const StyledPokerSquare = chakra(Box, {
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

export default function PokerBoard({ gameAreaController }: PokerGameProps): JSX.Element {
  const [board, setBoard] = useState<PokerCell[][]>(gameAreaController.board);
  const townController = useTownController();
  const [activeSkin, setActiveSkin] = useState<string>('SKIN1');
  const [cardMap, setCardMap] = useState<CardToImage | undefined>(undefined);
  const [playerBalances, setPlayerBalances] = useState<Array<number>>([]);

  useEffect(() => {
    async function fetchSkinData() {
      const fetchedSkin = await firebaseUtils.getActiveSkin(townController.ourPlayer.userName);
      setActiveSkin(fetchedSkin);
    }

    fetchSkinData();
  }, [townController]);

  useEffect(() => {
    setCardMap(new CardToImage(activeSkin));
  }, [activeSkin]);

  useEffect(() => {
    const updateBalances = () => {
      setPlayerBalances(gameAreaController.balances);
    };
    gameAreaController.addListener('gameUpdated', updateBalances);
    gameAreaController.addListener('boardChanged', setBoard);
    return () => {
      gameAreaController.addListener('gameUpdated', updateBalances);
      gameAreaController.removeListener('boardChanged', setBoard);
    };
  }, [gameAreaController, townController]);

  return (
    <StyledPokerBoard aria-label='Poker Board'>
      <Box
        marginBottom={'auto'}
        alignSelf='flex-start'
        width='100%'
        display={board.length > 8 && board[8].length > 0 ? 'flex' : 'none'} // Display only if rowIndex === 8 has cards
        flexDirection='row'
        padding='5px'>
        <Text
          padding={'4px'}
          margin={'2px'}
          alignSelf={'center'}
          fontSize='md'
          background={'white'}
          border='1px solid black'
          borderRadius='5px'>
          Community Cards:
        </Text>
        <Box display='flex' flexDirection='row' justifyContent='space-around'>
          {/* Render community cards here */}
          {board.length > 8 &&
            board[8].map((cell, colIndex) => (
              <StyledPokerSquare
                key={`8.${colIndex}`}
                aria-label={`Cell 8,${colIndex} (${cell ? 'Filled' : 'Empty'})`}>
                {cell ? <Image h='56px' w='33px' src={cardMap?.getCardUrl(cell.card)} /> : 'Empty'}
              </StyledPokerSquare>
            ))}
        </Box>
      </Box>
      <Box
        width={'100%'}
        flexDirection='row'
        display='flex'
        alignItems='flex-end'
        alignSelf='flex-start'
        marginTop={'auto'}
        justifyContent='space-around'>
        {board.map((row, rowIndex) => {
          if (rowIndex === 8) return null; // Skip rowIndex === 8 since it's handled separately as the tables cards
          return (
            <Box
              // alignSelf={rowIndex === 8 ? 'flex-start' : 'auto'}
              padding='5px'
              key={`row-${rowIndex}`}
              display='flex'
              flexDirection='column'>
              <Box display='flex' flexDirection='row'>
                {row.map((cell, colIndex) => {
                  return (
                    <StyledPokerSquare
                      key={`${rowIndex}.${colIndex}`}
                      aria-label={`Cell ${rowIndex},${colIndex} (${cell ? 'Filled' : 'Empty'})`}>
                      {cell ? (
                        cell.player === gameAreaController.playerSeat(townController.ourPlayer) ||
                        !gameAreaController.isPlayer ||
                        gameAreaController.status == 'OVER' ? (
                          <Image h='56px' w='33px' src={cardMap?.getCardUrl(cell.card)} />
                        ) : (
                          <Image
                            h='56px'
                            w='33px'
                            src={`/assets/cards/${activeSkin}/backOfCard.png`}
                          />
                        )
                      ) : (
                        'Empty'
                      )}
                    </StyledPokerSquare>
                  );
                })}
              </Box>
              {row.some(cell => cell && cell.player !== undefined) && (
                <Box display='flex' flexDirection='column' justifyContent='center' paddingTop='5px'>
                  <Text
                    key={`${rowIndex}-name`}
                    display={gameAreaController.occupiedSeats[rowIndex] ? 'block' : 'none'}
                    padding={'1px'}
                    fontSize='sm'
                    width='50px'
                    textAlign='center'
                    whiteSpace='nowrap'
                    overflow='hidden'
                    textOverflow='ellipsis'
                    background={
                      gameAreaController.playerSeat(gameAreaController.winner) === rowIndex
                        ? 'green'
                        : gameAreaController.foldedPlayers[rowIndex]
                        ? 'red'
                        : 'white'
                    }
                    border='1px solid black'
                    borderRadius='5px'
                    title={
                      gameAreaController.occupiedSeats[rowIndex]
                        ? gameAreaController.occupiedSeats[rowIndex].userName
                        : ''
                    }>
                    {gameAreaController.occupiedSeats[rowIndex]
                      ? gameAreaController.occupiedSeats[rowIndex].userName
                      : ''}
                  </Text>
                  <Text
                    key={`${rowIndex}-balance`}
                    display={gameAreaController.occupiedSeats[rowIndex] ? 'block' : 'none'}
                    padding={'1px'}
                    fontSize='sm'
                    width='50px'
                    textAlign='center'
                    background='white'
                    border='1px solid black'
                    borderRadius='5px'>
                    ${playerBalances[rowIndex]}
                  </Text>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </StyledPokerBoard>
  );
}
