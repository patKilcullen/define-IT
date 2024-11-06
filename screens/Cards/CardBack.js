// import React, { useState, useEffect } from "react";
// import {Text, StyleSheet, Dimensions, Animated } from "react-native";
// import { useFonts } from "expo-font";
// import { LinearGradient } from "expo-linear-gradient";

// const CardBack = ({ title, flip, flipAnim }) => {
//   const { width } = Dimensions.get("window");
//   const cardHeight = width * 1.5;
//   const cardWidth = width * 0.9;
//   const textFontSize = width * 0.15;

//   const [flipAnimation] = useState(new Animated.Value(0));
//   // const flipAnimation = useRef(new Animated.Value(0).current);
//   const [isFlipped, setIsFlipped] = useState(false);

//   const handleFlip = () => {
//     if (!isFlipped) {
//       Animated.timing(flipAnimation, {
//         toValue: 180,
//         duration: 800,
//         useNativeDriver: false, // Set to false for unsupported properties
//       }).start(() => {
//         setIsFlipped(true);
//       });
//     } else {
//       Animated.timing(flipAnimation, {
//         toValue: 0,
//         duration: 800,
//         useNativeDriver: false, // Set to false for unsupported properties
//       }).start(() => {
//         setIsFlipped(false);
//       });
//     }
//   };
//   // FLIP
//   const backInterpolate = flipAnimation.interpolate({
//     inputRange: [0, 180],
//     outputRange: ["180deg", "360deg"],
//   });

//   const animatedStyle = {
//     transform: [{ rotateY: backInterpolate }],
//   };

//   useEffect(() => {
//     if (flip) {
//       handleFlip();
//     }
//   }, [flip]);

//   // Load the custom font
//   const [fontsLoaded] = useFonts({
//     CustomFont: require("../../assets/fonts/Prociono-Regular.ttf"), // Example of a custom font
//   });

//   if (!fontsLoaded) {
//     return null;
//   }

//   // Interpolate rotation for front and back flip
//   const rotateY = flipAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "180deg"],
//   });

//   return (
//     <Animated.View
//       style={[
//         styles.card,
//         { height: cardHeight, width: cardWidth, animatedStyle },
//         { transform: [{ rotateY }] },
//       ]}
//     >
//       {/* Inner Card with Gradient */}
//       <LinearGradient colors={["#88ebe6", "#283330"]} style={styles.innerCard}>
//         <Text
//           style={[
//             styles.titleText,
//             { fontFamily: "CustomFont", fontSize: textFontSize },
//           ]}
//         >
//           {title.first || ""}
//         </Text>
//         <Text
//           style={[
//             styles.subTitleText,
//             { fontFamily: "CustomFont", fontSize: textFontSize },
//           ]}
//         >
//           {title.second || ""}
//         </Text>
//       </LinearGradient>
//     </Animated.View>
//   );
// };

import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  Animated,


} from "react-native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const CardBack = ({ title, flip, flipAnim }) => {
  const { width } = Dimensions.get("window");
  const cardHeight = width * 1.5;
  const cardWidth = width * 0.9;
  const textFontSize = width * 0.15;

  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    // Flip logic using the existing flipAnim prop
    const toValue = isFlipped ? 0 : 180;
    Animated.timing(flipAnim, {
      toValue: toValue,
      duration: 800,
      useNativeDriver: true, // Enable for performance
    }).start(() => setIsFlipped(!isFlipped));
  };

  

      const flipAnim2 = useRef(new Animated.Value(1)).current;
  // Interpolate rotation for flip animation
  const rotateY = flipAnim
    ? flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["180deg", "0deg"],
      }) : "0deg"



  useEffect(() => {
    if (flip) {
      handleFlip();
    }
  }, [flip]);

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
        { height: cardHeight, width: cardWidth },
          { transform: [{ rotateY }] }, 
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

// import React, {
//   useState,
//   useEffect,
//   forwardRef,
//   useRef,
//   useImperativeHandle,
// } from "react";
// import { Text, StyleSheet, Dimensions, Animated } from "react-native";
// import { useFonts } from "expo-font";
// import { LinearGradient } from "expo-linear-gradient";

// const CardBack = forwardRef(({ title, flip }, ref) => {
//   const { width } = Dimensions.get("window");
//   const cardHeight = width * 1.5;
//   const cardWidth = width * 0.9;
//   const textFontSize = width * 0.15;

//   // const [flipAnimation] = useState(new Animated.Value(0));
//   // const flipAnimation = useRef(new Animated.Value(0).current);
//   // const [isFlipped, setIsFlipped] = useState(false);

//   // const handleFlip = () => {
//   //   if (!isFlipped) {
//   //     Animated.timing(flipAnimation, {
//   //       toValue: 180,
//   //       duration: 800,
//   //       useNativeDriver: false, // Set to false for unsupported properties
//   //     }).start(() => {
//   //       setIsFlipped(true);
//   //     });
//   //   } else {
//   //     Animated.timing(flipAnimation, {
//   //       toValue: 0,
//   //       duration: 800,
//   //       useNativeDriver: false, // Set to false for unsupported properties
//   //     }).start(() => {
//   //       setIsFlipped(false);
//   //     });
//   //   }
//   // };
//   // // FLIP
//   // const backInterpolate = flipAnimation.interpolate({
//   //   inputRange: [0, 180],
//   //   outputRange: ["180deg", "360deg"],
//   // });

//   // const animatedStyle = {
//   //   transform: [{ rotateY: backInterpolate }],
//   // };

//   // useEffect(() => {
//   //   if (flip) {
//   //     handleFlip();
//   //   }
//   // }, [flip]);

//   // Load the custom font
//   const [fontsLoaded] = useFonts({
//     CustomFont: require("../../assets/fonts/Prociono-Regular.ttf"), // Example of a custom font
//   });

//   if (!fontsLoaded) {
//     return null;
//   }



//   const flipAnim = useRef(new Animated.Value(0)).current;
//   const [isFlipped, setIsFlipped] = useState(false);

//   const flipCard = () => {
//     setIsFlipped((prev) => !prev);
//     const flipToValue = isFlipped ? 0 : 1;

//     Animated.timing(flipAnim, {
//       toValue: flipToValue,
//       duration: 800,
//       useNativeDriver: true,
//     }).start();
//   };

//   // Expose flipCard to the parent component
//   useImperativeHandle(ref, () => ({
//     flipCard,
//   }));

//   const rotateY = flipAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "180deg"],
//   });


//   return (
//     <Animated.View
//       style={[
//         styles.card,
//         { height: cardHeight, width: cardWidth},
//       ]}
      
//     >
//       {/* Inner Card with Gradient */}
//       <LinearGradient colors={["#88ebe6", "#283330"]} style={styles.innerCard}>
//         <Text
//           style={[
//             styles.titleText,
//             { fontFamily: "CustomFont", fontSize: textFontSize },
//           ]}
//         >
//           {title.first || ""}
//         </Text>
//         <Text
//           style={[
//             styles.subTitleText,
//             { fontFamily: "CustomFont", fontSize: textFontSize },
//           ]}
//         >
//           {title.second || ""}
//         </Text>
//       </LinearGradient>
//     </Animated.View>
//   );
// });

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 50,
//     padding: 30,
//     backgroundColor: "#e6e8dc",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//     marginVertical: 10,
//     borderColor: "black",
//     borderWidth: 8,
//   },
//   innerCard: {
//     padding: 20,
//     width: "100%",
//     height: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 40,
//     borderColor: "black",
//     borderWidth: 5,
//   },
//   titleText: {
//     fontWeight: "900",
//     textAlign: "center",
//     textShadowColor: "#558ABB",
//     textShadowOffset: { width: 5, height: 5 },
//     textShadowRadius: 2,
//     transform: [{ rotate: "40deg" }],
//     position: "absolute",
//     top: "40%",
//     textWrap: "noWrap",
//   },
//   subTitleText: {
//     fontWeight: "bold",
//     textAlign: "center",
//     textShadowColor: "#558ABB",
//     textShadowOffset: { width: 5, height: 5 },
//     textShadowRadius: 2,
//     transform: [{ rotate: "40deg" }],
//     position: "absolute",
//     bottom: "35%",
//   },
// });

// export default CardBack;