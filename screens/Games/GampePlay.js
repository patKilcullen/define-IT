// import React, { useEffect, useState, useContext, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { View, StyleSheet, ScrollView, Animated, Text } from "react-native";

// // SLICES/STATE REDUCERS
// import {
//   setWordState,
//   clearFakeDefs,
//   addDefinition,
//   addRealDefinition,
//   getFakeDefinitions,
// } from "../../redux/gameplay.js";
// import { selectMe } from "../../redux/auth";
// // import { testAIFunc } from "./openAISlice";

// // Components
// import CardBack from "../Cards/CardBack.js";
// import Buttons from "../../Buttons.js";
// import GuessDefs from "./GuessDefs.js";

// import { UserContext } from "../../UserContext.js";

// import { ref, set, onValue } from "firebase/database";
// import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";

// import { balderdashWords } from "../../Words.js";

// import CardFront from "../Cards/CardFront.js";
// import GuessCard from "../Cards/GuessCard.js";

// const GamePlay = ({ game, userScore, userId, reloadScores }) => {
//   const dispatch = useDispatch();
//   const me = useSelector(selectMe);

//   const gameName = game.name;
//   const { user } = useContext(UserContext);
//   const username = user.displayName;

//   // Component state
//   const [word, setWord] = useState("");
//   const [definition, setDefinition] = useState("");
//   const [guessDef, setGuessDef] = useState(false);
//   const [defInput, setDefInput] = useState(false);

//   const [timer, setTimer] = useState(false);
//   const [choseWord, setChoseWord] = useState(false);
//   const [playerTurn, setPlayerTurn] = useState("");
//   const [playerTurnName, setPlayerTurnName] = useState("");
//   const [flip, setFlip] = useState(false);
//   const [flipSide, setFlipSide] = useState("back");
//   const [countdown, setCountdown] = useState(10);
//   const [playGame, setPlayGame] = useState(false);

//   //   GET PLAYERS TURN NUMBER
//   useEffect(() => {
//     if (game && game.scores) {
//       setPlayerTurn(game.scores.filter((score) => score.turnNum === game.turn));
//     }
//     if (playerTurn) {
//       setPlayerTurnName(playerTurn[0].user.username);
//     }
//   }, []);

//   // GET WORD
//   const handleGetWord = () => {
//     let newWord =
//       balderdashWords[Math.floor(Math.random() * balderdashWords.length)];

//     setWord(newWord?.word);
//     setDefinition(newWord.definition);
//     dispatch(addDefinition({ type: "real", definition: newWord.definition }));
//   };

//   const handleGetFakeDefs = () => {
//     dispatch(clearFakeDefs());
//     let count = 0;
//     while (count < 5) {
//       dispatch(getFakeDefinitions()).then((res) => {
//         set(
//           ref(RealTimeDB, `games/${game.name}/fake_definitions`),
//           res.payload
//         );
//       });

//       count++;
//     }
//   };

//   const handleChooseWord = () => {
//     set(ref(RealTimeDB, `games/${game.name}/countdown`), game.name);
//     dispatch(addRealDefinition({ type: "real", definition: definition }));
//     handleGetFakeDefs();
//     set(ref(RealTimeDB, `games/${gameName}/word`), {
//       word: word,
//       definition: definition,
//       room: game.name,
//       playerTurnName: user.displayName,
//     });
//     setTimer(true);
//     setChoseWord(true);
//     setDefInput(true);
//   };

//   useEffect(() => {
//     const wordRef = ref(RealTimeDB, `games/${gameName}/word`);
//     const fakeDefRef = ref(RealTimeDB, `games/${gameName}/fake_definitions`);
//     const countdownNumRef = ref(RealTimeDB, `games/${gameName}/countdownNum`);
//     const playerDefRef = ref(
//       RealTimeDB,
//       `games/${gameName}/fake__player_definition`
//     );

//     // Listen for word data (receive_word)
//     const wordListener = onValue(wordRef, (snapshot) => {
//       const data = snapshot.val();

//       //    if (data && data.playerTurnName !== username && data.room === gameName) {
//       if (data) {
//         dispatch(clearFakeDefs());
//         setDefInput(true);
//         dispatch(setWordState(data?.word || ""));
//         dispatch(
//           addRealDefinition({ type: "real", definition: data.definition })
//         );
//         setPlayerTurnName(data.playerTurnName);
//         setWord(data.word);
//       }
//     });

//     const countdownNumListener = onValue(countdownNumRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data && userId !== data.playerTurnId) {
//         setCountdown(data.countdown);
//         if (data.countdown === 0) {
//           setDefInput(false);
//           setPlayGame(true);
//         }
//       }
//     });

//     // Listen for player fake definitions (receive_player_fake_def)
//     const fakePlayerDefListener = onValue(playerDefRef, (snapshot) => {
//       const data = snapshot.val();

//       if (data) {
//         dispatch(
//           addDefinition({ type: [data.userId], definition: data.playerDef })
//         );
//       }
//     });

//     const fakeDefListener = onValue(fakeDefRef, (snapshot) => {
//       const data = snapshot.val();

//       if (data) {
//         dispatch(addDefinition({ type: "fake", definition: data }));
//       }
//     });

//     // Cleanup function to unsubscribe listeners on unmount
//     return () => {
//       wordListener();
//       fakePlayerDefListener();
//       countdownNumListener();
//       fakeDefListener();
//     };
//   }, [
//     gameName,
//     username,
//     dispatch,
//     setPlayerTurnName,
//     setWord,
//     setFlip,
//     setFlipSide,
//     setTimer,
//   ]);

//   useEffect(() => {
//     if (timer) {
//       setTimeout(() => {
//         set(ref(RealTimeDB, `games/${gameName}/countdownNum`), {
//           countdown: countdown,
//           playerTurnId: userId,
//         });
//         if (countdown > 0) {
//           setDefInput(true);
//           setCountdown((countdown) => countdown - 1);
//         } else if (countdown === 0) {
//           console.log("Countdown 0: ", userId);
//           setPlayGame(true);
//           setDefInput(false);
//         } else {
//           setDefInput(false);
//         }
//       }, 1000);
//     }
//   }, [timer, countdown]);

//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         {!playGame ? (
//           <View>
//             <Text>
//               Countdown: {countdown}, Timer: {timer}
//             </Text>
//             <Buttons name={"TEMOP SSPCR"} func={reloadScores} />

//             {/* Get Word Button - only visible if it's the player's turn */}
//             {game && userScore && game.turn === userScore.turnNum ? (
//               <Buttons
//                 name={!word ? "Get Word" : "Get Another Word"}
//                 func={handleGetWord}
//                 pulse={!word || !word.length ? "pulse" : null}
//               />
//             ) : null}
//             {/* Main Card Component */}
//             <View style={styles.cardContainer}>
//               {/* {defInput && userScore.turnNum !== game.turn && userScore.accepted ===  true ? */}
//               {defInput ? (
//                 <GuessCard
//                   word={word}
//                   definition={definition}
//                   flip={flip}
//                   userId={userId}
//                   gameName={game.name}
//                 ></GuessCard>
//               ) : null}

//               {game && userScore && game.turn === userScore.turnNum ? (
//                 <CardFront word={word} definition={definition}></CardFront>
//               ) : null}
//               <CardBack
//                 title={{ first: "Balder", second: "Dash" }}
//                 flip={flip}
//               />
//             </View>
//             {/* Choose Word Button */}
//             {definition && !choseWord ? (
//               <Buttons
//                 name={"Choose Word"}
//                 func={handleChooseWord}
//                 pulse={"pulse"}
//               />
//             ) : null}
//           </View>
//         ) : (
//           // GUESS DEFINTIONS CARDS
//           <View style={styles.container}>
//             <View style={styles.guessDef}>
//               <View style={styles.cardContainer}>
//                 <GuessDefs
//                   word={word}
//                   userScore={userScore}
//                   userId={userId}
//                   gameId={game.id}
//                   gameName={gameName}
//                 />
//               </View>
//             </View>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cardContainer: {
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   guessDef: {
//     marginLeft: -13,
//   },
// });

// export default GamePlay;
import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, StyleSheet, ScrollView, Text } from "react-native";

// Redux State and Actions
import {
  setWordState,
  clearFakeDefs,
  addDefinition,
  addRealDefinition,
  getFakeDefinitions,
} from "../../redux/gameplay.js";
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

const GamePlay = ({ game, userScore, userId, reloadScores }) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);

  // Retrieve user and game details
  const gameName = game.name;
  const { user } = useContext(UserContext);
  const username = user.displayName;

  // Local Component State
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [guessDef, setGuessDef] = useState(false);
  const [defInput, setDefInput] = useState(false);
  const [timer, setTimer] = useState(false);
  const [choseWord, setChoseWord] = useState(false);
  const [playerTurn, setPlayerTurn] = useState("");
  const [playerTurnName, setPlayerTurnName] = useState("");
  const [flip, setFlip] = useState(false);
  const [flipSide, setFlipSide] = useState("back");
  const [countdown, setCountdown] = useState(10);
  const [playGame, setPlayGame] = useState(false);

  // Get the player's turn number
  useEffect(() => {
    if (game && game.scores) {
      setPlayerTurn(game.scores.filter((score) => score.turnNum === game.turn));
    }
    if (playerTurn) {
      setPlayerTurnName(playerTurn[0].user.username);
    }
  }, []);

  // Select a random word and set definition
  const handleGetWord = () => {
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
    set(ref(RealTimeDB, `games/${gameName}/word`), {
      word,
      definition,
      room: game.name,
      playerTurnName: user.displayName,
    });
    setTimer(true);
    setChoseWord(true);
    setDefInput(true);
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
        dispatch(clearFakeDefs());
        setDefInput(true);
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
        setCountdown(data.countdown);
        if (data.countdown === 0) {
          setDefInput(false);
          setPlayGame(true);
        }
      }
    });

    // Listener for player fake definitions
    const fakePlayerDefListener = onValue(playerDefRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        dispatch(
          addDefinition({ type: [data.userId], definition: data.playerDef })
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

  // Timer countdown effect for gameplay
  useEffect(() => {
    if (timer) {
      setTimeout(() => {
        set(ref(RealTimeDB, `games/${gameName}/countdownNum`), {
          countdown,
          playerTurnId: userId,
        });
        if (countdown > 0) {
          setDefInput(true);
          setCountdown((countdown) => countdown - 1);
        } else if (countdown === 0) {
          setPlayGame(true);
          setDefInput(false);
        } else {
          setDefInput(false);
        }
      }, 1000);
    }
  }, [timer, countdown]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Display gameplay or guess definitions based on playGame state */}
        {!playGame ? (
          <View>
            <Text>
              Countdown: {countdown}, Timer: {timer}
            </Text>
            <Buttons name={"TEMOP SSPCR"} func={reloadScores} />

            {/* Button to get a word if it's the player's turn */}
            {game && userScore && game.turn === userScore.turnNum ? (
              <Buttons
                name={!word ? "Get Word" : "Get Another Word"}
                func={handleGetWord}
                pulse={!word || !word.length ? "pulse" : null}
              />
            ) : null}

            {/* Display GuessCard and CardFront components based on conditions */}
            <View style={styles.cardContainer}>
              {defInput ? (
                <GuessCard
                  word={word}
                  definition={definition}
                  flip={flip}
                  userId={userId}
                  gameName={game.name}
                />
              ) : null}
              {game && userScore && game.turn === userScore.turnNum ? (
                <CardFront word={word} definition={definition} />
              ) : null}
              <CardBack
                title={{ first: "Balder", second: "Dash" }}
                flip={flip}
              />
            </View>

            {/* Button to choose word once a word is set */}
            {definition && !choseWord ? (
              <Buttons
                name={"Choose Word"}
                func={handleChooseWord}
                pulse={"pulse"}
              />
            ) : null}
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
});

export default GamePlay;
