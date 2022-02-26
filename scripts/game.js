let numberCorrect = 0;
let numberAttempted = 0;

async function fetchCard() {
  // Fetch a random card
  try {
    const response = await fetch(`https://api.scryfall.com/cards/random`);
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function cardInfo() {
  let card = await fetchCard();

  // Define the card's name
  let cardName = card.name;

  // Prevent an error if the card has more than one facee
  if (card.card_faces === undefined) {
    let cardImage = card.image_uris.art_crop;
    let imageCreate = document.getElementById("card");
    imageCreate.setAttribute("src", `${cardImage}`);
  } else {
    let cardImage = card.card_faces[0].image_uris.art_crop;
    let imageCreate = document.getElementById("card");
    imageCreate.setAttribute("src", `${cardImage}`);
  }

  // Collect user input and check if correct
  function cardGuess() {
    let guessBox = document.getElementById("guessBox").value;
    let answer = cardName;
    document.getElementById("answerBox").style.visibility = "visible";
    document.getElementById("scoreBox").style.visibility = "visible";
    if (guessBox == answer) {
      document.getElementById(
        "answerBox"
      ).innerHTML = `Correct! The card was ${answer}`;

      numberCorrect++;
    } else {
      document.getElementById(
        "answerBox"
      ).innerHTML = `Sorry. The correct answer was ${answer}`;
    }

    numberAttempted++; // This doesn't work correctly

    document.getElementById(
      "scoreBox"
    ).innerHTML = `Score: ${numberCorrect} / ${numberAttempted}`;
  }

  function skip() {
    document.getElementById("answerBox").style.visibility = "visible";
    document.getElementById("scoreBox").style.visibility = "visible";
    document.getElementById(
      "answerBox"
    ).innerHTML = `Skipped! The correct answer was ${cardName}`;

    numberAttempted++; // This doesn't work correctly

    document.getElementById(
      "scoreBox"
    ).innerHTML = `Score: ${numberCorrect} / ${numberAttempted}`;
  }

  // Submit button for user input
  const submitButton = document.querySelector(`#submitButton`);
  submitButton.addEventListener(`click`, cardGuess);
  submitButton.addEventListener(`click`, cardInfo);

  // Skip to the next art
  const skipButton = document.querySelector(`#skip`);
  skipButton.addEventListener(`click`, skip);
  skipButton.addEventListener(`click`, cardInfo);

  // Detect enter key for submission // This isn't working either
  //     document.querySelector('#guessBox').addEventListener('keypress', function (e) {
  //     if (e.key === 'Enter') {
  //       cardGuess();
  //       cardInfo();
  //     }
  // });
}

// Run the game on page load
cardInfo();

// Always display the current year for the copyright
document
  .getElementById("year")
  .appendChild(document.createTextNode(new Date().getFullYear()));
