import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

// SOCKET
import { SocketContext } from "../../socketProvider";

// COMPONENTS
import DefInputBox from "./DefineInputBox";
import GuessDefs from "./GuessDefs";

// SLICES/STATE REDUCERS
import {
  selectFakeWords,
  getFakeDefinitions,
  selectFakeDefinitions,
} from "../../redux/gameplay";

import { RealTimeDB } from "../../Firebase/FirebaseConfig";
import { ref, set } from "firebase/database";

const Timer = ({
  checkIfTied,
  setTempBack,
  showBackOfCard,
  makeHidden,
  game,
  username,
  userId,
  userScore,
  gameName,
  gameId,
  playerTurnName,
  reloadScores,
  setDefinition,
  setWord,
  setTimer,
  setChoseWord,
}) => {
  // COMPONENT STATE
  const [countdown, setCountdown] = useState(12);
  const [defInput, setDefInput] = useState(false);
  const [playGame, setPlayGame] = useState(false);

  const clientSocket = useContext(SocketContext);
  const dispatch = useDispatch();

  const fakeWords = useSelector(selectFakeWords);
  const fakeDefinitions = useSelector(selectFakeDefinitions);

  // Gets a "fake" definition for each "fake" word
  const handleGetFakeDefinitions = () => {
    fakeWords.forEach((word) => {
      dispatch(getFakeDefinitions(word));
    });
  };

  // Timer logic: Countdown, DefInput visibility, and triggering the GuessDefs component
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setDefInput(true);
        setCountdown(countdown - 1);
      } else if (countdown === 0) {
        handleGetFakeDefinitions();
        setPlayGame(true);
        setDefInput(false);
        showBackOfCard("front");
        setTempBack(false);
      } else {
        setDefInput(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Emit socket event to start countdown when the component mounts
  useEffect(() => {
    // clientSocket.emit("start_countdown", { gameName });
     set(ref(RealTimeDB, `games/${game.name}/countdown`), game.name);
  }, []);

  // When playGame becomes true, hide the previous styles to show guessDefs
  useEffect(() => {
    if (playGame) {
      makeHidden();
    }
  }, [playGame]);

  return (
    <View style={styles.container}>
      {/* Timer display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Time: {countdown}</Text>
      </View>

      {/* Definition Input Box (renders if it's not the player's turn and they've been accepted) */}
      {defInput &&
      userScore.turnNum !== game.turn &&
      userScore.accepted === true ? (
        <DefInputBox
          showBackOfCard={showBackOfCard}
          game={game}
          gameName={gameName}
          userId={userId}
          playerTurnName={playerTurnName}
        />
      ) : null}

      {/* Guess Definitions Component */}
      {playGame ? (
        <GuessDefs
          checkIfTied={checkIfTied}
          showBackOfCard={showBackOfCard}
          makeHidden={makeHidden}
          guessDefs={true}
          top={top}
          game={game}
          username={username}
          userScore={userScore}
          fakeDefinitions={fakeDefinitions}
          gameName={gameName}
          gameId={gameId}
          playerTurnName={playerTurnName}
          userId={userId}
          Name={playerTurnName}
          reloadScores={reloadScores}
          setDefinition={setDefinition}
          setWord={setWord}
          setTimer={setTimer}
          setPlayGame={setPlayGame}
          setChoseWord={setChoseWord}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timerContainer: {
    position: "absolute",
    bottom: "8%",
    left: "40%",
  },
  timerText: {
    fontSize: 24,
    color: "red",
  },
});

export default Timer;
