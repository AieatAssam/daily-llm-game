document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const scoreElement = document.getElementById('score');
    const movesElement = document.getElementById('moves');
    const restartBtn = document.getElementById('restartBtn');
    
    let score = 0;
    let moves = 0;
    let flippedCards = [];
    let matchedPairs = 0;
    let lockBoard = false;
    
    // Color palette for the game
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B',
        '#FB5607', '#8338EC', '#3A86FF', '#38B000'
    ];
    
    // Duplicate colors to create pairs
    let gameColors = [...colors, ...colors];
    
    // Initialize the game
    function initGame() {
        score = 0;
        moves = 0;
        flippedCards = [];
        matchedPairs = 0;
        lockBoard = false;
        
        scoreElement.textContent = score;
        movesElement.textContent = moves;
        
        // Shuffle the colors
        shuffleArray(gameColors);
        
        // Clear the game board
        gameBoard.innerHTML = '';
        
        // Create cards
        gameColors.forEach((color, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.color = color;
            card.dataset.index = index;
            
            // Initially show the back of the card
            card.style.backgroundColor = '#ddd';
            
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }
    
    // Shuffle array using Fisher-Yates algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    // Flip a card
    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCards[0]) return;
        if (flippedCards.length === 2) return;
        
        this.style.backgroundColor = this.dataset.color;
        this.classList.add('flipped');
        
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            moves++;
            movesElement.textContent = moves;
            checkForMatch();
        }
    }
    
    // Check if the two flipped cards match
    function checkForMatch() {
        const [firstCard, secondCard] = flippedCards;
        const isMatch = firstCard.dataset.color === secondCard.dataset.color;
        
        if (isMatch) {
            disableCards();
            score += 10;
            scoreElement.textContent = score;
        } else {
            unflipCards();
        }
    }
    
    // Disable matched cards
    function disableCards() {
        flippedCards[0].classList.add('matched');
        flippedCards[1].classList.add('matched');
        
        flippedCards = [];
        matchedPairs++;
        
        // Check for win
        if (matchedPairs === colors.length) {
            setTimeout(() => {
                alert(`Congratulations! You won with ${moves} moves and ${score} points!`);
            }, 500);
        }
    }
    
    // Unflip non-matching cards
    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            flippedCards[0].style.backgroundColor = '#ddd';
            flippedCards[1].style.backgroundColor = '#ddd';
            
            flippedCards[0].classList.remove('flipped');
            flippedCards[1].classList.remove('flipped');
            
            flippedCards = [];
            lockBoard = false;
        }, 1000);
    }
    
    // Restart the game
    restartBtn.addEventListener('click', initGame);
    
    // Start the game
    initGame();
});