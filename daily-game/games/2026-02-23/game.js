// Catch the Stars - Daily Game 2026-02-23
// Move basket to catch stars, avoid bombs!

const gameArea = document.getElementById('game-area');
const basket = document.getElementById('basket');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const levelDisplay = document.getElementById('level');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScoreDisplay = document.getElementById('final-score');

// Game state
let score = 0;
let lives = 3;
let level = 1;
let gameRunning = false;
let spawnInterval = null;
let items = [];
let basketX = 50; // percentage

// Item types
const itemTypes = [
    { emoji: '⭐', points: 10, type: 'star', probability: 0.6 },
    { emoji: '🌟', points: 25, type: 'star', probability: 0.15 },
    { emoji: '💫', points: 50, type: 'star', probability: 0.05 },
    { emoji: '💣', points: 0, type: 'bomb', probability: 0.2 }
];

// Initialize basket position
function updateBasketPosition() {
    basket.style.left = `${basketX}%`;
    basket.style.transform = 'translateX(-50%)';
}

updateBasketPosition();

// Mouse/touch controls
gameArea.addEventListener('mousemove', (e) => {
    if (!gameRunning) return;
    const rect = gameArea.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    basketX = Math.max(10, Math.min(90, x));
    updateBasketPosition();
});

gameArea.addEventListener('touchmove', (e) => {
    if (!gameRunning) return;
    e.preventDefault();
    const rect = gameArea.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    basketX = Math.max(10, Math.min(90, x));
    updateBasketPosition();
}, { passive: false });

// Spawn a falling item
function spawnItem() {
    if (!gameRunning) return;
    
    const rand = Math.random();
    let cumulative = 0;
    let selectedItem = itemTypes[0];
    
    for (const item of itemTypes) {
        cumulative += item.probability;
        if (rand <= cumulative) {
            selectedItem = item;
            break;
        }
    }
    
    const item = document.createElement('div');
    item.className = 'falling-item';
    item.textContent = selectedItem.emoji;
    item.style.left = `${Math.random() * 80 + 10}%`;
    item.style.top = '-50px';
    
    // Speed increases with level
    const baseSpeed = 2 + (level * 0.5);
    const speed = baseSpeed + Math.random() * 2;
    item.style.animationDuration = `${speed}s`;
    
    item.dataset.type = selectedItem.type;
    item.dataset.points = selectedItem.points;
    
    gameArea.appendChild(item);
    items.push(item);
    
    // Check for collision
    setTimeout(() => checkCollision(item), speed * 1000 - 100);
    
    // Remove item after animation
    setTimeout(() => {
        if (item.parentNode) {
            item.remove();
            items = items.filter(i => i !== item);
        }
    }, speed * 1000);
}

// Check collision with basket
function checkCollision(item) {
    if (!gameRunning || !item.parentNode) return;
    
    const itemRect = item.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();
    
    const overlap = !(itemRect.right < basketRect.left ||
                     itemRect.left > basketRect.right ||
                     itemRect.bottom < basketRect.top ||
                     itemRect.top > basketRect.bottom);
    
    if (overlap) {
        const type = item.dataset.type;
        const points = parseInt(item.dataset.points);
        
        if (type === 'star') {
            score += points;
            scoreDisplay.textContent = score;
            createSparkle(itemRect.left, itemRect.top, '✨');
            
            // Level up every 100 points
            const newLevel = Math.floor(score / 100) + 1;
            if (newLevel > level) {
                level = newLevel;
                levelDisplay.textContent = level;
                increaseDifficulty();
            }
        } else if (type === 'bomb') {
            lives--;
            updateLivesDisplay();
            createSparkle(itemRect.left, itemRect.top, '💥');
            
            if (lives <= 0) {
                endGame();
            }
        }
        
        item.remove();
        items = items.filter(i => i !== item);
    }
}

// Create sparkle effect
function createSparkle(x, y, emoji) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = emoji;
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    gameArea.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 500);
}

// Update lives display
function updateLivesDisplay() {
    livesDisplay.textContent = '❤️'.repeat(lives);
}

// Increase difficulty
function increaseDifficulty() {
    if (spawnInterval) {
        clearInterval(spawnInterval);
    }
    // Spawn faster at higher levels
    const spawnRate = Math.max(500, 1500 - (level * 150));
    spawnInterval = setInterval(spawnItem, spawnRate);
}

// Start game
function startGame() {
    score = 0;
    lives = 3;
    level = 1;
    gameRunning = true;
    items = [];
    
    scoreDisplay.textContent = score;
    livesDisplay.textContent = '❤️❤️❤️';
    levelDisplay.textContent = level;
    
    // Clear any existing items
    document.querySelectorAll('.falling-item').forEach(item => item.remove());
    
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    // Start spawning
    spawnInterval = setInterval(spawnItem, 1500);
    
    // Spawn first item immediately
    spawnItem();
}

// End game
function endGame() {
    gameRunning = false;
    
    if (spawnInterval) {
        clearInterval(spawnInterval);
        spawnInterval = null;
    }
    
    finalScoreDisplay.textContent = `Score: ${score} | Level: ${level}`;
    gameOverScreen.classList.remove('hidden');
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Keyboard controls (arrow keys)
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    if (e.key === 'ArrowLeft') {
        basketX = Math.max(10, basketX - 5);
        updateBasketPosition();
    } else if (e.key === 'ArrowRight') {
        basketX = Math.min(90, basketX + 5);
        updateBasketPosition();
    }
});
