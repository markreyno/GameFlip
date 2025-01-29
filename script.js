function startGame(){

    const size = document.getElementById('grid-size').value;
    const gridContainer = document.getElementById('grid-container');
    const movesDisplay = document.getElementById('moves');
    const messageDisplay = document.getElementById('message');

    gridContainer.innerHTML = '';

    gridContainer.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    gridContainer.style.gridTemplateRows = `repeat(${size}, 100px)`;
    messageDisplay.textContent = ''; 
    movesDisplay.textContent = '0';
    let moves = 0;

    let matchedPairs = 0;
    const totalCards = size * size;
    const pairs = totalCards/2;
    const cardValues = [];

    for (let i= 0; i < pairs; i++) {
        cardValues.push(String.fromCharCode(65 + i), String.fromCharCode(65 + i));
    }

    cardValues.sort(() => 0.5 - Math.random()); 

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    for (let i = 0; i < totalCards; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="front"></div>
            <div class="back">${cardValues[i]}</div>
        `;
        card.addEventListener('click', () => flipCard(card));
        gridContainer.appendChild(card);
    }

    function flipCard(card) {
        if (lockBoard || card === firstCard || card.classList.contains('flip')) return;

        card.classList.add('flip');

        if (!firstCard) {
            firstCard = card;
        } else {
            secondCard = card;
            moves++;
            checkForMatch();
            movesDisplay.textContent = moves;
        }
    }

    
    function checkForMatch() {
        const isMatch =
            firstCard.querySelector('.back').textContent ===
            secondCard.querySelector('.back').textContent;

        if (isMatch) {
            matchedPairs++; 
            disableCards();
            if (matchedPairs === pairs) {
                endMessage();
            }
        } else {
            unflipCards();
        }

     
    }

    
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    
    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

   
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function endMessage() {
        
        messageDisplay.textContent = `Game Over! You completed the game in ${moves} moves.`;
    }

}




