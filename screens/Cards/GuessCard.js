import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Animated
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { createGame } from "../../redux/singleGame";
import { createScore } from "../../redux/scores";
import { UserContext } from "../../UserContext";
import { useFonts } from "expo-font";
import { addPlayerFakeDef} from "../../redux/gameplay"
import { ref, set, onValue } from "firebase/database";
import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";

const GuessCard = ({ word, definition, flip, gameName, userId,}) => {
  const { user } = useContext(UserContext);
    const [seeInput, setSeeInput] = useState(true);

    const [playerDef, setPlayerDef] = useState("");

      const inputRef = useRef();

      // Set focus on input box
      useEffect(() => {
        inputRef.current.focus();
      }, []);


  const dispatch = useDispatch();
  const navigation = useNavigation();

  
  const [rounds, setRounds] = useState(1);
  const [error, setError] = useState("");

  const { width } = Dimensions.get("window");
  const cardHeight = width * 1.5;
  const cardWidth = width * 0.9;
  const textFontSize = width * 0.15;

  // Load the custom font
  //   const [fontsLoaded] = useFonts({
  //     // CustomFont: require("../assets/fonts/Prociono-Regular.ttf"), // Example of a custom font
  //     CustomFont: require("../../assets/fonts/Prociono-Regular.ttf"),
  //   });

  const [flipAnimation] = useState(new Animated.Value(0));
  // const flipAnimation = useRef(new Animated.Value(0).current);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    console.log("HANDLE FLIP @");
    if (!isFlipped) {
      Animated.timing(flipAnimation, {
        toValue: 180,
        duration: 800,
        useNativeDriver: true, // Set to false for unsupported properties
      }).start(() => {
        setIsFlipped(true);
      });
    } else {
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true, // Set to false for unsupported properties
      }).start(() => {
        setIsFlipped(false);
      });
    }
  };
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const animatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  useEffect(() => {
    if (flip) {
      handleFlip();
    }
  }, [flip]);



  // Sends player's fake definition to the player whose turn it is via a socket
  const handleEnterFakeDef = (e) => {

    e.preventDefault();

    dispatch(addPlayerFakeDef(playerDef));
console.log("playerDefplayerDef: ", playerDef);
    set(ref(RealTimeDB, `games/${gameName}/fake__player_definition`), {
      playerDef,
    //   room: gameName,
      userId,
    //  playerId,
    });
    setSeeInput(false);
    setPlayerDef("");
    // showBackOfCard("back");
  };
  return (
    // <Animated.View style={[styles.container, animatedStyle]}>
    <Animated.View style={styles.container}>
      <View style={styles.cardsContainer}>
        <LinearGradient
          colors={["#88ebe6", "#283330"]}
          style={[styles.card, { height: cardHeight, width: cardWidth }]}
        >
          <View style={styles.innerCard}>
            <View style={styles.topPortion}>
              <Text style={styles.topText}>{word}</Text>
            </View>
            <View style={styles.bottomPortion}>
              {seeInput && (
                <View>
                  <TextInput
                    style={[styles.textInput, { textAlignVertical: "top" }]}
                    placeholder="Enter your definition"
                    multiline={true}
                    numberOfLines={4}
                    value={playerDef}
                    onChangeText={(text) => setPlayerDef(text)}
                    ref={inputRef}
                  />

                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleEnterFakeDef}
                  >
                    <Text>Submit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  topPortion: {
    height: "40%",
    width: "100%",
    backgroundColor: "#88ebe6",
    justifyContent: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#571122",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  topText: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  bottomText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",

    width: "100%",
  },
  bottomPortion: {
    padding: 10,
    width: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "pink",
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: -10,
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
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
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
  textInput: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 50,
    // marginBottom: 20,
    fontSize: 18,
    height:"65%"
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

export default GuessCard;
