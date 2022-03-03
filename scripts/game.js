let numberCorrect = 0;
let numberAttempted = 0;
let cardName = "";
let cardArt = "";
let format = "";
let guess = "";
let guessButton1 = document.createElement("button");
let guessButton2 = document.createElement("button");
let guessButton3 = document.createElement("button");
let correctGuessButton = document.createElement("button");
let seconds = "";
let timer = "";
let displayTimer = document.getElementById("timerBox");
const skipButton = document.querySelector(`#skip`);
const formatButton = document.querySelector(`#format`);

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

  // Skip to the next art
  skipButton.addEventListener(`click`, skip);

  // Change format
  formatButton.addEventListener(`click`, changeFormat);
}

// Select format, hide modal, and display game
function setFormat(choice) {
  format = choice;
  nextRound();
  let modal = document.getElementById("diffModal");
  modal.style.display = "none";
  let content = document.getElementById("content");
  content.style.display = "flex";
  seconds = 10;
  timerStart();
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
  correctGuessButton.style.borderColor = "#d299ff";
  nextRound();
  seconds = 10;
  timerStart();
}

// Show the restart button at game end
function showRestartButton() {
  let restartButton = document.getElementById("restart");
  restartButton.addEventListener(`click`, restartGame);
  restartButton.style.display = "inline";
}

// Disable the guess buttons
function disableButtons() {
  guessButton1.disabled = true;
  guessButton2.disabled = true;
  guessButton3.disabled = true;
  correctGuessButton.disabled = true;
  skipButton.disabled = true;
}

// Game over if the user doesn't choose the correct answer in the allotted time
function timerStart() {
  let timer = setInterval(function () {
    if (seconds < 0) {
      clearInterval(timer);

      // Highlight the correct answer
      correctGuessButton.style.borderColor = "red";

      // Change the instructional text to display the lose condition
      document.getElementById("answerBox").innerHTML = "Too slow! Game over!";
      disableButtons();
      showRestartButton();
    } else {
      displayTimer.innerHTML = "00:" + seconds.toString().padStart(2, "0");
      seconds--;
    }
  }, 1000);
}

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

  // Show the random options as buttons
  guessButton1.setAttribute("class", `guessButtons`);
  guessButton1.innerHTML = `${randomCardName1}`;
  guessButton1.addEventListener(`click`, function () {
    answerSelection(randomCardName1);
  });
  document.getElementById("getUserInput").appendChild(guessButton1);
  guessButton2.setAttribute("class", `guessButtons`);
  guessButton2.innerHTML = `${randomCardName2}`;
  guessButton2.addEventListener(`click`, function () {
    answerSelection(randomCardName2);
  });
  document.getElementById("getUserInput").appendChild(guessButton2);
  guessButton3.setAttribute("class", `guessButtons`);
  guessButton3.innerHTML = `${randomCardName3}`;
  guessButton3.addEventListener(`click`, function () {
    answerSelection(randomCardName3);
  });
  document.getElementById("getUserInput").appendChild(guessButton3);

  // Define the card's name
  cardName = card.name;
  correctGuessButton.setAttribute("class", `guessButtons`);
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
    let imageCreate = document.getElementById("currentCardArt");
    imageCreate.setAttribute("src", `${cardArt}`);
    imageCreate.setAttribute("max-width", `25%`);
  } else if (card.card_faces === 2) {
    cardArt = card.card_faces[0].image_uris.art_crop;
    let imageCreate = document.getElementById("currentCardArt");
    imageCreate.setAttribute("src", `${cardArt}`);
    imageCreate.setAttribute("max-width", `25%`);
  } else {
    cardArt = card.card_faces[0].image_uris.art_crop;
    let imageCreate = document.getElementById("currentCardArt");
    imageCreate.setAttribute("src", `${cardArt}`);
    imageCreate.setAttribute("max-width", `25%`);
  }
}

// Remove the buttons for the next round
function removeButtons() {
  document.getElementById("getUserInput").removeChild(guessButton1);
  document.getElementById("getUserInput").removeChild(guessButton2);
  document.getElementById("getUserInput").removeChild(guessButton3);
  document.getElementById("getUserInput").removeChild(correctGuessButton);
}

// Display the card image for the previous round
function displayCard() {
  let imageCreate = document.getElementById("cardArt");
  imageCreate.setAttribute("src", `${cardArt}`);
  imageCreate.setAttribute("width", `250px`);
}

// Increment the number of attempts and display the score
function keepScore() {
  document.getElementById("scoreBox").style.visibility = "visible";
  numberAttempted++;

  document.getElementById(
    "scoreBox"
  ).innerHTML = `Score: ${numberCorrect} / ${numberAttempted}`;

  nextRound();
}

// Collect user input and check if correct
function cardGuess() {
  let answer = cardName;
  if (guess === answer) {
    document.getElementById(
      "answerBox"
    ).innerHTML = `Correct! The card was ${answer}.`;
    numberCorrect++;
    seconds = 10;
    displayCard();
    keepScore();
    removeButtons();
  } else {
    document.getElementById(
      "answerBox"
    ).innerHTML = `Sorry. The correct answer was ${answer}.<br>You answered "${guess}".`;

    displayCard();
    keepScore();
    removeButtons();
    clearInterval(timer);
  }
}

function skip() {
  document.getElementById("scoreBox").style.visibility = "visible";
  document.getElementById(
    "answerBox"
  ).innerHTML = `Skipped! The correct answer was ${cardName}.`;

  // This requires a 1 second delay between skipping to avoid abuse
  document.getElementById("skip").disabled = true;
  setTimeout('document.getElementById("skip").disabled=false;', 1000);

  numberAttempted++;

  document.getElementById(
    "scoreBox"
  ).innerHTML = `Score: ${numberCorrect} / ${numberAttempted}`;

  displayCard();
  nextRound();
  removeButtons();
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
