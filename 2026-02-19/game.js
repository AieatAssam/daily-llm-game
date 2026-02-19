// Bubble Popper Game - Pop bubbles before they float away!
let score = 0;
let missed = 0;
let level = 1;
let gameActive = false;
let bubbleInterval;
let bubbles = [];
const maxMissed = 5;

const gameArea = document.getElementById('game-area');
const scoreEl = document.getElementById('score');
const missedEl = document.getElementById('missed');
const levelEl = document.getElementById('level');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');

function startGame() {
    score = 0;
    missed = 0;
    level = 1;
    gameActive = true;
    bubbles = [];
    
    // Clear existing bubbles
    document.querySelectorAll('.bubble').forEach(b => b.remove());
    
    updateStats();
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    // Start spawning bubbles
    startSpawningBubbles();
}

function startSpawningBubbles() {
    if (bubbleInterval) clearInterval(bubbleInterval);
    
    // Spawn rate increases with level
    const spawnRate = Math.max(800, 2000 - (level - 1) * 300);
    
    bubbleInterval = setInterval(() => {
        if (gameActive) {
            spawnBubble();
        }
    }, spawnRate);
}

function spawnBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Random size between 40-80px
    const size = 40 + Math.random() * 40;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    // Random horizontal position
    const maxX = gameArea.offsetWidth - size;
    const startX = Math.random() * maxX;
    bubble.style.left = `${startX}px`;
    bubble.style.bottom = '-80px';
    
    // Add emoji
    const emojis = ['🫧', '💙', '⭐', '🎈', '✨'];
    bubble.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Click to pop
    bubble.addEventListener('click', () => popBubble(bubble));
    bubble.addEventListener('touchstart', (e) => {
        e.preventDefault();
        popBubble(bubble);
    });
    
    gameArea.appendChild(bubble);
    bubbles.push({
        element: bubble,
        y: -80,
        speed: 1 + (level - 1) * 0.5 + Math.random() * 1.5
    });
    
    // Start animation loop if not already running
    if (!window.animationFrame) {
        animateBubbles();
    }
}

function animateBubbles() {
    if (!gameActive) {
        window.animationFrame = null;
        return;
    }
    
    bubbles.forEach((bubble, index) => {
        bubble.y += bubble.speed;
        bubble.element.style.bottom = `${bubble.y}px`;
        
        // Check if bubble escaped
        if (bubble.y > gameArea.offsetHeight) {
            bubble.element.remove();
            bubbles.splice(index, 1);
            missed++;
            updateStats();
            
            if (missed >= maxMissed) {
                endGame();
            }
        }
    });
    
    window.animationFrame = requestAnimationFrame(animateBubbles);
}

function popBubble(bubbleEl) {
    if (!gameActive) return;
    
    bubbleEl.classList.add('pop');
    
    // Find and remove from bubbles array
    const index = bubbles.findIndex(b => b.element === bubbleEl);
    if (index !== -1) {
        bubbles.splice(index, 1);
    }
    
    score += 10 * level;
    updateStats();
    
    // Check for level up every 100 points
    if (score >= level * 100) {
        level++;
        updateStats();
        startSpawningBubbles(); // Increase spawn rate
    }
    
    // Remove element after animation
    setTimeout(() => {
        if (bubbleEl.parentNode) {
            bubbleEl.remove();
        }
    }, 300);
}

function updateStats() {
    scoreEl.textContent = score;
    missedEl.textContent = missed;
    levelEl.textContent = level;
}

function endGame() {
    gameActive = false;
    if (bubbleInterval) clearInterval(bubbleInterval);
    if (window.animationFrame) {
        cancelAnimationFrame(window.animationFrame);
        window.animationFrame = null;
    }
    
    finalScoreEl.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

function resetGame() {
    gameActive = false;
    if (bubbleInterval) clearInterval(bubbleInterval);
    if (window.animationFrame) {
        cancelAnimationFrame(window.animationFrame);
        window.animationFrame = null;
    }
    
    document.querySelectorAll('.bubble').forEach(b => b.remove());
    bubbles = [];
    score = 0;
    missed = 0;
    level = 1;
    updateStats();
    
    startScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
}