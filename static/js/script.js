let blackjackGames = {
    "you": {
        "scoreSpan": "#your-blackjack-result",
        "div": ".your-box",
        "score": 0
    },
    "dealer": {
        "scoreSpan": "#dealer-blackjack-result",
        "div": ".dealer-box",
        "score": 0
    },
    "card": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
    "cardsMap": {
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        "10": 10,
        "K": 10,
        "J": 10,
        "Q": 10,
        "A": [1, 11]
    },
    "wins": 0,
    "losses": 0,
    "draws": 0,
    "isHit": true,
    "isStand": false,
    "turnOver": false
}

const YOU = blackjackGames["you"];
const DEALER = blackjackGames["dealer"];

// sound 
const hitSound = new Audio("/static/sounds/swish.m4a");
const winSound = new Audio("/static/sounds/cash.mp3");
const lossSound = new Audio("/static/sounds/aww.mp3");

// buttons 
document.querySelector("#blackjack-hit-button").addEventListener("click", blackjackHit);
document.querySelector("#blackjack-stand-button").addEventListener("click", blackjackStand);
document.querySelector("#blackjack-deal-button").addEventListener("click", blackjackDeal);


function blackjackHit() {
    if (blackjackGames["isHit"] === true) {
        let card = randomCard();
        showCard(YOU, card);
        updateScore(card, YOU);
        showScore(YOU);
        blackjackGames["isStand"] = true;
    }
}

async function blackjackStand() {
    if (blackjackGames["isStand"] === true) {
        blackjackGames["isHit"] = false;
        blackjackGames["isStand"] = false;

        while (DEALER["score"] < 16) {
            let card = randomCard();
            showCard(DEALER, card);
            updateScore(card, DEALER);
            showScore(DEALER);
            await sleep(1000);
        }


        blackjackGames["turnOver"] = true;
        showResult(computeWinner());
    }
}


function blackjackDeal() {
    if (blackjackGames["turnOver"] === true) {

        blackjackGames["isHit"] = true;
        blackjackGames["isStand"] = false

        let yourImages = document.querySelector(YOU["div"]).querySelectorAll("img");
        let dealerImages = document.querySelector(DEALER["div"]).querySelectorAll("img");

        for (let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }

        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        YOU["score"] = 0;
        DEALER["score"] = 0;

        document.querySelector(YOU["scoreSpan"]).textContent = 0;
        document.querySelector(DEALER["scoreSpan"]).textContent = 0;

        document.querySelector(YOU["scoreSpan"]).style.color = "white";
        document.querySelector(DEALER["scoreSpan"]).style.color = "white";

        document.querySelector("#blackjack-result").textContent = "Let's Play";
        document.querySelector("#blackjack-result").style.color = "black";

        blackjackGames["turnOver"] = false;
    }
}


function showCard(activePlayer, card) {
    if (activePlayer["score"] <= 21) {
        let cardImage = document.createElement("img");
        cardImage.src = "/static/images/" + card + ".webp";
        document.querySelector(activePlayer["div"]).appendChild(cardImage);
        hitSound.play();
    }
}



function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGames["card"][randomIndex];
}

function updateScore(card, activePlayer) {
    if (card === "A") {
        // if adding 11 keeps below or equal to 21, add 11. otherwise add 1
        if (activePlayer["score"] + blackjackGames["cardsMap"][card][1] <= 21) {
            activePlayer["score"] += blackjackGames["cardsMap"][card][1];
        } else {
            activePlayer["score"] += blackjackGames["cardsMap"][card][0];
        }
    } else activePlayer["score"] += blackjackGames["cardsMap"][card];
}

function showScore(activePlayer) {
    if (activePlayer["score"] <= 21) {
        document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];
    } else {
        document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
        document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function computeWinner() {
    let winner;

    if (blackjackGames["isStand"] === false && blackjackGames["isHit"] === false) {
        // if your score less than equal to 21
        if (YOU["score"] <= 21) {
            // if your score is greater than dealer or dealer score is greater than 21
            if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
                blackjackGames["wins"]++;
                winner = YOU;
            }
            // if your score is less than dealer score
            else if (YOU["score"] < DEALER["score"]) {
                blackjackGames["losses"]++;
                winner = DEALER;
            }
            // if both scores are equal
            else if (YOU["score"] === DEALER["score"]) {
                blackjackGames["draws"]++;
            }
        }
        // if score greater than 21 and dealer less than equal to 21
        else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
            blackjackGames["losses"]++;
            winner = DEALER;
        }
        // if both dealer and your score greater than 21
        else if (YOU["score"] > 21 && DEALER["score"] > 21) {
            blackjackGames["draws"]++;
        }
    }

    return winner;
}


function showResult(winner) {
    let message, messageColor;

    if (blackjackGames["turnOver"] === true) {
        if (winner === YOU) {
            document.querySelector("#wins").textContent = blackjackGames["wins"];
            message = "You won!";
            messageColor = "green";
            winSound.play();
        } else if (winner === DEALER) {
            document.querySelector("#losses").textContent = blackjackGames["losses"];
            message = "You lost!";
            messageColor = "red";
            lossSound.play();
        } else {
            document.querySelector("#draws").textContent = blackjackGames["draws"];
            message = "You drew!";
            messageColor = "black";
        }

        document.querySelector("#blackjack-result").textContent = message;
        document.querySelector("#blackjack-result").style.color = messageColor;
    }

}