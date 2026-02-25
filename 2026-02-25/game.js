// Alien Whack - Daily Game 2026-02-25
// Whack-a-mole style game with aliens and bombs

const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const missedDisplay = document.getElementById('missed');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const finalScoreDisplay = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score');

// Game state
let score = 0;
let timeLeft = 30;
let missed = 0;
let gameRunning = false;
let timerInterval = null;
let moleTimer = null;
let currentHole = null;
let highScore = localStorage.getItem('alienWhackHighScore') || 0;

// Entity types
const entities = [
    { emoji: '👽', points: 10, type: 'alien', probability: 0.7 },
    { emoji: '👾', points: 15, type: 'alien', probability: 0.15 },
    { emoji: '💣', points: -5, type: 'bomb', probability: 0.15 }
];

// Get random entity based on probability
function getRandomEntity() {
    const rand = Math.random();
    let cumulative = 0;
    for (const entity of entities) {
        cumulative += entity.probability;
        if (rand <= cumulative) {
            return entity;
        }
    }
    return entities[0];
}

// Get random hole
function getRandomHole() {
    const availableHoles = Array.from(holes).filter(h => h !== currentHole);
    return availableHoles[Math.floor(Math.random() * availableHoles.length)];
}

// Show entity in a hole
function showEntity() {
    if (!gameRunning) return;
    
    const entity = getRandomEntity();
    currentHole = getRandomHole();
    
    const mole = currentHole.querySelector('.mole');
    mole.textContent = entity.emoji;
    mole.dataset.type = entity.type;
    mole.dataset.points = entity.points;
    
    currentHole.classList.add('up');
    
    // Random time between 0.5 and 1.2 seconds
    const displayTime = 500 + Math.random() * 700;
    
    // Remove entity after time
    setTimeout(() => {
        if (!gameRunning) return;
        
        if (currentHole.classList.contains('up')) {
            currentHole.classList.remove('up');
            if (entity.type === 'alien') {
                missed++;
                missedDisplay.textContent = missed;
            }
        }
        
        // Show next entity
        moleTimer = setTimeout(showEntity, 200 + Math.random() * 300);
    }, displayTime);
}

// Handle click on hole
function handleWhack(e) {
    if (!gameRunning) return;
    
    const hole = e.currentTarget;
    const mole = hole.querySelector('.mole');
    
    if (!hole.classList.contains('up')) return;
    
    const type = mole.dataset.type;
    const points = parseInt(mole.dataset.points);
    
    // Update score
    score += points;
    if (score < 0) score = 0;
    scoreDisplay.textContent = score;
    
    // Visual feedback
    if (type === 'alien') {
        hole.classList.add('hit');
        showScorePopup(hole, `+${points}`);
        setTimeout(() => hole.classList.remove('hit'), 200);
    } else if (type === 'bomb') {
        hole.classList.add('bomb-hit');
        showScorePopup(hole, `${points}`);
        setTimeout(() => hole.classList.remove('bomb-hit'), 300);
    }
    
    // Hide the mole
    hole.classList.remove('up');
    currentHole = null;
    
    // Speed up as score increases
    clearTimeout(moleTimer);
    moleTimer = setTimeout(showEntity, 100);
}

// Show floating score popup
function showScorePopup(hole, text) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = text;
    popup.style.color = text.includes('-') ? '#ff4444' : '#00ff88';
    
    const rect = hole.getBoundingClientRect();
    popup.style.left = `${rect.left + rect.width / 2 - 20}px`;
    popup.style.top = `${rect.top}px`;
    
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 800);
}

// Start game
function startGame() {
    score = 0;
    timeLeft = 30;
    missed = 0;
    gameRunning = true;
    
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    missedDisplay.textContent = missed;
    
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    // Reset all holes
    holes.forEach(hole => {
        hole.classList.remove('up', 'hit', 'bomb-hit');
        hole.querySelector('.mole').textContent = '';
    });
    
    // Start timer
    timerInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    
    // Start showing entities
    showEntity();
}

// End game
function endGame() {
    gameRunning = false;
    
    clearInterval(timerInterval);
    clearTimeout(moleTimer);
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('alienWhackHighScore', highScore);
    }
    
    finalScoreDisplay.textContent = `Score: ${score}`;
    highScoreDisplay.textContent = `High Score: ${highScore}`;
    gameOverScreen.classList.remove('hidden');
    
    // Clear all holes
    holes.forEach(hole => hole.classList.remove('up'));
}

// Add click listeners to holes
holes.forEach(hole => {
    hole.addEventListener('click', handleWhack);
    hole.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleWhack(e);
    });
});

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
