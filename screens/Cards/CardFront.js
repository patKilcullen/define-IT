import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CardBack from "./CardBack";
import Buttons from "../../Buttons";


const CardFront = ({
  word,
  definition,
  getAWordButton,
  handleChooseWord,
  closeCardFront,
  getWord,
  setGetWord,
  handleGetWord,
  userTurn,
  gameTurn,
  wordCount,
  showWordCount,
}) => {
  const [reverseFlip, setReverseFlip] = useState(false);

  const { width } = Dimensions.get("window");
  const cardWidth = width * 0.9;
  const cardHeight = width * 1.5;

  const flipAnimation = useRef(new Animated.Value(0)).current;
  const flipAnimation2 = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    if (getWord) {
      startPositionAnimation();
    }
  }, [getWord]);

  const startPositionAnimation = () => {
    Animated.parallel([
      // Flip animation
      Animated.timing(flipAnimation, {
        toValue: 1,
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
    ]).start();
  };

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

  // Interpolation for scaling
  const scale = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1.2], // Grow and settle
  });

  const handleClose = () => {
    setGetWord(false);
  };

  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 0.9, // Scale up
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1, // Scale down
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop(); // Clean up animation on unmount
  }, [scaleAnimation]);

  const handlePickWord = () => {
    setReverseFlip(true);
    startFlipAnimation2();
    handleChooseWord();
  };
  console.log("wordCount", wordCount);
  return (
    <>
      {!getWord && !closeCardFront && (
        <Animated.View
          style={[
            {
              transform: [
                {
                  scale: !getWord && gameTurn === userTurn ? scaleAnimation : 1,
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.cardBackContainer}
            onPress={handleGetWord}
            activeOpacity={0.8} // For better press feedback
          >
            <CardBack title={{ first: "Balder", second: "Dash" }} />
            {handleGetWord && (
              <Animated.View
                style={[
                  styles.pulsingButton,
                  { transform: [{ scale: scaleAnimation }] },
                ]}
              >
                <Text style={styles.getWordText}>Click</Text>
              </Animated.View>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}

      <Modal
        visible={getWord && !closeCardFront}
        animationType="fade"
        transparent={true}
        onRequestClose={closeCardFront}
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
                  ],
                  position: "absolute",
                },
              ]}
            >
              <CardBack title={{ first: "Waht's", second: "it?" }} />
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
              <LinearGradient
                colors={["#88ebe6", "#283330"]}
                style={[styles.card, { height: cardHeight, width: cardWidth }]}
              >
                <View style={styles.innerCard}>
                  <Animated.View style={styles.topPortion}>
                    <Text style={styles.topText}>{word}</Text>
                  </Animated.View>
                  <View style={styles.bottomPortion}>
                    <Text style={styles.bottomText}>{definition}</Text>
                  </View>

                  <View style={styles.buttons}>
                    {showWordCount && (
                      <View>
                        {wordCount - 1 < 2 && (
                          <Text
                            style={{ color: "red" }}
                          >{`${wordCount - 1} draw remaining`}</Text>
                        )}
                      </View>
                    )}
                    {wordCount < 3 && getAWordButton}
                    <Buttons
                      name={"Choose Word"}
                      func={handlePickWord}
                      pulse={"pulse"}
                    />
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cardBackContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  pulsingButton: {
    position: "absolute",
    top: "25%", 
    transform: [{ translateY: -20 }], 
    zIndex: 10, 
    padding: 10,
    borderRadius: 25,
    borderWidth: 3,
    position: "absolute",

    borderRadius: 25,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  getWordText: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    padding: 6,
    color: "rgba(255, 255, 255, 0.5)",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
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
    backfaceVisibility: "hidden", 
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
    flexDirection: "column",
    overflow: "hidden",
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
  bottomPortion: {
    padding: 10,
    width: "100%",
  },
  bottomText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    width: "100%",
  },
  buttons: {
    marginTop: "auto",
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default CardFront;
