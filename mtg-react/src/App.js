import React, { useEffect, useReducer, useRef, useState } from 'react';
import './App.css';
import HistoryModal from './HistoryModal';

function App() {
  const [format, setFormat] = useState(null);
  const [cardPool, setCardPool] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [level, setLevel] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [cardArt, setCardArt] = useState(null);
  const [cardFlavor, setCardFlavor] = useState(null);
  const [showGame, setShowGame] = useState(false);
  const [randomCardArray, setRandomCardArray] = useState([]);
  const [incorrectAnswerOne, setIncorrectAnswerOne] = useState('');
  const [incorrectAnswerTwo, setIncorrectAnswerTwo] = useState('');
  const [incorrectAnswerThree, setIncorrectAnswerThree] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [endMessage, setEndMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [historyValue, setHistoryValue] = useState('');
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const initialState = {
    isRunning: false,
    time: 10,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const idRef = useRef(0);

  useEffect(() => {
    if (!state.isRunning) {
      return;
    }
    idRef.current = setInterval(() => dispatch({ type: 'tick' }), 1000);

    return () => {
      clearInterval(idRef.current);
      idRef.current = 0;
    };
  }, [state.isRunning]);

  function reducer(state, action) {
    switch (action.type) {
      case 'start':
        return { ...state, isRunning: true };
      case 'stop':
        return { ...state, isRunning: false };
      case 'reset':
        return { isRunning: false, time: 10 };
      case 'tick': {
        if (state.time > 0) {
          return { ...state, time: state.time - 1 };
        } else return { ...state, time: state.time };
      }
      default:
        throw new Error();
    }
  }

  const fetchStandard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`./StandardAtomic.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      } else if (response.ok) {
        setError(null);
      }

      const result = await response.json();
      setCardPool(Object.keys(result.data));

      let randomCardArray = Object.keys(result.data);
      setRandomCardArray(
        Array.from({ length: 4 }, () =>
          Math.floor(Math.random() * randomCardArray.length)
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setFormat('Standard');
      setLevel(1);
      setPlaying(true);
      setShowGame(true);
      setDisable(false);
      dispatch({ type: 'start' });
    }
  };

  const fetchPauper = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`./PauperAtomic.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      } else if (response.ok) {
        setError(null);
      }

      const result = await response.json();
      setCardPool(Object.keys(result.data));

      let randomCardArray = Object.keys(result.data);
      setRandomCardArray(
        Array.from({ length: 4 }, () =>
          Math.floor(Math.random() * randomCardArray.length)
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setFormat('Pauper');
      setLevel(1);
      setPlaying(true);
      setShowGame(true);
      setDisable(false);
      dispatch({ type: 'start' });
    }
  };

  const fetchPioneer = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`./PioneerAtomic.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      } else if (response.ok) {
        setError(null);
      }

      const result = await response.json();
      setCardPool(Object.keys(result.data));

      let randomCardArray = Object.keys(result.data);
      setRandomCardArray(
        Array.from({ length: 4 }, () =>
          Math.floor(Math.random() * randomCardArray.length)
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setFormat('Pioneer');
      setLevel(1);
      setPlaying(true);
      setShowGame(true);
      setDisable(false);
      dispatch({ type: 'start' });
    }
  };

  const fetchModern = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`./ModernAtomic.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      } else if (response.ok) {
        setError(null);
      }

      const result = await response.json();
      setCardPool(Object.keys(result.data));

      let randomCardArray = Object.keys(result.data);
      setRandomCardArray(
        Array.from({ length: 4 }, () =>
          Math.floor(Math.random() * randomCardArray.length)
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setFormat('Modern');
      setLevel(1);
      setPlaying(true);
      setShowGame(true);
      setDisable(false);
      dispatch({ type: 'start' });
    }
  };

  const fetchLegacy = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`./LegacyAtomic.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      } else if (response.ok) {
        setError(null);
      }

      const result = await response.json();
      setCardPool(Object.keys(result.data));

      let randomCardArray = Object.keys(result.data);
      setRandomCardArray(
        Array.from({ length: 4 }, () =>
          Math.floor(Math.random() * randomCardArray.length)
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setFormat('Legacy');
      setLevel(1);
      setPlaying(true);
      setShowGame(true);
      setDisable(false);
      dispatch({ type: 'start' });
    }
  };

  const fetchVintage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`./VintageAtomic.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      } else if (response.ok) {
        setError(null);
      }

      const result = await response.json();
      setCardPool(Object.keys(result.data));

      let randomCardArray = Object.keys(result.data);
      setRandomCardArray(
        Array.from({ length: 4 }, () =>
          Math.floor(Math.random() * randomCardArray.length)
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setFormat('Vintage');
      setLevel(1);
      setPlaying(true);
      setShowGame(true);
      setDisable(false);
      dispatch({ type: 'start' });
    }
  };

  const newCards = () => {
    setRandomCardArray(
      Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * cardPool.length)
      )
    );
    dispatch({ type: 'start' });
  };

  useEffect(() => {
    if (cardPool !== null) {
      setIncorrectAnswerOne(cardPool[randomCardArray[0]]);
      setIncorrectAnswerTwo(cardPool[randomCardArray[1]]);
      setIncorrectAnswerThree(cardPool[randomCardArray[2]]);
      setCorrectAnswer(cardPool[randomCardArray[3]]);
    }
  }, [format, cardPool, randomCardArray]);

  useEffect(() => {
    let initialAnswers = [
      { label: `${incorrectAnswerOne}`, index: 0 },
      { label: `${incorrectAnswerTwo}`, index: 1 },
      {
        label: `${incorrectAnswerThree}`,
        index: 2,
      },
      { label: `${correctAnswer}`, index: 3 },
    ];

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const shuffledAnswers = shuffle(initialAnswers);

    setAnswers(shuffledAnswers);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    correctAnswer,
    incorrectAnswerOne,
    incorrectAnswerThree,
    incorrectAnswerTwo,
  ]);

  useEffect(() => {
    if (state.time === 0) {
      endGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.time]);

  const handleClick = (e) => {
    addToHistory();
    if (e === correctAnswer) {
      nextLevel();
    } else {
      setSelectedAnswer(e);
      endGame();
    }
  };

  const addToHistory = () => {
    let tempArr = history;
    tempArr.push(historyValue);
    setHistory(tempArr);
  };

  const restartGame = () => {
    setLevel(1);
    setPlaying(true);
    setShowGame(true);
    setDisable(false);
    setHistory([]);
    dispatch({ type: 'reset' });
    newCards();
  };

  const changeFormat = () => {
    setFormat(null);
    setLevel(0);
    setShowGame(false);
    setEndMessage(false);
    setHistory([]);
    dispatch({ type: 'reset' });
  };

  useEffect(() => {
    const fetchArt = async () => {
      if (correctAnswer !== null) {
        try {
          const response = await fetch(
            `https://api.scryfall.com/cards/named?fuzzy=${correctAnswer}`
          );
          const card = await response.json();
          setHistoryValue(card);

          if (card.card_faces === undefined) {
            setCardArt(card.image_uris.art_crop);
          } else if (card.image_uris === undefined) {
            setCardArt(card.card_faces[0].image_uris.art_crop);
          } else {
            setCardArt(card.image_uris.art_crop);
          }

          if (card.card_faces === undefined) {
            setCardFlavor(card.flavor_text);
          } else if (card.card_faces === 2) {
            setCardFlavor(card.flavor_text);
          } else {
            setCardFlavor(card.card_faces[1].flavor_text);
          }

          if (!response.ok) {
            throw new Error(`${response.status}`);
          } else if (response.ok) {
            setError(null);
          }
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchArt();
  }, [correctAnswer]);

  const nextLevel = () => {
    setLevel(level + 1);
    dispatch({ type: 'reset' });
    newCards();
  };

  const endGame = () => {
    setDisable(true);
    setPlaying(false);
    dispatch({ type: 'stop' });
    if (level >= 100) {
      setEndMessage(`Incredible! You made it all the way to Level ${level}!`);
    } else if (level >= 10 && level <= 99) {
      setEndMessage(`Fantastic! You made it to Level ${level}!`);
    } else if (level >= 2 && level <= 9) {
      setEndMessage(`Congratulations! You made it to Level ${level}.`);
    } else if (level === 1) {
      setEndMessage(`Oof! You couldn't get beyond Level ${level}.`);
    }
  };

  const year = new Date().getFullYear();

  const buttonStyle =
    'border border-solid border-light-purple hover:border-white rounded h-8 mt-4 uppercase font-extrabold whitespace-nowrap';

  return (
    <div className="flex flex-col place-items-center text-light-purple m-4">
      <div>
        <header className="flex flex-col place-items-center">
          <h1 className="md:text-5xl text-3xl font-extrabold md:mt-8">
            MTG Art Game
          </h1>
          <h2 className="md:text-2xl text-l text-white md:mt-3 mt-2 mb-4">
            Guess the card based on the art!
          </h2>
        </header>
      </div>
      <div>
        {isLoading && <h1 className="text-center mt-4">Loading cards...</h1>}
        {error && (
          <h1 className="text-center mt-4">
            Hmm. Something went wrong. Status: {error}
          </h1>
        )}
      </div>
      {format === null && (
        <div className="md:w-1/2 mt-20">
          <div className="text-center font-bold mb-4">
            What format would you like cards from?
          </div>
          <div className="flex flex-col place-items-center">
            <div className="max-w-xs">
              <button
                type="submit"
                className={`${buttonStyle} text-sm min-w-full`}
                onClick={fetchStandard}
              >
                Standard
              </button>
              <button
                type="submit"
                className={`${buttonStyle} text-sm min-w-full`}
                onClick={fetchPauper}
              >
                Pauper
              </button>
              <button
                type="submit"
                className={`${buttonStyle} text-sm min-w-full`}
                onClick={fetchPioneer}
              >
                Pioneer
              </button>
              <button
                type="submit"
                className={`${buttonStyle} text-sm min-w-full`}
                onClick={fetchModern}
              >
                Modern
              </button>
              <button
                type="submit"
                className={`${buttonStyle} text-sm min-w-full`}
                onClick={fetchLegacy}
              >
                Legacy
              </button>
              <button
                type="submit"
                className={`${buttonStyle} text-sm min-w-full`}
                onClick={fetchVintage}
              >
                Vintage
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full md:w-[768px]">
        {showGame && (
          <div className="w-full">
            <div className="flex justify-center">
              <img
                src={cardArt}
                alt="Guess the card based on the artwork!"
                className="max-h-80 md:max-h-full"
              ></img>
            </div>
          </div>
        )}
        {showGame && (
          <div className="md:w-2/3 mx-auto">
            {cardFlavor && (
              <div className="text-center italic mt-2">{cardFlavor}</div>
            )}
            {!playing && (
              <div className="text-white text-lg text-center mt-4">
                {endMessage}
              </div>
            )}
            {answers !== null && (
              <div className="flex flex-col px-0 mb-2 md:justify-items-center text-xs">
                {answers.map((answer) => {
                  return (
                    <button
                      className={`overflow-hidden ${buttonStyle} ${
                        answer.label.length >= 45 ? 'xs:text-xxs' : 'text-xs'
                      } ${answer.index === 3 && !playing && 'border-red-500'} ${
                        answer.label === selectedAnswer &&
                        !playing &&
                        'border-white'
                      }`}
                      key={answer.index}
                      onClick={(e) => handleClick(e.target.value)}
                      disabled={disable}
                      value={answer.label}
                    >
                      {answer.label}
                    </button>
                  );
                })}
              </div>
            )}
            {format !== null && (
              <div className="grid grid-cols-2 content-between mt-4 md:mt-8">
                <button
                  className={`${buttonStyle} xs:text-xxs text-xs overflow-hidden w-3/4 justify-self-start`}
                  disabled={!disable}
                  onClick={() => setHistoryModalOpen(true)}
                >
                  {playing ? `Level: ${level}` : `History`}
                </button>
                <button
                  className={`${buttonStyle} xs:text-xxs text-xs overflow-hidden w-3/4 justify-self-end ${
                    state.time < 4 && 'text-red-500'
                  }`}
                  disabled
                >
                  {state.time === 0
                    ? `Time's Up!`
                    : `00:${state.time.toString().padStart(2, '0')}`}
                </button>
              </div>
            )}
            {!playing && format !== null && (
              <div className="grid grid-cols-2 content-between">
                <button
                  className={`${buttonStyle} xs:text-xxs text-xs overflow-hidden w-3/4 justify-self-start`}
                  onClick={restartGame}
                >
                  Restart Game
                </button>
                <button
                  className={`${buttonStyle} xs:text-xxs overflow-hidden text-xs w-3/4  justify-self-end`}
                  onClick={changeFormat}
                >
                  Change Format
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <footer className="mx-auto md:fixed md:right-1 md:bottom-0 m-1 mt-4 text-sm bottom-0 text-white sticky top-[100vh] md:top-auto">
        <p>
          Made with <span className="font-sans">&#128556;</span> by
          <a
            href="https://github.com/Kerakis"
            target="_blank"
            rel="noopener noreferrer"
          >
            &nbsp;Kerakis&nbsp;© {year}
          </a>
        </p>
      </footer>
      <HistoryModal
        modalOpen={historyModalOpen}
        closeModal={() => setHistoryModalOpen(false)}
        history={history}
      />
    </div>
  );
}

export default App;
