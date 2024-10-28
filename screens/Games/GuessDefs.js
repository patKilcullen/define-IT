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
// import { addPoint } from "../../redux/scores";
// import { editGameTurn, selectSingleGame } from "../../redux/singleGame";

// // SOCKET
// import { SocketContext } from "../../socketProvider";

// // COMPONENTS
// import TempScoreCard from "../../screens/scores/TempScoreCard";
// const CardFront = React.lazy(() => import("../Cards/CardBack.js"));

// import { ref, set, onValue } from "firebase/database";
// import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";

// const GuessDefs = ({

// }) => {
//   const [fakeDefs, setFakeDefs] = useState([]);
//   const [defList, setDefList] = useState(false);
//   const [guessed, setGuessed] = useState(false);
//   const [countdown, setCountdown] = useState(10);

//   const dispatch = useDispatch();
//   const word = useSelector(selectWord);
//   const clientSocket = useContext(SocketContext);

//   const singleGame = useSelector(selectSingleGame);

//   const fakeDefs = useSelector(selectFakeDefinitions);
//   const real = useSelector(selectRealDefinition);





//   return (
//     <View style={styles.container}>
//       <Text style={styles.timerText}>Time: {countdown}</Text>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text>Guesssss</Text>
   

//         {guessed && <CardFront flip={true} side={"back"} fullScreen={true} />}
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

// SLICES/STATE REDUCERS
import {
  addTempScoreCardMessage,
  clearFakeWords,
  selectWord,
  selectFakeDefinitions,
  selectRealDefinition,
} from "../../redux/gameplay";
import { addPoint, getUserScore } from "../../redux/scores";
import { editGameTurn, selectSingleGame } from "../../redux/singleGame";

import { UserContext } from "../../UserContext";


// COMPONENTS
import TempScoreCard from "../../screens/scores/TempScoreCard";
const CardFront = React.lazy(() => import("../Cards/CardFront.js"));

import { ref, set, onValue } from "firebase/database";
import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";

const GuessDefs = ({gameId,  userScore}) => {
     const { user } = useContext(UserContext);
     userId = user.id
  const [combinedDefs, setCombinedDefs] = useState([]);
  const [defList, setDefList] = useState(false);
  const [guessed, setGuessed] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const dispatch = useDispatch();
  const word = useSelector(selectWord);


  const singleGame = useSelector(selectSingleGame);

  const fakeDefs = useSelector(selectFakeDefinitions);
  const realDef = useSelector(selectRealDefinition);

  useEffect(() => {
    // Randomly insert `real` into `fakeDefs`
    const randomIndex = Math.floor(Math.random() * (fakeDefs.length + 1));
    const definitions = [...fakeDefs];
    definitions.splice(randomIndex, 0, realDef); // Insert `real` at the random index
    setCombinedDefs(definitions);
  }, [fakeDefs, realDef]);


  // Handle word selection
  const handleChooseDef = (def) => {
    setGuessed(true);

    let message;
    if (def.type === "fake") {
      message = `${user.displayName} guessed the WRONG answer!`;
    } else if (def.type === "real") {
      message = `${user.displayName} guessed the CORRECT answer and gets 1 point!`;
      dispatch(addPoint({ userId, gameId }));
    } else {
      dispatch(addPoint({ userId, gameId })).then((res) => {
        message = `${user.displayName} guessed ${res.payload.user.user.displayName}'s fake definition... ${res.payload.user.user.displayName} gets 1 point!!`;
      });
    }

    if (singleGame.turn === userScore.turnNum) {
      dispatch(addTempScoreCardMessage(message));
    } else {
      const scoreCardRef = ref(RealTimeDB, `games/${gameName}/score_card_info`);

      // Send scorecard information to Firebase
      set(scoreCardRef, {
        gameName: gameName,
        playerTurnName: playerTurnName,
        message: message,
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
    }
  };
  return (
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
  );
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
