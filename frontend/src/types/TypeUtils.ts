import {
  ConversationArea,
  Interactable,
  TicTacToeGameState,
  ViewingArea,
  GameArea,
  ShopArea,
  ConnectFourGameState,
  PokerGameState,
  BlackjackGameState,
} from './CoveyTownSocket';

/**
 * Test to see if an interactable is a conversation area
 */
export function isConversationArea(interactable: Interactable): interactable is ConversationArea {
  return interactable.type === 'ConversationArea';
}

export function isShopArea(interactable: Interactable): interactable is ShopArea {
  return interactable.type === 'ShopArea';
}

/**
 * Test to see if an interactable is a viewing area
 */
export function isViewingArea(interactable: Interactable): interactable is ViewingArea {
  return interactable.type === 'ViewingArea';
}

export function isTicTacToeArea(
  interactable: Interactable,
): interactable is GameArea<TicTacToeGameState> {
  return interactable.type === 'TicTacToeArea';
}
export function isConnectFourArea(
  interactable: Interactable,
): interactable is GameArea<ConnectFourGameState> {
  return interactable.type === 'ConnectFourArea';
}

export function isBlackJackArea(
  interactable: Interactable,
): interactable is GameArea<BlackjackGameState> {
  return interactable.type === 'BlackjackArea';
}

export function isPokerArea(interactable: Interactable): interactable is GameArea<PokerGameState> {
  return interactable.type === 'PokerArea';
}
