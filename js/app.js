/*
 * Create a list that holds all of your cards
 */

(function(){

    const listOfCards = ["fa fa-paw", "fa fa-diamond", "fa fa-anchor", "fa fa-bolt",
        "fa fa-heart", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle", "fa fa-paw", "fa fa-bomb",
        "fa fa-leaf", "fa fa-bomb", "fa fa-bolt", "fa fa-bicycle", "fa fa-diamond", "fa fa-heart"];

    /*
     * Display the cards on the page
     *   - shuffle the list of cards using the provided "shuffle" method below
     *   - loop through each card and create its HTML
     *   - add each card's HTML to the page
     */

    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    let openList = [];
    let matchList = [];
    let counterOfMoves = 0;
    const moveCounterDisplay = document.querySelector('.moves');
    const deckOfCards = document.querySelector('.deck');
    const starsPanel = document.querySelector('.stars');
    const cards = document.querySelectorAll('.deck li');
    const stars = starsPanel.querySelectorAll('li');
    const restartButton = document.querySelector('.restart');
    const restartButtonPopup = document.querySelector('.congratulations .restart')
    let startTime;
    let endTime;
    let timerInterval;
    let timerCounter = 0;
    let timerMin = 0;

    addRandomSymbolToCard(cards);

    /*
     * set up the event listener for a card. If a card is clicked:
     *  - display the card's symbol (put this functionality in another function that you call from this one)
     *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
     *  - if the list already has another card, check to see if the two cards match
     *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
     *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
     *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
     *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
     */

    deckOfCards.addEventListener('click', function (evt) {

        /* This condition makes sure that:
         * - player doesn't click deck
         * - player doesn't click the same card
         * - player doesn't click the symbol
         */

        if (!(evt.target.className === 'deck') && (openList.length <= 2) && !(evt.target.isClicked === 1) && !(evt.target.localName === 'i')) {
            showSymbol(evt);
            addCardToOpenList(evt);
            incrementCounter();

            //timer

            if (counterOfMoves === 1) {
                timerInterval = setInterval(function () {
                    startTimer();
                }, 1000);
            }
            timeOfGame();
            removeStarFromScorePanel();
        }
    })

    //restart buttons

    restartButton.addEventListener('click', function () {
        resetGame();
    })

    restartButtonPopup.addEventListener('click', function () {
      resetGame();
    })

    /*
     * Functions for the game
     */

    function showSymbol(evt) {
        evt.target.className = 'card open show';
        evt.target.isClicked = 1;

    }

    function addCardToOpenList(evt) {
        openList.push(evt.target.firstElementChild);
        checkTwoCardsMatch(openList);
        checkTwoCardsNotMatch(openList);
    }

    function checkTwoCardsMatch(array) {
        if (array.length === 2 && array[0].className === array[1].className) {
            array[0].parentNode.className = 'card match show';
            array[1].parentNode.className = 'card match show';
            matchList.push(array[0]);
            clearTheOpenList(array);
        }
    }

    function checkTwoCardsNotMatch(array) {
        if (array.length === 2 && array[0].className !== array[1].className) {
            setTimeout(function () {
                array[0].parentNode.className = 'card close';
                array[1].parentNode.className = 'card close';
                array[0].parentNode.isClicked = 0;
                array[1].parentNode.isClicked = 0;
                clearTheOpenList(array);
            }, 800);
        }
    }


    function clearTheOpenList(array) {
        for (let i = 0; i < 2; i++) {
            array.shift();
        }
        return array;
    }

    function addRandomSymbolToCard(array) {
        let shuffleListOfCards = shuffle(listOfCards);
        for (i = 0; i < array.length; i++) {
            array[i].firstElementChild.className = shuffleListOfCards[i];
        }
    }

    function startTimer() {
        let sec;
        timerCounter++
        sec = timerCounter;
        if (timerCounter === 60) {
            timerMin++;
            sec = 0;
            timerCounter = 0;
        }
        document.querySelector('.timer').innerHTML = addZeroToTimer(timerMin) + ':' + addZeroToTimer(sec);
    }

    function addZeroToTimer(number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number;
        }

    }

    /*
     * score panel
     */

    function removeStarFromScorePanel() {
        if (counterOfMoves === 30) {
            starsPanel.lastElementChild.style.visibility = 'hidden';
        } else if (counterOfMoves === 50) {
            starsPanel.lastElementChild.previousElementSibling.style.visibility = 'hidden';
        }
    }

    function resetGame() {
        for (let card of cards) {
            card.className = "card close";
            card.isClicked = 0;
        }
        for (star of stars) {
            star.style.visibility = "visible";
        }
        stopTimer();
        counterOfMoves = 0;
        moveCounterDisplay.innerHTML = counterOfMoves;
        matchList = [];
        openList = [];
        addRandomSymbolToCard(cards);
        document.querySelector(".win-popup").style.display = "none";
    }
    function getCounterOfMoves() {
        let counterOfMoves = 0;
        return counterOfMoves;
    }

    function setCounterOfMoves(number) {


    }

    function incrementCounter() {
        counterOfMoves++;
        moveCounterDisplay.innerHTML = counterOfMoves;
    }

    /*
     * congratulations popup
     */

    function changeSizeOfElement(element, widthElement = 200, countH = 10, countW = 10, display) {
        let countHeight = 0;
        let countWidth = 0;
        let id = setInterval(function () {
            countHeight += countH;
            countWidth += countW;
            element.style.display = display;
            element.style.height = countHeight + 'px';
            element.style.width = countWidth + 'px';
            element.style.opacity = widthElement / (widthElement * 3 - widthElement * 2);
            if (countHeight >= widthElement) {
                clearInterval(id)
            }
        }, 5);

    }

    function openPopup() {
        let heightElement = 400;
        if (window.innerWidth < 900) {
            heightElement = 305;
        }
        if (window.innerWidth <= 600) {
            heightElement = 250;
        }
        if (window.innerWidth <= 450) {
            heightElement = 160;
        }

        changeSizeOfElement(document.querySelector('.win-popup'), heightElement, 10, 10, 'inherit');

        document.querySelector('#score-time').innerHTML = (Math.round(endTime / 1000, 2) + ' sec');

        document.querySelector('#score-moves').innerHTML = (counterOfMoves + ' moves');

        if (counterOfMoves <= 29) {
            document.querySelector('#score-stars').innerHTML =
            `<img src="img/star.png" alt="star">
            <img src="img/star.png" alt="star">
            <img src="img/star.png" alt="star">`;
        } else if (counterOfMoves <= 49) {
            document.querySelector('#score-stars').innerHTML =
            `<img src="img/star.png" alt="star">
            <img src="img/star.png" alt="star">`;
        } else {
            document.querySelector('#score-stars').innerHTML =
            `<img src="img/star.png" alt="star">`
        }

        setTimeout(function () {
            document.querySelector('table').style.display = 'inline-table';
        }, 500)
    }

    function timeOfGame() {

// start game

        if (counterOfMoves === 1) {
            startTime = Date.now();
        }

// end game

        if (matchList.length === 8) {
            endTime = Date.now() - startTime;
            openPopup();
            stopTimer();
        }

    }

    function getScore () {
        let score = (100 - Math.floor(endTime / 1000)) + (100 - counterOfMoves);
        return score;
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerCounter = 0;
        timerMin = 0;
        document.querySelector('.timer').innerHTML = '00:00';
    }

})()
