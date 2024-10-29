import React, { useEffect, useState, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SocketContext } from "../../socketProvider";

// Redux actions and selectors
import {
  clearTempScoreCardMessages,
  selectPlayerFakeDef,
  addTempScoreCardMessage,
} from "../../redux/gameplay.js";
import { selectMe } from "../../redux/auth.js";
// import { askAI } from "../gamePlay/openAISlice";
import { add3Points, subtract3Points } from "../../redux/scores.js";

// Components
import Buttons from "../../Buttons.js";

const TempScoreCard = ({
  reloadScores,
  prevGameTurn,
  userScore,
  game,
  gameName,
  setShowTempScoreCard,
  setReloadFlip,
  word,
  definition,
  tempScoreCard,
  showTiedGame,
}) => {
  const [countdown, setCountdown] = useState(7);
  const [showChallengeButton, setShowChallengeButton] = useState(true);
  const [pause, setPause] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [message, setMessage] = useState("");
  const [challenge, setChallenge] = useState({});

  const dispatch = useDispatch();
  const clientSocket = useContext(SocketContext);

  const me = useSelector(selectMe);
  const userName = me.username;
  const userId = me.id;
  const gameId = game.id;
  const playerFakeDef = useSelector(selectPlayerFakeDef);

  const handleTogglePause = () => {
    // setShowChallengeButton(false);
    // setPause(!pause);

    // setChallenge({ userName, playerFakeDef });
    // clientSocket.emit("send_pause_tempScoreCard_countdown", {
    //   gameName,
    //   userName,
    //   playerFakeDef: playerFakeDef,
    // });

    // dispatch(askAI({ word, definition: playerFakeDef })).then((res) => {
    //   clientSocket.emit("send_ask_ai_answer", {
    //     room: gameName,
    //     answer: res.payload,
    //     message:
    //       res.payload.toLowerCase() === "yes" || res.payload.includes("yes")
    //         ? `AI says ${userName} wrote a CORRECT definition, ${userName} gets 3 points!`
    //         : `AI says ${userName} wrote an INCORRECT definition, ${userName} LOSES 3 points!`,
    //   }
    //   );
    //   setTimeout(() => {
    //     setAiResponse(res.payload);
    //     setMessage(
    //       res.payload.toLowerCase() === "yes" || res.payload.includes("yes")
    //         ? `AI says ${userName} wrote a CORRECT definition, ${userName} gets 3 points!`
    //         : `AI says ${userName} wrote an INCORRECT definition, ${userName} LOSES 3 points!`
    //     );
    //     if (
    //       res.payload.toLowerCase() === "yes" ||
    //       res.payload.includes("yes")
    //     ) {
    //       dispatch(add3Points({ userId, gameId })).then(() => reloadScores());
    //     } else {
    //       dispatch(subtract3Points({ userId, gameId })).then(() =>
    //         reloadScores()
    //       );
    //     }
    //   }, 1500);
    // });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0 && !pause) {
        setCountdown(countdown - 1);
      } else if (countdown === 0) {
        dispatch(clearTempScoreCardMessages());
        setShowTempScoreCard(false);
        game.roundsLeft !== 0 ? setReloadFlip(true) : null;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, pause]);

  // Socket events
  useEffect(() => {
    clientSocket.on(
      "recieve_pause_tempScoreCard_countdown",
      ({ room, userName, playerFakeDef }) => {
        if (room === gameName) {
          setPause(!pause);
          setChallenge({ userName, playerFakeDef });
        }
      }
    );

    clientSocket.on("receive_ask_ai_answer", ({ room, answer, message }) => {
      if (room === gameName) {
        setTimeout(() => {
          setAiResponse(answer);
          setPause(!pause);
          setMessage(message);
          reloadScores();
        }, 1500);
      }
    });
  }, [clientSocket, pause]);

  return (
    <View style={styles.container}>
      {!pause ? (
        <View style={styles.card}>
          <View style={styles.innerCard}>
            <View style={styles.topSection}>
              <Text style={styles.title}>Round Results</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.text}>
                The definition of {word} is... {definition}
              </Text>
              <ScrollView>
                {tempScoreCard && tempScoreCard.length
                  ? tempScoreCard.map((message, index) => (
                      <View key={index}>
                        <Text style={styles.text}>{message}</Text>
                      </View>
                    ))
                  : null}
              </ScrollView>
              {message ? (
                <Text style={styles.text}>***MESSAGE: {message}</Text>
              ) : null}
              {showTiedGame ? (
                <Text style={styles.tiedText}>TIED GAME... keep playing!</Text>
              ) : null}
            </View>
            {showChallengeButton &&
            userScore.turnNum !== prevGameTurn.current ? (
              <Buttons
                name="Challenge"
                func={handleTogglePause}
                pulse="pulse"
              />
            ) : null}
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <View style={styles.innerCard}>
            <View style={styles.topSection}>
              <Text style={styles.title}>CHALLENGED!</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.text}>
                {challenge.userName} challenges that {challenge.playerFakeDef}{" "}
                is a fitting definition of {word}
              </Text>
              <ScrollView>
                <Text style={styles.text}>{aiResponse}</Text>
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#88ebe6",
    padding: 20,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "black",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  innerCard: {
    backgroundColor: "#e6e8dc",
    padding: 10,
    height: "95%",
    width: "90%",
    borderRadius: 50,
    overflow: "scroll",
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  topSection: {
    width: "110%",
    marginBottom: 10,
    paddingBottom: 10,
    height: "20%",
    justifyContent: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#571122",
    backgroundColor: "#88ebe6",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  content: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
  },
  text: {
    fontSize: 20,
    marginVertical: 10,
    textAlign: "center",
  },
  tiedText: {
    color: "red",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TempScoreCard;