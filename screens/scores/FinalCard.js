import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

// Slices and Reducers
import { fetchHighestGameScores } from "../../redux/scores";
import { editGameTurn } from "../../redux/singleGame";

// Socket
import { SocketContext } from "../../socketProvider";

const FinalCard = ({ game, userScore }) => {
  // Component State
  const [winner, setWinner] = useState("");
  const [winnerScore, setWinnerScore] = useState(0);

  // Socket
  const clientSocket = useContext(SocketContext);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Fetch highest score and set winner info
  useEffect(() => {
    dispatch(fetchHighestGameScores(game.id)).then((res) => {
      setWinner(res.payload[0].user);
      setWinnerScore(res.payload[0].score);
    });
  }, [dispatch, game.id]);

  // Handle play again
  const handlePlayAgain = () => {
    dispatch(
      editGameTurn({
        gameId: game.id,
        turn: game.numPlayers,
        roundsLeft: game.rounds,
        started: false,
      })
    ).then(() => {
      clientSocket.emit("send_play_again", {
        room: game.name,
        gameId: game.id,
      });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ScrollView contentContainerStyle={styles.innerCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Game OVER</Text>
          </View>
          <View>
            <Text style={styles.winnerText}>
              <Text style={styles.winnerName}>{winner.username}</Text> is the
              WINNER with{" "}
              <Text style={styles.winnerScore}>
                {winnerScore} point{winnerScore > 1 ? "s" : null}
              </Text>
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            {userScore && game.ownerId === userScore.userId && (
              <TouchableOpacity style={styles.button} onPress={handlePlayAgain}>
                <Text style={styles.buttonText}>Play Again</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.buttonText}>Return Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#88ebe6",
  },
  card: {
    width: "90%",
    height: "90%",
    backgroundColor: "#e6e8dc",
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "#000",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  innerCard: {
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
    backgroundColor: "#88ebe6",
    width: "100%",
    padding: 10,
    borderBottomWidth: 5,
    borderBottomColor: "#571122",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#571122",
    textDecorationLine: "underline",
  },
  winnerText: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#571122",
    marginBottom: 20,
  },
  winnerName: {
    fontSize: 60,
    fontWeight: "bolder",
    textDecorationLine: "underline",
  },
  winnerScore: {
    fontSize: 60,
    fontWeight: "bolder",
    textDecorationLine: "underline",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    backgroundColor: "#571122",
    padding: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default FinalCard;
