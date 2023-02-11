const statusDisplay = document.querySelector(".status");

const randomPlayerChoice = () => Math.floor(Math.random() * 10 + 1);

let gameActive = true;
let currentPlayer = randomPlayerChoice() % 2 == 0 ? "X" : "O";
let gameState = ["", "", "", "", "", "", "", "", ""];

let player1 = currentPlayer;
let player2 = currentPlayer === "X" ? "O" : "X";

console.log(player1, player2);

const scoreBoard = { player1: 0, player2: 0 };

// Build status bar
// const board = document.createElement("div").appendChild(statusBar);
const statusBar = document.querySelector(".players");

const buildScoreBoard = () => {
  let player1Color;
  let player2Color;

  if (currentPlayer === player1) {
    player1Color = "blue";
    player2Color = "";
  }

  if (currentPlayer === player2) {
    player1Color = "";
    player2Color = "red";
  }

  statusBar.style.height = "50px";
  statusBar.style.padding = "5px";
  statusBar.style.border = "solid #414141";
  statusBar.style.width = statusBar.previousSibling.width;
  statusBar.style.borderRadius = "5%";
  statusBar.innerHTML = `<p> <b style="color:${player1Color}">Player 1:</b> ${scoreBoard.player1} <b>|</b> <b style="color:${player2Color}">Player 2:</b> ${scoreBoard.player2} </p>`;
};

buildScoreBoard();

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.innerHTML = currentPlayerTurn();
  buildScoreBoard();
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    if (currentPlayer === player1) {
      scoreBoard.player1 += 1;
    }

    if (currentPlayer === player2) {
      scoreBoard.player2 += 1;
    }

    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
    statusDisplay.style.color = "rgb(251,100,204)";
    buildScoreBoard();
    return;
  }

  let roundDraw = !gameState.includes("");

  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    statusDisplay.style.color = "rgb(251,100,204)";
    buildScoreBoard();
    return;
  }

  handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];

  statusDisplay.style.color = "rgb(65, 65, 65)";

  // currentPlayer = randomPlayerChoice() % 2 == 0 ? "X" : "O";

  statusDisplay.innerHTML = currentPlayerTurn();
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));
}

document
  .querySelectorAll(".cell")
  .forEach((cell) => cell.addEventListener("click", handleCellClick));
document.querySelector(".restart").addEventListener("click", handleRestartGame);
