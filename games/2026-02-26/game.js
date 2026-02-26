// Color Match Reflex Game
// A simple reaction time game - press the matching key as fast as possible!

const colors = [
    { name: 'red', key: 'r', class: 'color-red' },
    { name: 'green', key: 'g', class: 'color-green' },
    { name: 'blue', key: 'b', class: 'color-blue' },
    { name: 'yellow', key: 'y', class: 'color-yellow' }
];

let gameState = 'waiting'; // waiting, playing, result
let currentColor = null;
let score = 0;
let bestScore = 0;
let reactionTimes = [];
let startTime = 0;
let timeoutId = null;

const colorBox = document.getElementById('color-box');
const keyHint = document.getElementById('key-hint');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const avgTimeEl = document.getElementById('avg-time');
const messageEl = document.getElementById('message');

// Load best score from localStorage
function loadBestScore() {
    const saved = localStorage.getItem('colorMatchBest');
    if (saved) bestScore = parseInt(saved);
    bestEl.textContent = bestScore;
}

function saveBestScore() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('colorMatchBest', bestScore);
        bestEl.textContent = bestScore;
    }
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function showColor() {
    currentColor = getRandomColor();
    colorBox.className = 'color-box ' + currentColor.class;
    keyHint.textContent = `Press ${currentColor.key.toUpperCase()}!`;
    startTime = Date.now();
}

function hideColor() {
    colorBox.className = 'color-box';
    keyHint.textContent = 'Wait for it...';
}

function startGame() {
    gameState = 'playing';
    score = 0;
    reactionTimes = [];
    scoreEl.textContent = score;
    messageEl.textContent = '';
    nextRound();
}

function nextRound() {
    hideColor();
    const delay = 1000 + Math.random() * 2000; // 1-3 seconds
    
    timeoutId = setTimeout(() => {
        if (gameState === 'playing') {
            showColor();
        }
    }, delay);
}

function handleKeyPress(key) {
    if (gameState === 'waiting' && key === ' ') {
        startGame();
        return;
    }
    
    if (gameState !== 'playing' || !currentColor) return;
    
    const pressedColor = colors.find(c => c.key === key.toLowerCase());
    if (!pressedColor) return;
    
    clearTimeout(timeoutId);
    
    const reactionTime = Date.now() - startTime;
    reactionTimes.push(reactionTime);
    
    if (pressedColor.name === currentColor.name) {
        // Correct!
        score++;
        scoreEl.textContent = score;
        messageEl.textContent = `⚡ ${reactionTime}ms - Great!`;
        messageEl.style.color = '#4ecca3';
        saveBestScore();
        updateAvgTime();
        
        setTimeout(() => {
            messageEl.textContent = '';
            nextRound();
        }, 500);
    } else {
        // Wrong!
        messageEl.textContent = `❌ Wrong key! Game Over. Final: ${score}`;
        messageEl.style.color = '#e74c3c';
        gameState = 'result';
        keyHint.textContent = 'Press SPACE to restart';
    }
}

function updateAvgTime() {
    if (reactionTimes.length > 0) {
        const avg = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
        avgTimeEl.textContent = `${avg}ms`;
    }
}

// Keyboard input
document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    handleKeyPress(e.key);
});

// Touch/click for mobile
colorBox.addEventListener('click', () => {
    if (gameState === 'waiting' || gameState === 'result') {
        startGame();
    } else if (currentColor) {
        handleKeyPress(currentColor.key);
    }
});

// Initialize
loadBestScore();
