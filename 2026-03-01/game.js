// Catch the Stars - Daily Microgame
// A simple game where you catch falling stars and avoid bombs

const gameArea = document.getElementById('game-area');
const basket = document.getElementById('basket');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const timerEl = document.getElementById('timer');
const gameOverScreen = document.getElementById('game-over');
const startScreen = document.getElementById('start-screen');
const finalScoreEl = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// Game state
let score = 0;
let lives = 3;
let timeLeft = 60;
let gameRunning = false;
let basketPosition = 50; // percentage
let fallingItems = [];
let gameLoop;
let spawnLoop;
let timerLoop;

// Settings
const basketSpeed = 3;
const spawnRate = 800; // ms between spawns
const fallSpeedMin = 2;
const fallSpeedMax = 5;

// Initialize basket position
basket.style.left = basketPosition + '%';

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;
  
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    basketPosition = Math.max(10, basketPosition - 5);
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    basketPosition = Math.min(90, basketPosition + 5);
  }
  basket.style.left = basketPosition + '%';
});

// Touch controls
gameArea.addEventListener('touchstart', (e) => {
  if (!gameRunning) return;
  e.preventDefault();
  const touch = e.touches[0];
  const rect = gameArea.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const percentage = (x / rect.width) * 100;
  basketPosition = Math.max(10, Math.min(90, percentage));
  basket.style.left = basketPosition + '%';
});

// Start game
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function startGame() {
  // Reset state
  score = 0;
  lives = 3;
  timeLeft = 60;
  gameRunning = true;
  basketPosition = 50;
  
  // Clear existing items
  fallingItems.forEach(item => item.element.remove());
  fallingItems = [];
  
  // Update UI
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  timerEl.textContent = timeLeft;
  basket.style.left = basketPosition + '%';
  
  // Hide screens
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  
  // Start loops
  gameLoop = setInterval(updateGame, 16); // ~60fps
  spawnLoop = setInterval(spawnItem, spawnRate);
  timerLoop = setInterval(updateTimer, 1000);
}

function spawnItem() {
  if (!gameRunning) return;
  
  const isBomb = Math.random() < 0.3; // 30% chance of bomb
  const item = document.createElement('div');
  item.className = `falling-item ${isBomb ? 'bomb' : 'star'}`;
  item.textContent = isBomb ? '💣' : '⭐';
  item.style.left = Math.random() * 85 + 5 + '%';
  item.style.top = '-40px';
  
  const fallSpeed = fallSpeedMin + Math.random() * (fallSpeedMax - fallSpeedMin);
  
  gameArea.appendChild(item);
  fallingItems.push({
    element: item,
    y: -40,
    speed: fallSpeed,
    isBomb: isBomb
  });
}

function updateGame() {
  if (!gameRunning) return;
  
  // Update falling items
  for (let i = fallingItems.length - 1; i >= 0; i--) {
    const item = fallingItems[i];
    item.y += item.speed;
    item.element.style.top = item.y + 'px';
    
    // Check if caught by basket
    if (item.y >= 350 && item.y <= 380) {
      const itemRect = item.element.getBoundingClientRect();
      const basketRect = basket.getBoundingClientRect();
      
      if (itemRect.left < basketRect.right && itemRect.right > basketRect.left) {
        // Caught!
        if (item.isBomb) {
          lives--;
          livesEl.textContent = lives;
          item.element.remove();
          fallingItems.splice(i, 1);
          
          if (lives <= 0) {
            endGame();
          }
          continue;
        } else {
          score += 10;
          scoreEl.textContent = score;
          item.element.remove();
          fallingItems.splice(i, 1);
          continue;
        }
      }
    }
    
    // Check if fell off screen
    if (item.y > 400) {
      item.element.remove();
      fallingItems.splice(i, 1);
    }
  }
}

function updateTimer() {
  if (!gameRunning) return;
  
  timeLeft--;
  timerEl.textContent = timeLeft;
  
  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  gameRunning = false;
  clearInterval(gameLoop);
  clearInterval(spawnLoop);
  clearInterval(timerLoop);
  
  finalScoreEl.textContent = score;
  gameOverScreen.classList.remove('hidden');
}

// Prevent arrow key scrolling
window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault();
  }
});
