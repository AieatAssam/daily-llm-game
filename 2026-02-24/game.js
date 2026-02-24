// Space Dodge - Daily Game 2026-02-24
// Dodge falling asteroids and survive!

const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');
const healthDisplay = document.getElementById('health');
const timeDisplay = document.getElementById('time');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const finalStatsDisplay = document.getElementById('final-stats');

// Game state
let score = 0;
let health = 3;
let gameRunning = false;
let gameTime = 0;
let timerInterval = null;
let spawnInterval = null;
let gameLoopId = null;
let asteroids = [];
let playerX = 50;
let playerY = 80;

// Asteroid types
const asteroidTypes = ['🪨', '☄️', '🌑', '🛰️'];

// Create background stars
function createStars() {
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        gameArea.appendChild(star);
    }
}

createStars();

// Update player position
function updatePlayerPosition() {
    player.style.left = `${playerX}%`;
    player.style.top = `${playerY}%`;
    player.style.transform = 'translate(-50%, -50%)';
}

updatePlayerPosition();

// Mouse controls
gameArea.addEventListener('mousemove', (e) => {
    if (!gameRunning) return;
    const rect = gameArea.getBoundingClientRect();
    playerX = ((e.clientX - rect.left) / rect.width) * 100;
    playerY = ((e.clientY - rect.top) / rect.height) * 100;
    playerX = Math.max(10, Math.min(90, playerX));
    playerY = Math.max(10, Math.min(90, playerY));
    updatePlayerPosition();
});

gameArea.addEventListener('touchmove', (e) => {
    if (!gameRunning) return;
    e.preventDefault();
    const rect = gameArea.getBoundingClientRect();
    playerX = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    playerY = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
    playerX = Math.max(10, Math.min(90, playerX));
    playerY = Math.max(10, Math.min(90, playerY));
    updatePlayerPosition();
}, { passive: false });

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    const speed = 5;
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        playerX = Math.max(10, playerX - speed);
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        playerX = Math.min(90, playerX + speed);
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        playerY = Math.max(10, playerY - speed);
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        playerY = Math.min(90, playerY + speed);
    }
    updatePlayerPosition();
});

// Spawn asteroid
function spawnAsteroid() {
    if (!gameRunning) return;
    
    const asteroid = document.createElement('div');
    asteroid.className = 'asteroid';
    asteroid.textContent = asteroidTypes[Math.floor(Math.random() * asteroidTypes.length)];
    asteroid.style.left = `${Math.random() * 85 + 5}%`;
    asteroid.style.top = '-50px';
    
    // Speed increases with time
    const baseSpeed = 2 + (gameTime / 20);
    const speed = Math.min(5, baseSpeed);
    asteroid.dataset.speed = speed;
    asteroid.dataset.y = -50;
    
    gameArea.appendChild(asteroid);
    asteroids.push(asteroid);
}

// Check collision between asteroid and player
function checkCollision(asteroid) {
    if (!asteroid.parentNode) return false;
    
    const asteroidRect = asteroid.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    
    // Hitbox padding for fairness
    const padding = 15;
    const overlap = !(asteroidRect.right - padding < playerRect.left + padding ||
                     asteroidRect.left + padding > playerRect.right - padding ||
                     asteroidRect.bottom - padding < playerRect.top + padding ||
                     asteroidRect.top + padding > playerRect.bottom - padding);
    
    return overlap;
}

// Create explosion effect
function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.textContent = '💥';
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    gameArea.appendChild(explosion);
    
    setTimeout(() => explosion.remove(), 400);
}

// Update health display
function updateHealthDisplay() {
    healthDisplay.textContent = '❤️'.repeat(health);
}

// Game loop - runs every frame for smooth collision detection
function gameLoop() {
    if (!gameRunning) return;
    
    const gameAreaHeight = gameArea.offsetHeight;
    
    // Update each asteroid position
    asteroids.forEach((asteroid, index) => {
        if (!asteroid.parentNode) return;
        
        // Move asteroid down based on speed
        let currentY = parseFloat(asteroid.dataset.y) || -50;
        const speed = parseFloat(asteroid.dataset.speed) || 3;
        currentY += speed * 2; // pixels per frame
        asteroid.dataset.y = currentY;
        asteroid.style.top = `${currentY}px`;
        
        // Check collision every frame
        if (checkCollision(asteroid)) {
            health--;
            updateHealthDisplay();
            const rect = asteroid.getBoundingClientRect();
            createExplosion(rect.left, rect.top);
            asteroid.remove();
            asteroids.splice(index, 1);
            
            if (health <= 0) {
                endGame();
            }
            return;
        }
        
        // Remove if off screen
        if (currentY > gameAreaHeight) {
            asteroid.remove();
            asteroids.splice(index, 1);
        }
    });
    
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    score = 0;
    health = 3;
    gameTime = 0;
    gameRunning = true;
    asteroids = [];
    
    scoreDisplay.textContent = score;
    healthDisplay.textContent = '❤️❤️❤️';
    timeDisplay.textContent = '0s';
    
    // Clear existing asteroids
    document.querySelectorAll('.asteroid').forEach(a => a.remove());
    
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    // Reset player position
    playerX = 50;
    playerY = 80;
    updatePlayerPosition();
    
    // Start timer
    timerInterval = setInterval(() => {
        gameTime++;
        timeDisplay.textContent = `${gameTime}s`;
        score = gameTime * 10;
        scoreDisplay.textContent = score;
    }, 1000);
    
    // Start spawning asteroids
    spawnInterval = setInterval(spawnAsteroid, 600);
    
    // Start game loop for collision detection
    gameLoop();
}

// End game
function endGame() {
    gameRunning = false;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (spawnInterval) {
        clearInterval(spawnInterval);
        spawnInterval = null;
    }
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
    
    finalStatsDisplay.textContent = `Score: ${score} | Survived: ${gameTime}s`;
    gameOverScreen.classList.remove('hidden');
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
