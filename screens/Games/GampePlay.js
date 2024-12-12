import React, { useEffect, useState, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, ScrollView, Text, Dimensions } from "react-native";

// Redux State and Actions
import {
  setWordState,
  clearFakeDefs,
  addDefinition,
  addRealDefinition,
  getFakeDefinitions,
  clearWordState,
} from "../../redux/gameplay.js";
import { fetchAllGameScores, selectAllScores } from "../../redux/scores.js";
import { selectMe } from "../../redux/auth";

// Components
import CardBack from "../Cards/CardBack.js";
import Buttons from "../../Buttons.js";
import GuessDefs from "./GuessDefs.js";
import CardFront from "../Cards/CardFront.js";
import GuessCard from "../Cards/GuessCard.js";

// Firebase and Context
import { UserContext } from "../../UserContext.js";
import { ref, set, onValue } from "firebase/database";
import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";
import { balderdashWords } from "../../Words.js";

import { useNavbar } from "../../NabBarContext.js";
import { fetchSingleGame } from "../../redux/singleGame.js";

const GamePlay = ({
  game,
  userScore,
  userId,
  reloadScores,
  setPlayerTurnName,
  handleHideScoreCard,
  setHideScoreCard,
}) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const gameScores = useSelector(selectAllScores);

  // Retrieve user and game details
  const gameName = game.name;
  const { user } = useContext(UserContext);
  const { hideNavbar, showNavbar } = useNavbar();
  const username = user.displayName;

  // Local Component State
  const [word, setWord] = useState("");
  const [getWord, setGetWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [defInput, setDefInput] = useState(false);
  const [timer, setTimer] = useState(false);

  const [flip, setFlip] = useState(false);
  const [countdown, setCountdown] = useState(1);
  const [playGame, setPlayGame] = useState(false);
  const [closeGetWord, setCloseGetWord] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showWordCount, setShowWordCount] = useState(false);

  const { width, height } = Dimensions.get("window");
  const cardWidth = width;
  const cardHeight = height;

  useEffect(() => {
    dispatch(clearWordState());
    setWord("");
    setCountdown(10);
  }, []);

  useEffect(() => {
    // Fetch the game scores when the component mounts
    dispatch(fetchAllGameScores());
    showNavbar();
    // setWordCount(0);
  }, [dispatch]);
  useEffect(() => {
    if (gameScores && gameScores.length > 0) {
      // Filter scores to find the current player's turn
      const currentPlayerTurn = gameScores.filter(
        (score) => score.turnNum === game.turn
      );

      //   setPlayerTurn(currentPlayerTurn);
      if (currentPlayerTurn) {
        setPlayerTurnName(currentPlayerTurn.displayName);
      }
    }

    if (game.turn === userScore?.turnNum) {
      dispatch(fetchSingleGame(game.id));
    }
  }, [gameScores, game.turn]);

  const handleShowWordCount = () => {
    setShowWordCount(true);
    setTimeout(() => {
      setShowWordCount(false);
    }, 3000);
  };

  // Select a random word and set definition
  const handleGetWord = () => {
    setWordCount((count) => count + 1);
    if (wordCount > 0) {
      handleShowWordCount();
    }
    hideNavbar();
    handleHideScoreCard();
    setGetWord(true);
    const newWord =
      balderdashWords[Math.floor(Math.random() * balderdashWords.length)];
    setWord(newWord?.word);
    setDefinition(newWord.definition);
    dispatch(addDefinition({ type: "real", definition: newWord.definition }));
  };

  // Fetch fake definitions from API and store them in Firebase
  const handleGetFakeDefs = () => {
    dispatch(clearFakeDefs());
    for (let count = 0; count < 5; count++) {
      dispatch(getFakeDefinitions()).then((res) => {
        set(
          ref(RealTimeDB, `games/${game.name}/fake_definitions`),
          res.payload
        );
      });
    }
  };

  // Choose word and set initial game states
  const handleChooseWord = () => {
    set(ref(RealTimeDB, `games/${game.name}/countdown`), game.name);
    dispatch(addRealDefinition({ type: "real", definition }));
    handleGetFakeDefs();
    setTimer(true);
    setDefInput(true);
    set(ref(RealTimeDB, `games/${gameName}/word`), {
      word,
      definition,
      room: game.name,
      playerTurnName: user.displayName,
      play: true,
    });
    setCloseGetWord(true);
      setWordCount(0);
  };

  // Firebase listeners for various game data
  useEffect(() => {
    const wordRef = ref(RealTimeDB, `games/${gameName}/word`);
    const fakeDefRef = ref(RealTimeDB, `games/${gameName}/fake_definitions`);
    const countdownNumRef = ref(RealTimeDB, `games/${gameName}/countdownNum`);
    const playerDefRef = ref(
      RealTimeDB,
      `games/${gameName}/fake__player_definition`
    );

    // Listener for receiving word
    const wordListener = onValue(wordRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setDefInput(true);
        dispatch(clearFakeDefs());
        dispatch(setWordState(data?.word || ""));
        dispatch(
          addRealDefinition({ type: "real", definition: data.definition })
        );
        setPlayerTurnName(data.playerTurnName);
        setWord(data.word);
      }
    });

    // Listener for countdown timer
    const countdownNumListener = onValue(countdownNumRef, (snapshot) => {
      const data = snapshot.val();

      if (data && userId !== data.playerTurnId) {
        if (data.countdown > 0) {
          setCountdown(data.countdown);
          if (data.countdown === 1) {
            setSeeInput(false);
          }
        }
        if (data.countdown === 0) {
          setDefInput(false);
          setGetWord(false);
          setCloseCardFront(false);
          if (data.play === true) {
            setPlayGame(true);
          }
        }
      }
    });

    // Listener for player fake definitions
    const fakePlayerDefListener = onValue(playerDefRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        dispatch(
          addDefinition({
            type: data.userName,
            definition: data.playerDef,
            userId,
          })
        );
      }
    });

    // Listener for fake definitions
    const fakeDefListener = onValue(fakeDefRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        dispatch(addDefinition({ type: "fake", definition: data }));
      }
    });

    // Cleanup: Unsubscribe listeners on component unmount
    return () => {
      wordListener();
      fakePlayerDefListener();
      countdownNumListener();
      fakeDefListener();
    };
  }, [
    gameName,
    username,
    dispatch,
    setPlayerTurnName,
    setWord,
    setFlip,
    setTimer,
  ]);

  const [seeInput, setSeeInput] = useState(true);
  // Timer countdown effect for gameplay
  useEffect(() => {
    if (timer) {
      setTimeout(() => {
        set(ref(RealTimeDB, `games/${gameName}/countdownNum`), {
          countdown,
          playerTurnId: userId,
          play: true,
        });
        if (countdown > 0) {
          setDefInput(true);
          setCountdown((countdown) => countdown - 1);
        }
        if (countdown === 1) {
          setCloseCardFront(true);
        } else if (countdown === 0) {
          set(ref(RealTimeDB, `games/${gameName}/countdownNum`), {
            playerTurnId: userId,
            play: false,
          });
          setPlayGame(true);
          setDefInput(false);
          setCloseGetWord(false);
          console.log("END OF TIMER");
          setGetWord(false);
          setCloseCardFront(false);
        } else {
          setDefInput(false);
        }
      }, 1000);
    }
  }, [timer, countdown]);

  const [closeCardFront, setCloseCardFront] = useState(false);
  const handleCloseCardFront = () => {
    setCloseCardFront(true);
  };

  return (
    <View style={styles.container}>
      {/* Display gameplay or guess definitions based on playGame state */}
      {!playGame ? (
        <View>
          <Text>
            Countdown: {countdown}, Timer: {timer}
          </Text>
          {/* Display GuessCard and CardFront components based on conditions */}
          <View
            style={[
              styles.cardContainer,
              { height: cardHeight, width: cardWidth },
            ]}
          >
            {defInput &&
            game &&
            userScore &&
            game.turn !== userScore.turnNum ? (
              <GuessCard
                word={word}
                definition={definition}
                flip={flip}
                userId={userId}
                gameName={game.name}
                seeInput={seeInput}
                setSeeInput={setSeeInput}
                userName={username}
              />
            ) : null}
            {userScore && userScore.turnNum && (
              <CardFront
                gameId={game.id}
                username={username}
                gameTurn={game.turn}
                userTurn={userScore?.turnNum}
                handleGetWord={
                  game &&
                  !closeGetWord &&
                  userScore &&
                  game.turn === userScore.turnNum
                    ? handleGetWord
                    : null
                }
                getWord={getWord}
                setGetWord={setGetWord}
                word={word}
                definition={definition}
                getAWordButton={
                  <Buttons
                    name={!word ? "Get Word" : `New Word`}
                    //   name={"Get Word"}
                    func={handleGetWord}
                    pulse={!word || !word.length ? "pulse" : null}
                  />
                }
                wordCount={wordCount}
                handleChooseWord={handleChooseWord}
                closeCardFront={closeCardFront}
                showWordCount={showWordCount}
              />
            )}

            {closeGetWord && (
              <View style={styles.backCard}>
                <CardBack
                  title={{ first: "Balder", second: "Dash" }}
                  flip={flip}
                />
              </View>
            )}
          </View>
        </View>
      ) : (
        // Display GuessDefs component when playGame is true

        <View style={styles.container}>
          <View style={styles.guessDef}>
            <View style={styles.cardContainer}>
              <GuessDefs
                word={word}
                userScore={userScore}
                userId={userId}
                gameId={game.id}
                gameName={gameName}
                setPlayGame={setPlayGame}
                reloadScores={reloadScores}
                game={game}
                setDefinition={setDefinition}
                setWord={setWord}
                setTimer={setTimer}
                setGamePlayCountdown={setCountdown}
                setSeeInput={setSeeInput}
                setParentCountdown={setCountdown}
                userName={username}
                setGetWord={setGetWord}
                setHideScoreCard={setHideScoreCard}
              />
            </View>
          </View>
        </View>
      )}
      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "pink",
  },
  cardContainer: {
    borderColor: "transparent",
    borderWidth: 20,
  },
  guessDef: {
    marginLeft: -13,
  },
  backCard: {
    marginTop: "0",
  },
});

export default GamePlay;
