// export default TempScoreCard;
import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { SocketContext } from "../../socketProvider";
import { clearTempScoreCardMessages } from "../../redux/gameplay.js";
import { fetchSingleGame } from "../../redux/singleGame.js";
import { selectMe } from "../../redux/auth.js";
import { add3Points, subtract3Points } from "../../redux/scores.js";
import Buttons from "../../Buttons.js";
import { UserContext } from "../../UserContext";
import { ref, set, onValue } from "firebase/database";
import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";

const TempScoreCard = ({
  reloadScores,
  game,
  gameName,
  setShowTempScoreCard,
  word,
  definition,
  tempScoreCard,
}) => {
  const { user } = useContext(UserContext);
  const [countdown, setCountdown] = useState(1);
  const [showChallengeButton, setShowChallengeButton] = useState(true);
  const [pause, setPause] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [message, setMessage] = useState("");
  const [challenge, setChallenge] = useState({});

  const dispatch = useDispatch();
  const clientSocket = useContext(SocketContext);
  const me = useSelector(selectMe);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0 && !pause) {
        setCountdown(countdown - 1);
      } else if (countdown === 0) {
        dispatch(clearTempScoreCardMessages());
        setShowTempScoreCard(false);
        dispatch(fetchSingleGame(game.id));
        set(ref(RealTimeDB, `games/${game.name}/word`), {
          word: "",
          definition: "",
          room: game.name,
          playerTurnName: user.displayName,
          play: true,
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, pause]);

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
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowTempScoreCard(false)}
    >
      <View style={styles.modalContainer}>
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
                    {/* Display messages in tempScoreCard here */}
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
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.innerCard}>
                <View style={styles.topSection}>
                  <Text style={styles.title}>CHALLENGED!</Text>
                </View>
                {/* Display challenge information here */}
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
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
    width: "90%",
    maxHeight: "90%",
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
