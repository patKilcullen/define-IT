import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
} from "react-native";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { addPlayerFakeDef } from "../../redux/gameplay";
import { ref, set } from "firebase/database";
import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";
import CardBack from "./CardBack.js";

const GuessCard = ({
  word,
  gameName,
  userId,
  seeInput,
  setSeeInput,
  userName,
}) => {
  const [playerDef, setPlayerDef] = useState("");
  const [reverseFlip, setReverseFlip] = useState(false);
  const inputRef = useRef();

  const dispatch = useDispatch();

  const { width } = Dimensions.get("window");
  const cardHeight = width * 1.5;
  const cardWidth = width * 0.9;
  const textFontSize = width * 0.15;

  const handleEnterFakeDef = async (e) => {
    e.preventDefault();

    try {
      dispatch(
        addPlayerFakeDef({ def: playerDef, userId: userId, userName: userName })
      );

      await set(ref(RealTimeDB, `games/${gameName}/fake__player_definition`), {
        playerDef,
        userId,
        userName,
      });

      console.log("Data successfully written to Firebase");
    } catch (error) {
      console.error("Firebase set error:", error.message);
    }
    setPlayerDef("");
    setReverseFlip(true);
    startFlipAnimation2();

    setTimeout(() => {
      setSeeInput(false);
    }, 2000);
  };

  const flipAnimation = useRef(new Animated.Value(0)).current;

  const flipAnimation2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (word) {
      startFlipAnimation();
    }
  }, [word !== "" && seeInput]);

  const startFlipAnimation = () => {
    Animated.parallel([
      // Flip animation
      Animated.timing(flipAnimation, {
        toValue: 1, // Reverse or forward
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startFlipAnimation2 = () => {
    Animated.parallel([
      // Flip animation
      Animated.timing(flipAnimation2, {
        toValue: 1, // Reverse or forward
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(moveOffScreenValue, {
        toValue: 0 - cardHeight, // Move completely off-screen
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const backRotation2 = flipAnimation2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["180deg", "90deg", "0deg"],
    // Back starts visible, rotates to hide
  });

  // Interpolation for front rotation
  const frontRotation2 = flipAnimation2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "90deg", "180deg"],
    // Front starts hidden, rotates to show
  });

  const moveOffScreenValue = useRef(new Animated.Value(0)).current;

  // Interpolation for back rotation
  const backRotation = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: reverseFlip
      ? ["180deg", "90deg", "0deg"]
      : ["0deg", "90deg", "180deg"], // Back starts visible, rotates to hide
  });

  // Interpolation for front rotation
  const frontRotation = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: reverseFlip
      ? ["0deg", "90deg", "180deg"]
      : ["180deg", "90deg", "0deg"], // Front starts hidden, rotates to show
  });

  // Interpolation for scaling
  const scale = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1.2],
  });

  return (
    <>
      <Modal
        visible={word !== "" && seeInput}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.cardContainer,
              {
                transform: [{ scale }],
              },
            ]}
          >
            {/* Back of the card */}
            <Animated.View
              style={[
                styles.cardBack,
                {
                  width: cardWidth,
                  height: cardHeight,
                  transform: [
                    { scale },
                    { rotateY: reverseFlip ? backRotation2 : backRotation },
                    { translateY: moveOffScreenValue },
                  ],
                  position: "absolute",
                },
              ]}
            >
              <CardBack title={{ first: "What's", second: "It?" }} />
            </Animated.View>

            {/* Front of the card */}

            <Animated.View
              style={[
                styles.card,
                {
                  width: cardWidth,
                  height: cardHeight,
                  transform: [
                    { scale },
                    { rotateY: reverseFlip ? frontRotation2 : frontRotation },
                  ],
                  position: "absolute",
                },
              ]}
            >
              <View style={styles.cardsContainer}>
                <LinearGradient
                  colors={["#88ebe6", "#283330"]}
                  style={[
                    styles.card,
                    { height: cardHeight, width: cardWidth },
                  ]}
                >
                  <View style={styles.innerCard}>
                    <View style={styles.topPortion}>
                      <Text style={styles.topText}>{word}</Text>
                    </View>
                    <View style={styles.bottomPortion}>
                      {seeInput && (
                        <View>
                          <TextInput
                            style={[
                              styles.textInput,
                              { textAlignVertical: "top" },
                            ]}
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
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    zIndex: 1,
    borderRadius: 50,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    overflow: "hidden",
    backfaceVisibility: "hidden", // Prevents the back and front from showing simultaneously
  },
  card: {
    zIndex: 2004,
    borderRadius: 50,
    padding: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 8,
    backfaceVisibility: "hidden", // Prevents the back and front from showing simultaneously
  },
  topPortion: {
    height: "40%",
    width: "100%",
    backgroundColor: "#88ebe6",
    justifyContent: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#571122",
    overflow: "hidden",
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
    height: "65%",
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
