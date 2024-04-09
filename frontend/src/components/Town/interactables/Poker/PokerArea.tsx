import {
  Box,
  Button,
  Flex,
  List,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useReducer, useState } from 'react';
import PokerAreaController from '../../../../classes/interactable/PokerAreaController';
import { useInteractableAreaController } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import { GameStatus, InteractableID } from '../../../../types/CoveyTownSocket';
import PokerBoard from './PokerBoard';
import * as firebaseUtils from '../../../../firebaseUtils';
import { DEFAULT_BUY_IN } from './PokerGameDefaults';
import { gameReducer } from './PokerReducer';

/**
 * The PokerArea component renders the Poker game area.
 * It renders the current state of the area, optionally allowing the player to join the game.
 *
 * It uses Chakra-UI components (does not use other GUI widgets)
 *
 * It uses the PokerAreaController to get the current state of the game.
 * It listens for the 'gameUpdated' and 'gameEnd' events on the controller, and re-renders accordingly.
 * It subscribes to these events when the component mounts, and unsubscribes when the component unmounts. It also unsubscribes when the gameAreaController changes.
 *
 * It renders the following:
 * - A list of players' usernames (in a list with the aria-label 'list of players in the game', one item for red and one for yellow)
 *    - If there is no player in the game, the username is '(No player yet!)'
 *    - List the players as (exactly) `Red: ${username}` and `Yellow: ${username}`
 * - A message indicating the current game status:
 *    - If the game is in progress, the message is 'Game in progress, {moveCount} moves in, currently {whoseTurn}'s turn'. If it is currently our player's turn, the message is 'Game in progress, {moveCount} moves in, currently your turn'
 *    - If the game is in status WAITING_FOR_PLAYERS, the message is 'Waiting for players to join'
 *    - If the game is in status WAITING_TO_START, the message is 'Waiting for players to press start'
 *    - If the game is in status OVER, the message is 'Game over'
 * - If the game is in status WAITING_FOR_PLAYERS or OVER, a button to join the game is displayed, with the text 'Join New Game'
 *    - Clicking the button calls the joinGame method on the gameAreaController
 *    - Before calling joinGame method, the button is disabled and has the property isLoading set to true, and is re-enabled when the method call completes
 *    - If the method call fails, a toast is displayed with the error message as the description of the toast (and status 'error')
 *    - Once the player joins the game, the button dissapears
 * - If the game is in status WAITING_TO_START, a button to start the game is displayed, with the text 'Start Game'
 *    - Clicking the button calls the startGame method on the gameAreaController
 *    - Before calling startGame method, the button is disabled and has the property isLoading set to true, and is re-enabled when the method call completes
 *    - If the method call fails, a toast is displayed with the error message as the description of the toast (and status 'error')
 *    - Once the game starts, the button dissapears
 * - The PokerBoard component, which is passed the current gameAreaController as a prop (@see PokerBoard.tsx)
 *
 * - When the game ends, a toast is displayed with the result of the game:
 *    - Tie: description 'Game ended in a tie'
 *    - Our player won: description 'You won!'
 *    - Our player lost: description 'You lost :('
 *
 */

export default function PokerArea({
  interactableID,
}: {
  interactableID: InteractableID;
}): JSX.Element {
  const initialState = {
    gameStatus: 'WAITING_FOR_PLAYERS' as GameStatus,
    raiseValue: 0,
    activePlayers: 0,
    playerBalance: 0,
    dbBalance: 0,
    joiningGame: false,
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { gameStatus, raiseValue, activePlayers, playerBalance, dbBalance } = state;
  const gameAreaController = useInteractableAreaController<PokerAreaController>(interactableID);
  const townController = useTownController();

  const [joiningGame, setJoiningGame] = useState(false);

  const toast = useToast();
  useEffect(() => {
    const updateGameState = () => {
      dispatch({
        type: 'SET_GAME_STATUS',
        payload: gameAreaController.status || 'WAITING_TO_START',
      });
      dispatch({ type: 'SET_ACTIVE_PLAYERS', payload: gameAreaController.numActivePlayers });
      dispatch({
        type: 'SET_PLAYER_BALANCE',
        payload:
          gameAreaController.balances[gameAreaController.playerSeat(townController.ourPlayer) || 0],
      });
    };
    const onGameEnd = () => {
      const winner = gameAreaController.winner;
      if (winner === townController.ourPlayer) {
        toast({
          title: 'Game over',
          description: 'You won!',
          status: 'success',
        });
      } else {
        toast({
          title: 'Game over',
          description: `You lost :(`,
          status: 'error',
        });
      }
      firebaseUtils.updateCurrencyIncrement(
        townController.ourPlayer.userName,
        gameAreaController.balances[gameAreaController.playerSeat(townController.ourPlayer) || 0],
      );
    };
    gameAreaController.addListener('gameUpdated', updateGameState);
    gameAreaController.addListener('gameEnd', onGameEnd);
    return () => {
      gameAreaController.removeListener('gameUpdated', updateGameState);
      gameAreaController.removeListener('gameEnd', onGameEnd);
    };
  }, [townController, gameAreaController, toast]);

  useEffect(() => {
    async function fetchData() {
      const balance = await firebaseUtils.getCurrency(townController.ourPlayer.userName);
      dispatch({ type: 'SET_DB_BALANCE', payload: balance });
    }
    fetchData();
  });

  let gameStatusText = <></>;
  if (gameStatus == 'IN_PROGRESS') {
    const raiseInput = (
      <NumberInput
        paddingLeft={1}
        width={100}
        defaultValue={5}
        min={1}
        onChange={valueString =>
          dispatch({ type: 'SET_RAISE_VALUE', payload: parseInt(valueString) })
        }>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    );
    const raiseButton = (
      <Flex paddingLeft='0' paddingTop='1' paddingRight='1' paddingBottom='1'>
        <Button
          onClick={async () => {
            setJoiningGame(true);
            try {
              await gameAreaController.makeMove({
                moveType: 'RAISE',
                raiseAmount: raiseValue,
              });
            } catch (err) {
              toast({
                title: 'Error raising',
                description: (err as Error).toString(),
                status: 'error',
              });
            }
            setJoiningGame(false);
          }}>
          Raise
        </Button>

        {raiseInput}
      </Flex>
    );
    const callButton = (
      <Button
        onClick={async () => {
          setJoiningGame(true);
          try {
            await gameAreaController.makeMove({
              moveType: 'CALL',
              raiseAmount: undefined,
            });
          } catch (err) {
            toast({
              title: 'Error calling',
              description: (err as Error).toString(),
              status: 'error',
            });
          }
          setJoiningGame(false);
        }}>
        Call
      </Button>
    );
    const foldButton = (
      <Button
        onClick={async () => {
          setJoiningGame(true);
          try {
            await gameAreaController.makeMove({
              moveType: 'FOLD',
              raiseAmount: undefined,
            });
            dispatch({ type: 'SET_ACTIVE_PLAYERS', payload: gameAreaController.numActivePlayers });
          } catch (err) {
            toast({
              title: 'Error folding',
              description: (err as Error).toString(),
              status: 'error',
            });
          }
          setJoiningGame(false);
        }}>
        Fold
      </Button>
    );
    gameStatusText = (
      <>
        Balance: ${playerBalance} <br />
        Game in progress, Players left: {activePlayers} Pot: {gameAreaController.pot} <hr />
        {raiseButton}
        {callButton} {foldButton}
      </>
    );
    // } else if (
    //   gameStatus == 'IN_PROGRESS' &&
    //   gameAreaController.whoseTurn !== townController.ourPlayer
    // ) {
    //   const turnName = gameAreaController.whoseTurn?.userName;
    //   const raiseButton = <Button disabled={true}>Raise</Button>;
    //   const callButton = <Button disabled={true}>Call</Button>;
    //   const foldButton = <Button disabled={true}>Fold</Button>;
    //   gameStatusText = (
    //     <>
    //       Game in progress, {moveCount - activePlayers * 2} moves in, currently {turnName + "'s"} turn
    //       . Players left: {activePlayers} Pot: {gameAreaController.pot} <hr />
    //       {raiseButton} {callButton}
    //       {foldButton}
    //     </>
    //   );
  } else if (gameStatus == 'WAITING_TO_START') {
    const startGameButton = (
      <Button
        onClick={async () => {
          setJoiningGame(true);
          try {
            await gameAreaController.startGame();
          } catch (err) {
            toast({
              title: 'Error starting game',
              description: (err as Error).toString(),
              status: 'error',
            });
          }
          setJoiningGame(false);
        }}
        isLoading={joiningGame}
        disabled={joiningGame}>
        Start Game
      </Button>
    );
    gameStatusText = <b>Waiting for players to press start. {startGameButton}</b>;
  } else {
    let startGameButton = <Button disabled={true}>Start Game</Button>;
    if (gameAreaController.players.length >= 2 && gameAreaController.isPlayer) {
      startGameButton = (
        <Button
          onClick={async () => {
            setJoiningGame(true);
            try {
              await gameAreaController.startGame();
            } catch (err) {
              toast({
                title: 'Error starting game',
                description: (err as Error).toString(),
                status: 'error',
              });
            }
            firebaseUtils.updateCurrencyIncrement(
              townController.ourPlayer.userName,
              -DEFAULT_BUY_IN,
            );
            setJoiningGame(false);
          }}
          isLoading={joiningGame}
          disabled={joiningGame}>
          Start Game
        </Button>
      );
    }
    let joinGameButton = (
      <Button
        onClick={async () => {
          setJoiningGame(true);
          if (dbBalance < DEFAULT_BUY_IN) {
            toast({
              title: 'Error joining game',
              description: 'You do not have enough currency to join this game',
              status: 'error',
            });
            setJoiningGame(false);
            return;
          }
          try {
            await gameAreaController.joinGame();
          } catch (err) {
            toast({
              title: 'Error joining game',
              description: (err as Error).toString(),
              status: 'error',
            });
          }
          setJoiningGame(false);
        }}
        isLoading={joiningGame}
        disabled={joiningGame}>
        Join New Game
      </Button>
    );
    if (gameAreaController.isPlayer) {
      joinGameButton = <Button disabled={true}>Join New Game</Button>;
    }
    let gameStatusStr;
    if (gameStatus === 'OVER') gameStatusStr = 'over';
    else if (gameStatus === 'WAITING_FOR_PLAYERS') gameStatusStr = 'waiting for players to join';
    gameStatusText = (
      <b>
        Game {gameStatusStr}. <br /> Poker Guide: https://en.wikipedia.org/wiki/Texas_hold_%27em{' '}
        {joinGameButton} {startGameButton}
      </b>
    );
  }
  return (
    <Box width='600px'>
      {gameStatusText}
      {gameAreaController.status !== 'IN_PROGRESS' && (
        <List aria-label='list of players in the game'>
          {gameAreaController.occupiedSeats.map((player, seatNumber) => (
            <ListItem key={seatNumber}>
              Seat {seatNumber + 1} : {player?.userName || '(No player yet!)'}
            </ListItem>
          ))}
        </List>
      )}
      <PokerBoard gameAreaController={gameAreaController} />
    </Box>
  );
}
