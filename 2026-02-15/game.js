// Slider Puzzle Game - Arrange tiles in numerical order
const BOARD_SIZE = 4;
let board = [];
let emptyRow, emptyCol;
let moves = 0;
let startTime;
let timerInterval;
let gameActive = false;

// Initialize the game
function initGame() {
    // Reset game state
    moves = 0;
    document.getElementById('moves').textContent = moves;
    
    // Clear timer if running
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Initialize the solved board
    board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            const value = i * BOARD_SIZE + j + 1;
            board[i][j] = value === 16 ? 0 : value; // 0 represents the empty space
        }
    }
    
    // Set empty position to bottom-right
    emptyRow = BOARD_SIZE - 1;
    emptyCol = BOARD_SIZE - 1;
    
    // Randomize the board
    shuffleBoard();
    
    // Render the board
    renderBoard();
    
    // Reset timer
    document.getElementById('timer').textContent = '0';
    gameActive = false;
}

// Shuffle the board by making random valid moves
function shuffleBoard() {
    // Make 500 random moves to ensure solvability
    for (let i = 0; i < 500; i++) {
        const possibleMoves = getPossibleMoves();
        if (possibleMoves.length > 0) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            makeMove(randomMove.row, randomMove.col);
        }
    }
    
    // Reset moves counter after shuffling
    moves = 0;
    document.getElementById('moves').textContent = moves;
}

// Get possible moves (adjacent tiles to empty space)
function getPossibleMoves() {
    const moves = [];
    
    // Check up
    if (emptyRow > 0) moves.push({row: emptyRow - 1, col: emptyCol});
    // Check down
    if (emptyRow < BOARD_SIZE - 1) moves.push({row: emptyRow + 1, col: emptyCol});
    // Check left
    if (emptyCol > 0) moves.push({row: emptyRow, col: emptyCol - 1});
    // Check right
    if (emptyCol < BOARD_SIZE - 1) moves.push({row: emptyRow, col: emptyCol + 1});
    
    return moves;
}

// Make a move by swapping the tile with the empty space
function makeMove(row, col) {
    // Only allow move if it's adjacent to the empty space
    const isAdjacent = 
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow);
    
    if (!isAdjacent) return;
    
    // Swap the tile with the empty space
    board[emptyRow][emptyCol] = board[row][col];
    board[row][col] = 0;
    
    // Update empty position
    emptyRow = row;
    emptyCol = col;
    
    // Update move count
    moves++;
    document.getElementById('moves').textContent = moves;
    
    // Start timer on first move
    if (!gameActive) {
        gameActive = true;
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    // Render the updated board
    renderBoard();
    
    // Check for win
    if (checkWin()) {
        clearInterval(timerInterval);
        setTimeout(() => {
            alert(`Congratulations! You solved the puzzle in ${moves} moves and ${Math.floor((Date.now() - startTime) / 1000)} seconds!`);
        }, 100);
    }
}

// Update the timer
function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = elapsed;
}

// Render the game board
function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            if (board[i][j] !== 0) {
                cell.textContent = board[i][j];
                cell.className += ' tile';
                
                // Add click event for the tile
                cell.addEventListener('click', () => makeMove(i, j));
            } else {
                cell.className += ' empty';
            }
            
            cell.dataset.row = i;
            cell.dataset.col = j;
            gameBoard.appendChild(cell);
        }
    }
}

// Check if the player has won
function checkWin() {
    let num = 1;
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (i === BOARD_SIZE - 1 && j === BOARD_SIZE - 1) {
                // Last cell should be empty (0)
                if (board[i][j] !== 0) return false;
            } else {
                // Other cells should be in sequence
                if (board[i][j] !== num) return false;
                num++;
            }
        }
    }
    return true;
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);