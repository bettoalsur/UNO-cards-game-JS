
let deck = [];
let table = [];
let colors = ["darkred","orange","darkgreen","darkblue"];
let symbols = ["0","1","2","3","4","5","6","7","8","9","reverse","block","p2"];
let jokers = ["changeColor","p4"];

let turn = 0;
let direction = 1;
let availableToClick = false;

let players = [];

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
    tableCard = document.getElementById("tableCard");

    let symbolHTML;
    
    let carta = table[table.length-1];

    if ( carta.symbol == "reverse" ) symbolHTML = '<ion-icon name="refresh-outline"></ion-icon>';
    else if ( carta.symbol == "block" ) symbolHTML = '<ion-icon name="ban-outline"></ion-icon>';
    else if ( carta.symbol == "changeColor" ) symbolHTML = '<ion-icon name="color-palette-outline"></ion-icon>';
    else if ( carta.symbol == "p2" ) symbolHTML = `<p>+2</p>`;
    else if ( carta.symbol == "p4" ) symbolHTML = `<p>+4</p>`;
    else symbolHTML = `<p>${carta.symbol}</p>`;

    tableCard.innerHTML = `
    <div style="background-color: ${carta.color};" class="card card-on-table">
        <div class="logo">
            ${symbolHTML}
        </div>
    </div>
    `;
}

function renderUserCards() {
    cardsContainer = document.getElementById("cardsContainer");
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
        <div style="background-color: ${carta.color};" class="card" id="${cont}" onclick="handleClick(this)">
            <div class="logo">
                ${symbolHTML}
            </div>
        </div>
        `;
        
        cont++;
    }
}

function takeCard(numPlayer) {

    players[numPlayer].push(deck[0]);
    players[numPlayer] = organizeCards(players[numPlayer]);
    deck.shift();
}

function handleClick(cardObject) {

    if (!availableToClick) return;
    
    let cardId = parseInt( cardObject.id );
    let selectedCard = players[0][cardId];

    let tableCard = table[table.length-1];

    if ( selectedCard.symbol != tableCard.symbol && 
        selectedCard.color != tableCard.color && 
        selectedCard.color != "black" ) return;

    // valid selection

    table.push( selectedCard );
    players[0].splice(cardId,1);

    if (selectedCard.color == "black") {

        renderTable();

        let chosenColor = prompt('choose a color: [ r , y , g , b ]');

        if ( chosenColor == "r" ) chosenColor = "darkred";
        if ( chosenColor == "y" ) chosenColor = "orange";
        if ( chosenColor == "g" ) chosenColor = "darkgreen";
        if ( chosenColor == "b" ) chosenColor = "darkblue";

        table[table.length-1].color = chosenColor;
    }

    availableToClick = false;
    turn += direction;
    renderTable();
    renderUserCards();
    handleTurn();
}

function handleTurn() {

    let currentPlayer = turn%4;

    // console.log(`Turn of Player ${currentPlayer+1}`);

    let tableCard = table[table.length-1];
    let validCards = [];

    players[turn%4].forEach( card => {
        if (card.symbol == tableCard.symbol || 
            card.color == tableCard.color || 
            card.color == "black") {
                validCards.push(card);
            }
    });

    // if there are NOT valid cards to play 

    if (validCards.length == 0) {
        console.log(`Player ${currentPlayer+1} is taking a card`);

        takeCard(currentPlayer);
        turn += direction;

        if (currentPlayer == 0) {
            setTimeout(() => {
                renderTable();
                renderUserCards();
            },4000);
        }

        setTimeout(handleTurn,4000);
        return;
    }

    // if there are valid cards to play 

    if (currentPlayer==0) {
        console.log("It's your time!");
        let cards = document.querySelectorAll(".cards-container .card");
        cards.forEach( card => {
            card.classList.add("my-turn");
            availableToClick = true;
        });
    } else {
        //logic for the other players...
        console.log(`Player ${currentPlayer+1} is thinking`);

        let selectedCardId = Math.floor( Math.random(validCards.length) );
        let selectedCard = validCards[selectedCardId];

        table.push(selectedCard);

        let index = players[currentPlayer].findIndex(element => element === selectedCard);

        players[currentPlayer].splice(index,1);

        if (selectedCard.color == "black") {
            
            setTimeout(() => {
                renderTable();
                console.log(`Player ${currentPlayer+1} is choosing a color`);
                let chosenColor = colors[Math.floor( Math.random(colors.length) )]
                table[table.length-1].color = chosenColor;
            },3000);
        }

        setTimeout(() => {
            turn += direction;
            renderTable();
            handleTurn();
        },5000);
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
handleTurn();







