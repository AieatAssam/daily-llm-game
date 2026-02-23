// Memory Match Game - Daily Game 2026-02-23
// Find all matching pairs of emojis!

const emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎬', '🎸'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timerInterval = null;
let seconds = 0;
let gameStarted = false;

const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const pairsDisplay = document.getElementById('pairs');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const winMessage = document.getElementById('win-message');
const winStats = document.getElementById('win-stats');

// Initialize game
function initGame() {
    // Reset state
    cards = [...emojis, ...emojis]; // Duplicate for pairs
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    gameStarted = false;
    
    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Update displays
    movesDisplay.textContent = '0';
    pairsDisplay.textContent = '0/8';
    timerDisplay.textContent = '0:00';
    winMessage.classList.add('hidden');
    
    // Shuffle cards
    shuffleArray(cards);
    
    // Create card elements
    createCards();
}

// Fisher-Yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Create card elements
function createCards() {
    gameBoard.innerHTML = '';
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${emoji}</div>
            </div>
        `;
        
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
}

// Flip a card
function flipCard(card) {
    // Ignore if already flipped or matched
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Ignore if two cards already flipped
    if (flippedCards.length >= 2) {
        return;
    }
    
    // Start timer on first flip
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }
    
    // Flip the card
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // Check for match if two cards flipped
    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

// Check if two flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Match found!
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        pairsDisplay.textContent = `${matchedPairs}/8`;
        flippedCards = [];
        
        // Check for win
        if (matchedPairs === 8) {
            endGame();
        }
    } else {
        // No match - flip back after delay
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

// End game
function endGame() {
    clearInterval(timerInterval);
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeStr = `${mins}m ${secs}s`;
    
    winStats.textContent = `You found all pairs in ${moves} moves and ${timeStr}!`;
    winMessage.classList.remove('hidden');
}

// Restart button
restartBtn.addEventListener('click', initGame);

// Start the game
initGame();
