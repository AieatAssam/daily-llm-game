// Bubble Pop Game - 2026-03-05
// Click bubbles before they float away!

const gameArea = document.getElementById('game-area');
const scoreEl = document.getElementById('score');
const missedEl = document.getElementById('missed');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const gameOverEl = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const finalMissedEl = document.getElementById('final-missed');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let missed = 0;
let timeLeft = 60;
let gameActive = false;
let paused = false;
let bubbleInterval;
let timerInterval;
let bubbles = [];

const bubbleEmojis = ['🫧', '💫', '⭐', '🔮', '💎', '🌟', '✨', '🎈'];
const bubbleColors = [
    'rgba(78, 204, 163, 0.7)',
    'rgba(52, 152, 219, 0.7)',
    'rgba(155, 89, 182, 0.7)',
    'rgba(241, 196, 15, 0.7)',
    'rgba(230, 126, 34, 0.7)'
];

function createBubble() {
    if (!gameActive || paused) return;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = Math.random() * 40 + 50; // 50-90px
    const left = Math.random() * (gameArea.clientWidth - size);
    const speed = Math.random() * 3 + 4; // 4-7 seconds
    const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    const emoji = bubbleEmojis[Math.floor(Math.random() * bubbleEmojis.length)];
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}px`;
    bubble.style.bottom = '-100px';
    bubble.style.background = `radial-gradient(circle at 30% 30%, ${color}, rgba(0,0,0,0.3))`;
    bubble.style.animationDuration = `${speed}s`;
    bubble.textContent = emoji;
    
    bubble.addEventListener('click', () => popBubble(bubble));
    
    gameArea.appendChild(bubble);
    bubbles.push(bubble);
    
    // Remove bubble if it floats away
    setTimeout(() => {
        if (bubble.parentNode && bubbles.includes(bubble)) {
            bubble.remove();
            bubbles = bubbles.filter(b => b !== bubble);
            if (gameActive && !paused) {
                missed++;
                missedEl.textContent = missed;
            }
        }
    }, speed * 1000);
}

function popBubble(bubble) {
    if (!gameActive || paused) return;
    
    // Pop animation
    bubble.style.transform = 'scale(1.5)';
    bubble.style.opacity = '0';
    bubble.style.transition = 'all 0.1s';
    
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.remove();
        }
    }, 100);
    
    bubbles = bubbles.filter(b => b !== bubble);
    score += 10;
    scoreEl.textContent = score;
}

function startGame() {
    score = 0;
    missed = 0;
    timeLeft = 60;
    gameActive = true;
    paused = false;
    
    scoreEl.textContent = score;
    missedEl.textContent = missed;
    timerEl.textContent = timeLeft;
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Pause';
    gameOverEl.style.display = 'none';
    
    // Clear any existing bubbles
    bubbles.forEach(b => b.remove());
    bubbles = [];
    
    // Spawn bubbles
    bubbleInterval = setInterval(createBubble, 800);
    
    // Start timer
    timerInterval = setInterval(() => {
        if (!paused) {
            timeLeft--;
            timerEl.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }
    }, 1000);
}

function pauseGame() {
    if (!gameActive) return;
    
    paused = !paused;
    pauseBtn.textContent = paused ? 'Resume' : 'Pause';
    
    if (paused) {
        // Add pause overlay
        const pauseOverlay = document.createElement('div');
        pauseOverlay.id = 'pause-overlay';
        pauseOverlay.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            color: #4ecca3;
            background: rgba(0,0,0,0.8);
            padding: 1rem 2rem;
            border-radius: 10px;
        `;
        pauseOverlay.textContent = '⏸️ Paused';
        gameArea.appendChild(pauseOverlay);
    } else {
        const overlay = document.getElementById('pause-overlay');
        if (overlay) overlay.remove();
    }
}

function endGame() {
    gameActive = false;
    clearInterval(bubbleInterval);
    clearInterval(timerInterval);
    
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    finalScoreEl.textContent = score;
    finalMissedEl.textContent = missed;
    gameOverEl.style.display = 'block';
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
restartBtn.addEventListener('click', startGame);

// Initialize
console.log('🫧 Bubble Pop loaded! Click Start to play.');
