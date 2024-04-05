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
    flexDirection: 'row',
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
    // <StyledPokerBoard aria-label='Poker Board'>
    //   {board.map((row, rowIndex) => {
    //     return (
    //       <Box
    //         alignSelf={rowIndex === 8 ? 'flex-start' : 'auto'}
    //         padding='5px'
    //         key={`row-${rowIndex}`}
    //         display='flex'
    //         flexDirection='row'>
    //         {gameAreaController.status === 'IN_PROGRESS' && rowIndex === 8 && (
    //           <Text alignSelf={rowIndex === 8 ? 'flex-start' : 'auto'} fontSize='md'>
    //             Community Cards:{' '}
    //           </Text>
    //         )}
    //         {row.map((cell, colIndex) => {
    //           return (
    //             <StyledPokerSquare
    //               key={`${rowIndex}.${colIndex}`}
    //               aria-label={`Cell ${rowIndex},${colIndex} (${cell ? 'Filled' : 'Empty'})`}>
    //               {cell ? (
    //                 cell.player === gameAreaController.playerSeat(townController.ourPlayer) ||
    //                 !gameAreaController.isPlayer ? (
    //                   <Image
    //                     h='50px'
    //                     w='25px'
    //                     // Uncomment and use the correct path or function to get the card URL
    //                     // src={cardMap.getCardUrl(cell.card)}
    //                     src={`/assets/cards/${activeSkin}/aceOfSpades.png`}
    //                   />
    //                 ) : cell.player !== undefined ? (
    //                   <Image h='50px' w='25px' src={`/assets/cards/${activeSkin}/backOfCard.png`} />
    //                 ) : (
    //                   <Image
    //                     h='50px'
    //                     w='25px'
    //                     // Uncomment and use the correct path or function to get the card URL
    //                     // src={cardMap.getCardUrl(cell.card)}
    //                     src={`/assets/cards/${activeSkin}/aceOfSpades.png`}
    //                   />
    //                 )
    //               ) : (
    //                 'Empty'
    //               )}
    //             </StyledPokerSquare>
    //           );
    //         })}
    //       </Box>
    //     );
    //   })}
    // </StyledPokerBoard>
    <StyledPokerBoard aria-label='Poker Board'>
      <Box
        alignSelf='flex-start'
        width='100%'
        display={board.length > 8 && board[8].length > 0 ? 'flex' : 'none'} // Display only if rowIndex === 8 has cards
        flexDirection='row'
        padding='5px'>
        <Text fontSize='md'>Community Cards: </Text>
        <Box display='flex' flexDirection='row' justifyContent='space-around'>
          {/* Render community cards here */}
          {board.length > 8 &&
            board[8].map((cell, colIndex) => (
              <StyledPokerSquare
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
              </StyledPokerSquare>
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
            <Box display='flex' flexDirection='row'>
              {gameAreaController.status === 'IN_PROGRESS' && rowIndex === 8 && (
                <Text fontSize='md'>Community Cards: </Text>
              )}
              {row.map((cell, colIndex) => {
                return (
                  <StyledPokerSquare
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
                  </StyledPokerSquare>
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
                  {/* Adjust this to show player name or ID based on your data structure */}
                  {gameAreaController.occupiedSeats[rowIndex]
                    ? gameAreaController.occupiedSeats[rowIndex].userName
                    : ''}
                </Text>
              </Box>
            )}
          </Box>
        );
      })}
    </StyledPokerBoard>
  );
}
