// Balloon Pop Game
// Click balloons before they float away!

const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e91e63', '#00bcd4'];

let score = 0;
let missed = 0;
let timeLeft = 60;
let gameActive = false;
let spawnInterval;
let timerInterval;
let balloons = [];

const gameArea = document.getElementById('game-area');
const scoreEl = document.getElementById('score');
const missedEl = document.getElementById('missed');
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const gameOverEl = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const finalMissedEl = document.getElementById('final-missed');
const restartBtn = document.getElementById('restart-btn');

function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createBalloon() {
    if (!gameActive) return;
    
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.background = getRandomColor();
    balloon.style.left = Math.random() * (gameArea.offsetWidth - 60) + 'px';
    balloon.style.bottom = '-70px';
    
    const speed = 1 + Math.random() * 2; // Speed between 1-3
    let position = -70;
    
    balloon.addEventListener('click', () => popBalloon(balloon));
    
    gameArea.appendChild(balloon);
    balloons.push(balloon);
    
    function animate() {
        if (!gameActive || !balloon.parentNode) return;
        
        position += speed;
        balloon.style.bottom = position + 'px';
        
        // Check if balloon escaped
        if (position > gameArea.offsetHeight) {
            if (balloon.parentNode) {
                balloon.remove();
                missed++;
                missedEl.textContent = missed;
            }
            balloons = balloons.filter(b => b !== balloon);
            return;
        }
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}

function popBalloon(balloon) {
    if (!gameActive || !balloon.parentNode) return;
    
    balloon.classList.add('pop');
    score++;
    scoreEl.textContent = score;
    
    setTimeout(() => {
        if (balloon.parentNode) {
            balloon.remove();
        }
    }, 200);
    
    balloons = balloons.filter(b => b !== balloon);
}

function startGame() {
    // Reset game state
    score = 0;
    missed = 0;
    timeLeft = 60;
    gameActive = true;
    
    // Update UI
    scoreEl.textContent = score;
    missedEl.textContent = missed;
    timerEl.textContent = timeLeft;
    startBtn.classList.add('hidden');
    gameOverEl.classList.add('hidden');
    
    // Clear any existing balloons
    gameArea.innerHTML = '';
    balloons = [];
    
    // Start spawning balloons
    spawnInterval = setInterval(createBalloon, 800);
    
    // Start timer
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
    clearInterval(timerInterval);
    
    // Remove remaining balloons
    balloons.forEach(balloon => {
        if (balloon.parentNode) {
            balloon.remove();
        }
    });
    balloons = [];
    
    // Show game over screen
    finalScoreEl.textContent = score;
    finalMissedEl.textContent = missed;
    gameOverEl.classList.remove('hidden');
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
