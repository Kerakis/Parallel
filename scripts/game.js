let level = 0;
let cardName = "";
let cardArt = "";
let cardImage = "";
let format = "";
let guess = "";
let seconds = "";
let timer = "";
let displayTimer = document.getElementById("timerBox");
let historyModal = document.getElementById("historyModalContent");

function init() {
  // Difficulty buttons
  const standard = document.querySelector(`#standard`);
  standard.addEventListener(`click`, () => {
    setFormat(`standard`);
  });
  const pioneer = document.querySelector(`#pioneer`);
  pioneer.addEventListener(`click`, () => {
    setFormat(`pioneer`);
  });
  const modern = document.querySelector(`#modern`);
  modern.addEventListener(`click`, () => {
    setFormat(`modern`);
  });
  const commander = document.querySelector(`#commander`);
  commander.addEventListener(`click`, () => {
    setFormat(`commander`);
  });

  keepScore();
}

// Select format, hide modal, and display game
function setFormat(choice) {
  format = choice;
  let modal = document.getElementById("diffModal");
  modal.style.display = "none";
  let content = document.getElementById("content");
  content.style.display = "flex";
  restartGame();
}

// Fetch a random card
async function fetchCard() {
  try {
    const response = await fetch(
      `https://api.scryfall.com/cards/random?q=f%3A${format}`
    );
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

// Fetch a list of all card names
async function fetchCardNames() {
  try {
    const response = await fetch(`./assets/card-names.json`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

// Restart the Game
function restartGame() {
  seconds = 10;
  level = 0;
  keepScore();
  removeButtons();
  nextRound();
  timerStart();
  hideRestartButton();
  hideFormatButton();
  historyModal.replaceChildren();
  disableHistoryButton();
}

// Disable history during gameplay
function disableHistoryButton() {
  let historyButton = document.getElementById("scoreBox");
  historyButton.setAttribute("data-bs-toggle", "");
}

// Disable history during gameplay
function enableHistoryButton() {
  let historyButton = document.getElementById("scoreBox");
  historyButton.setAttribute("data-bs-toggle", "modal");
}

// Show the restart button
function showRestartButton() {
  let restartButton = document.getElementById("restart");
  restartButton.addEventListener(`click`, restartGame);
  restartButton.style.display = "inline";
}

// Hide the restart button
function hideRestartButton() {
  let restartButton = document.getElementById("restart");
  restartButton.style.display = "none";
}

// Show the change format button
function showFormatButton() {
  let formatButton = document.getElementById("format");
  formatButton.addEventListener(`click`, changeFormat);
  formatButton.style.display = "inline";
}

// Hide the change format button
function hideFormatButton() {
  let formatButton = document.getElementById("format");
  formatButton.style.display = "none";
}

// Stop the timer
function stopTimer(timer) {
  clearInterval(timer);
}

// Game over if the user doesn't choose the correct answer in the allotted time
function timerStart() {
  timer = setInterval(function () {
    if (seconds < 0) {
      stopTimer(timer);

      // Highlight the correct answer
      document.getElementById("correctGuessButton").style.borderColor = "red";

      // Change the instructional text to display the lose condition
      document.getElementById("answerBox").innerHTML = "Time is up! Game over!";

      showRestartButton();
      showFormatButton();

      // Prevent button clicking after loss
      document.getElementById("guessButton1").disabled = true;
      document.getElementById("guessButton2").disabled = true;
      document.getElementById("guessButton3").disabled = true;
      document.getElementById("correctGuessButton").disabled = true;

      enableHistoryButton();

      historyModal.removeChild(historyModal.firstChild);
    } else {
      displayTimer.innerHTML = "00:" + seconds.toString().padStart(2, "0");
      seconds--;
    }
    if (seconds < 4) {
      displayTimer.style.color = "red";
    } else {
      displayTimer.style.color = "#d299ff";
    }
  }, 1000);
}

// Detect user choice and then check answer
function answerSelection(select) {
  guess = select;
  cardGuess();
}

// Pull the needed card information for the current round
async function nextRound() {
  let card = await fetchCard();
  let options = await fetchCardNames();
  // Pull 3 random card names as wrong answers
  let randomCardArray = Array.from({ length: 3 }, () =>
    Math.floor(Math.random() * options.data.length)
  );

  let randomCardName1 = options.data[randomCardArray[0]];
  let randomCardName2 = options.data[randomCardArray[1]];
  let randomCardName3 = options.data[randomCardArray[2]];

  let guessButton1 = document.createElement("button");
  let guessButton2 = document.createElement("button");
  let guessButton3 = document.createElement("button");
  let correctGuessButton = document.createElement("button");

  // Show the random options as buttons
  guessButton1.setAttribute("class", `guessButtons`);
  guessButton1.setAttribute("id", `guessButton1`);
  guessButton1.innerHTML = `${randomCardName1}`;
  guessButton1.addEventListener(`click`, function () {
    answerSelection(randomCardName1);
  });
  document.getElementById("getUserInput").appendChild(guessButton1);
  guessButton2.setAttribute("class", `guessButtons`);
  guessButton2.setAttribute("id", `guessButton2`);
  guessButton2.innerHTML = `${randomCardName2}`;
  guessButton2.addEventListener(`click`, function () {
    answerSelection(randomCardName2);
  });
  document.getElementById("getUserInput").appendChild(guessButton2);
  guessButton3.setAttribute("class", `guessButtons`);
  guessButton3.setAttribute("id", `guessButton3`);
  guessButton3.innerHTML = `${randomCardName3}`;
  guessButton3.addEventListener(`click`, function () {
    answerSelection(randomCardName3);
  });
  document.getElementById("getUserInput").appendChild(guessButton3);

  // Define the card's name
  cardName = card.name;
  correctGuessButton.setAttribute("class", `guessButtons`);
  correctGuessButton.setAttribute("id", `correctGuessButton`);
  correctGuessButton.innerHTML = `${cardName}`;
  correctGuessButton.addEventListener(`click`, function () {
    answerSelection(cardName);
  });
  document.getElementById("getUserInput").appendChild(correctGuessButton);

  // Randomize the order of the answer buttons
  var cardButtons = document.querySelector(".getUserInput");
  for (var i = cardButtons.children.length; i >= 0; i--) {
    cardButtons.appendChild(cardButtons.children[(Math.random() * i) | 0]);
  }

  // Make the button text smaller for long card names like MDFC
  if (randomCardName1.length >= 50 && randomCardName1.length <= 55) {
    document.getElementById("guessButton1").style.fontSize = "0.55rem";
  } else if (randomCardName1.length > 50) {
    document.getElementById("guessButton1").style.fontSize = "0.5rem";
  }
  if (randomCardName2.length >= 50 && randomCardName2.length <= 55) {
    document.getElementById("guessButton2").style.fontSize = "0.55rem";
  } else if (randomCardName2.length > 50) {
    document.getElementById("guessButton2").style.fontSize = "0.5rem";
  }
  if (randomCardName3.length >= 50 && randomCardName3.length <= 55) {
    document.getElementById("guessButton3").style.fontSize = "0.55rem";
  } else if (randomCardName3.length > 50) {
    document.getElementById("guessButton3").style.fontSize = "0.5rem";
  }
  if (cardName.length >= 50 && cardName.length <= 55) {
    document.getElementById("correctGuessButton").style.fontSize = "0.55rem";
  } else if (cardName.length > 50) {
    document.getElementById("correctGuessButton").style.fontSize = "0.5rem";
  }

  // Define the card's flavor text and display it. This should prevent errors for certain multi-face cards.
  if (card.card_faces === undefined) {
    let cardFlavor = card.flavor_text;
    if (cardFlavor !== undefined) {
      document.getElementById("flavorText").innerHTML = `'${cardFlavor}'`;
    } else {
      document.getElementById("flavorText").innerHTML = ``;
    }
  } else if (card.card_faces === 2) {
    let cardFlavor = card.flavor_text;
    if (cardFlavor !== undefined) {
      document.getElementById("flavorText").innerHTML = `'${cardFlavor}'`;
    } else {
      document.getElementById("flavorText").innerHTML = ``;
    }
  } else {
    let cardFlavor = card.card_faces[1].flavor_text;
    if (cardFlavor !== undefined) {
      document.getElementById("flavorText").innerHTML = `'${cardFlavor}'`;
    } else {
      document.getElementById("flavorText").innerHTML = ``;
    }
  }

  // Define the card image and prevent an error if the card has more than one face
  if (card.card_faces === undefined) {
    cardArt = card.image_uris.art_crop;
    cardImage = card.image_uris.border_crop;
    let imageCreate = document.getElementById("currentCardArt");
    imageCreate.setAttribute("src", `${cardArt}`);
    imageCreate.setAttribute("max-width", `25%`);
  } else if (card.image_uris === undefined) {
    cardArt = card.card_faces[0].image_uris.art_crop;
    cardImage = card.card_faces[0].image_uris.border_crop;
    let imageCreate = document.getElementById("currentCardArt");
    imageCreate.setAttribute("src", `${cardArt}`);
    imageCreate.setAttribute("max-width", `25%`);
  } else {
    cardArt = card.image_uris.art_crop;
    cardImage = card.image_uris.border_crop;
    let imageCreate = document.getElementById("currentCardArt");
    imageCreate.setAttribute("src", `${cardArt}`);
    imageCreate.setAttribute("max-width", `25%`);
  }

  // Append card into history modal
  let cardLink = document.createElement("a");
  cardLink.setAttribute("href", `https://scryfall.com/cards/${card.id}`);
  cardLink.setAttribute("target", "_blank");
  cardLink.setAttribute("rel", "noreferrer");
  historyModal.prepend(cardLink);
  let historyCard = document.createElement("img");
  historyCard.setAttribute("src", `${cardImage}`);
  historyCard.setAttribute("class", "historyCards");
  cardLink.appendChild(historyCard);
  let levelDiv = document.createElement("div");
  levelDiv.setAttribute("class", "levelDiv");
  historyModal.prepend(levelDiv);
  let levelNode = document.createElement("p");
  levelDiv.appendChild(levelNode);
  let historyLevel = document.createTextNode(`Level: `);
  levelNode.appendChild(historyLevel);
  let levelSpanNode = document.createElement("span");
  levelSpanNode.setAttribute("class", "levelColorText");
  levelNode.appendChild(levelSpanNode);
  let historyLevelColor = document.createTextNode(`${level}`);
  levelSpanNode.appendChild(historyLevelColor);
  let lineBreak = document.createElement("HR");
  lineBreak.setAttribute("class", "lineBreaks");
  historyModal.prepend(lineBreak);

  // let cardLink = document.createElement("a");
  // cardLink.setAttribute("href", `https://scryfall.com/cards/${card.id}`);
  // cardLink.setAttribute("target", "_blank");
  // cardLink.setAttribute("rel", "noreferrer");
  // historyModal.appendChild(cardLink);
  // let historyCard = document.createElement("img");
  // historyCard.setAttribute("src", `${cardImage}`);
  // historyCard.setAttribute("class", "historyCards");
  // cardLink.appendChild(historyCard);
  // let levelDiv = document.createElement("div");
  // levelDiv.setAttribute("class", "levelDiv");
  // historyModal.appendChild(levelDiv);
  // let levelNode = document.createElement("p");
  // levelDiv.appendChild(levelNode);
  // let historyLevel = document.createTextNode(`Level: `);
  // levelNode.appendChild(historyLevel);
  // let levelSpanNode = document.createElement("span");
  // levelSpanNode.setAttribute("class", "levelColorText");
  // levelNode.appendChild(levelSpanNode);
  // let historyLevelColor = document.createTextNode(`${level}`);
  // levelSpanNode.appendChild(historyLevelColor);
  // let lineBreak = document.createElement("HR");
  // lineBreak.setAttribute("class", "lineBreaks");
  // historyModal.appendChild(lineBreak);
}

// Remove the buttons for the next round
function removeButtons() {
  document.getElementById("getUserInput").innerHTML = "";
}

// Display the card image for the previous round
function displayCard() {
  let previousImage = document.getElementById("cardArt");
  previousImage.setAttribute("src", `${cardArt}`);
  previousImage.setAttribute("width", `250px`);
}

// Increment the level number and display the score
function keepScore() {
  level++;
  document.getElementById("scoreBox").innerHTML = `Level: ${level}`;
}

// Collect user input and check if correct
function cardGuess() {
  let answer = cardName;
  if (guess === answer) {
    document.getElementById("answerBox").style.display = "inline";
    document.getElementById(
      "answerBox"
    ).innerHTML = `Correct! The previous card was ${answer}.`;
    seconds = 10;
    removeButtons();
    displayCard();
    keepScore();
    nextRound();
  } else {
    // Highlight the correct answer
    document.getElementById("correctGuessButton").style.borderColor = "red";
    document.getElementById("answerBox").style.display = "none";
    stopTimer(timer);
    document.getElementById("guessButton1").disabled = true;
    document.getElementById("guessButton2").disabled = true;
    document.getElementById("guessButton3").disabled = true;
    document.getElementById("correctGuessButton").disabled = true;

    enableHistoryButton();
    showRestartButton();
    showFormatButton();
    historyModal.removeChild(historyModal.firstChild);
  }
}

function changeFormat() {
  let modal = document.getElementById("diffModal");
  modal.style.display = "inline";
  let content = document.getElementById("content");
  content.style.display = "none";
  removeButtons();
}

// Run the game on page load
init();

// Always display the current year for the copyright
document
  .getElementById("year")
  .appendChild(document.createTextNode(new Date().getFullYear()));
