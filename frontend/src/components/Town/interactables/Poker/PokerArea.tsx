import {
  Button,
  List,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import PokerAreaController from '../../../../classes/interactable/PokerAreaController';
import PlayerController from '../../../../classes/PlayerController';
import { useInteractableAreaController } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import { GameStatus, InteractableID, SeatNumber } from '../../../../types/CoveyTownSocket';
import PokerBoard from './PokerBoard';

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
  const gameAreaController = useInteractableAreaController<PokerAreaController>(interactableID);
  const townController = useTownController();

  const [seats, setSeats] = useState<Array<PlayerController>>(gameAreaController.occupiedSeats);
  const [joiningGame, setJoiningGame] = useState(false);

  const [gameStatus, setGameStatus] = useState<GameStatus>(gameAreaController.status);
  const [moveCount, setMoveCount] = useState<number>(gameAreaController.moveCount);
  const [raiseValue, setRaiseValue] = useState<number>(0);
  const [activePlayers, setActivePlayers] = useState<number>(0);
  const toast = useToast();
  useEffect(() => {
    const updateGameState = () => {
      setSeats(gameAreaController.occupiedSeats);
      setGameStatus(gameAreaController.status || 'WAITING_TO_START');
      setMoveCount(gameAreaController.moveCount || 0);
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
    };
    gameAreaController.addListener('gameUpdated', updateGameState);
    gameAreaController.addListener('gameEnd', onGameEnd);
    return () => {
      gameAreaController.removeListener('gameUpdated', updateGameState);
      gameAreaController.removeListener('gameEnd', onGameEnd);
    };
  }, [townController, gameAreaController, toast]);
  let gameStatusText = <></>;
  if (gameStatus == 'IN_PROGRESS' && gameAreaController.whoseTurn === townController.ourPlayer) {
    const raiseInput = (
      <NumberInput
        defaultValue={5}
        min={1}
        onChange={valueString => setRaiseValue(parseInt(valueString))}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    );
    const raiseButton = (
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
              title: 'Error raising, insufficient funds!',
              description: (err as Error).toString(),
              status: 'error',
            });
          }
          setJoiningGame(false);
        }}>
        Raise
      </Button>
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
            setActivePlayers(activePlayers - 1);
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
        Game in progress, {moveCount} moves in, currently your turn. Players left: {activePlayers}{' '}
        Pot: {gameAreaController.pot} {raiseButton}
        {raiseInput} {callButton} {foldButton}
      </>
    );
  } else if (
    gameStatus == 'IN_PROGRESS' &&
    gameAreaController.whoseTurn !== townController.ourPlayer
  ) {
    const raiseButton = <Button disabled={true}>Raise</Button>;
    const callButton = <Button disabled={true}>Call</Button>;
    const foldButton = <Button disabled={true}>Fold</Button>;
    gameStatusText = (
      <>
        Game in progress, {moveCount} moves in, currently {gameAreaController.whoseTurn + "'s"} turn
        . Players left: {activePlayers} Pot: {gameAreaController.pot} {raiseButton} {callButton}
        {foldButton}
      </>
    );
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
    if (gameAreaController.players.length >= 2) {
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
        Game {gameStatusStr}. {joinGameButton} {startGameButton}
      </b>
    );
  }
  return (
    <>
      {gameStatusText}
      <List aria-label='list of players in the game'>
        {Array.from(seats.entries()).map(([seatNumber, player]) => (
          <ListItem key={seatNumber}>
            Seat {seatNumber} : {player?.userName || '(No player yet!)'}
          </ListItem>
        ))}
      </List>
      <PokerBoard gameAreaController={gameAreaController} />
    </>
  );
}
