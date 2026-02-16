// Reaction Timer Game - Test your reflexes!
let gameState = 'waiting'; // waiting, ready, go, finished
let startTime;
let timeoutId;
let bestTime = localStorage.getItem('bestReactionTime') || null;
let lastTime = null;

const gameArea = document.getElementById('game-area');
const message = document.getElementById('message');
const result = document.getElementById('result');
const bestTimeEl = document.getElementById('best-time');
const lastTimeEl = document.getElementById('last-time');

// Initialize best time display
if (bestTime) {
    bestTimeEl.textContent = bestTime;
}

// Game area click handler
gameArea.addEventListener('click', handleClick);

function handleClick() {
    switch(gameState) {
        case 'waiting':
            startGame();
            break;
        case 'ready':
            tooEarly();
            break;
        case 'go':
            recordReaction();
            break;
        case 'finished':
            resetGame();
            break;
    }
}

function startGame() {
    gameState = 'ready';
    gameArea.className = 'game-area ready';
    message.textContent = 'Wait for green...';
    result.textContent = '';
    
    // Random delay between 2-5 seconds
    const delay = 2000 + Math.random() * 3000;
    
    timeoutId = setTimeout(() => {
        gameState = 'go';
        gameArea.className = 'game-area go';
        message.textContent = 'CLICK!';
        startTime = Date.now();
    }, delay);
}

function tooEarly() {
    clearTimeout(timeoutId);
    gameState = 'waiting';
    gameArea.className = 'game-area too-early';
    message.textContent = 'Too early! Click to try again';
    result.textContent = '❌ You clicked too early!';
}

function recordReaction() {
    const reactionTime = Date.now() - startTime;
    lastTime = reactionTime;
    lastTimeEl.textContent = reactionTime;
    
    // Update best time
    if (!bestTime || reactionTime < bestTime) {
        bestTime = reactionTime;
        bestTimeEl.textContent = bestTime;
        localStorage.setItem('bestReactionTime', bestTime);
    }
    
    gameState = 'finished';
    gameArea.className = 'game-area finished';
    
    // Show result with rating
    let rating;
    if (reactionTime < 200) {
        rating = '🏆 Incredible!';
    } else if (reactionTime < 250) {
        rating = '🥇 Excellent!';
    } else if (reactionTime < 300) {
        rating = '🥈 Good!';
    } else if (reactionTime < 400) {
        rating = '🥉 Average';
    } else {
        rating = '😅 Keep practicing!';
    }
    
    message.textContent = `${reactionTime}ms`;
    result.textContent = rating;
}

function resetGame() {
    gameState = 'waiting';
    gameArea.className = 'game-area waiting';
    message.textContent = 'Click to Start';
    result.textContent = '';
}