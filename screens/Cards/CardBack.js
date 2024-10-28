

// import React, { useEffect, useState, useMemo } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import Timer from "./Games/Timer"; // Assuming you have a Timer component
// import Buttons from "../Buttons"; // Assuming you have a custom Buttons component

// const CardFront = ({

//   top, bottom

// }) => {


    

//   return (
//     <View style={styles.card}>
//       {/* Show word (top) */}
//       <View style={styles.topPortion}>
//         <Text style={styles.topText}>{top || "Default Word"}</Text>
//       </View>

//       {/* Show definition (bottom) */}
//       <View style={styles.bottomPortion}>
//         <Text style={styles.bottomText}>{bottom}</Text>
//       </View>

//       {/* Timer Component */}
     
     

     
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     padding: 20,
//     margin: 10,
//     borderWidth: 1,
//     borderColor: "#000",
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     width: "90%",
//   },
//   topPortion: {
//     marginBottom: 20,
//   },
//   topText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   bottomPortion: {
//     marginTop: 10,
//   },
//   bottomText: {
//     fontSize: 20,
//     textAlign: "center",
//   },
// });

// export default CardFront;
// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";

// const CardFront = ({ top, bottom }) => {
//    const { width, height } = Dimensions.get("window");
//    const cardHeight = width * 1.5; // Set card height based on the screen width
//    const topTextFontSize = width * 0.08; // Make text size responsive to screen width
//    const cardwidth = width * .9;
//    const bottomTextFontSize = width * 0.06;

//   return (
//     <View style={[styles.card, { height: cardHeight, width: cardwidth }]}>
//       {/* Top Portion (word) */}
//       <View style={styles.topPortion}>
//         <Text style={styles.topText}>{top || null}</Text>
//       </View>

//       {/* Bottom Portion (definition) */}
//       <View style={styles.bottomPortion}>
//         <Text style={styles.bottomText}>{bottom || null}</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 20,
//     padding: 20,
//     backgroundColor: "#88ebe6",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5, // For Android shadow effect
//     marginVertical: 10,
//   },
//   topPortion: {
//     height: "30%",
//     width: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//     borderBottomWidth: 5,
//     borderBottomColor: "#571122",
//     paddingBottom: 10,
//   },
//   topText: {
//     fontSize: 35,
//     fontWeight: "bold",
//     textAlign: "center",
//     textDecorationLine: "underline",
//   },
//   bottomPortion: {
//     marginTop: 20,
//     paddingHorizontal: "10%",
//     width: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   bottomText: {
//     fontSize: 22,
//     textAlign: "center",
//   },
// });

// export default CardFront;


// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";

// const CardFront = ({ top, bottom }) => {
//   const { width, height } = Dimensions.get("window");
//   const cardHeight = width * 1.5; // Set card height based on the screen width
//   const cardWidth = width * 0.9;
//   const topTextFontSize = width * 0.08; // Make text size responsive to screen width
//   const bottomTextFontSize = width * 0.06;

//   return (
//     <View style={[styles.card, { height: cardHeight, width: cardWidth }]}>
//       {/* Top Portion (word) */}
//       <View style={styles.topPortion}>
//         <Text style={[styles.topText, { fontSize: topTextFontSize }]}>
//           {top || null}
//         </Text>
//       </View>

//       {/* Bottom Portion (definition) */}
//       <View style={styles.bottomPortion}>
//         <Text style={[styles.bottomText, { fontSize: bottomTextFontSize }]}>
//           {bottom || null}
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 50,
//     padding: 20,
//     backgroundColor: "#e6e8dc", // Background similar to the back of the card
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5, // For Android shadow effect
//     marginVertical: 10,
//     borderColor: "black", // Border similar to the one defined in the MUI card
//     borderWidth: 8,
//   },
//   topPortion: {
//     height: "30%",
//     width: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#88ebe6", // Mimics the top portion background in MUI
//     borderBottomWidth: 5,
//     borderBottomColor: "#571122", // Mimics the border-bottom color from MUI styles
//     paddingBottom: 10,
//   },
//   topText: {
//     fontWeight: "bold",
//     textAlign: "center",
//     textDecorationLine: "underline", // Adds underline similar to the front card style
//     textShadowColor: "#558ABB", // Adds a shadow to the text like MUI
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 2,
//   },
//   bottomPortion: {
//     marginTop: 20,
//     paddingHorizontal: "10%",
//     width: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#88ebe6",
//   },
//   bottomText: {
//     textAlign: "center",
//     fontWeight: "bold",
//   },
// });

// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";

// const CardFront = ({ title }) => {
//   const { width } = Dimensions.get("window");
//   const cardHeight = width * 1.5; // Set card height based on the screen width
//   const cardWidth = width * 0.9;
//   const textFontSize = width * 0.15; // Make text size responsive to screen width

//   return (
//     <View style={[styles.card, { height: cardHeight, width: cardWidth }]}>
//       {/* Inner Card */}
//       <View style={styles.innerCard}>
//         <Text style={[styles.titleText, { fontSize: textFontSize }]}>
//           {title.first || ""}
//         </Text>
//         <Text style={[styles.subTitleText, { fontSize: textFontSize }]}>
//           {title.second || ""}
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 50,
//     padding: 30, // Padding added to outer card
//     backgroundColor: "#e6e8dc", // Background similar to the back of the card
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5, // For Android shadow effect
//     marginVertical: 10,
//     borderColor: "black", // Border similar to the one defined in the MUI card
//     borderWidth: 8,
//   },
//   innerCard: {
//     padding: 20, // Padding inside the inner card
//     backgroundColor: "#88ebe6",
//     width: "100%",
//     height: "100%", // Ensure it takes up the full height of the outer card
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 40, // Rounded corners for the inner card
//     borderColor: "black",
//     borderWidth: 5,
//   },
//   titleText: {
//     fontWeight: "bold",
//     textAlign: "center",
//     textShadowColor: "#558ABB", // Adds a shadow to the text like MUI
//     textShadowOffset: { width: 5, height: 5 },
//     textShadowRadius: 2,
//     transform: [{ rotate: "40deg" }], // Rotates the text slightly counterclockwise
//     position: "absolute",
//     top: "40%", // Position the title above the sub-title

//   },
//   subTitleText: {
//     fontWeight: "bold",
//     textAlign: "center",
//     textShadowColor: "#558ABB",
//     textShadowOffset: { width: 5, height: 5 },
//     textShadowRadius: 2,
//     transform: [{ rotate: "40deg" }], // Rotates the text slightly counterclockwise
//     position: "absolute",
//     bottom: "35%", // Position the subtitle below the title

//   },
// });

// export default CardFront;


// import React from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import { LinearGradient } from "expo-linear-gradient"; // Use LinearGradient from expo-linear-gradient
// import { useFonts } from "expo-font"; // For loading custom fonts

// const CardFront = ({ title }) => {
//   const { width } = Dimensions.get("window");
//   const cardHeight = width * 1.5; // Set card height based on the screen width
//   const cardWidth = width * 0.9;
//   const textFontSize = width * 0.15; // Make text size responsive to screen width

//   // Load custom fonts
//   const [loaded] = useFonts({
//     CustomFont: require("./assets/fonts/Prochiono-Regular.ttf"), // Example of a custom font
//   });

//   if (!loaded) {
//     return null; // Show nothing or a loader until the font is loaded
//   }

//   return (
//     <View style={[styles.card, { height: cardHeight, width: cardWidth }]}>
//       {/* Inner Card with Gradient */}
//       <LinearGradient
//         colors={["#283330", "#88ebe6"]} // Gradient from darker to lighter
//         style={styles.innerCard}
//       >
//         <Text style={[styles.titleText, { fontSize: textFontSize }]}>
//           {title.first || ""}
//         </Text>
//         <Text style={[styles.subTitleText, { fontSize: textFontSize }]}>
//           {title.second || ""}
//         </Text>
//       </LinearGradient>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 50,
//     padding: 30, // Padding added to outer card
//     backgroundColor: "#e6e8dc", // Background similar to the back of the card
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5, // For Android shadow effect
//     marginVertical: 10,
//     borderColor: "black", // Border similar to the one defined in the MUI card
//     borderWidth: 8,
//   },
//   innerCard: {
//     padding: 20, // Padding inside the inner card
//     width: "100%",
//     height: "100%", // Ensure it takes up the full height of the outer card
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 40, // Rounded corners for the inner card
//     borderColor: "black",
//     borderWidth: 5,
//   },
//   titleText: {
//     fontFamily: "CustomFont", // Use custom font here
//     fontWeight: "bold",
//     textAlign: "center",
//     textShadowColor: "#558ABB", // Adds a shadow to the text like MUI
//     textShadowOffset: { width: 5, height: 5 },
//     textShadowRadius: 2,
//     transform: [{ rotate: "40deg" }], // Rotates the text slightly counterclockwise
//     position: "absolute",
//     top: "40%", // Position the title above the sub-title
//   },
//   subTitleText: {
//     fontFamily: "CustomFont", // Use custom font here
//     fontWeight: "bold",
//     textAlign: "center",
//     textShadowColor: "#558ABB",
//     textShadowOffset: { width: 5, height: 5 },
//     textShadowRadius: 2,
//     transform: [{ rotate: "40deg" }], // Rotates the text slightly counterclockwise
//     position: "absolute",
//     bottom: "35%", // Position the subtitle below the title
//   },
// });

// export default CardFront;


import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient"; 

const CardBack = ({ title, flip}) => {
  const { width } = Dimensions.get("window");
  const cardHeight = width * 1.5;
  const cardWidth = width * 0.9;
  const textFontSize = width * 0.15;

   const [flipAnimation] = useState(new Animated.Value(0));
  // const flipAnimation = useRef(new Animated.Value(0).current);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) {
      Animated.timing(flipAnimation, {
        toValue: 180,
        duration: 800,
        useNativeDriver: false, // Set to false for unsupported properties
      }).start(() => {
        setIsFlipped(true);
      });
    } else {
      Animated.timing(flipAnimation, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false, // Set to false for unsupported properties
      }).start(() => {
        setIsFlipped(false);
      });
    }
  };
  // FLIP
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const animatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

   useEffect(() => {
     if (flip) {
      console.log("HANDLE FLIP")
       handleFlip();
     }
   }, [flip]);

  // Load the custom font
  const [fontsLoaded] = useFonts({
    CustomFont: require("../../assets/fonts/Prociono-Regular.ttf"), // Example of a custom font
  });

  if (!fontsLoaded) {
    return null; // Show a loader or nothing until the font is loaded
  }

  return (
    <Animated.View
      style={[styles.card, { height: cardHeight, width: cardWidth, animatedStyle }]}
    >
      {/* <View style={[styles.card, { height: cardHeight, width: cardWidth }]}> */}
      {/* Inner Card with Gradient */}
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
    textWrap: "noWrap"
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