// Memory Match Challenge - Daily Game 2026-02-28
// A simple memory card matching game with emojis

const emojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎬', '🎸'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let bestMoves = localStorage.getItem('memoryBest') || null;
let isLocked = false;

const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const pairsDisplay = document.getElementById('pairs');
const bestDisplay = document.getElementById('best');
const messageDisplay = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

// Initialize best moves display
if (bestMoves) {
    bestDisplay.textContent = bestMoves;
}

// Shuffle array using Fisher-Yates algorithm
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create the game board
function createBoard() {
    // Duplicate emojis to create pairs
    const cardEmojis = shuffle([...emojis, ...emojis]);
    
    gameBoard.innerHTML = '';
    cards = [];
    
    cardEmojis.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.textContent = ''; // Hidden initially
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

// Flip a card
function flipCard(card) {
    // Ignore if locked, already flipped, or already matched
    if (isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    flippedCards.push(card);
    
    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

// Check if the two flipped cards match
function checkMatch() {
    isLocked = true;
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Match found!
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            pairsDisplay.textContent = `${matchedPairs}/8`;
            flippedCards = [];
            isLocked = false;
            
            // Check for win
            if (matchedPairs === 8) {
                handleWin();
            }
        }, 500);
    } else {
        // No match - flip back
        setTimeout(() => {
            card1.classList.remove('flipped');
            card1.textContent = '';
            card2.classList.remove('flipped');
            card2.textContent = '';
            flippedCards = [];
            isLocked = false;
        }, 1000);
    }
}

// Handle win condition
function handleWin() {
    messageDisplay.textContent = `🎉 Congratulations! You won in ${moves} moves!`;
    
    // Update best score
    if (!bestMoves || moves < parseInt(bestMoves)) {
        bestMoves = moves;
        localStorage.setItem('memoryBest', moves);
        bestDisplay.textContent = moves;
        messageDisplay.textContent += ' New record! 🏆';
    }
}

// Restart the game
function restartGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    isLocked = false;
    
    movesDisplay.textContent = '0';
    pairsDisplay.textContent = '0/8';
    messageDisplay.textContent = '';
    
    createBoard();
}

// Event listeners
restartBtn.addEventListener('click', restartGame);

// Initialize game
createBoard();
