// Reaction Timer Game
// Test your reflexes by clicking when the box turns green!

const gameBox = document.getElementById('game-box');
const gameText = document.getElementById('game-text');
const result = document.getElementById('result');
const startBtn = document.getElementById('start-btn');

let startTime;
let timeoutId;
let gameState = 'idle'; // idle, waiting, ready, finished

function startGame() {
    gameState = 'waiting';
    result.textContent = '';
    startBtn.textContent = 'Wait...';
    startBtn.disabled = true;
    gameBox.className = 'game-box waiting';
    gameText.textContent = 'Wait for green...';
    
    // Random delay between 2-5 seconds
    const delay = 2000 + Math.random() * 3000;
    
    timeoutId = setTimeout(() => {
        if (gameState === 'waiting') {
            gameState = 'ready';
            startTime = Date.now();
            gameBox.className = 'game-box ready';
            gameText.textContent = 'CLICK NOW!';
        }
    }, delay);
}

function handleClick() {
    if (gameState === 'idle' || gameState === 'finished') {
        return;
    }
    
    if (gameState === 'waiting') {
        // Clicked too early!
        clearTimeout(timeoutId);
        gameState = 'finished';
        gameBox.className = 'game-box too-early';
        gameText.textContent = 'Too Early!';
        result.textContent = '❌ You clicked too soon!';
        startBtn.textContent = 'Try Again';
        startBtn.disabled = false;
    } else if (gameState === 'ready') {
        // Success!
        const reactionTime = Date.now() - startTime;
        gameState = 'finished';
        gameBox.className = 'game-box finished';
        gameText.textContent = `${reactionTime}ms`;
        
        let message = `⚡ ${reactionTime}ms!`;
        if (reactionTime < 200) {
            message += ' Incredible! 🏆';
        } else if (reactionTime < 300) {
            message += ' Great job! 🎉';
        } else if (reactionTime < 400) {
            message += ' Not bad! 👍';
        } else {
            message += ' Keep practicing! 💪';
        }
        result.textContent = message;
        startBtn.textContent = 'Play Again';
        startBtn.disabled = false;
    }
}

gameBox.addEventListener('click', handleClick);
startBtn.addEventListener('click', startGame);

// Also allow spacebar to start/play
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'idle' || gameState === 'finished') {
            startGame();
        } else {
            handleClick();
        }
    }
});
