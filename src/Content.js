import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useFetch } from './useFetch';
import HistoryModal from './HistoryModal';

function Content() {
  const [query, setQuery] = useState('');
  const [startScreen, setStartScreen] = useState(true);
  const [format, setFormat] = useState(null);
  const [artError, setArtError] = useState(null);
  const [cardIsLoading, setCardIsLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [level, setLevel] = useState(0);
  const [hiddenCount, setHiddenCount] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [cardArt, setCardArt] = useState(null);
  const [cardFlavor, setCardFlavor] = useState(null);
  const [showGame, setShowGame] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(undefined);
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
  const timerRef = useRef(0);
  const url = query && `./assets/${query}.json`;
  const { status, data, error } = useFetch(url);

  const toggleModal = useCallback(() => {
    setHistoryModalOpen((prevState) => !prevState);
  }, []);

  useEffect(() => {
    if (!state.isRunning) {
      return;
    }
    timerRef.current = setInterval(() => dispatch({ type: 'tick' }), 1000);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = 0;
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
        if (state.time > 0 && !cardIsLoading) {
          return { ...state, time: state.time - 1 };
        } else return { ...state, time: state.time };
      }
      default:
        throw new Error();
    }
  }

  useEffect(() => {
    if (data !== null) {
      const cardArray = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * data.length)
      );

      const incorrectAnswerOne = data[cardArray[0]];
      const incorrectAnswerTwo = data[cardArray[1]];
      const incorrectAnswerThree = data[cardArray[2]];
      const correctAnswer = data[cardArray[3]];
      setCorrectAnswer(correctAnswer);

      const initialAnswers = [
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
      dispatch({ type: 'start' });
    }
  }, [data, hiddenCount]);

  const endGame = useCallback(() => {
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
  }, [level]);

  const addToHistory = useCallback(() => {
    let tempArr = history;
    tempArr.push(historyValue);
    setHistory(tempArr);
  }, [history, historyValue]);

  useEffect(() => {
    if (state.time === 0) {
      addToHistory();
      endGame();
    }
  }, [addToHistory, endGame, state.time]);

  const handleClick = (e) => {
    // This prevents the correct answer from being auto-focused
    document.activeElement.blur();
    addToHistory();
    if (e === correctAnswer) {
      nextLevel();
    } else {
      setSelectedAnswer(e);
      endGame();
    }
  };

  const handleFormatClick = (e) => {
    if (e === format) {
      setHiddenCount(hiddenCount + 1);
      setFormat(e);
    } else {
      setHiddenCount(1);
      setFormat(e);
    }
    setStartScreen(false);
    setLevel(1);
    setPlaying(true);
    setShowGame(true);
    setDisable(false);
    dispatch({ type: 'reset' });
    dispatch({ type: 'start' });

    const query = e;
    if (query) {
      setQuery(query);
    }
  };

  const restartGame = () => {
    // Wonky workaround to force a re-render for level 1
    if (level === 1) {
      setLevel(1);
      setHiddenCount(hiddenCount + 1);
      setQuery(query);
    } else {
      setLevel(1);
      setHiddenCount(1);
    }
    setPlaying(true);
    setShowGame(true);
    setDisable(false);
    setHistory([]);
    dispatch({ type: 'reset' });
  };

  const changeFormat = () => {
    setStartScreen(true);
    setLevel(0);
    setShowGame(false);
    setEndMessage(false);
    setHistory([]);
    dispatch({ type: 'reset' });
  };

  useEffect(() => {
    const fetchArt = async () => {
      if (correctAnswer !== undefined) {
        try {
          setCardIsLoading(true);
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
            setArtError(null);
          }
        } catch (err) {
          setArtError(err.message);
        } finally {
          setCardIsLoading(false);
        }
      }
    };

    fetchArt();
  }, [correctAnswer]);

  const nextLevel = () => {
    setLevel(level + 1);
    setHiddenCount(hiddenCount + 1);
    dispatch({ type: 'reset' });
  };

  const buttonStyle =
    'border border-theme-color rounded h-8 mt-4 uppercase font-extrabold whitespace-nowrap';

  return (
    <div className="flex flex-col flex-1">
      <div>
        {status === 'fetching' && (
          <h1 className="text-center mt-4">
            Loading cards. This may take a moment.
          </h1>
        )}
        {status === error && (
          <h1 className="text-center mt-4">
            Hmm. Something went wrong. {error}
          </h1>
        )}
      </div>
      {startScreen && (
        <div className="mt-20">
          <div className="text-center font-bold mb-4">
            What format would you like cards from?
          </div>
          <div className="flex justify-center">
            <div className="max-w-xs">
              <button
                type="submit"
                className={`${buttonStyle} text-sm min-w-full`}
                onClick={(e) => handleFormatClick(e.target.value)}
                value="standard"
              >
                Standard
              </button>
              <button
                type="submit"
                className={`${buttonStyle} text-sm min-w-full`}
                onClick={(e) => handleFormatClick(e.target.value)}
                value="pauper"
              >
                Pauper
              </button>
              <button
                type="submit"
                className={`${buttonStyle} text-sm min-w-full`}
                onClick={(e) => handleFormatClick(e.target.value)}
                value="pioneer"
              >
                Pioneer
              </button>
              <button
                type="submit"
                className={`${buttonStyle} text-sm min-w-full`}
                onClick={(e) => handleFormatClick(e.target.value)}
                value="modern"
              >
                Modern
              </button>
              <button
                type="submit"
                className={`${buttonStyle} text-sm min-w-full`}
                onClick={(e) => handleFormatClick(e.target.value)}
                value="legacy"
              >
                Legacy
              </button>
              <button
                type="submit"
                className={`${buttonStyle} text-sm min-w-full`}
                onClick={(e) => handleFormatClick(e.target.value)}
                value="vintage"
              >
                Vintage
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        {showGame && (
          <div className="w-full">
            <div className="flex mx-auto justify-center xs:max-h-96">
              {artError && <div>Card error {artError}</div>}
              <img
                src={cardArt}
                alt="Guess the card based on the artwork!"
                className="object-scale-down"
              ></img>
            </div>
          </div>
        )}
        {showGame && (
          <div className="mx-auto max-w-screen-sm">
            {cardFlavor && (
              <div className="text-center italic mt-2">{cardFlavor}</div>
            )}
            {!playing && (
              <div className="text-dark-gray dark:text-white text-lg text-center mt-4">
                {endMessage}
              </div>
            )}
            <div className="mx-auto max-w-lg">
              {answers !== null && (
                <div className="flex flex-col px-0 mb-2 text-xs">
                  {answers.map((answer) => {
                    return (
                      <button
                        className={`overflow-hidden ${buttonStyle} ${
                          playing &&
                          'hover:border-dark-gray dark:hover:border-white duration-100'
                        } ${
                          answer.index === 3 && !playing && 'border-red-500'
                        } ${
                          answer.label === selectedAnswer &&
                          !playing &&
                          'border-dark-gray dark:border-white'
                        }`}
                        key={answer.index}
                        onClick={(e) => handleClick(e.target.value)}
                        disabled={disable}
                        value={answer.label}
                      >
                        <span
                          className={`pointer-events-none ${
                            answer.label.length >= 45
                              ? 'xs:text-xxs duration-0'
                              : 'text-xs md:text-sm duration-0'
                          }`}
                        >
                          {answer.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              {!startScreen && (
                <div className="grid grid-cols-2 content-between mt-4 md:mt-8">
                  <button
                    className={`${buttonStyle} ${
                      !playing &&
                      'hover:border-dark-gray dark:hover:border-white duration-100'
                    } w-3/4 justify-self-start`}
                    disabled={!disable}
                    onClick={() => setHistoryModalOpen(true)}
                  >
                    <span className="xs:text-xxs text-xs md:text-sm overflow-hidden duration-0">
                      {playing ? `Level: ${level}` : `History`}
                    </span>
                  </button>
                  <button
                    className={`${buttonStyle} ${
                      !playing &&
                      'hover:border-dark-gray dark:hover:border-white duration-100'
                    } w-3/4 justify-self-end ${
                      state.time < 4 && 'text-red-500'
                    }`}
                    disabled
                  >
                    <span className="xs:text-xxs text-xs md:text-sm overflow-hidden duration-0">
                      {state.time === 0
                        ? `Time's Up!`
                        : `00:${state.time.toString().padStart(2, '0')}`}
                    </span>
                  </button>
                </div>
              )}
              {!playing && (
                <div className="grid grid-cols-2 content-between">
                  <button
                    className={`${buttonStyle} ${
                      !playing &&
                      'hover:border-dark-gray dark:hover:border-white duration-100'
                    } w-3/4 justify-self-start`}
                    onClick={restartGame}
                  >
                    <span className="xs:text-xxs text-xs md:text-sm overflow-hidden duration-0">
                      Restart Game
                    </span>
                  </button>
                  <button
                    className={`${buttonStyle} ${
                      !playing &&
                      'hover:border-dark-gray dark:hover:border-white duration-100'
                    } w-3/4  justify-self-end`}
                    onClick={changeFormat}
                  >
                    <span className="xs:text-xxs text-xs md:text-sm overflow-hidden duration-0">
                      Change Format
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <HistoryModal
        toggleModal={toggleModal}
        modalOpen={historyModalOpen}
        closeModal={() => setHistoryModalOpen(false)}
        history={history}
      />
    </div>
  );
}

export default Content;
