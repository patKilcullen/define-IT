import React, {useEffect, useRef, useState} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";



const CardFront = ({
  word,
  definition,
  guessDefs,
  handleChooseDef,
  guessedDef,
flipAnim
}) => {
  const { width } = Dimensions.get("window");
  const cardHeight = width * 1.5;
  const cardWidth = width * 0.9;



  // Interpolate rotation for front and back flip
  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

    console.log("FORNT: ", flipAnim);
  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>


        <Animated.View style={[{ transform: [{ rotateY }] }]}>
          <LinearGradient
            colors={["#88ebe6", "#283330"]}
            style={[styles.card, { height: cardHeight, width: cardWidth }]}
          >
            <View
              style={
                guessDefs === undefined
                  ? styles.innerCard
                  : styles.innerCardGuessDef
              }
            >
              <View style={styles.topPortion}>
                <Text style={styles.topText}>{word}</Text>
              </View>
              <View style={styles.bottomPortion}>
                <Text
                  style={
                    guessDefs === undefined
                      ? styles.bottomText
                      : styles.bottomTextguessDef
                  }
                >
                  {definition}
                </Text>
              </View>
              {guessDefs && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleChooseDef(guessedDef)}
                >
                  <Text>Choose Definition</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
};

// import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

// const CardFront = forwardRef(({
//   word,
//   definition,
//   guessDefs,
//   handleChooseDef,
//   guessedDef,
// }, ref) => {
//   const { width } = Dimensions.get("window");
//   const cardHeight = width * 1.5;
//   const cardWidth = width * 0.9;

//   // FLIP
//   const flipAnim = useRef(new Animated.Value(0)).current;
//   const [isFlipped, setIsFlipped] = useState(false);

// //   const flipCard = () => {
// //     setIsFlipped((prev) => !prev);
// //     const flipToValue = isFlipped ? 0 : 1;

// //     Animated.timing(flipAnim, {
// //       toValue: flipToValue,
// //       duration: 800,
// //       useNativeDriver: true,
// //     }).start();
// //   };
// const flipCard = () => {
//     console.log("FLIP CARD")
//   const flipToValue = isFlipped ? 0 : 1; // Determine flip direction based on current state

//   // Start the animation
//   Animated.timing(flipAnim, {
//     toValue: flipToValue,
//     duration: 800,
//     useNativeDriver: true,
//   }).start(() => {
//     // Toggle the isFlipped state after animation completes
//     setIsFlipped(!isFlipped);
//   });
// };

//   // Expose flipCard to the parent component
//   useImperativeHandle(ref, () => ({
//     flipCard,
//   }));

//   const rotateY = flipAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "180deg"],
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.cardsContainer}>
//         {/* <TouchableOpacity style={styles.button} onPress={flipCard} >
//           <Text>flipy</Text>
//         </TouchableOpacity> */}
//         <Animated.View style={[{ transform: [{ rotateY }] }]}>
//           <LinearGradient
//             colors={["#88ebe6", "#283330"]}
//             style={[styles.card, { height: cardHeight, width: cardWidth }]}
//           >
//                      <View
//               style={
//                 guessDefs === undefined
//                   ? styles.innerCard
//                   : styles.innerCardGuessDef
//               }
//             >
//               <View style={styles.topPortion}>
//                 <Text style={styles.topText}>{word}</Text>
//               </View>
//               <View style={styles.bottomPortion}>
//                 <Text
//                   style={
//                     guessDefs === undefined
//                       ? styles.bottomText
//                       : styles.bottomTextguessDef
//                   }
//                 >
//                   {definition}
//                 </Text>
//               </View>
//               {guessDefs && (
//                 <TouchableOpacity
//                   style={styles.button}
//                   onPress={() => handleChooseDef(guessedDef)}
//                 >
//                   <Text>Choose Definition</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </LinearGradient>
//         </Animated.View>
//       </View>
//     </View>
//   );
// });

// import React, { useRef, useState, forwardRef, useImperativeHandle } from "react";
// import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

// const CardFront = forwardRef(({ word, definition, guessDefs, handleChooseDef, guessedDef }, ref) => {
//   const { width } = Dimensions.get("window");
//   const cardHeight = width * 1.5;
//   const cardWidth = width * 0.9;

//   // FLIP
//   const flipAnim = useRef(new Animated.Value(0)).current;
//   const [isFlipped, setIsFlipped] = useState(false);

//   const flipCard = () => {
//     console.log("FLIPPPY: ", flipAnim)
//     const flipToValue = isFlipped ? 0 : 1;

//     Animated.timing(flipAnim, {
//       toValue: flipToValue,
//       duration: 800,
//       useNativeDriver: true,
//     }).start(() => {
//       setIsFlipped(!isFlipped);
//     });
//   };

//   // Expose flipCard to the parent component
//   useImperativeHandle(ref, () => ({
//     flipCard,
   
//   }));
//     useImperativeHandle(ref, () => ({
//       testRef: () => console.log("Ref is working in CardFront"),
//     }));



//   const rotateY = flipAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "180deg"],
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.cardsContainer}>
//         <Animated.View style={[{ transform: [{ rotateY }] }]}>
//           <LinearGradient
//             colors={["#88ebe6", "#283330"]}
//             style={[styles.card, { height: cardHeight, width: cardWidth }]}
//           >
//             <View style={guessDefs === undefined ? styles.innerCard : styles.innerCardGuessDef}>
//               <View style={styles.topPortion}>
//                 <Text style={styles.topText}>{word}</Text>
//               </View>
//               <View style={styles.bottomPortion}>
//                 <Text style={guessDefs === undefined ? styles.bottomText : styles.bottomTextguessDef}>
//                   {definition}
//                 </Text>
//               </View>
//               {guessDefs && (
//                 <TouchableOpacity style={styles.button} onPress={() => handleChooseDef(guessedDef)}>
//                   <Text>Choose Definition</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </LinearGradient>
//         </Animated.View>
//       </View>
//     </View>
//   );
// });




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
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",

    width: "100%",
  },
  bottomTextguessDef: {
    marginTop: -100,
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
    borderColor: "green",
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
  innerCardGuessDef: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
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

export default CardFront;
