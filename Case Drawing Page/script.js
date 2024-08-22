const topSidePieces = [...document.getElementsByClassName("top-side-piece")];
const rightSidePieces = [...document.getElementsByClassName("right-side-piece")];
const bottomSidePieces = [...document.getElementsByClassName("bottom-side-piece")];
const leftSidePieces = [...document.getElementsByClassName("left-side-piece")];
const squarePieces = [...document.getElementsByClassName("square-piece")];
const colors = ['rgb(128,128,128)', 'rgb(255,255,0)', 'rgb(255,0,0)', 'rgb(255,165,0)', 'rgb(0,0,255)', 'rgb(0,255,0)'];

// Set up event listener on each piece so that it changes color when clicked
// Top side pieces
topSidePieces.forEach(piece => {
    piece.addEventListener('click', () => {
        // Current color of piece is stored as innerText of that piece
        const currColorIndex = parseInt(piece.innerText);
        const newColorIndex = (currColorIndex + 1) % 6;
        const newColor = colors[newColorIndex];
        
        // Update color and index of piece
        piece.style.borderBottomColor = newColor;
        piece.innerText = newColorIndex;
    })
});

// Right side pieces
rightSidePieces.forEach(piece => {
    piece.addEventListener('click', () => {
        // Current color of piece is stored as innerText of that piece
        const currColorIndex = parseInt(piece.innerText);
        const newColorIndex = (currColorIndex + 1) % 6;
        const newColor = colors[newColorIndex];
        
        // Update color and index of piece
        piece.style.borderLeftColor = newColor;
        piece.innerText = newColorIndex;
    })
});

// Bottom side pieces
bottomSidePieces.forEach(piece => {
    piece.addEventListener('click', () => {
        // Current color of piece is stored as innerText of that piece
        const currColorIndex = parseInt(piece.innerText);
        const newColorIndex = (currColorIndex + 1) % 6;
        const newColor = colors[newColorIndex];
        
        // Update color and index of piece
        piece.style.borderTopColor = newColor;
        piece.innerText = newColorIndex;
    })
});

// Left side pieces
leftSidePieces.forEach(piece => {
    piece.addEventListener('click', () => {
        // Current color of piece is stored as innerText of that piece
        const currColorIndex = parseInt(piece.innerText);
        const newColorIndex = (currColorIndex + 1) % 6;
        const newColor = colors[newColorIndex];
        
        // Update color and index of piece
        piece.style.borderRightColor = newColor;
        piece.innerText = newColorIndex;
    })
});

// Square pieces
squarePieces.forEach(piece => {
    piece.addEventListener('click', () => {
        // Current color of piece is stored as innerText of that piece
        const currColorIndex = parseInt(piece.innerText);
        const newColorIndex = (currColorIndex + 1) % 6;
        const newColor = colors[newColorIndex];
        
        // Update color and index of piece
        piece.style.backgroundColor = newColor;
        piece.innerText = newColorIndex;
    })
});