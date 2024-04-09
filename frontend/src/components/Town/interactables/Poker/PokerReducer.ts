export type GameState = {
  gameStatus: 'WAITING_TO_START' | 'IN_PROGRESS' | 'OVER' | 'WAITING_FOR_PLAYERS';
  raiseValue: number;
  activePlayers: number;
  playerBalance: number;
  dbBalance: number;
};

export type GameAction =
  | { type: 'SET_GAME_STATUS'; payload: GameState['gameStatus'] }
  | { type: 'SET_RAISE_VALUE'; payload: number }
  | { type: 'SET_ACTIVE_PLAYERS'; payload: number }
  | { type: 'SET_PLAYER_BALANCE'; payload: number }
  | { type: 'SET_DB_BALANCE'; payload: number };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_GAME_STATUS':
      return { ...state, gameStatus: action.payload };
    case 'SET_RAISE_VALUE':
      return { ...state, raiseValue: action.payload };
    case 'SET_ACTIVE_PLAYERS':
      return { ...state, activePlayers: action.payload };
    case 'SET_PLAYER_BALANCE':
      return { ...state, playerBalance: action.payload };
    case 'SET_DB_BALANCE':
      return { ...state, dbBalance: action.payload };
    default:
      throw new Error(`Unhandled action type: ${(action as GameAction).type}`);
  }
}
