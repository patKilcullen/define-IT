import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { createGame } from "../../redux/singleGame";
import { createScore } from "../../redux/scores";
import { UserContext } from "../../UserContext";
import { useFonts } from "expo-font";

const CreateGame = () => {
  const { user } = useContext(UserContext);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [gameName, setGameName] = useState("");
  const [rounds, setRounds] = useState(1);
  const [error, setError] = useState("");

  const { width } = Dimensions.get("window");
  const cardHeight = width * 1.5;
  const cardWidth = width * 0.9;
  const textFontSize = width * 0.15;


  const handleCreateGame = () => {
    if (!isNaN(rounds) && rounds > 0) {
      dispatch(
        createGame({
          userId: user.uid,
          name: gameName,
          rounds,
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
            displayName: user.displayName || user.email,
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
      <View style={styles.cardsContainer}>
        <LinearGradient
          colors={["#88ebe6", "#283330"]}
          style={[styles.card, { height: cardHeight, width: cardWidth }]}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.innerCard}>
              <Text style={[styles.title, { fontFamily: "CustomFont" }]}>
                Create a New Game
              </Text>
              <KeyboardAvoidingView style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Game Name"
                  value={gameName}
                  onChangeText={setGameName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Number of Rounds"
                  value={rounds.toString()}
                  onChangeText={(text) => {
                    if(text === ""){
                        setRounds("")
                    }else{
                    setRounds(parseInt(text) || 0)}}
                  }
                  keyboardType="numeric"
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* CREATE GAME BUTTON */}
                <TouchableOpacity onPress={handleCreateGame}>
                  <LinearGradient
                    colors={["#88ebe6", "#283330"]}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>Create Game</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "pink",
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 70,
  },

  card: {
    borderRadius: 50,
    padding: 30,
    backgroundColor: "#e6e8dc",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginVertical: 10,
    borderColor: "black",
    borderWidth: 8,
  },
  innerCard: {
    padding: 20,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    borderColor: "black",
    borderWidth: 5,
    backgroundColor: "#e6e8dc",
  },
  titleText: {
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "#558ABB",
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 2,
    transform: [{ rotate: "40deg" }],
    position: "absolute",
    top: "40%",
    textWrap: "noWrap",
    fontSize: "100",
    color: "#88ebe6",
  },
  subTitleText: {
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "#558ABB",
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 2,
    transform: [{ rotate: "40deg" }],
    position: "absolute",
    bottom: "35%",
  },
  title: {
    color: "#283330",
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",

    marginBottom: 20,
    marginTop: -40,
    textShadowColor: "#88ebe6",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 50,
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#88ebe6",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderColor: "black",
    borderWidth: 2,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },

  backButtonText: {
    fontSize: 18,
    textDecorationLine: "underline",
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: "center",
  },
});



export default CreateGame;
