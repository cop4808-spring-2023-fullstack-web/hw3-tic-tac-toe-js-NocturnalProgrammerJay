// SET GAME
let gameActive = true
let gameState = ["", "", "", "", "", "", "", "", ""]
let statusDisplay = document.querySelector(".status")

// PLAYERS IDs
let currentPlayer = randomPlayerChoice() % 2 == 0 ? "X" : "O"
const player1 = currentPlayer
const player2 = currentPlayer === "X" ? "O" : "X"

// SCORE BOARD
const scoreBoard = { player1: 0, player2: 0 }

// STATUS BAR
let statusBar = document.querySelector(".players")
let player1Color
let player2Color

// EMIT ACTION LISTENERS
document.querySelectorAll(".cell").forEach((cell) => cell.addEventListener("click", handleCellClick))
document.querySelector(".restart").addEventListener("click", handleRestartGame)

// UPDATE UI
const buildScoreBoard = () => {
  if (currentPlayer === player1) {
    player1Color = "#00BCE3"
    player2Color = ""
  }

  if (currentPlayer === player2) {
    player1Color = ""
    player2Color = "#ab20fd"
  }
  statusBar.innerHTML = `<p> <b style="color:${player1Color}">Player 1:</b> ${scoreBoard.player1} <b>|</b> <b style="color:${player2Color}">Player 2:</b> ${scoreBoard.player2} </p>`
}

// SELECTS RANDOM PLAYER
function randomPlayerChoice(){
  return Math.floor(Math.random() * 10 + 1)
}

// GLOBAL VARIABLES
const winningMessage = () => `Player ${currentPlayer} has won!`
const drawMessage = () => `Game ended in a draw!`
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`

// WINNING COMBINATIONS
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

// UPDATE GAME STATE
function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer
  clickedCell.innerHTML = currentPlayer
}

// COMPUTERS TURN
function computer(){
  const spacesAvailable = gameState.map((el,idx) => {
    if(el === ""){
      return idx
    }
  }).filter(el => el >= 0)

  while(true){
    let num = Math.floor((Math.random()*9))
    
    if(spacesAvailable.includes(num)){
      document.querySelectorAll(".cell").forEach(cell => {
        if (cell.getAttribute("data-cell-index") === num.toString()){
          statusDisplay.innerHTML = currentPlayerTurn()
          setTimeout(()=>{
            document.querySelector(`[data-cell-index="${num}"]`).click()
          }, 1200)
        }
      })
      break
    } 
  }
  buildScoreBoard()
}

// CHANGE PLAYER
function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X"
  statusDisplay.innerHTML = currentPlayerTurn()
  if (currentPlayer === "O") computer()
  buildScoreBoard()
}

// CHECK FOR WINNER
function handleResultValidation() {
  let roundWon = false
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i]
    let a = gameState[winCondition[0]]
    let b = gameState[winCondition[1]]
    let c = gameState[winCondition[2]]
    if (a === "" || b === "" || c === "") {
      continue
    }
    if (a === b && b === c) {
      roundWon = true

      document.querySelectorAll(".cell").forEach((cell, idx) => {
        if (
          cell.getAttribute("data-cell-index") === winCondition[0].toString() ||
          cell.getAttribute("data-cell-index") === winCondition[1].toString() ||
          cell.getAttribute("data-cell-index") === winCondition[2].toString()
        ) {
          document.querySelector(`.cell--${idx.toString()}`).style.zIndex = 1
          document.querySelector(`.cell--${idx.toString()}`).style.border= 0.5
          document.querySelector(`.cell--${idx.toString()}`).style.border = currentPlayer === player1 ? `6px solid ${player1Color}` : `6px solid ${player2Color}`
        }
      })
      break
    }
  }

  if (roundWon) {
    if (currentPlayer === player1) {
      scoreBoard.player1 += 1
    }

    if (currentPlayer === player2) {
      scoreBoard.player2 += 1
    }

    statusDisplay.innerHTML = winningMessage()
    gameActive = false
    statusDisplay.style.color = currentPlayer === player1 ? `${player1Color}` : `${player2Color}`
    buildScoreBoard()
    return
  }

  let roundDraw = !gameState.includes("")

  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage()
    gameActive = false
    statusDisplay.style.color = "rgb(251,100,204)"
    buildScoreBoard()
    return
  }

  handlePlayerChange()
}

// PLAYER TURN
function handleCellClick(clickedCellEvent) {
  clickedCellEvent.target.style.color = currentPlayer === player1 ? `${player1Color}` : `${player2Color}`
  const clickedCell = clickedCellEvent.target
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  )

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return
  }

  handleCellPlayed(clickedCell, clickedCellIndex)
  handleResultValidation()
}

// CLEAR GAME INPUT
function handleRestartGame() {
  gameActive = true
  currentPlayer = player1
  gameState = ["", "", "", "", "", "", "", "", ""]

  statusDisplay.style.color = "black"

  statusDisplay.innerHTML = currentPlayerTurn()
  document.querySelectorAll(".cell").forEach((cell, idx) => {
    cell.innerHTML = ""
    cell.style.border = "6px solid black"
    cell.style.zIndex = 0
  })

  if(currentPlayer === "O") computer()
}

// UPDATE UI STATE
buildScoreBoard()
statusDisplay.innerHTML = currentPlayerTurn()
