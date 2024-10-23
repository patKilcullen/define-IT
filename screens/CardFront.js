

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

import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const CardFront = ({ title }) => {
  const { width } = Dimensions.get("window");
  const cardHeight = width * 1.5; // Set card height based on the screen width
  const cardWidth = width * 0.9;
  const textFontSize = width * 0.15; // Make text size responsive to screen width

  return (
    <View style={[styles.card, { height: cardHeight, width: cardWidth }]}>
      {/* Inner Card */}
      <View style={styles.innerCard}>
        <Text style={[styles.titleText, { fontSize: textFontSize }]}>
          {title.first || ""}
        </Text>
        <Text style={[styles.subTitleText, { fontSize: textFontSize }]}>
          {title.second || ""}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 50,
    padding: 30, // Padding added to outer card
    backgroundColor: "#e6e8dc", // Background similar to the back of the card
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // For Android shadow effect
    marginVertical: 10,
    borderColor: "black", // Border similar to the one defined in the MUI card
    borderWidth: 8,
  },
  innerCard: {
    padding: 20, // Padding inside the inner card
    backgroundColor: "#88ebe6",
    width: "100%",
    height: "100%", // Ensure it takes up the full height of the outer card
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40, // Rounded corners for the inner card
    borderColor: "black",
    borderWidth: 5,
  },
  titleText: {
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "#558ABB", // Adds a shadow to the text like MUI
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 2,
    transform: [{ rotate: "40deg" }], // Rotates the text slightly counterclockwise
    position: "absolute",
    top: "40%", // Position the title above the sub-title

  },
  subTitleText: {
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "#558ABB",
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 2,
    transform: [{ rotate: "40deg" }], // Rotates the text slightly counterclockwise
    position: "absolute",
    bottom: "35%", // Position the subtitle below the title

  },
});

export default CardFront;

