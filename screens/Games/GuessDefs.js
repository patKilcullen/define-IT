import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

// SLICES/STATE REDUCERS
import {
  selectFakeWords,
  getFakeDefinitions,
  selectFakeDefinitions,
  addTempScoreCardMessage,
  selectTempScoreCardMessages,
  selectRealDefinition,
  clearFakeWords,
  clearFakeDefs,
  selectWord,
} from "../../redux/gameplay";
import {
  editScore,
  addPoint,
  fetchHighestGameScores,
} from "../../redux/scores";
import {
  editGame,
  editGameTurn,
  fetchSingleGame,
  selectSingleGame,
} from "../../redux/singleGame";
import { fetchSingleUser, selectSingleUser } from "../../redux/users";

// SOCKET
import { SocketContext } from "../../socketProvider";

// COMPONENTS
import TempScoreCard from "../../screens/scores/TempScoreCard";
import CardFront from "../CardFront";

const GuessDefs = ({
  checkIfTied,
  showBackOfCard,
  makeHidden,
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
  const [defList, setDefList] = useState(null);
  const [guessed, setGuessed] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const dispatch = useDispatch();
  const word = useSelector(selectWord);
  const clientSocket = useContext(SocketContext);

  const singleGame = useSelector(selectSingleGame);
  const tempScoreCardMessages = useSelector(selectTempScoreCardMessages);

  // Sets card to front when GuessDefs component loads
  useEffect(() => {
    showBackOfCard("front");
  }, []);

  // Countdown logic to change game state when time runs out
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setDefList(true);
        setCountdown(countdown - 1);
      } else if (countdown === 0) {
        handleChangeGameTurn();
        reloadScores();
        resetState();
        makeHidden();
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
    } else {
      dispatch(fetchHighestGameScores(gameId)).then((res) => {
        if (res.payload.length > 1) {
          checkIfTied();
        }
        const newTurn = game.turn === 1 ? game.numPlayers : game.turn - 1;
        const newRoundsLeft =
          res.payload.length > 1 ? game.roundsLeft : game.roundsLeft - 1;
        dispatch(
          editGameTurn({ gameId, turn: newTurn, roundsLeft: newRoundsLeft })
        );
      });
    }
  };

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
      clientSocket.emit("send_score_card_info", {
        gameName,
        playerTurnName,
        message,
      });
    }
  };

  // Socket to handle fake definitions and score information
  useEffect(() => {
    clientSocket.emit("send_fake_defs", { fakeDefinitions, gameName });
    clientSocket.on("receive_fake_defs", (fakeDefinitions) => {
      setFakeDefs(fakeDefinitions);
    });

    clientSocket.on("receive_score_card_info", ({ room, message }) => {
      if (room === gameName && singleGame.turn === userScore.turnNum) {
        dispatch(addTempScoreCardMessage(message));
      }
    });
  }, [clientSocket]);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Time: {countdown}</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!guessed &&
          defList &&
          fakeDefs.length > 0 &&
          fakeDefs
            .filter((def) => !def.hasOwnProperty(`${userId}`))
            .map((def) => {
              const value = Object.values(def)[0];
              return (
                <CardFront
                  key={value}
                  def={def}
                  handleChooseWord={handleChooseWord}
                  defCards={true}
                  fullScreen={true}
                  top={word}
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
