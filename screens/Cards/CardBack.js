

import React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  Animated,


} from "react-native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const CardBack = ({ title, flipAnim, flippingCard }) => {
  const { width } = Dimensions.get("window");
  const cardHeight = width * 1.5;
  const cardWidth = width * 0.9;
  const textFontSize = width * 0.15;

  // Interpolate rotation for flip animation
  const rotateY = flipAnim
    ? flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["180deg", "0deg"],
      })
    : "0deg";

  // Interpolate opacity to make the card invisible when flipped
  // const opacity = flipAnim
  //   ? flipAnim.interpolate({
  //       inputRange: [0, 1],
  //       outputRange: [0, 1], // Opacity goes from 0 (invisible) to 1 (visible)
  //     })
  //   : 1;
    // const opacity = flipAnim
    //   ? flipAnim.interpolate({
    //       inputRange: [0, 0.5, 1],
    //       outputRange: [0, 0, 1], // Instant opacity change
    //     })
    //   : 1;
const opacity = flipAnim
  ? flipAnim.interpolate({
      inputRange: [0, 0.5, 0.5, 1], // Switch at 90 degrees (0.5)
      outputRange: [0, 0, 1, 1], // Instantly invisible at halfway point
    })
  : 1;
  // Load the custom font
  const [fontsLoaded] = useFonts({
    CustomFont: require("../../assets/fonts/Prociono-Regular.ttf"), // Example of a custom font
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.card,
        { height: cardHeight, width: cardWidth, marginTop: flippingCard ? -575 : 0},
        { transform: [{ rotateY }] },
        { opacity },
      ]}
    >
      <LinearGradient colors={["#88ebe6", "#283330"]} style={styles.innerCard}>
        <Text
          style={[
            styles.titleText,
            { fontFamily: "CustomFont", fontSize: textFontSize },
          ]}
        >
          {title.first || ""}
        </Text>
        <Text
          style={[
            styles.subTitleText,
            { fontFamily: "CustomFont", fontSize: textFontSize },
          ]}
        >
          {title.second || ""}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};






const styles = StyleSheet.create({
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
});

export default CardBack;

