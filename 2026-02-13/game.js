document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const solveBtn = document.getElementById('solve-btn');
    const moveCountElement = document.getElementById('move-count');
    
    let tiles = [];
    let emptyTileIndex = 15; // Start with the empty space at the end
    let moveCount = 0;
    
    // Initialize the game board
    function initBoard() {
        board.innerHTML = '';
        tiles = [];
        moveCount = 0;
        moveCountElement.textContent = moveCount;
        
        // Create tiles with numbers 1-15
        for (let i = 0; i < 15; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.textContent = i + 1;
            tile.dataset.index = i;
            tile.addEventListener('click', () => moveTile(i));
            
            board.appendChild(tile);
            tiles.push(tile);
        }
        
        // Add empty tile
        const emptyTile = document.createElement('div');
        emptyTile.classList.add('tile', 'empty');
        emptyTile.dataset.index = 15;
        board.appendChild(emptyTile);
        tiles.push(emptyTile);
    }
    
    // Move a tile if it's adjacent to the empty space
    function moveTile(index) {
        const emptyIndex = emptyTileIndex;
        
        // Check if the clicked tile is adjacent to the empty space
        if (isAdjacent(index, emptyIndex)) {
            // Swap the tile with the empty space
            swapTiles(index, emptyIndex);
            moveCount++;
            moveCountElement.textContent = moveCount;
            
            // Check if the puzzle is solved
            if (isPuzzleSolved()) {
                setTimeout(() => {
                    alert(`Congratulations! You solved the puzzle in ${moveCount} moves!`);
                }, 300);
            }
        }
    }
    
    // Check if two tiles are adjacent (horizontally or vertically)
    function isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / 4);
        const col1 = index1 % 4;
        const row2 = Math.floor(index2 / 4);
        const col2 = index2 % 4;
        
        return (
            (Math.abs(row1 - row2) === 1 && col1 === col2) || 
            (Math.abs(col1 - col2) === 1 && row1 === row2)
        );
    }
    
    // Swap two tiles
    function swapTiles(index1, index2) {
        // Swap DOM elements
        const temp = tiles[index1].cloneNode(true);
        tiles[index1].replaceWith(tiles[index2].cloneNode(true));
        tiles[index2].replaceWith(temp);
        
        // Update dataset indices
        tiles[index1].dataset.index = index1;
        tiles[index2].dataset.index = index2;
        
        // Add event listener to the moved tile
        if (!tiles[index1].classList.contains('empty')) {
            tiles[index1].addEventListener('click', () => moveTile(index1));
        }
        if (!tiles[index2].classList.contains('empty')) {
            tiles[index2].addEventListener('click', () => moveTile(index2));
        }
        
        // Update empty tile index
        if (index1 === emptyTileIndex) {
            emptyTileIndex = index2;
        } else {
            emptyTileIndex = index1;
        }
    }
    
    // Shuffle the tiles
    function shuffleTiles() {
        // Perform a series of random valid moves to ensure the puzzle remains solvable
        for (let i = 0; i < 500; i++) {
            const possibleMoves = [];
            
            // Find all tiles adjacent to the empty space
            for (let j = 0; j < 16; j++) {
                if (isAdjacent(j, emptyTileIndex)) {
                    possibleMoves.push(j);
                }
            }
            
            // Select a random adjacent tile to move
            if (possibleMoves.length > 0) {
                const randomIndex = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                swapTiles(randomIndex, emptyTileIndex);
            }
        }
        
        moveCount = 0;
        moveCountElement.textContent = moveCount;
    }
    
    // Check if the puzzle is solved
    function isPuzzleSolved() {
        for (let i = 0; i < 15; i++) {
            if (parseInt(tiles[i].textContent) !== i + 1) {
                return false;
            }
        }
        return emptyTileIndex === 15; // Empty space should be in the last position
    }
    
    // Solve the puzzle (reset to original state)
    function solvePuzzle() {
        initBoard();
    }
    
    // Event listeners
    shuffleBtn.addEventListener('click', shuffleTiles);
    solveBtn.addEventListener('click', solvePuzzle);
    
    // Initialize the game
    initBoard();
});