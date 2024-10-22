import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";

// SLICES/STATE REDUCERS
import {
  addTempScoreCardMessage,
  clearFakeWords,
  selectWord,
} from "../../redux/gameplay";
import { addPoint } from "../../redux/scores";
import {
  editGameTurn,
  selectSingleGame,
} from "../../redux/singleGame";

// SOCKET
import { SocketContext } from "../../socketProvider";

// COMPONENTS
import TempScoreCard from "../../screens/scores/TempScoreCard";
const CardFront = React.lazy(() => import("../CardFront"));

import { ref, set, onValue } from "firebase/database";
import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";

const GuessDefs = ({
  checkIfTied,
  //   showBackOfCard,
  //   makeHidden,
  game,
  username,
  userId,
  userScore,
  fakeDefinitions,
  gameName,
  gameId,
  playerTurnName,
  reloadScores,
  setDefinition,
  setWord,
  setTimer,
  setPlayGame,
  setChoseWord,
}) => {
  const [fakeDefs, setFakeDefs] = useState([]);
  const [defList, setDefList] = useState(false);
  const [guessed, setGuessed] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const dispatch = useDispatch();
  const word = useSelector(selectWord);
  const clientSocket = useContext(SocketContext);

  const singleGame = useSelector(selectSingleGame);

  //   useEffect(() => {
  //     showBackOfCard("front");
  //   }, []);

  // Countdown logic to change game state when time runs out
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setDefList(true); // Show definitions when countdown starts
        setCountdown(countdown - 1);
      } else if (countdown === 0) {
        handleChangeGameTurn();
        reloadScores();
        resetState();
        // makeHidden();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Reset component state after each turn
  const resetState = () => {
    setDefList(false);
    setDefinition("");
    setWord("");
    setGuessed(false);
    setFakeDefs([]);
    setTimer(false);
    setPlayGame(false);
    setChoseWord(false);
    dispatch(clearFakeWords());
  };

  // Handle changing the game turn based on round and score
  const handleChangeGameTurn = () => {
    const isLastRound = game.roundsLeft === 1;
    if (!isLastRound) {
      const newTurn = game.turn === 1 ? game.numPlayers : game.turn - 1;
      const newRoundsLeft = game.roundsLeft - 1;
      dispatch(
        editGameTurn({ gameId, turn: newTurn, roundsLeft: newRoundsLeft })
      );
    }
  };
  // Set Fake Definitions
  useEffect(() => {
    setFakeDefs(fakeDefinitions);
  }, [fakeDefinitions]);

  // Handle word selection
  const handleChooseWord = (def) => {
    setGuessed(true);
    const userKey = Object.keys(def)[0];
    let message;
    if (userKey === "fake") {
      message = `${username} guessed the WRONG answer!`;
    } else if (userKey === "real") {
      message = `${username} guessed the CORRECT answer and gets 1 point!`;
      dispatch(addPoint({ userId, gameId }));
    } else {
      dispatch(addPoint({ userId: userKey, gameId })).then((res) => {
        message = `${username} guessed ${res.payload.user.username}'s fake definition... ${res.payload.user.username} gets 1 point!!`;
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

  // ReadTimeDB to handle fake definitions and score information
  useEffect(() => {
    // Reference to the location where fake definitions will be stored in Firebase
    const fakeDefsRef = ref(RealTimeDB, `games/${gameName}/fake_definitions`);
    const scoreCardRef = ref(RealTimeDB, `games/${gameName}/score_card_info`);

    // Emit fake definitions to Firebase (similar to sending data via Socket.io)
    set(fakeDefsRef, { fakeDefinitions, gameName });

    // Listen for fake definitions (replaces clientSocket.on('receive_fake_defs'))
    const fakeDefsListener = onValue(fakeDefsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setFakeDefs(data.fakeDefinitions);
      }
    });

    // Listen for score card information (replaces clientSocket.on('receive_score_card_info'))
    const scoreCardListener = onValue(scoreCardRef, (snapshot) => {
      const data = snapshot.val();
      if (
        data &&
        data.room === gameName &&
        singleGame.turn === userScore.turnNum
      ) {
        dispatch(addTempScoreCardMessage(data.message)); // Dispatch the score card message
      }
    });

    // Cleanup function to remove Firebase listeners on component unmount
    return () => {
      fakeDefsListener();
      scoreCardListener();
    };
  }, [gameName, fakeDefinitions, singleGame, userScore, dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Time: {countdown}</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!guessed &&
          defList &&
          fakeDefs?.length &&
          fakeDefs.length > 0 &&
          fakeDefs
            .filter((def) => !def.hasOwnProperty(`${userId}`))
            .map((def, index) => {
              const value = Object.values(def)[0];
              return (
                <CardFront
                  key={`def-${index}`} // Use unique key
                  def={def}
                  handleChooseWord={handleChooseWord}
                  defCards={true}
                  fullScreen={true}
                  top={word || ""}
                  bottom={value}
                  side={"front"}
                  userScore={userScore}
                  singleGame={singleGame}
                />
              );
            })}

        {guessed && <CardFront flip={true} side={"back"} fullScreen={true} />}
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
