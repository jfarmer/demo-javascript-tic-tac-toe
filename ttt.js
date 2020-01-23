let readlineSync = require('readline-sync');

/**
 * Helper function to prompt a user for a response and return their
 * response.
 *
 */
function prompt(text) {
  let response = readlineSync.question(text + ' ');

  return response;
}

/**
 * Create and return a new, empty TTT board.
 *
 */
function boardCreate() {
  let board = [
    [' ', ' ', ' '],
    [' ', ' ', ' '],
    [' ', ' ', ' '],
  ];

  return board;
}

/**
 * Given a list of players, create and return a new game.
 *
 * A game contains:
 *
 * - A list of players
 * - A TTT board
 * - The turn number
 * - The winner (if they exist)
 *
 */
function gameCreate(players) {
  let game = {
    players: players,
    board: boardCreate(),
    turn: 0,
    winner: undefined,
  };

  return game;
}

/**
 * Given a game, return the current player based on the turn number.
 */
function gameCurrentPlayer(game) {
  /*
    Here's how this works:

    turn     | 0 1 2 3 4 5 6 7 8 9 ... |
    turn % 2 | 0 1 0 1 0 1 0 1 0 1 ... |
  */
  return game.players[game.turn % 2];
}

/**
 * Given a board with some X's and O's, print it out.
 */
function printBoard(board) {
  console.log('---+---+---');

  for (let row of board) {
    console.log('   |   |   ');
    console.log(` ${row.join(' | ')} `);
    console.log('   |   |   ');
    console.log('---+---+---');
  }
}

/**
 * Create and return a new player object.
 *
 * A player contains:
 * - A name
 * - A symbol (X or O)
 *
 */
function playerCreate(name, symbol, isComputer) {
  let playerData = {
    name: name,
    symbol: symbol,
    isComputer: isComputer,
  };

  return playerData;
}

/**
 * Given a cell number 1-9, return the corresponding board row.
 */
function getRow(position) {
  return Math.floor((position - 1) / 3);
}

/**
 * Given a cell number 1-9, return the corresponding board column.
 */
function getCol(position) {
  return (position + 2) % 3;
}

/**
 * Given a player and a board, prompt the player to make a move. Loop until they
 * make a valid move.
 */
function playerGetMove(player, board) {
  let position;
  let isValidPosition = false;

  console.log(`Your turn, ${player.name}! You're ${player.symbol}`);

  while (!isValidPosition) {
    let response = prompt('Where would you like to play? [1-9]');
    position = Number(response);

    isValidPosition = boardIsValidPosition(board, position);

    if (!isValidPosition) {
      console.log('Invalid move.');
    }
  }

  return position;
}

/**
 * Given a board and a move, return true if the move is valid and false otherwise.
 *
 * A move is invalid if:
 *
 * 1. The user enters something other than an integer
 * 2. The user enters a number smaller than 1 or larger than 9
 * 3. The board is already filled in the given position
 *
 */
function boardIsValidPosition(board, move) {
  if (!Number.isInteger(move) || move < 1 || move > 9) {
    return false;
  }

  let row = getRow(move);
  let col = getCol(move);

  if (board[row][col] !== ' ') {
    return false;
  }

  return true;
}

/**
 * Given a game, player, and position, set the board at the appropriate position
 * to the player's symbol.
 *
 * Check if the move results in a win and, if so, set the winner.
 */
function gameMakeMove(game, player, move) {
  let row = getRow(move);
  let col = getCol(move);

  game.board[row][col] = player.symbol;
  game.turn += 1;

  gameFindWinnerAfterMove(game, player, move);

  return game;
}

/**
 * Returns true if the game is finished and false otherwise.
 *
 * A game is finished if there's a winner or the game is a draw.
 */
function gameIsDone(game) {
  return gameHasWinner(game) || gameIsDraw(game);
}

/**
 * Returns true if the game has a winner.
 *
 * Call gameFindWinnerAfterMove before this.
 */
function gameHasWinner(game) {
  return game.winner !== undefined;
}

/**
 * Returns true if the game is a draw, i.e., if there's no winner and
 * there are no more turns.
 */
function gameIsDraw(game) {
  return game.winner === undefined && game.turn === 9;
}

/**
 * After a player makes a move, determine if they've won the game.
 *
 * If they have, set the game winner to that player.
 */
function gameFindWinnerAfterMove(game, player, move) {
  if (boardHasWinnerAfterMove(game.board, player, move)) {
    game.winner = player;
  }

  return game;
}

/**
 * After we place something on the board,
 */
function boardHasWinnerAfterMove(board, player, move) {
  let row = getRow(move);
  let col = getCol(move);

  return boardHasWinnerInRow(board, player, row) ||
    boardHasWinnerInColumn(board, player, col) ||
    boardHasWinnerInMainDiagonal(board, player) ||
    boardHasWinnerInOffDiagonal(board, player);
}

/**
 * Returns true if player has winning move on the off diagonal.
 */
function boardHasWinnerInOffDiagonal(board, player) {
  let symbol = player.symbol;

  for (let i = 0; i < 3; i += 1) {
    if (board[i][2 - i] !== symbol) {
      return false;
    }
  }

  return true;
}

/**
 * Returns true if player has winning move on the main diagonal.
 */
function boardHasWinnerInMainDiagonal(board, player) {
  let symbol = player.symbol;

  for (let i = 0; i < 3; i += 1) {
    if (board[i][i] !== symbol) {
      return false;
    }
  }

  return true;
}

/**
 * Given a column, returns true if the player has won in
 * that column.
 */
function boardHasWinnerInColumn(board, player, col) {
  let symbol = player.symbol;

  for (let i = 0; i < 3; i += 1) {
    if (board[i][col] !== symbol) {
      return false;
    }
  }

  return true;
}

/**
 * Given a row, returns true if the player has won in
 * that row.
 */
function boardHasWinnerInRow(board, player, row) {
  let symbol = player.symbol;

  for (let j = 0; j < 3; j += 1) {
    if (board[row][j] !== symbol) {
      return false;
    }
  }

  return true;
}

let players = [
  playerCreate('Jesse', 'X'),
  playerCreate('Mysterio', 'O'),
];

let game = gameCreate(players);

// Until game is done (win or draw), prompt the player
// for input and update the game accordingly.
while (!gameIsDone(game)) {
  let currentPlayer = gameCurrentPlayer(game);

  console.clear();
  printBoard(game.board);

  let move = playerGetMove(currentPlayer, game.board);

  gameMakeMove(game, currentPlayer, move);
};

// The game is done. Either someone won or it's a draw.
// Clear + print the final board.
console.clear();
printBoard(game.board);

let playSound = require('play-sound')();

if (gameHasWinner(game)) {
  let winner = game.winner;

  console.log(`Congraulations, ${winner.name}!`);

  playSound.play('./sounds/fanfare.mp3');
} else if (gameIsDraw(game)) {
  console.log('It\'s a draw! :(');

  playSound.play('./sounds/sad-trombone.mp3');
} else {
  console.clear();
  console.log('Uhhh....something went really wrong.');
}
