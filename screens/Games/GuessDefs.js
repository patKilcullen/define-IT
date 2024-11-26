import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, ScrollView, StyleSheet, Modal } from "react-native";

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
const DefsCard = React.lazy(() => import("../Cards/DefsCard.js"));
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
  setSeeInput,
  setParentCountdown,
  userName,
  setGetWord
}) => {
  const { user } = useContext(UserContext);
  const userId = user.uid;

  // Component state for definitions, guesses, and countdown timer
  const [combinedDefs, setCombinedDefs] = useState([]);
  const [defList, setDefList] = useState(false);
  const [guessed, setGuessed] = useState(false);
  const [countdown, setCountdown] = useState(3);

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
    let notUsersDefs = definitions.filter((def) => def.type !== userName);
    setCombinedDefs(notUsersDefs);
  }, [fakeDefs, realDef]);

  // Handle the selection of a definition by the user
  const handleChooseDef = (def) => {
  
    const chosenDefUserID = def.userId
    setGuessed(true);
    let message;
    if (def.type === "none") {
      message = `${user.displayName} forgot to answer!`;
    } else if (def.type === "fake") {
      message = `${user.displayName} guessed the WRONG answer!`;
    } else if (def.type === "real") {
      message = `${user.displayName} guessed the CORRECT answer and gets 1 point!`;
      dispatch(addPoint({ userId, gameId }));
    } else {
      // Handle scenario for guessing another player's fake definition
      dispatch(addPoint({ chosenDefUserID, gameId }))
       message = `${user.displayName} guessed ${def.type}'s fake definition... ${def.type} gets 1 point!!`;
    //   .then((res) => {
    //     console.log("RES: ", res);
    //     // console.log(
    //     //   "res.payload.user.user.displayName: ",
    //     //   res.payload.userName
    //     // );
    //      message = `${user.displayName} guessed ${res.payload.user.user.displayName}'s fake definition... ${res.payload.user.user.displayName} gets 1 point!!`;
    //     // message = `${userName} guessed turns's fake definition... turd gets 1 point!!`;
    //   });
    }

    // Update score card information in Firebase
    const scoreCardRef = ref(RealTimeDB, `games/${gameId}/score_card_info`);
    console.log("MESSAGE: ", message, gameName, userName, gameId);

    set(scoreCardRef, {
      gameName,
      message,
      userName
    })
    //   .then(() => {
    //     console.log("Scorecard information sent to Firebase successfully");
    //   })
    //   .catch((error) => {
    //     console.error(
    //       "Error sending scorecard information to Firebase:",
    //       error
    //     );
    //   });

    // Dispatch score card message if it's the user's turn
    if (singleGame.turn === userScore.turnNum) {
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

        if (countdown === 1) {
          setSeeInput(true);
          if (!guessed) {
            handleChooseDef({ type: "none" });
          }
        }
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
        setSeeInput(true);
        setParentCountdown(15);
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

  return !guessed ? (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      //   onRequestClose={() => setShowTempScoreCard(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <Text style={styles.timerText}>Time: {countdown}</Text>

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text>Guess the Definition</Text>

            {combinedDefs.map((definition, index) => (
              <DefsCard
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
      </View>
    </Modal>
  ) : (
    <CardBack title={{ first: "Balder", second: "Dash" }} />
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
});

export default GuessDefs;
