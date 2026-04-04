// Number Memory Game
// Remember the sequence of numbers and type them back!

class NumberMemoryGame {
    constructor() {
        this.sequence = [];
        this.round = 1;
        this.score = 0;
        this.best = parseInt(localStorage.getItem('numberMemoryBest')) || 0;
        this.isPlaying = false;
        this.isShowingSequence = false;
        
        // DOM elements
        this.roundEl = document.getElementById('round');
        this.scoreEl = document.getElementById('score');
        this.bestEl = document.getElementById('best');
        this.sequenceDisplay = document.getElementById('sequence-display');
        this.inputEl = document.getElementById('player-input');
        this.startBtn = document.getElementById('start-btn');
        this.submitBtn = document.getElementById('submit-btn');
        this.feedbackEl = document.getElementById('feedback');
        
        // Initialize
        this.bestEl.textContent = this.best;
        this.startBtn.addEventListener('click', () => this.startGame());
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.submitBtn.disabled) {
                this.checkAnswer();
            }
        });
    }
    
    startGame() {
        this.sequence = [];
        this.round = 1;
        this.score = 0;
        this.isPlaying = true;
        this.updateStats();
        this.startBtn.textContent = 'Playing...';
        this.startBtn.disabled = true;
        this.nextRound();
    }
    
    nextRound() {
        this.isShowingSequence = true;
        this.inputEl.disabled = true;
        this.inputEl.value = '';
        this.submitBtn.disabled = true;
        this.feedbackEl.textContent = '';
        this.feedbackEl.className = 'feedback';
        
        // Add a new random digit (0-9)
        this.sequence.push(Math.floor(Math.random() * 10));
        
        // Show the sequence
        this.showSequence();
    }
    
    showSequence() {
        let index = 0;
        const speed = Math.max(800 - (this.round * 50), 400); // Gets faster each round
        
        const showNextDigit = () => {
            if (index < this.sequence.length) {
                this.sequenceDisplay.innerHTML = `<span class="digit">${this.sequence[index]}</span>`;
                index++;
                setTimeout(showNextDigit, speed);
            } else {
                // Clear and let player input
                setTimeout(() => {
                    this.sequenceDisplay.innerHTML = '<p class="hint">Type the sequence!</p>';
                    this.isShowingSequence = false;
                    this.inputEl.disabled = false;
                    this.submitBtn.disabled = false;
                    this.inputEl.focus();
                    this.inputEl.maxLength = this.sequence.length;
                }, 500);
            }
        };
        
        showNextDigit();
    }
    
    checkAnswer() {
        if (this.isShowingSequence) return;
        
        const playerInput = this.inputEl.value.trim();
        const correctSequence = this.sequence.join('');
        
        if (playerInput === correctSequence) {
            // Correct!
            this.score += this.round * 10;
            this.feedbackEl.textContent = '✓ Correct! Next round...';
            this.feedbackEl.className = 'feedback success';
            this.round++;
            this.updateStats();
            
            setTimeout(() => this.nextRound(), 1500);
        } else {
            // Wrong!
            this.feedbackEl.textContent = `✗ Game Over! The sequence was: ${correctSequence}`;
            this.feedbackEl.className = 'feedback error';
            this.endGame();
        }
    }
    
    updateStats() {
        this.roundEl.textContent = this.round;
        this.scoreEl.textContent = this.score;
        
        if (this.score > this.best) {
            this.best = this.score;
            this.bestEl.textContent = this.best;
            localStorage.setItem('numberMemoryBest', this.best);
        }
    }
    
    endGame() {
        this.isPlaying = false;
        this.isShowingSequence = false;
        this.startBtn.textContent = 'Play Again';
        this.startBtn.disabled = false;
        this.inputEl.disabled = true;
        this.submitBtn.disabled = true;
        
        if (this.score > 0 && this.score >= this.best) {
            this.feedbackEl.textContent += ' 🎉 New Best!';
        }
    }
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NumberMemoryGame();
});
