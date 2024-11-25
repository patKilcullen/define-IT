import React, { useEffect, useState, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, ScrollView, Text } from "react-native";

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

const GamePlay = ({
  game,
  userScore,
  userId,
  reloadScores,
  setPlayerTurnName,
}) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);
  const gameScores = useSelector(selectAllScores);

  // Retrieve user and game details
  const gameName = game.name;
  const { user } = useContext(UserContext);
  const username = user.displayName;

  // Local Component State
  const [word, setWord] = useState("");
  const [getWord, setGetWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [guessDef, setGuessDef] = useState(false);
  const [defInput, setDefInput] = useState(false);
  const [timer, setTimer] = useState(false);
  const [choseWord, setChoseWord] = useState(false);
  const [playerTurn, setPlayerTurn] = useState("");

  const [flip, setFlip] = useState(false);
  const [flipSide, setFlipSide] = useState("back");
  const [countdown, setCountdown] = useState(15);
  const [playGame, setPlayGame] = useState(false);
  const [closeGetWord, setCloseGetWord] = useState(false);

  useEffect(() => {
    dispatch(clearWordState());
    setWord("");
    setCountdown(15)
  }, []);

  useEffect(() => {
    // Fetch the game scores when the component mounts
    dispatch(fetchAllGameScores());
  }, [dispatch]);
  useEffect(() => {
    if (gameScores && gameScores.length > 0) {
      // Filter scores to find the current player's turn
      const currentPlayerTurn = gameScores.filter(
        (score) => score.turnNum === game.turn
      );

      setPlayerTurn(currentPlayerTurn);
      if (currentPlayerTurn) {
        setPlayerTurnName(currentPlayerTurn.displayName);
      }
    }
  }, [gameScores, game.turn]);

  // Select a random word and set definition
  const handleGetWord = () => {
    setGetWord(true)
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
setChoseWord(true);

    setDefInput(true);
    set(ref(RealTimeDB, `games/${gameName}/word`), {
      word,
      definition,
      room: game.name,
      playerTurnName: user.displayName,
      play: true,
    });
    setCloseGetWord(true);
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
          
        //   setCountdown(0);
          setDefInput(false);

          if (data.play === true) {
            
            setPlayGame(true);
            //   setSeeInput(true);
          }
        }
      }
    });

    // Listener for player fake definitions
    const fakePlayerDefListener = onValue(playerDefRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log("DATA FAKE PLAYER DEF LISTENER: ", data)
        dispatch(
          addDefinition({ type: data.userName, definition: data.playerDef, userId })
          //   addDefinition({ type: [data.userName], definition: data.playerDef })
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
    setFlipSide,
    setTimer,
  ]);

  const [seeInput, setSeeInput] = useState(true);
  // Timer countdown effect for gameplay
  useEffect(() => {
    if (timer) {
        console.log("OTHER OCUNT: ", countdown);
      setTimeout(() => {
        set(ref(RealTimeDB, `games/${gameName}/countdownNum`), {
          countdown,
          playerTurnId: userId,
          play: true,
        });
        if (countdown > 0) {
          setDefInput(true);
          setCountdown((countdown) => countdown - 1);
        } if (countdown === 1) {
             setCloseCardFront(true);
        } 
    
        else if (countdown === 0) {
            
          set(ref(RealTimeDB, `games/${gameName}/countdownNum`), {
            playerTurnId: userId,
            play: false,
          });
          setPlayGame(true);
          setDefInput(false);
          setCloseGetWord(false);
        //   setTimer(false)
        //      setCountdown(15);
        } else {
          setDefInput(false);
        }
      }, 1000);
    }
  }, [timer, countdown]);
// useEffect(() => {
//   if (timer) {
//     const interval = setInterval(() => {
//       setCountdown((prevCountdown) => {
//         if (prevCountdown > 1) {
//           return prevCountdown - 1;
//         } else {
//           clearInterval(interval); // Stop the interval
//           setCountdown(15); // Reset countdown for the next round
//           setTimer(false); // Stop the timer
//           setPlayGame(true); // Transition to gameplay
//           return 0;
//         }
//       });
//     }, 1000);

//     return () => clearInterval(interval); // Cleanup on unmount
//   }
// }, [timer]);


const [closeCardFront, setCloseCardFront] = useState(false)
const handleCloseCardFront = ()=>{
setCloseCardFront(true)
}

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Display gameplay or guess definitions based on playGame state */}
        {!playGame ? (
          <View>
            <Text>
              Countdown: {countdown}, Timer: {timer}
            </Text>

            {/* Button to get a word if it's the player's turn */}
            {/* {game &&
            !closeGetWord &&
            userScore &&
            game.turn === userScore.turnNum ? (
              <Buttons
                // name={!word ? "Get Word" : "Get Another Word"}
                name={"Get Word"}
                func={handleGetWord}
                pulse={!word || !word.length ? "pulse" : null}
              />
            ) : null} */}

            {/* Display GuessCard and CardFront components based on conditions */}
            <View style={styles.cardContainer}>
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
                  getAWord={
                    <Buttons
                      name={!word ? "Get Word" : "New Word"}
                      //   name={"Get Word"}
                      func={handleGetWord}
                      pulse={!word || !word.length ? "pulse" : null}
                    />
                  }
                  handleChooseWord={handleChooseWord}
                  closeCardFront={closeCardFront}
                />
              )}

              {/* {!word && (
                <View style={styles.backCard}>
                  <CardBack title={{ first: "Balder", second: "Dash" }} />
                </View>
              )} */}
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
                  setChoseWord={setChoseWord}
                  setGamePlayCountdown={setCountdown}
                  setSeeInput={setSeeInput}
                  setParentCountdown={setCountdown}
                  userName={username}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  guessDef: {
    marginLeft: -13,
  },
  backCard: {
    marginTop: "0",
  },
});

export default GamePlay;
