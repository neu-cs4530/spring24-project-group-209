export type TownJoinResponse = {
  /** Unique ID that represents this player * */
  userID: string;
  /** Secret token that this player should use to authenticate
   * in future requests to this service * */
  sessionToken: string;
  /** Secret token that this player should use to authenticate
   * in future requests to the video service * */
  providerVideoToken: string;
  /** List of players currently in this town * */
  currentPlayers: Player[];
  /** Friendly name of this town * */
  friendlyName: string;
  /** Is this a private town? * */
  isPubliclyListed: boolean;
  /** Current state of interactables in this town */
  interactables: TypedInteractable[];
}

export type InteractableType = 'ConversationArea' | 'ViewingArea' | 'TicTacToeArea' | 'ConnectFourArea' | 'PokerArea' | 'BlackjackArea';
export interface Interactable {
  type: InteractableType;
  id: InteractableID;
  occupants: PlayerID[];
}

export type TownSettingsUpdate = {
  friendlyName?: string;
  isPubliclyListed?: boolean;
}

export type Direction = 'front' | 'back' | 'left' | 'right';

export type PlayerID = string;
export interface Player {
  id: PlayerID;
  userName: string;
  location: PlayerLocation;
};

export type XY = { x: number, y: number };

export interface PlayerLocation {
  /* The CENTER x coordinate of this player's location */
  x: number;
  /* The CENTER y coordinate of this player's location */
  y: number;
  /** @enum {string} */
  rotation: Direction;
  moving: boolean;
  interactableID?: string;
};
export type ChatMessage = {
  author: string;
  sid: string;
  body: string;
  dateCreated: Date;
  interactableID?: string;
};

export interface ConversationArea extends Interactable {
  topic?: string;
};
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface ViewingArea extends Interactable {
  video?: string;
  isPlaying: boolean;
  elapsedTimeSec: number;
}

export type GameStatus = 'IN_PROGRESS' | 'WAITING_TO_START' | 'OVER' | 'WAITING_FOR_PLAYERS';
/**
 * Base type for the state of a game
 */
export interface GameState {
  status: GameStatus;
} 

/**
 * Type for the state of a game that can be won
 */
export interface WinnableGameState extends GameState {
  winner?: PlayerID;
}
/**
 * Base type for a move in a game. Implementers should also extend MoveType
 * @see MoveType
 */
export interface GameMove<MoveType> {
  playerID: PlayerID;
  gameID: GameInstanceID;
  move: MoveType;
}

export type TicTacToeGridPosition = 0 | 1 | 2;

/**
 * Type for a move in TicTacToe
 */
export interface TicTacToeMove {
  gamePiece: 'X' | 'O';
  row: TicTacToeGridPosition;
  col: TicTacToeGridPosition;
}

export type PokerAction = 'RAISE' | 'CALL' | 'FOLD';

/**
 * Type for the amount raised in a poker move, or undefined if the
 * action was not a raise
 */
export type RaiseAmount = Integer | undefined;

export type CardSuite = 'DIAMONDS' | 'CLUBS' | 'SPADES' | 'HEARTS';

// Represents the face of a card. Ace is 1, and J, Q and K are 11, 12 and 13 respectively.
export type CardFace = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

// Represents one card in a deck of cards
export interface Card {
  face: CardFace;
  suite: CardSuite;
}

/**
 * Type for a move in Poker
 */
export interface PokerMove {
  moveType: PokerAction;
  raiseAmount: RaiseAmount;
}

/**
 * Interface for the methods needed in an implementation of a deck of cards
 */
export interface DeckOfCards {
  drawCard(): Card;
  shuffle(): void;
  remainingCards(): Integer;
}

/**
 * Type for the state of a poker game
 * The state of the game is represented as a list of moves, the playerIDs of the players in each seat,
 * the starting balances of the players in those seats, and the seat which will be the next small blind.
 * Players will be assigned to the first free seat when joining
 */
export interface PokerGameState extends WinnableGameState {
  // The moves in this game
  moves: ReadOnlyArray<PokerMove>;
  // A map that represents the player at each seat in the table, if there is a player in that seat.
  occupiedSeats: Map<SeatNumber, PlayerID | undefined>;
  // A map representing which players in the game are ready to start.
  readyPlayers: Map<SeatNumber, boolean | undefined>;
  // A map representing the balance of players in each seat.
  playerBalances: Map<SeatNumber, Integer | undefined>;
  // The player who will be the small blind
  smallBlind: SeatNumber;
}

export type BlackjackAction = 'BET' | 'HIT' | 'STAND' | 'DEAL' | 'DOUBLE';

/**
 * Type for the seat position at a blackjack table,
 * used to limit the max number of players.
 */
export type SeatNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Type for the amount bet in a blackjack hand, or undefined if the
 * action was not a bet
 */
export type BetAmount = Integer | undefined;

/**
 * Type for a move in Blackjack
 */
export interface BlackjackMove {
  moveType: BlackjackAction;
  card?: Card;
  player?: SeatNumber;

  // The following need to be added for compatibility since other gamemoves require gamePiece, col, and row, even though these seem uncessecary
  // for poker - future work might involve refactoring design to include card game function

  gamePiece?: undefined;

  col?: undefined;
  row?: undefined;
}

/**
 * Type for the state of a blackjack game
 * The state of the game is represented as a list of moves, the playerIDs of the players in each seat,
 * the starting balances of the players in those seats, and the seat which will be the next small blind.
 * Players will be assigned to the first free seat when joining
 */
export interface BlackjackGameState extends WinnableGameState {
  dealerMoves: ReadOnlyArray<BlackjackMove>;
  // The moves in this game
  moves: ReadOnlyArray<BlackjackMove>;
  // A map that represents the player at each seat in the table, if there is a player in that seat.
  occupiedSeats: Array<PlayerID | undefined>;
  // A map representing which players in the game are ready to start.
  readyPlayers: Array< boolean | undefined>;
  // A map representing the balance of players in each seat.
  playerBalances: Array<number | undefined>;
}


/**
 * Type for the state of a TicTacToe game
 * The state of the game is represented as a list of moves, and the playerIDs of the players (x and o)
 * The first player to join the game is x, the second is o
 */
export interface TicTacToeGameState extends WinnableGameState {
  moves: ReadonlyArray<TicTacToeMove>;
  x?: PlayerID;
  o?: PlayerID;
}

/**
 * Type for the state of a ConnectFour game.
 * The state of the game is represented as a list of moves, and the playerIDs of the players (red and yellow)
 */
export interface ConnectFourGameState extends WinnableGameState {
  // The moves in this game
  moves: ReadonlyArray<ConnectFourMove>;
  // The playerID of the red player, if any
  red?: PlayerID;
  // The playerID of the yellow player, if any
  yellow?: PlayerID;
  // Whether the red player is ready to start the game
  redReady?: boolean;
  // Whether the yellow player is ready to start the game
  yellowReady?: boolean;
  // The color of the player who will make the first move
  firstPlayer: ConnectFourColor;
}

/**
 * Type for a move in ConnectFour
 * Columns are numbered 0-6, with 0 being the leftmost column
 * Rows are numbered 0-5, with 0 being the top row
 */
export interface ConnectFourMove {
  gamePiece: ConnectFourColor;
  col: ConnectFourColIndex;
  row: ConnectFourRowIndex;
}

/**
 * Row indices in ConnectFour start at the top of the board and go down
 */
export type ConnectFourRowIndex = 0 | 1 | 2 | 3 | 4 | 5;
/**
 * Column indices in ConnectFour start at the left of the board and go right
 */
export type ConnectFourColIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ConnectFourColor = 'Red' | 'Yellow';

export type InteractableID = string;
export type GameInstanceID = string;

/**
 * Type for the result of a game
 */
export interface GameResult {
  gameID: GameInstanceID;
  scores: { [playerName: string]: number };
}

/**
 * Base type for an *instance* of a game. An instance of a game
 * consists of the present state of the game (which can change over time),
 * the players in the game, and the result of the game
 * @see GameState
 */
export interface GameInstance<T extends GameState> {
  state: T;
  id: GameInstanceID;
  players: PlayerID[];
  result?: GameResult;
}

/**
 * Base type for an area that can host a game
 * @see GameInstance
 */
export interface GameArea<T extends GameState> extends Interactable {
  game: GameInstance<T> | undefined;
  history: GameResult[];
}

export type CommandID = string;

/**
 * Base type for a command that can be sent to an interactable.
 * This type is used only by the client/server interface, which decorates
 * an @see InteractableCommand with a commandID and interactableID
 */
interface InteractableCommandBase {
  /**
   * A unique ID for this command. This ID is used to match a command against a response
   */
  commandID: CommandID;
  /**
   * The ID of the interactable that this command is being sent to
   */
  interactableID: InteractableID;
  /**
   * The type of this command
   */
  type: string;
}

export type InteractableCommand =  ViewingAreaUpdateCommand | JoinGameCommand | GameMoveCommand<TicTacToeMove> | GameMoveCommand<ConnectFourMove> | GameMoveCommand<BlackjackMove> | StartGameCommand | LeaveGameCommand;
export interface ViewingAreaUpdateCommand  {
  type: 'ViewingAreaUpdate';
  update: ViewingArea;
}
export interface JoinGameCommand {
  type: 'JoinGame';
}
export interface LeaveGameCommand {
  type: 'LeaveGame';
  gameID: GameInstanceID;
}
export interface StartGameCommand {
  type: 'StartGame';
  gameID: GameInstanceID;
}
export interface GameMoveCommand<MoveType> {
  type: 'GameMove';
  gameID: GameInstanceID;
  move: MoveType;
}
export type InteractableCommandReturnType<CommandType extends InteractableCommand> = 
  CommandType extends JoinGameCommand ? { gameID: string}:
  CommandType extends ViewingAreaUpdateCommand ? undefined :
  CommandType extends GameMoveCommand<TicTacToeMove> ? undefined :
  CommandType extends LeaveGameCommand ? undefined :
  never;

export type InteractableCommandResponse<MessageType> = {
  commandID: CommandID;
  interactableID: InteractableID;
  error?: string;
  payload?: InteractableCommandResponseMap[MessageType];
}

export interface ServerToClientEvents {
  playerMoved: (movedPlayer: Player) => void;
  playerDisconnect: (disconnectedPlayer: Player) => void;
  playerJoined: (newPlayer: Player) => void;
  initialize: (initialData: TownJoinResponse) => void;
  townSettingsUpdated: (update: TownSettingsUpdate) => void;
  townClosing: () => void;
  chatMessage: (message: ChatMessage) => void;
  interactableUpdate: (interactable: Interactable) => void;
  commandResponse: (response: InteractableCommandResponse) => void;
}

export interface ClientToServerEvents {
  chatMessage: (message: ChatMessage) => void;
  playerMovement: (movementData: PlayerLocation) => void;
  interactableUpdate: (update: Interactable) => void;
  interactableCommand: (command: InteractableCommand & InteractableCommandBase) => void;
}