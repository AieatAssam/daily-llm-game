// Type Rush - A typing reflex game
// Type the falling letters before they hit the bottom!

class TypeRush {
    constructor() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.isPlaying = false;
        this.currentLetter = '';
        this.letterY = 20;
        this.gameArea = document.getElementById('game-area');
        this.targetLetter = document.getElementById('target-letter');
        this.scoreEl = document.getElementById('score');
        this.livesEl = document.getElementById('lives');
        this.levelEl = document.getElementById('level');
        this.gameOverEl = document.getElementById('game-over');
        this.finalScoreEl = document.getElementById('final-score');
        this.finalLevelEl = document.getElementById('final-level');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');
        
        this.speed = 1; // pixels per frame
        this.spawnInterval = null;
        this.gameLoop = null;
        
        this.init();
    }
    
    init() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    startGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.speed = 1;
        this.isPlaying = true;
        this.letterY = 20;
        
        this.updateDisplay();
        this.gameOverEl.style.display = 'none';
        this.startBtn.style.display = 'none';
        
        this.spawnLetter();
        this.gameLoop = requestAnimationFrame(() => this.update());
    }
    
    spawnLetter() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.currentLetter = letters[Math.floor(Math.random() * letters.length)];
        this.targetLetter.textContent = this.currentLetter;
        this.targetLetter.className = 'target-letter';
        this.letterY = 20;
    }
    
    handleKeyPress(e) {
        if (!this.isPlaying) return;
        
        const pressed = e.key.toUpperCase();
        if (pressed === this.currentLetter) {
            // Correct letter!
            this.score += 10 * this.level;
            this.targetLetter.classList.add('pop');
            setTimeout(() => this.targetLetter.classList.remove('pop'), 200);
            
            // Increase difficulty
            if (this.score % 50 === 0) {
                this.level++;
                this.speed = Math.min(this.speed + 0.3, 5);
            }
            
            this.updateDisplay();
            this.spawnLetter();
        }
    }
    
    update() {
        if (!this.isPlaying) return;
        
        this.letterY += this.speed;
        this.targetLetter.style.top = this.letterY + 'px';
        
        // Check if letter hit the bottom
        if (this.letterY > 260) {
            this.lives--;
            this.targetLetter.classList.add('missed');
            this.updateDisplay();
            
            if (this.lives <= 0) {
                this.endGame();
                return;
            }
            
            this.spawnLetter();
        }
        
        this.gameLoop = requestAnimationFrame(() => this.update());
    }
    
    updateDisplay() {
        this.scoreEl.textContent = this.score;
        this.livesEl.textContent = '❤️'.repeat(this.lives);
        this.levelEl.textContent = this.level;
    }
    
    endGame() {
        this.isPlaying = false;
        cancelAnimationFrame(this.gameLoop);
        
        this.finalScoreEl.textContent = this.score;
        this.finalLevelEl.textContent = this.level;
        this.gameOverEl.style.display = 'block';
        this.startBtn.style.display = 'inline-block';
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TypeRush();
});
