// import React, { useState, useEffect, useContext } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { View, Text, ScrollView, StyleSheet } from "react-native";

// // SLICES/STATE REDUCERS
// import {
//   addTempScoreCardMessage,
//   clearFakeWords,
//   selectWord,
//   selectFakeDefinitions,
//   selectRealDefinition,
// } from "../../redux/gameplay";
// import { addPoint, getUserScore } from "../../redux/scores";
// import { editGameTurn, selectSingleGame } from "../../redux/singleGame";

// import { UserContext } from "../../UserContext";

// // COMPONENTS
// import TempScoreCard from "../../screens/scores/TempScoreCard";
// const CardFront = React.lazy(() => import("../Cards/CardFront.js"));

// import { ref, set, onValue } from "firebase/database";
// import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";

// const GuessDefs = ({ gameId, userScore, gameName, setPlayGame, playGame }) => {
//   const { user } = useContext(UserContext);
//   userId = user.uid;
//   const [combinedDefs, setCombinedDefs] = useState([]);
//   const [defList, setDefList] = useState(false);
//   const [guessed, setGuessed] = useState(false);
//   const [countdown, setCountdown] = useState(5);

//   const dispatch = useDispatch();
//   const word = useSelector(selectWord);

//   const singleGame = useSelector(selectSingleGame);

//   const fakeDefs = useSelector(selectFakeDefinitions);
//   const realDef = useSelector(selectRealDefinition);

//   useEffect(() => {
//     // Randomly insert `real` into `fakeDefs`
//      const randomIndex = Math.floor(Math.random() * (fakeDefs.length + 1));
//     const definitions = [...fakeDefs];
//     definitions.splice(randomIndex, 0, realDef); // Insert `real` at the random index
//     setCombinedDefs(definitions);
//   }, [fakeDefs, realDef]);

//   // Handle word selection
//   const handleChooseDef = (def) => {
//     setGuessed(true);

//     let message;
//     if (def.type === "fake") {
//       message = `${user.displayName} guessed the WRONG answer!`;
//     } else if (def.type === "real") {
//       message = `${user.displayName} guessed the CORRECT answer and gets 1 point!`;
//       dispatch(addPoint({ userId, gameId }));
//     } else {
//       dispatch(addPoint({ userId, gameId })).then((res) => {
//         message = `${user.displayName} guessed ${res.payload.user.user.displayName}'s fake definition... ${res.payload.user.user.displayName} gets 1 point!!`;
//       });
//     }

//     if (singleGame.turn === userScore.turnNum) {
//       dispatch(addTempScoreCardMessage(message));
//       const scoreCardRef = ref(RealTimeDB, `games/${gameId}_info`);

//       set(scoreCardRef, {
//         gameName: gameName,
//         // playerTurnName: playerTurnName,
//         message: message,
//       });
//     } else {
//       const scoreCardRef = ref(RealTimeDB, `games/${gameId}/score_card_info`);

//       set(scoreCardRef, {
//         gameName: gameName,
//         // playerTurnName: playerTurnName,
//         message: message,
//       })
//         .then(() => {
//           console.log("Scorecard information sent to Firebase successfully");
//         })
//         .catch((error) => {
//           console.error(
//             "Error sending scorecard information to Firebase:",
//             error
//           );
//         });
//     }
//   };

//   useEffect(() => {
//     const scoreCardRef = ref(RealTimeDB, `games/${gameId}_info`);

//     const scoreCardListener = onValue(scoreCardRef, (snapshot) => {
//       const data = snapshot.val();
//       if (
//         data &&
//         data.room === gameName &&
//         singleGame.turn === userScore.turnNum
//       ) {
//         dispatch(addTempScoreCardMessage(data.message)); // Dispatch the score card message
//       }
//     });

//     // Cleanup function to remove Firebase listeners on component unmount
//     return () => {
//       scoreCardListener();
//     };
//   }, [gameId, userScore, dispatch]);

//   useEffect(() => {
//     const timer = setTimeout(async () => {
//       if (countdown > 0) {
//         setCountdown(countdown - 1);
//       } else if (countdown === 0) {
//         // setFakeDefs([]);
//         setPlayGame(false);
//       }
//     }, 1000);

//     // Cleanup the timer when the component unmounts
//     // NEED?
//     return () => clearTimeout(timer);
//   }, [countdown]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.timerText}>Time: {countdown}</Text>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text>Guess the Definition</Text>

//         {combinedDefs.map((definition, index) => (
//           <CardFront
//             key={index}
//             definition={definition.definition}
//             word={word}
//             guessDefs={true}
//             handleChooseDef={handleChooseDef}
//             guessedDef={definition}
//           />
//         ))}
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
//   timerText: {
//     fontSize: 20,
//     color: "red",
//     position: "absolute",
//     top: "5%",
//   },
//   scrollContainer: {
//     padding: 10,
//     alignItems: "center",
//   },
// });

// export default GuessDefs;

import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, ScrollView, StyleSheet } from "react-native";

// Redux State and Actions
import {
  addTempScoreCardMessage,
  clearFakeWords,
  selectWord,
  selectFakeDefinitions,
  selectRealDefinition,
} from "../../redux/gameplay";
import { addPoint, getUserScore } from "../../redux/scores";
import { editGameTurn, selectSingleGame } from "../../redux/singleGame";

// Contexts
import { UserContext } from "../../UserContext";

// Components
import TempScoreCard from "../../screens/scores/TempScoreCard";
const CardFront = React.lazy(() => import("../Cards/CardFront.js"));
const CardBack = React.lazy(() => import("../Cards/CardBack.js"));
// Firebase Configuration
import { ref, set, onValue } from "firebase/database";
import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";

const GuessDefs = ({
  gameId,
  userScore,
  gameName,
  setPlayGame,
  playGame,
  reloadScores,
  game,
  setDefinition,
  setWord,
  setTimer,
  setChoseWord,
  setGamePlayCountdown,

}) => {
  const { user } = useContext(UserContext);
  const userId = user.uid;

  // Component state for definitions, guesses, and countdown timer
  const [combinedDefs, setCombinedDefs] = useState([]);
  const [defList, setDefList] = useState(false);
  const [guessed, setGuessed] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const dispatch = useDispatch();

  // Redux state selectors
  const word = useSelector(selectWord);
  const singleGame = useSelector(selectSingleGame);
  const fakeDefs = useSelector(selectFakeDefinitions);
  const realDef = useSelector(selectRealDefinition);

  // Combine real and fake definitions, inserting the real definition at a random index
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * (fakeDefs.length + 1));
    const definitions = [...fakeDefs];
    definitions.splice(randomIndex, 0, realDef);
    setCombinedDefs(definitions);
  }, [fakeDefs, realDef]);
  console.log("GUESSDEF COUNTDOWN: ", countdown);

  // Handle the selection of a definition by the user
  const handleChooseDef = (def) => {
    setGuessed(true);
    let message;

    if (def.type === "fake") {
      message = `${user.displayName} guessed the WRONG answer!`;
    } else if (def.type === "real") {
      message = `${user.displayName} guessed the CORRECT answer and gets 1 point!`;
      dispatch(addPoint({ userId, gameId }));
    } else {
      // Handle scenario for guessing another player's fake definition
      dispatch(addPoint({ userId, gameId })).then((res) => {
        message = `${user.displayName} guessed ${res.payload.user.user.displayName}'s fake definition... ${res.payload.user.user.displayName} gets 1 point!!`;
      });
    }

    // Update score card information in Firebase
    const scoreCardRef = ref(RealTimeDB, `games/${gameId}/score_card_info`);

    set(scoreCardRef, {
      gameName,
      message,
    })
      .then(() => {
        console.log("Scorecard information sent to Firebase successfully");
      })
      .catch((error) => {
        console.error(
          "Error sending scorecard information to Firebase:",
          error
        );
      });

    // Dispatch score card message if it's the user's turn
    if (singleGame.turn === userScore.turnNum) {
      console.log("singleGame.turn === userScore.turnNum");
      dispatch(addTempScoreCardMessage(message));
    }
  };

  // Listen for score card information updates from Firebase
  useEffect(() => {
    const scoreCardRef = ref(RealTimeDB, `games/${gameId}/score_card_info`);

    const scoreCardListener = onValue(scoreCardRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        dispatch(addTempScoreCardMessage(data.message));
      }
    });

    // Cleanup Firebase listener on component unmount
    return () => scoreCardListener();
  }, [gameId, userScore, dispatch]);

  // Countdown timer for guessing phase
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      } else if (countdown === 0) {
        setPlayGame(false);
        handleChangeGameTurn();
        reloadScores();
        setDefinition("");
        setWord("");
        setGuessed(false);
        setChoseWord(false);
        setTimer(false);
        dispatch(clearFakeWords());
        setGamePlayCountdown(5);
      }
    }, 1000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChangeGameTurn = () => {
    game.roundsLeft !== 1
      ? game.turn === 1
        ? dispatch(
            editGameTurn({
              gameId: gameId,
              turn: game.numPlayers,
              roundsLeft: game.roundsLeft - 1,
            })
          )
        : dispatch(
            editGameTurn({
              gameId: gameId,
              turn: game.turn - 1,
              roundsLeft: game.roundsLeft - 1,
            })
          )
      : dispatch(fetchHighestGameScores(gameId)).then((res) => {
          res.payload.length > 1 ? checkIfTied() : null;

          res.payload.length > 1
            ? game.turn === 1
              ? dispatch(
                  editGameTurn({ gameId: gameId, turn: game.numPlayers })
                )
              : dispatch(editGameTurn({ gameId: gameId, turn: game.turn - 1 }))
            : dispatch(
                editGameTurn({
                  gameId: gameId,
                  turn: game.turn - 1,
                  roundsLeft: game.roundsLeft - 1,
                })
              );
        });
  };
  console.log("GUESSED: ", guessed);
  return !guessed ? (
    <View style={styles.container}>
      <Text style={styles.timerText}>Time: {countdown}</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text>Guess the Definition</Text>

        {combinedDefs.map((definition, index) => (
          <CardFront
            key={index}
            definition={definition.definition}
            word={word}
            guessDefs={true}
            handleChooseDef={handleChooseDef}
            guessedDef={definition}
          />
        ))}
      </ScrollView>
    </View>
  ) : (
    <CardBack title={{ first: "Balder", second: "Dash" }} />
  );

  //   return (

  //    {guessed ?  (<View style={styles.container}>

  //       <Text style={styles.timerText}>Time: {countdown}</Text>

  //       <ScrollView contentContainerStyle={styles.scrollContainer}>
  //         <Text>Guess the Definition</Text>

  //         {combinedDefs.map((definition, index) => (
  //           <CardFront
  //             key={index}
  //             definition={definition.definition}
  //             word={word}
  //             guessDefs={true}
  //             handleChooseDef={handleChooseDef}
  //             guessedDef={definition}
  //           />
  //         ))}
  //       </ScrollView>
  //     </View>)
  //     :<View style={styles.container}>

  //       <Text style={styles.timerText}> you guesses</Text>

  //     </View>
  //    }
  //   );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 20,
    color: "red",
    position: "absolute",
    top: "5%",
  },
  scrollContainer: {
    padding: 10,
    alignItems: "center",
  },
});

export default GuessDefs;
