// import React, {useRef} from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Modal,
//    Animated,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import Buttons from "../../Buttons";
// import CardBack from "./CardBack";

// const CardFront = ({
//   word,
//   definition,
//   guessDefs,
//   handleChooseDef,
//   guessedDef,
//   getAWord,

//   handleChooseWord,
// }) => {
//   const { width, height } = Dimensions.get("window");
// // const cardHeight = height * .9;
// //  const cardHeight = width * 1.5;
//  const cardHeight = height * .9;
//   const cardWidth = width * .9 ;
 



//    const flipAnimation = useRef(new Animated.Value(0)).current;

//   const startAnimation = () => {
//     Animated.timing(flipAnimation, {
//       toValue: 1,
//       duration: 1000,
//       useNativeDriver: true,
//     }).start();
//   };

//   // Interpolation for back rotation
//   const backRotation = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: ["0deg", "90deg", "180deg"], // Start visible, rotate to hide
//   });

//   // Interpolation for front rotation
//   const frontRotation = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: ["180deg", "90deg", "0deg"], // Start hidden, rotate to visible
//   });

//   // Interpolation for scaling
//   const scale = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [1, 1.5, 1], // Add growth effect
//   });



//   return (
//     <Modal
//       visible={true}
//     //   animationType="slide"
//       animationType="fade"
//       transparent={true}
//       onRequestClose={() => setShowTempScoreCard(false)}
//            onShow={startAnimation}
//     >
//       <View
//         style={{
//           ...styles.modalContainer,
//           width: width,
//           height: cardHeight,
//         }}
//       >
//          {/* Back of the card */}
//           <Animated.View
//             style={[
//               styles.card,
//               {
//                 transform: [{ rotateY: backRotation }, { scale }],
//                 position: "absolute",
//               },
//             ]}
//           >
//             <CardBack title={{ first: "Balder", second: "Dash" }} />
//           </Animated.View>

//         <View style={styles.container}>
//           {/* <View style={styles.cardsContainer}> */}
//    <Animated.View
//             style={[
//               styles.cardsContainer,
//               {
//                 transform: [{ rotateY: frontRotation }, { scale }],
//                 position: "absolute",
//               },
//             ]}
//           >

//             <LinearGradient
//               colors={["#88ebe6", "#283330"]}
//               style={[styles.card, { height: cardHeight, width: cardWidth }]}
//             >
//               <View style={styles.innerCard}>
//                 <View style={styles.topPortion}>
//                   <Text style={styles.topText}>{word}</Text>
//                 </View>
//                 <View style={styles.bottomPortion}>
//                   <Text style={styles.bottomText}>{definition}</Text>
//                 </View>
//                 {guessDefs && (
//                   <TouchableOpacity
//                     style={styles.button}
//                     onPress={() => handleChooseDef(guessedDef)}
//                   >
//                     <Text>Choose Definition</Text>
//                   </TouchableOpacity>
//                 )}
//                 <View style={styles.buttons}>
//                   {getAWord}
//                   <Buttons
//                     name={"Choose Word"}
//                     func={handleChooseWord}
//                     pulse={"pulse"}
//                   />
//                 </View>
//               </View>
//             </LinearGradient>
//             </Animated.View>
//           </View>
//         </View>
//       {/* </View> */}
//       {/* <View style={styles.cardBack}>
//         <CardBack title={{ first: "Balder", second: "Dash" }} />
//       </View> */}
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
//   },
//   topPortion: {
//     height: "40%",
//     width: "100%",
//     backgroundColor: "#88ebe6",
//     justifyContent: "center",
//     borderBottomWidth: 5,
//     borderBottomColor: "#571122",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//   },
//   topText: {
//     fontSize: 40,
//     fontWeight: "bold",
//     textAlign: "center",
//     textDecorationLine: "underline",
//   },
//   bottomText: {
//     marginTop: 10,
//     fontSize: 20,
//     fontWeight: "bold",

//     width: "100%",
//   },
//   bottomTextguessDef: {
//     marginTop: -100,
//     fontSize: 20,
//     fontWeight: "bold",

//     width: "100%",
//   },
//   bottomPortion: {
//     padding: 10,
//     width: "100%",
//   },

//   cardsContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     marginTop: -10,
//   },

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
//     overflow: "hidden",
//     backfaceVisibility: "hidden",
//   },

//   innerCard: {
//     width: "100%",
//     height: "100%",
//     justifyContent: "flex-start", // Maintain original alignment for other content
//     alignItems: "center", // Center other elements horizontally
//     borderRadius: 40,
//     borderColor: "black",
//     borderWidth: 5,
//     backgroundColor: "#e6e8dc",
//     flexDirection: "column", // Stack children in a column
//   },
//   innerCardGuessDef: {
//     width: "100%",
//     height: "100%",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderRadius: 40,
//     borderColor: "black",
//     borderWidth: 5,
//     backgroundColor: "#e6e8dc",
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
//     fontSize: "100",
//     color: "#88ebe6",
//   },

//   title: {
//     color: "#283330",
//     fontSize: 40,
//     textAlign: "center",
//     fontWeight: "bold",

//     marginBottom: 20,
//     marginTop: -40,
//     textShadowColor: "#88ebe6",
//     textShadowOffset: { width: 3, height: 3 },
//     textShadowRadius: 1,
//   },
//   form: {
//     width: "100%",
//     alignItems: "center",
//   },
//   input: {
//     width: "100%",
//     padding: 15,
//     backgroundColor: "#fff",
//     borderColor: "black",
//     borderWidth: 2,
//     borderRadius: 50,
//     marginBottom: 20,
//     fontSize: 18,
//   },
//   button: {
//     backgroundColor: "#88ebe6",
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 25,
//     borderColor: "black",
//     borderWidth: 2,
//   },
//   buttonText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "black",
//   },
//   errorText: {
//     color: "red",
//     marginTop: 10,
//   },

//   backButtonText: {
//     fontSize: 18,
//     textDecorationLine: "underline",
//   },
//   buttonGradient: {
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 25,
//     alignItems: "center",
//   },

//   buttons: {
//     marginTop: "auto", // Push buttons to the bottom of the column
//     width: "100%",
//     flexDirection: "column", // Arrange buttons horizontally
//     justifyContent: "space-around", // Distribute buttons evenly
//     padding: 10,
//   },
//   cardBack: {
//     display: "none",
//     overflow: "hidden",
//     backfaceVisibility: "hidden",
//   },
// });

// export default CardFront;

// import React, { useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   Modal,
//   Animated,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import CardBack from "./CardBack";
// import Buttons from "../../Buttons";

// const CardFront = ({
//   word,
//   definition,
//   guessDefs,
//   handleChooseDef,
//   guessedDef,
//   getAWord,
//   handleChooseWord,
//   visible,
//   onClose,
// }) => {
//   const { width, height } = Dimensions.get("window");
//   const cardHeight = height * 0.9;
//   const cardWidth = width * 0.9;

//   const flipAnimation = useRef(new Animated.Value(0)).current;

//   const startAnimation = () => {
//     Animated.timing(flipAnimation, {
//       toValue: 1,
//       duration: 1000,
//       useNativeDriver: true,
//     }).start();
//   };

//   // Interpolation for back rotation
//   const backRotation = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: ["0deg", "90deg", "180deg"], // Start visible, rotate to hide
//   });

//   // Interpolation for front rotation
//   const frontRotation = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: ["180deg", "90deg", "0deg"], // Start hidden, rotate to visible
//   });

//   // Interpolation for scaling
//   const scale = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [1, 1.2, 1], // Add growth effect
//   });

//   return (
//     <Modal
//       visible={visible}
//       animationType="fade"
//       transparent={true}
//       onShow={startAnimation}
//       onRequestClose={onClose}
//     >
//       <View style={[styles.modalContainer, { width, height: cardHeight }]}>
//         <View style={styles.container}>
//           <View style={styles.cardsContainer}>
//             {/* Back of the card */}
//             <Animated.View
//               style={[
//                 styles.card,
//                 {
//                   height: cardHeight,
//                   width: cardWidth,
//                   transform: [{ rotateY: backRotation }, { scale }],
//                   position: "absolute",
//                 },
//               ]}
//             >
//               <CardBack title={{ first: "Balder", second: "Dash" }} />
//             </Animated.View>

//             {/* Front of the card */}
//             <Animated.View
//               style={[
//                 styles.card,
//                 {
//                   height: cardHeight,
//                   width: cardWidth,
//                   transform: [{ rotateY: frontRotation }, { scale }],
//                   position: "absolute",
//                 },
//               ]}
//             >
//               <LinearGradient
//                 colors={["#88ebe6", "#283330"]}
//                 style={styles.innerCard}
//               >
//                 <View style={styles.topPortion}>
//                   <Text style={styles.topText}>{word}</Text>
//                 </View>
//                 <View style={styles.bottomPortion}>
//                   <Text style={styles.bottomText}>{definition}</Text>
//                 </View>
//                 {guessDefs && (
//                   <TouchableOpacity
//                     style={styles.button}
//                     onPress={() => handleChooseDef(guessedDef)}
//                   >
//                     <Text>Choose Definition</Text>
//                   </TouchableOpacity>
//                 )}
//                 <View style={styles.buttons}>
//                   {getAWord}
//                   <Buttons
//                     name={"Choose Word"}
//                     func={handleChooseWord}
//                     pulse={"pulse"}
//                   />
//                 </View>
//               </LinearGradient>
//             </Animated.View>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cardsContainer: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
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
//     // marginVertical: 10,
//     borderColor: "black",
//     borderWidth: 8,
//     backfaceVisibility: "hidden",
//   },
//   innerCard: {
//     width: "100%",
//     height: "100%",
//     justifyContent: "flex-start",
//     alignItems: "center",
//     borderRadius: 40,
//     borderColor: "black",
//     borderWidth: 5,
//     backgroundColor: "#e6e8dc",
//     flexDirection: "column",
//   },
//   topPortion: {
//     height: "40%",
//     width: "100%",
//     backgroundColor: "#88ebe6",
//     justifyContent: "center",
//     borderBottomWidth: 5,
//     borderBottomColor: "#571122",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//   },
//   topText: {
//     fontSize: 40,
//     fontWeight: "bold",
//     textAlign: "center",
//     textDecorationLine: "underline",
//   },
//   bottomPortion: {
//     padding: 10,
//     width: "100%",
//   },
//   bottomText: {
//     marginTop: 10,
//     fontSize: 20,
//     fontWeight: "bold",
//     width: "100%",
//   },
//   button: {
//     backgroundColor: "#88ebe6",
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 25,
//     borderColor: "black",
//     borderWidth: 2,
//   },
//   buttons: {
//     marginTop: "auto",
//     width: "100%",
//     flexDirection: "column",
//     justifyContent: "space-around",
//     padding: 10,
//   },
// });

// export default CardFront;



// import React, { useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   Modal,
//   Animated,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import CardBack from "./CardBack";
// import Buttons from "../../Buttons";

// const CardFront = ({
//   word,
//   definition,
//   guessDefs,
//   handleChooseDef,
//   guessedDef,
//   getAWord,
//   handleChooseWord,
//   visible,
//   onClose,
// }) => {
//   const { width, height } = Dimensions.get("window");
//   const cardHeight = height * 0.7; // Adjusted for better centering
//   const cardWidth = width * 0.8;

//   const flipAnimation = useRef(new Animated.Value(0)).current;

//   const startAnimation = () => {
//     Animated.timing(flipAnimation, {
//       toValue: 1,
//       duration: 1000,
//       useNativeDriver: true,
//     }).start();
//   };

//   // Interpolation for back rotation
//   const backRotation = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: ["0deg", "90deg", "180deg"], // Start visible, rotate to hide
//   });

//   // Interpolation for front rotation
//   const frontRotation = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: ["180deg", "90deg", "0deg"], // Start hidden, rotate to visible
//   });

//   // Interpolation for scaling
//   const scale = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0.8, 1.1, 1], // Add growth effect during transition
//   });

//   return (
//     <Modal
//       visible={visible}
//       animationType="fade"
//       transparent={true}
//       onShow={startAnimation}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalContainer}>
//         <Animated.View
//           style={[
//             styles.cardContainer,
//             { height: cardHeight, width: cardWidth, transform: [{ scale }] },
//           ]}
//         >
//           {/* Back of the card */}
//           <Animated.View
//             style={[
//               styles.card,
//               {
//                 transform: [{ rotateY: backRotation }],
//                 position: "absolute",
//               },
//             ]}
//           >
//             <CardBack title={{ first: "Balder", second: "Dash" }} />
//           </Animated.View>

//           {/* Front of the card */}
//           <Animated.View
//             style={[
//               styles.card,
//               {
//                 transform: [{ rotateY: frontRotation }],
//                 position: "absolute",
//               },
//             ]}
//           >
//             <LinearGradient
//               colors={["#88ebe6", "#283330"]}
//               //   style={styles.innerCard}
//               style={[styles.cardX, { height: cardHeight, width: cardWidth }]}
//             >
//               {/* <View style={styles.outerCard}>
//                 <View style={styles.topPortion}>
//                   <Text style={styles.topText}>{word}</Text>
//                 </View>
//                 <View style={styles.bottomPortion}>
//                   <Text style={styles.bottomText}>{definition}</Text>
//                 </View>
//                 {guessDefs && (
//                   <TouchableOpacity
//                     style={styles.button}
//                     onPress={() => handleChooseDef(guessedDef)}
//                   >
//                     <Text>Choose Definition</Text>
//                   </TouchableOpacity>
//                 )}
//                 <View style={styles.buttons}>
//                   {getAWord}
//                   <Buttons
//                     name={"Choose Word"}
//                     func={handleChooseWord}
//                     pulse={"pulse"}
//                   />
//                 </View>
//               </View> */}

//               <View
//                 style={
//                   guessDefs === undefined
//                     ? styles.innerCard
//                     : styles.innerCardGuessDef
//                 }
//               >
//                 <View style={styles.topPortion}>
//                   <Text style={styles.topText}>{word}</Text>
//                 </View>
//                 <View style={styles.bottomPortion}>
//                   <Text
//                     style={
//                       guessDefs === undefined
//                         ? styles.bottomText
//                         : styles.bottomTextguessDef
//                     }
//                   >
//                     {definition}
//                   </Text>
//                 </View>
//                 {guessDefs && (
//                   <TouchableOpacity
//                     style={styles.button}
//                     onPress={() => handleChooseDef(guessedDef)}
//                   >
//                     <Text>Choose Definition</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </LinearGradient>
//           </Animated.View>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   cardContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   topPortion: {
//     height: "40%",
//     width: "100%",
//     backgroundColor: "#88ebe6",
//     justifyContent: "center",
//     borderBottomWidth: 5,
//     borderBottomColor: "#571122",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//   },
//   topText: {
//     fontSize: 40,
//     fontWeight: "bold",
//     textAlign: "center",
//     textDecorationLine: "underline",
//   },
//   bottomText: {
//     marginTop: 10,
//     fontSize: 20,
//     fontWeight: "bold",

//     width: "100%",
//   },
//   card: {
//     height: "100%",
//     width: "100%",
//     borderRadius: 20,
//     backfaceVisibility: "hidden",
//   },
//   cardX: {
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
//   outerCard: {
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
//     width: "100%",
//     height: "100%",
//     justifyContent: "flex-start",
//     alignItems: "center",
//     borderRadius: 40,
//     borderColor: "black",
//     borderWidth: 5,
//     backgroundColor: "#e6e8dc",
//   },
//   //   topPortion: {
//   //     height: "40%",
//   //     width: "100%",
//   //     backgroundColor: "#88ebe6",
//   //     justifyContent: "center",
//   //     borderBottomWidth: 5,
//   //     borderBottomColor: "#571122",
//   //     borderTopLeftRadius: 30,
//   //     borderTopRightRadius: 30,
//   //   },
//   //   topText: {
//   //     fontSize: 40,
//   //     fontWeight: "bold",
//   //     textAlign: "center",
//   //     textDecorationLine: "underline",
//   //   },
//   bottomPortionX: {
//     padding: 10,
//     width: "100%",
//   },

//   bottomPortionX: {
//     padding: 10,
//     width: "100%",
//   },
//   containerX: {
//     flex: 1,
//     justifyContent: "center",
//     backgroundColor: "pink",
//   },
//   cardsContainerX: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     marginTop: -10,
//   },
//   //   bottomText: {
//   //     marginTop: 10,
//   //     fontSize: 20,
//   //     fontWeight: "bold",
//   //     width: "100%",
//   //   },
//   bottomTextguessDef: {
//     marginTop: -100,
//     fontSize: 20,
//     fontWeight: "bold",

//     width: "100%",
//   },
//   button: {
//     backgroundColor: "#88ebe6",
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 25,
//     borderColor: "black",
//     borderWidth: 2,
//   },
//   buttons: {
//     marginTop: "auto",
//     width: "100%",
//     flexDirection: "column",
//     justifyContent: "space-around",
//     padding: 10,
//   },
// });

// export default CardFront;
// import React, { useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   Modal,
//   Animated,
//   TouchableOpacity,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import CardBack from "./CardBack";
// import Buttons from "../../Buttons";

// const CardFront = ({
//   word,
//   definition,
//   guessDefs,
//   handleChooseDef,
//   guessedDef,
//   getAWord,
//   handleChooseWord,
//   visible,
//   onClose,
// }) => {
//   const { width, height } = Dimensions.get("window");
//   const cardHeight = height * 0.9; // Retain original scaling
//   const cardWidth = width * 0.9;

//   const flipAnimation = useRef(new Animated.Value(0)).current;

//   const startAnimation = () => {
//     Animated.timing(flipAnimation, {
//       toValue: 1,
//       duration: 1000,
//       useNativeDriver: true,
//     }).start();
//   };

//   // Interpolation for back rotation
//   const backRotation = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: ["0deg", "90deg", "180deg"], // Back starts visible, rotates to hide
//   });

//   // Interpolation for front rotation
//   const frontRotation = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: ["180deg", "90deg", "0deg"], // Front starts hidden, rotates to show
//   });

//   // Interpolation for scaling
//   const scale = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0.8, 1.2, 1], // Grow and settle
//   });

//   return (
//     <Modal
//       visible={visible}
//       animationType="fade"
//       transparent={true}
//       onShow={startAnimation}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalContainer}>
//         <Animated.View
//           style={[
//             styles.cardContainer,
//             {
//               width: cardWidth,
//               height: cardHeight,
//               transform: [{ scale }],
//             },
//           ]}
//         >
//           {/* Back of the card */}
//           <Animated.View
//             style={[
//               styles.cardContainer,
//               {
//                 transform: [{ rotateY: backRotation }],
//                 position: "absolute",
//               },
//             ]}
//           >
//             <CardBack title={{ first: "Balder", second: "Dash" }} />
//           </Animated.View>

//           {/* Front of the card */}
//           <Animated.View
//             style={[
//               styles.card,
//               {
//                 transform: [{ rotateY: frontRotation }],
//                 position: "absolute",
//               },
//             ]}
//           >
//             <LinearGradient
//               colors={["#88ebe6", "#283330"]}
//               style={[styles.card, { height: cardHeight, width: cardWidth }]}
//             >
//               <View style={styles.innerCard}>
//                 <View style={styles.topPortion}>
//                   <Text style={styles.topText}>{word}</Text>
//                 </View>
//                 <View style={styles.bottomPortion}>
//                   <Text style={styles.bottomText}>{definition}</Text>
//                 </View>
//                 {guessDefs && (
//                   <TouchableOpacity
//                     style={styles.button}
//                     onPress={() => handleChooseDef(guessedDef)}
//                   >
//                     <Text>Choose Definition</Text>
//                   </TouchableOpacity>
//                 )}
//                 <View style={styles.buttons}>
//                   {getAWord}
//                   <Buttons
//                     name={"Choose Word"}
//                     func={handleChooseWord}
//                     pulse={"pulse"}
//                   />
//                 </View>
//               </View>
//             </LinearGradient>
//           </Animated.View>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
//     display: "hidden",
//   },
//   cardContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {

//     borderRadius: 50,
//     padding: 30,
//     // backgroundColor: "#e6e8dc",
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
//     backfaceVisibility: "hidden",
//   },
//   innerCard: {
//     width: "100%",
//     height: "100%",
//     justifyContent: "flex-start",
//     alignItems: "center",
//     borderRadius: 40,
//     borderColor: "black",
//     borderWidth: 5,
//     backgroundColor: "#e6e8dc",
//     flexDirection: "column",
//   },
//   topPortion: {
//     height: "40%",
//     width: "100%",
//     backgroundColor: "#88ebe6",
//     justifyContent: "center",
//     borderBottomWidth: 5,
//     borderBottomColor: "#571122",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//   },
//   topText: {
//     fontSize: 40,
//     fontWeight: "bold",
//     textAlign: "center",
//     textDecorationLine: "underline",
//   },
//   bottomPortion: {
//     padding: 10,
//     width: "100%",
//   },
//   bottomText: {
//     marginTop: 10,
//     fontSize: 20,
//     fontWeight: "bold",
//     width: "100%",
//   },
//   button: {
//     backgroundColor: "#88ebe6",
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 25,
//     borderColor: "black",
//     borderWidth: 2,
//   },
//   buttons: {
//     marginTop: "auto",
//     width: "100%",
//     flexDirection: "column",
//     justifyContent: "space-around",
//     padding: 10,
//   },
// });

//  export default CardFront;
// import React, { useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   Modal,
//   Animated,
//   TouchableOpacity,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import CardBack from "./CardBack";
// import Buttons from "../../Buttons";

// const CardFront = ({
//   word,
//   definition,
//   guessDefs,
//   handleChooseDef,
//   guessedDef,
//   getAWord,
//   handleChooseWord,
//   visible,
//   onClose,
// }) => {
//   const { width, height } = Dimensions.get("window");
//   const cardHeight = height * 0.9; // Retain original scaling
//   const cardWidth = width * 0.9;

//   const flipAnimation = useRef(new Animated.Value(0)).current;

//   const startAnimation = () => {
//     Animated.timing(flipAnimation, {
//       toValue: 1,
//       duration: 1000,
//       useNativeDriver: true,
//     }).start();
//   };

//   // Interpolation for back rotation
//   const backRotation = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: ["0deg", "90deg", "180deg"], // Back starts visible, rotates to hide
//   });

//   // Interpolation for front rotation
//   const frontRotation = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: ["180deg", "90deg", "0deg"], // Front starts hidden, rotates to show
//   });

//   // Conditional opacity for back
//   const backOpacity = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [1, 0, 0], // Fade out back as it flips
//   });

//   // Conditional opacity for front
//   const frontOpacity = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0, 0, 1], // Fade in front as it flips
//   });

//   // Interpolation for scaling
//   const scale = flipAnimation.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0.8, 1.2, 1], // Grow and settle
//   });

//   return (
//     <Modal
//       visible={visible}
//       animationType="fade"
//       transparent={true}
//       onShow={startAnimation}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalContainer}>
//         <Animated.View
//           style={[
//             styles.cardContainer,
//             {
//               width: cardWidth,
//               height: cardHeight,
//               transform: [{ scale }],
//             },
//           ]}
//         >
//           {/* Back of the card */}
//           <Animated.View
//             style={[
//               styles.cardBack,
//               {
//                 transform: [{ rotateY: backRotation }],
//                 position: "absolute",
//                 opacity: backOpacity,
//               },
//             ]}
//           >
//             <CardBack title={{ first: "Balder", second: "Dash" }} />
//           </Animated.View>

//           {/* Front of the card */}
//           <Animated.View
//             style={[
//               styles.card,
//               {
//                 transform: [{ rotateY: frontRotation }],
//                 position: "absolute",
//                 opacity: frontOpacity,
//               },
//             ]}
//           >
//             <LinearGradient
//               colors={["#88ebe6", "#283330"]}
//               style={[styles.card, { height: cardHeight, width: cardWidth }]}
//             >
//               <View style={styles.innerCard}>
//                 <View style={styles.topPortion}>
//                   <Text style={styles.topText}>{word}</Text>
//                 </View>
//                 <View style={styles.bottomPortion}>
//                   <Text style={styles.bottomText}>{definition}</Text>
//                 </View>
//                 {guessDefs && (
//                   <TouchableOpacity
//                     style={styles.button}
//                     onPress={() => handleChooseDef(guessedDef)}
//                   >
//                     <Text>Choose Definition</Text>
//                   </TouchableOpacity>
//                 )}
//                 <View style={styles.buttons}>
//                   {getAWord}
//                   <Buttons
//                     name={"Choose Word"}
//                     func={handleChooseWord}
//                     pulse={"pulse"}
//                   />
//                 </View>
//               </View>
//             </LinearGradient>
//           </Animated.View>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
//   },
//   cardContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     borderRadius: 50,
//     padding: 30,
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
//     backfaceVisibility: "hidden",
//   },
//   cardBack: {
//     borderRadius: 50,
//     padding: 30,
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//     elevation: 5,
//     marginVertical: 10,
//     // borderColor: "black",
//     // borderWidth: 8,
//     backfaceVisibility: "hidden",
//   },
//   innerCard: {
//     width: "100%",
//     height: "100%",
//     justifyContent: "flex-start",
//     alignItems: "center",
//     borderRadius: 40,
//     borderColor: "black",
//     borderWidth: 5,
//     backgroundColor: "#e6e8dc",
//     flexDirection: "column",
//   },
//   topPortion: {
//     height: "40%",
//     width: "100%",
//     backgroundColor: "#88ebe6",
//     justifyContent: "center",
//     borderBottomWidth: 5,
//     borderBottomColor: "#571122",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//   },
//   topText: {
//     fontSize: 40,
//     fontWeight: "bold",
//     textAlign: "center",
//     textDecorationLine: "underline",
//   },
//   bottomPortion: {
//     padding: 10,
//     width: "100%",
//   },
//   bottomText: {
//     marginTop: 10,
//     fontSize: 20,
//     fontWeight: "bold",
//     width: "100%",
//   },
//   button: {
//     backgroundColor: "#88ebe6",
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 25,
//     borderColor: "black",
//     borderWidth: 2,
//   },
//   buttons: {
//     marginTop: "auto",
//     width: "100%",
//     flexDirection: "column",
//     justifyContent: "space-around",
//     padding: 10,
//   },
// });

// export default CardFront;
import React, { useRef } from "react";
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
  guessDefs,
  handleChooseDef,
  guessedDef,
  getAWord,
  handleChooseWord,
  visible,
  onClose,
  getWord
}) => {
  const { width, height } = Dimensions.get("window");
  
  const cardWidth = width * 0.9;
// const cardHeight = height * 0.9;
const cardHeight = width * 1.5;
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.timing(flipAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  };

  // Interpolation for back rotation
  const backRotation = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["0deg", "90deg", "180deg"], // Back starts visible, rotates to hide
  });

  // Interpolation for front rotation
  const frontRotation = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["180deg", "90deg", "0deg"], // Front starts hidden, rotates to show
  });

  // Interpolation for scaling
  const scale = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.2, 1], // Grow and settle
  });
console.log("CHOSE WORKD : ", getWord)
  return (
    <Modal
      visible={getWord}
      animationType="fade"
      transparent={true}
      onShow={startAnimation}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* <Animated.View
          style={[
            styles.cardContainer,
            {
              width: cardWidth,
              height: cardHeight,
              transform: [{ scale }],
            },
          ]}
        > */}
        <Animated.View
          style={[
            styles.cardContainer,
            {
              //   width: cardWidth,
              //   height: cardHeight,
              transform: [{ perspective: 500 }, { scale }],
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

                transform: [{perspective: 500},{ scale }, { rotateY: backRotation }],
                position: "absolute",
              },
            ]}
          >
            <CardBack title={{ first: "Balder", second: "Dash" }} />
          </Animated.View>

          {/* Front of the card */}
          <Animated.View
            style={[
              styles.card,
              {
                width: cardWidth,
                height: cardHeight,
                transform: [{ scale }, { rotateY: frontRotation }],
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
                {/* <View
                  style={{
                    height: "40%",
                    width: "100%",
                    backgroundColor: "#88ebe6",
                    justifyContent: "center",
                     borderBottomWidth: 5,
    borderBottomColor: "#571122",
                  }}
                > */}
                {/* {" "}
                  <Text style={styles.topText}>{word}</Text>
                </View> */}
                <View style={styles.bottomPortion}>
                  <Text style={styles.bottomText}>{definition}</Text>
                </View>

                <View style={styles.buttons}>
                  {getAWord}
                  <Buttons
                    name={"Choose Word"}
                    func={handleChooseWord}
                    pulse={"pulse"}
                  />
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    overflow: "hidden",
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
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 5,
    // marginVertical: 10,
    // borderColor: "black",
    overflow: "hidden",
    borderWidth: 8,
    backfaceVisibility: "hidden", // Prevents the back and front from showing simultaneously
  },
  cardAni: {
    borderRadius: 50,
    padding: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    backfaceVisibility: "hidden", // Prevents the back and front from showing simultaneously
  },
  cardBack: {
    zIndex: 1,
    borderRadius: 50,

    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 5,
    marginVertical: 10,
    overflow: "hidden",
    backfaceVisibility: "hidden", // Prevents the back and front from showing simultaneously
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
  //   topPortion: {
  //      height: "40%",
  //     width: "100%",
  //       backgroundColor: "#88ebe6",
  //     justifyContent: "center",
  //     borderBottomWidth: 5,
  //      borderBottomColor: "#571122",
  //     borderTopLeftRadius: 30,
  //     borderTopRightRadius: 30,

  //   },
  // Modify topPortion with a workaround for the discoloration issue
  topPortion: {
    // height: "40%",
    // width: "100%",
    // backgroundColor: "#88ebe6",
    // justifyContent: "center",
    // borderBottomWidth: 5,
    // borderBottomColor: "#571122",
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    // overflow: "hidden", // Ensure child elements don't cause artifacts
    height: "40%",
    width: "100%",
    backgroundColor: "#88ebe6",
    justifyContent: "center",
    borderBottomWidth: 5,
    borderBottomColor: "#571122",
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
  button: {
    backgroundColor: "#88ebe6",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderColor: "black",
    borderWidth: 2,
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
