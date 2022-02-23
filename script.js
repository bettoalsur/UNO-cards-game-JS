
const deck = [];
const table = [];
const colors = ["darkred","orange","darkgreen","darkblue"];
const symbols = ["0","1","2","3","4","5","6","7","8","9","reverse","block","p2"];
const jokers = ["changeColor","p4"];

let turn = 5000;
let direction = 1;
let isMyTurn = false;

const players = [];

function createCards() {

    for (let color of colors){

        for (let i = 0 ; i < symbols.length ; i ++) {
    
            let card = {
                color: color,
                symbol: symbols[i]
            }
            
            if (i==0) {
                deck.push(card);
            } else {
                deck.push(card);
                deck.push(card);
            }
        }
    }
    
    for (let joker of jokers){
        let card = {
            color: "black",
            symbol: joker
        }
        deck.push(card);
        deck.push(card);
        deck.push(card);
        deck.push(card);
    }

}

function shuffleCards() {
    deck.sort( () => Math.random() - 0.5 );
}

function giveCardsToPlayers() {

    for (let j = 0 ; j < 4 ; j ++) {

        let playerCards = [];
        for (let i = 0 ; i < 7 ; i++) {
            playerCards.push(deck[0]);
            deck.shift();
        }
        playerCards = organizeCards(playerCards);
        players.push(playerCards);
    }
}

function organizeCards(playerCards) {

    let organizedCards = [];

    for( let color of ['black'].concat(colors) ) {
        let filteredCards = playerCards.filter( e => e.color == color );
        organizedCards = organizedCards.concat(filteredCards.sort((a,b) => {
            if (a.symbol > b.symbol) return 1;
            if (a.symbol < b.symbol) return -1;
            return 0;
        }));
    }
    return organizedCards;
}

function startTable() {
    
    for(let i = 0; i < deck.length ; i ++) {

        if ( !isNaN(parseInt( deck[i].symbol )) ) {
            table.push( deck[i] );
            deck.splice(i,1);
            return;
        }
    }
}

function renderTable() {
    let tableCard = document.getElementById("tableCard");

    let symbolHTML;
    
    let carta = table[table.length-1];

    if ( carta.symbol == "reverse" ) symbolHTML = '<ion-icon name="refresh-outline"></ion-icon>';
    else if ( carta.symbol == "block" ) symbolHTML = '<ion-icon name="ban-outline"></ion-icon>';
    else if ( carta.symbol == "changeColor" ) symbolHTML = '<ion-icon name="color-palette-outline"></ion-icon>';
    else if ( carta.symbol == "p2" ) symbolHTML = `<p>+2</p>`;
    else if ( carta.symbol == "p4" ) symbolHTML = `<p>+4</p>`;
    else symbolHTML = `<p>${carta.symbol}</p>`;

    tableCard.innerHTML = `
    <div style="background-color: ${carta.color};" class="card">
        <div class="logo">
            ${symbolHTML}
        </div>
    </div>
    `;
}
/* 
function sortCardsOnContainer(){

    const parentEl = document.getElementById("cardsContainer");

    let cards = document.getElementsByClassName("card"),
    cw = parentEl.clientWidth*0.8,
    sw = parentEl.scrollWidth,
    diff = sw - cw,
    offset = diff / (cards.length - 1);

  for (let i = 1; i < cards.length; i++) {
    cards[i].style.transform = "translateX(-" + offset * i + "px)";
  }
} */

function renderUserCards() {
    let cardsContainer = document.getElementById("cardsContainer");
    cardsContainer.innerHTML = "";

    let cont = 0;
    for (let carta of players[0]) {

        let symbolHTML;

        if ( carta.symbol == "reverse" ) symbolHTML = '<ion-icon name="refresh-outline"></ion-icon>';
        else if ( carta.symbol == "block" ) symbolHTML = '<ion-icon name="ban-outline"></ion-icon>';
        else if ( carta.symbol == "changeColor" ) symbolHTML = '<ion-icon name="color-palette-outline"></ion-icon>';
        else if ( carta.symbol == "p2" ) symbolHTML = '+2';
        else if ( carta.symbol == "p4" ) symbolHTML = '+4';
        else symbolHTML = `${carta.symbol}`;

        cardsContainer.innerHTML += `
        <div style="background-color: ${carta.color};" class="card" onclick="handleClick(this)">
            <div class="logo">
                ${symbolHTML}
            </div>
        </div>
        `;
        
        cont++;
    }
    // sortCardsOnContainer();
}

function renderOtherPlayers() {
    for(let numPlayer = 1; numPlayer < 4; numPlayer++){

        let element = document.querySelector(".player-"+(numPlayer+1));
        element.innerHTML = "";

        for(let card of players[numPlayer]){
            element.innerHTML += `
            <p style="color: ${card.color};"> ${card.symbol}</p> 
            `;
        }
    }
}

function takeCard() {

    let currentPlayer = turn%4;
    let takenCard = [];

    takenCard.push(deck[0]);
    players[currentPlayer].push(deck[0]);
    deck.shift();

    players[currentPlayer] = organizeCards(players[currentPlayer]);

    return takenCard;
}

function handleClick(cardObject) {

    if (!isMyTurn) return;

    const cardsContainer = document.getElementById("cardsContainer");
    const myCards = [...cardsContainer.querySelectorAll(".card")];
    const indexCard = myCards.findIndex(card => card == cardObject)

    let selectedCard = players[0][indexCard];

    if ( !isValidCard(selectedCard) ) return;

    // valid selection

    table.push( selectedCard );
    players[0].splice(indexCard,1);
    myCards[indexCard].remove();
    renderTable();

    // table array updated
    // cards array updated
    // screen updated: table and cards container

    isMyTurn = false;
    myCards.forEach( card => card.classList.remove("my-turn") );

    // efect of my turn removed

    handlePowerUps(selectedCard);
}

function isValidCard(card) {

    let tableCard = table[table.length-1];

    if (card.symbol == tableCard.symbol || 
        card.color == tableCard.color || 
        card.color == "black") return true;

        return false;
}

function handleTurn() {

    for (let i = 1 ; i < 4 ; i++){
        let turnOfObj = document.querySelector(".player-"+(i+1));
        if (i == turn%4){
            turnOfObj.classList.add("turnOf");
        } else {
            turnOfObj.classList.remove("turnOf");
        }
    }
    
    let validCards = 0;

    players[turn%4].forEach( card => {
        if (isValidCard(card)) validCards++;
    });

    // if there are NOT valid cards to play 

    if (validCards == 0) {
        takeCardActions();
        return;
    }

    // if there are valid cards to play 

    placeCardActions();
}

function takeCardActions() {

    currentPlayer = turn%4;

    if (currentPlayer == 0) {
        setTimeout(() => {
            console.log(`You're taking a card`);
        },1500);
    } else {
        setTimeout(() => {
            console.log(`Player ${currentPlayer+1} is taking a card`);
        },1500);
    }

    if (currentPlayer == 0) {
        setTimeout(() => {
            takeCard();
            turn += direction;
            renderUserCards();
            handleTurn();
        },4000);
    } else {
        setTimeout(() => {
            takeCard();
            turn += direction;
            renderOtherPlayers();
            handleTurn();
        },4000);
    }
}

function placeCardActions(){

    let currentPlayer = turn%4;
    
    if (currentPlayer==0) {

        console.log("It's your time!");
        let cards = document.querySelectorAll(".cards-container .card");
        cards.forEach( card => card.classList.add("my-turn") );
        isMyTurn = true;

    } else {
        //logic for the other players...

        console.log(`Player ${currentPlayer+1} is thinking`);

        let validCards = players[currentPlayer].filter(card => isValidCard(card));

        let jokers = validCards.filter(validCard => validCard.color == "black");
        let noJokers = validCards.filter(validCard => validCard.color != "black");

        let selectedCard;
        if ( noJokers.length > 0 ) {
            noJokers = noJokers.sort((a,b) => {
                if (a.symbol > b.symbol) return 1;
                if (a.symbol < b.symbol) return -1;
                return 0;
            });
            selectedCard = noJokers[noJokers.length-1];
        } else if (jokers.length > 0) {
            selectedCard = jokers[0];
        } else {
            console.log("SOMETHING WENT WRONG!!")
        }

        let index = players[currentPlayer].findIndex(card => card == selectedCard);

        table.push(selectedCard);
        players[currentPlayer].splice(index,1);

        setTimeout(() => {
            renderTable();
            renderOtherPlayers();
            handlePowerUps(selectedCard);
        },3000);
    }
}

function handlePowerUps(selectedCard) {

    // it's a number

    if ( !isNaN(parseInt( selectedCard.symbol )) ) {
        turn += direction;
        handleTurn();
        return;
    }

    // it's NOT a number:

    if (selectedCard.symbol == "reverse") {

        const reverseIcon = document.getElementById("table");
        reverseIcon.classList.toggle("inverse");

        direction *= -1;
        turn += direction;
        handleTurn();
        return;
    }

    if (selectedCard.symbol == "block") {
        turn += direction;
        turn += direction;
        handleTurn();
        return;
    }

    if (selectedCard.symbol == "p2") {
        turn += direction;
        takeCard();
        takeCard();
        setTimeout(() => {
            turn += direction;
            renderOtherPlayers();
            renderUserCards();
            handleTurn();
            return;
        },500);
    }

    if (selectedCard.symbol == "changeColor" || selectedCard.symbol == "p4") {

        if(turn%4==0) {
            chooseColor(selectedCard);
            return;
        } else {
            console.log(`Player ${turn%4+1} is choosing a color`);
            setTimeout(() => {
                chooseColor(selectedCard);
                return;
            },2000)
        }
    }
}

function chooseColor(selectedCard) {

    let currentPlayer = turn%4;

    if ( currentPlayer == 0 ){
        let chooseColorWindow = document.querySelector(".choose-color-window");
        chooseColorWindow.classList.remove("hide");

        let optionColors = [...chooseColorWindow.querySelectorAll(".color")];

        optionColors.forEach(color => color.addEventListener("click", (e) => {
            let objectColor = e.target;
            let indexColor = optionColors.findIndex(color => color == objectColor);
            let chosenColor = colors[indexColor];

            chooseColorWindow.classList.add("hide");

            table.pop();
            let card = {
                color: chosenColor,
                symbol: selectedCard.symbol
            }
            table.push(card);
            renderTable();

            if ( selectedCard.symbol == "p4") {
                turn += direction;
                takeCard();
                takeCard();
                takeCard();
                takeCard();
                setTimeout(() => {
                    turn += direction;
                    renderOtherPlayers();
                    handleTurn();
                    return;
                },500);
            } else {
                turn += direction;
                handleTurn();
                return;
            }
        }));
    } else {
        let chosenColor = colors[Math.floor( Math.random(colors.length) )]
        table.pop();
        let card = {
            color: chosenColor,
            symbol: selectedCard.symbol
        }
        table.push(card);
        renderTable();

        if ( selectedCard.symbol == "p4") {
            turn += direction;
            takeCard();
            takeCard();
            takeCard();
            takeCard();
            setTimeout(() => {
                turn += direction;
                renderOtherPlayers();
                renderUserCards();
                handleTurn();
                return;
            },500);
        } else {
            turn += direction;
            handleTurn();
            return;
        }
    }
}

// 
// 
// 

createCards();
shuffleCards();
giveCardsToPlayers();
startTable();

renderTable();
renderUserCards();
renderOtherPlayers();

handleTurn();







