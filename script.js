
let deck = [];
let table = [];
let colors = ["darkred","orange","darkgreen","darkblue"];
let symbols = ["0","1","2","3","4","5","6","7","8","9","reverse","block","p2"];
let jokers = ["changeColor","p4"];

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
    <div style="background-color: ${carta.color};" class="card">
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
        else if ( carta.symbol == "p2" ) symbolHTML = `<p>+2</p>`;
        else if ( carta.symbol == "p4" ) symbolHTML = `<p>+4</p>`;
        else symbolHTML = `<p>${carta.symbol}</p>`;

        cardsContainer.innerHTML += `
        <div style="background-color: ${carta.color};" class="card" id="${cont}" onclick=handleClick(this)>
            <div class="logo">
                ${symbolHTML}
            </div>
        </div>
        `;
        
        cont++;
    }
}

function handleClick(selectedObject) {
    
    let selectedCardId = parseInt( selectedObject.id );
    let selectedCard = players[0][selectedCardId];

    let tableCard = table[table.length-1];

    if ( selectedCard.symbol != tableCard.symbol && 
        selectedCard.color != tableCard.color && 
        selectedCard.color != "black" ) return;

    table.push( selectedCard );
    players[0].splice(selectedCardId,1);
    selectedObject.remove();

    renderTable();
    renderUserCards();
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






