const ROWS = 6;
const COLUMNS = 7;
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetButton = document.getElementById("resetButton");
const winnerMessage = document.getElementById("winnerMessage");

let board = [];
let currentPlayer = "red";
let gameOver = false;

function startGame() {
  board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
  currentPlayer = "red";
  gameOver = false;
  statusElement.textContent = "Red's turn";
  winnerMessage.hidden = true;
  winnerMessage.className = "winner-message";
  drawBoard();
}

function drawBoard() {
  boardElement.innerHTML = "";

  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.type = "button";
      cell.setAttribute("aria-label", `Row ${row + 1}, column ${column + 1}`);

      if (board[row][column]) {
        cell.classList.add(board[row][column]);
        cell.disabled = true;
      } else if (gameOver) {
        cell.disabled = true;
      } else {
        cell.addEventListener("click", () => playColumn(column));
      }

      boardElement.appendChild(cell);
    }
  }
}

function playColumn(column) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][column]) {
      board[row][column] = currentPlayer;

      if (hasWon(row, column)) {
        statusElement.textContent = "Game over";
        winnerMessage.textContent = `${capitalize(currentPlayer)} WINS!`;
        winnerMessage.className = `winner-message ${currentPlayer}`;
        winnerMessage.hidden = false;
        gameOver = true;
      } else if (board[0].every(Boolean)) {
        statusElement.textContent = "It's a draw!";
        winnerMessage.hidden = true;
        gameOver = true;
      } else {
        currentPlayer = currentPlayer === "red" ? "yellow" : "red";
        statusElement.textContent = `${capitalize(currentPlayer)}'s turn`;
      }

      drawBoard();
      return;
    }
  }
}

function hasWon(row, column) {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

  return directions.some(([rowStep, columnStep]) => {
    return countPieces(row, column, rowStep, columnStep)
      + countPieces(row, column, -rowStep, -columnStep) - 1 >= 4;
  });
}

function countPieces(row, column, rowStep, columnStep) {
  const player = board[row][column];
  let count = 0;

  while (
    row >= 0 && row < ROWS &&
    column >= 0 && column < COLUMNS &&
    board[row][column] === player
  ) {
    count++;
    row += rowStep;
    column += columnStep;
  }

  return count;
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

resetButton.addEventListener("click", startGame);
startGame();
