// Memory Card Flip Game - Find matching pairs of cards
// Click on cards to flip them and find all matching pairs

class MemoryGame {
  constructor() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.gameStarted = false;
    
    // Create card symbols (emojis)
    this.symbols = ['🍎', '🍊', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝'];
    this.initGame();
  }

  initGame() {
    // Duplicate symbols to create pairs
    const gameSymbols = [...this.symbols.slice(0, 8), ...this.symbols.slice(0, 8)];
    
    // Shuffle the cards
    this.shuffleArray(gameSymbols);
    
    // Create card elements
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    gameSymbols.forEach((symbol, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.symbol = symbol;
      card.dataset.index = index;
      
      // Front of card (hidden)
      const front = document.createElement('div');
      front.className = 'card-front';
      front.textContent = '?';
      
      // Back of card (shows symbol)
      const back = document.createElement('div');
      back.className = 'card-back';
      back.textContent = symbol;
      
      card.appendChild(front);
      card.appendChild(back);
      
      card.addEventListener('click', () => this.flipCard(card));
      gameBoard.appendChild(card);
      
      this.cards.push(card);
    });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  flipCard(card) {
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.startTimer();
    }
    
    // Don't allow flipping if card is already flipped or matched
    if (card.classList.contains('flipped') || card.classList.contains('matched') || this.flippedCards.length >= 2) {
      return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    this.flippedCards.push(card);
    
    // Check for match when two cards are flipped
    if (this.flippedCards.length === 2) {
      this.moves++;
      document.getElementById('moves').textContent = this.moves;
      
      setTimeout(() => {
        const card1 = this.flippedCards[0];
        const card2 = this.flippedCards[1];
        
        if (card1.dataset.symbol === card2.dataset.symbol) {
          // Match found
          card1.classList.add('matched');
          card2.classList.add('matched');
          this.matchedPairs++;
          
          this.flippedCards = [];
          
          // Check for win
          if (this.matchedPairs === 8) {
            this.endGame();
          }
        } else {
          // Not a match, flip cards back
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          this.flippedCards = [];
        }
      }, 1000);
    }
  }

  startTimer() {
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      document.getElementById('timer').textContent = elapsedTime;
    }, 1000);
  }

  endGame() {
    clearInterval(this.timerInterval);
    const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
    
    setTimeout(() => {
      alert(`Congratulations! You won in ${this.moves} moves and ${totalTime} seconds!`);
    }, 500);
  }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  new MemoryGame();
});