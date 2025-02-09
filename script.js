document.addEventListener("DOMContentLoaded", () => {
    const gridSizeSelect = document.getElementById("grid-size");
    const movesDisplay = document.getElementById("moves");
    const totalmovesDisplay = document.getElementById("totalmoves");
    const messageDisplay = document.getElementById("message");
    const gridContainer = document.getElementById("grid-container");


    let moves = parseInt(sessionStorage.getItem("moves")) || 0;
    let totalMoves = parseInt(localStorage.getItem("totalMoves")) || 0;
    let matchedPairs = 0;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let totalPairs;
    let cardValues = [];


   
    movesDisplay.textContent = moves;
    totalmovesDisplay.textContent = totalMoves;


   
    if (localStorage.getItem("gridSize")) {
        gridSizeSelect.value = localStorage.getItem("gridSize");
    }


   
    if (sessionStorage.getItem("gameState")) {
        restoreGame();
    }


    document.getElementById("start").addEventListener("click", startGame);


    function startGame() {
        const size = parseInt(gridSizeSelect.value);
        gridContainer.innerHTML = "";
        moves = 0;
        matchedPairs = 0;
        messageDisplay.textContent = "";
        movesDisplay.textContent = moves;
        sessionStorage.setItem("moves", moves);
        localStorage.setItem("gridSize", size);
        totalPairs = (size * size) / 2;


        gridContainer.style.gridTemplateColumns = `repeat(${size}, 100px)`;
        gridContainer.style.gridTemplateRows = `repeat(${size}, 100px)`;


        // Generate shuffled card values
        cardValues = [];
        for (let i = 0; i < totalPairs; i++) {
            cardValues.push(String.fromCharCode(65 + i), String.fromCharCode(65 + i));
        }
        cardValues.sort(() => 0.5 - Math.random());


        let storedState = {};
        let storedCards = {};


        for (let i = 0; i < size * size; i++) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.index = i;
            card.innerHTML = `<div class="front"></div><div class="back">${cardValues[i]}</div>`;
            card.addEventListener("click", () => flipCard(card));


            gridContainer.appendChild(card);
            storedState[i] = { value: cardValues[i], flipped: false };
            storedCards[i] = false; // Initially, no card is flipped
        }


        sessionStorage.setItem("gameState", JSON.stringify(storedState));
        sessionStorage.setItem("flippedCards", JSON.stringify(storedCards));
    }


    function flipCard(card) {
        if (lockBoard || card === firstCard || card.classList.contains("flip")) return;


        card.classList.add("flip");
        updateFlippedCards(card.dataset.index, true);


        if (!firstCard) {
            firstCard = card;
        } else {
            secondCard = card;
            moves++;
            movesDisplay.textContent = moves;
            sessionStorage.setItem("moves", moves);


           
            totalMoves++;
            totalmovesDisplay.textContent = totalMoves;
            localStorage.setItem("totalMoves", totalMoves);


            checkForMatch();
        }
    }


    function checkForMatch() {
        const isMatch =
            firstCard.querySelector(".back").textContent ===
            secondCard.querySelector(".back").textContent;


        if (isMatch) {
            matchedPairs++;
            disableCards();


            if (matchedPairs === totalPairs) {
                showGameOver();
            }
        } else {
            unflipCards();
        }
    }


    function disableCards() {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        resetBoard();
    }


    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");
            updateFlippedCards(firstCard.dataset.index, false);
            updateFlippedCards(secondCard.dataset.index, false);
            resetBoard();
        }, 1000);
    }


    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }


    function showGameOver() {
        messageDisplay.textContent = `Game Over! You completed the game in ${moves} moves.`;
        sessionStorage.removeItem("gameState");
        sessionStorage.removeItem("flippedCards");
        sessionStorage.removeItem("moves");
    }


    function updateFlippedCards(index, flipped) {
        let flippedCards = JSON.parse(sessionStorage.getItem("flippedCards"));
        flippedCards[index] = flipped;
        sessionStorage.setItem("flippedCards", JSON.stringify(flippedCards));
    }


    function restoreGame() {
        const storedGame = JSON.parse(sessionStorage.getItem("gameState"));
        const storedFlippedCards = JSON.parse(sessionStorage.getItem("flippedCards"));
        const size = parseInt(gridSizeSelect.value);
        totalPairs = (size * size) / 2;


        gridContainer.innerHTML = "";
        gridContainer.style.gridTemplateColumns = `repeat(${size}, 100px)`;
        gridContainer.style.gridTemplateRows = `repeat(${size}, 100px)`;


        for (let i = 0; i < size * size; i++) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.index = i;
            card.innerHTML = `<div class="front"></div><div class="back">${storedGame[i].value}</div>`;
            if (storedFlippedCards[i]) {
                card.classList.add("flip");
            }
            card.addEventListener("click", () => flipCard(card));


            gridContainer.appendChild(card);
        }
    }


 
    window.addEventListener("storage", (event) => {
        if (event.key === "totalMoves") {
            totalMoves = parseInt(event.newValue);
            totalmovesDisplay.textContent = totalMoves;
        }
    });




    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            sessionStorage.removeItem("moves");
            moves = 0;
            movesDisplay.textContent = moves;
        }
    });
});



