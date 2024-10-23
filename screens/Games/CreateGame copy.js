import React, { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { createGame } from "../../redux/singleGame";
import { createScore } from "../../redux/scores";
import { UserContext } from "../../UserContext";

const CreateGame = () => {
  const { user } = useContext(UserContext);

  //   const userId = useSelector((state) => state.auth.me.id);
  const [gameName, setGameName] = useState("");
  const [rounds, setRounds] = useState(1);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigation = useNavigation();

  //   CREATE GAME
  const handleCreateGame = (e) => {
    e.preventDefault();

    if (!isNaN(rounds) && rounds > 0) {
      dispatch(
        createGame({
          userId: user.uid,
          name: gameName,
          rounds: rounds,
          roundsLeft: rounds,
          winner: "null",
          started: false,
          complete: false,
          ownerId: user.uid,
          publicX: true,
          numPlayers: 1,
          turn: 1,
        })
      ).then((res) => {
        dispatch(
          createScore({
            score: 0,
            accepted: true,
            turn: true,
            turnNum: 1,
            gameId: res.payload.id,
            userId: user.uid,
            userName: user.displayName,
          })
        ).then((res) => {
          navigation.navigate("SingleGame", { id: res.payload.gameId });
        });
      });
    } else {
      setError("Rounds must be a positive integer");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.innerBox}>
          <Text style={styles.title}>Create a New Game</Text>
          <View>
            <Text style={styles.label}>Game Name:</Text>
            <KeyboardAvoidingView>
              <TextInput
                style={styles.input}
                placeholder="Pick a fun game name..."
                value={gameName}
                onChangeText={(text) => setGameName(text)}
                required
              />
              <Text style={styles.label}>Rounds:</Text>
              <TextInput
                style={styles.input}
                placeholder="Number of rounds"
                value={rounds.toString()}
                onChangeText={(text) => setRounds(parseInt(text))}
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleCreateGame}
              >
                <Text style={styles.buttonText}>Create Game</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </View>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.homeButtonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  box: {
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: "#88ebe6",
    padding: 20,
    borderRadius: 50,
    borderColor: "black",
    borderWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  innerBox: {
    backgroundColor: "#e6e8dc",
    padding: 20,
    borderRadius: 50,
    borderColor: "black",
    borderWidth: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    textDecorationLine: "underline",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 50,
    padding: 10,
    fontSize: 18,
    marginVertical: 10,
    width: "100%",
  },
  button: {
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  homeButton: {
    marginTop: 20,
  },
  homeButtonText: {
    fontSize: 18,
    textDecorationLine: "underline",
  },
});

export default CreateGame;
