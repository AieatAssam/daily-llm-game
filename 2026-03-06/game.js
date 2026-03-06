// Star Catcher - 2026-03-06
// Move basket to catch stars, avoid bombs!

const gameArea = document.getElementById('game-area');
const basket = document.getElementById('basket');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const gameOverEl = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let lives = 3;
let timeLeft = 60;
let gameActive = false;
let basketX = 50; // percentage
let items = [];
let spawnInterval;
let gameLoop;
let timerInterval;

const ITEM_SIZE = 30;
const BASKET_WIDTH = 80;
const BASKET_HEIGHT = 40;
const FALL_SPEED = 2;

// Mouse/Touch control
gameArea.addEventListener('mousemove', (e) => {
    if (!gameActive) return;
    const rect = gameArea.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    basketX = Math.max(10, Math.min(90, x));
    basket.style.left = basketX + '%';
});

gameArea.addEventListener('touchmove', (e) => {
    if (!gameActive) return;
    e.preventDefault();
    const rect = gameArea.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    basketX = Math.max(10, Math.min(90, x));
    basket.style.left = basketX + '%';
}, { passive: false });

function spawnItem() {
    if (!gameActive) return;
    
    const item = document.createElement('div');
    item.className = 'falling-item';
    
    // 80% chance of star, 20% chance of bomb
    const isBomb = Math.random() < 0.2;
    item.textContent = isBomb ? '💣' : '⭐';
    item.dataset.type = isBomb ? 'bomb' : 'star';
    
    const x = Math.random() * 90 + 5; // 5-95%
    item.style.left = x + '%';
    item.style.top = '-40px';
    
    gameArea.appendChild(item);
    items.push({
        element: item,
        x: x,
        y: -40,
        type: isBomb ? 'bomb' : 'star'
    });
}

function updateGame() {
    if (!gameActive) return;
    
    const basketRect = basket.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();
    
    // Get basket position in game area coordinates
    const basketLeft = (basketX - 10) * (gameRect.width / 100);
    const basketRight = (basketX + 10) * (gameRect.width / 100);
    const basketTop = gameRect.height - BASKET_HEIGHT - 10;
    const basketBottom = gameRect.height - 10;
    
    items.forEach((item, index) => {
        item.y += FALL_SPEED;
        item.element.style.top = item.y + 'px';
        
        // Check if item is at basket height
        if (item.y + ITEM_SIZE >= basketTop && item.y <= basketBottom) {
            const itemLeft = (item.x - 5) * (gameRect.width / 100);
            const itemRight = (item.x + 5) * (gameRect.width / 100);
            
            // Check horizontal collision
            if (itemRight >= basketLeft && itemLeft <= basketRight) {
                // Caught!
                if (item.type === 'star') {
                    score += 10;
                    scoreEl.textContent = score;
                } else {
                    lives--;
                    updateLives();
                    if (lives <= 0) {
                        endGame();
                        return;
                    }
                }
                
                // Remove item
                item.element.remove();
                items.splice(index, 1);
            }
        }
        
        // Check if item fell off screen
        if (item.y > gameRect.height) {
            if (item.type === 'star') {
                lives--;
                updateLives();
                if (lives <= 0) {
                    endGame();
                    return;
                }
            }
            
            item.element.remove();
            items.splice(index, 1);
        }
    });
}

function updateLives() {
    livesEl.textContent = '❤️'.repeat(lives);
}

function startGame() {
    score = 0;
    lives = 3;
    timeLeft = 60;
    gameActive = true;
    
    scoreEl.textContent = score;
    updateLives();
    timerEl.textContent = timeLeft;
    
    startBtn.disabled = true;
    gameOverEl.style.display = 'none';
    
    // Clear existing items
    items.forEach(item => item.element.remove());
    items = [];
    basketX = 50;
    basket.style.left = '50%';
    
    // Spawn items
    spawnInterval = setInterval(spawnItem, 800);
    
    // Game loop
    gameLoop = setInterval(updateGame, 16); // ~60fps
    
    // Timer
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(spawnInterval);
    clearInterval(gameLoop);
    clearInterval(timerInterval);
    
    startBtn.disabled = false;
    finalScoreEl.textContent = score;
    gameOverEl.style.display = 'block';
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

console.log('⭐ Star Catcher loaded! Click Start to play.');
