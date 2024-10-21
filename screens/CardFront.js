import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
 import Timer from "./Games/Timer";
import Buttons from "../Buttons"; // Assuming you have a custom Buttons component



const CardFront = ({
  baseCard,
  notReverse,
  moveOffScreen,
  bottomCard,
  checkIfTied,
  half,
  def,
  handleChooseWord,
  defCards,
  top,
  bottom,
  side,
  fullScreen,
  flip,
  timer,
  game,
  username,
  userId,
  userScore,
  gameName,
  playerTurnName,
  reloadScores,
  setDefinition,
  setWord,
  setTimer,
  setChoseWord,
  singleGame,
  flippable
}) => {
  const [sideState, setSideState] = useState(side);
  const [tempBack, setTempBack] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { width } = Dimensions.get("window");
  const cardHeight = width * 1.5;

  const cardDimensions = useMemo(() => {
    return {
      height: cardHeight,
      width: "100%", // Full width of the screen
      marginLeft: fullScreen && !hidden ? "-1vw" : defCards ? "2vw" : "0",
    };
  }, [cardHeight, fullScreen, defCards, hidden]);


  useEffect(() => {
    setSideState(side);
  }, [side]);

  const showBackOfCard = (sideX, X) => {
    if (sideX === "front") {
      setSideState(sideX);
    } else if (sideX === "back") {
      setTempBack(true);
    }
  };

  const makeHidden = () => {
    setHidden((prevHidden) => !prevHidden);
  };

  const cardBackgroundColor = useMemo(() => {
    return sideState === "front" && !defCards && !hidden && !tempBack
      ? "#88ebe6"
      : "#e6e8dc";
  }, [sideState, defCards, hidden, tempBack]);

//   const cardDimensions = useMemo(() => {
//     return {
//       height: timer || (fullScreen && !hidden) ? "100%" : 350,
//       width: defCards ? "85%" : 200,
//       marginLeft: fullScreen && !hidden ? "-1vw" : defCards ? "2vw" : "0",
//     };
//   }, [timer, fullScreen, defCards, hidden]);

  const cardBorderStyle = useMemo(() => {
    return hidden ? {} : { borderColor: "black", borderWidth: 2 };
  }, [hidden]);

  const frontCardStyle = useMemo(() => {
    return {
      minHeight: 600,
      minWidth: "110%",
      display: "flex",
      flexDirection: "column",
      borderTopWidth: hidden ? 0 : null,
      position: "relative",
    };
  }, [hidden]);

  const transformStyles = {
    transform: [
      { rotateY: flip || side === "front" || notReverse ? "0deg" : "180deg" },
      { translateX: moveOffScreen ? -1000 : 0 },
    ],
  };

  return (

    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBackgroundColor,
          ...cardDimensions,
          ...cardBorderStyle,
          ...transformStyles,
        },
      ]}
    >
      {/* Main Card */}
    <View
        style={flippable && [
          styles.card,
          {
            backgroundColor: cardBackgroundColor,
            ...cardDimensions,
            ...cardBorderStyle,
            ...transformStyles,
          },
        ]}
      >
        {/* Inner Card */}
        <View style={[styles.innerCard, cardBorderStyle]}>
          {sideState === "front" ? (
            <View style={frontCardStyle}>
              {/* Top Portion of Front of Card */}
              {!hidden && (
                <View style={styles.topPortion}>
                  <Text style={styles.topText}>
                    {top && !hidden && !tempBack ? top : null}
                  </Text>
                </View>
              )}
              {/* Bottom portion of front of card */}
              {!hidden && bottom && (
                <View style={styles.bottomPortion}>
                  <Text>{bottom}</Text>
                </View>
              )}
              {/* Timer Component */}
              {timer && (
                <Timer
                  checkIfTied={checkIfTied}
                  setTempBack={setTempBack}
                  showBackOfCard={showBackOfCard}
                  makeHidden={makeHidden}
                  top={top}
                  game={game}
                  username={username}
                  userId={userId}
                  userScore={userScore}
                  gameName={gameName}
                  gameId={game.id}
                  playerTurnName={playerTurnName}
                  definition={bottom}
                  reloadScores={reloadScores}
                  setDefinition={setDefinition}
                  setWord={setWord}
                  setTimer={setTimer}
                  setChoseWord={setChoseWord}
                />
              )}
            </View>
          ) : null}

          {/* Back of Card */}
          {sideState === "back" || tempBack ? (
            <View style={styles.backOfCard}>
              <Text style={styles.backText}>
                {half ? half.first : "Balder..."}
              </Text>
              <Text style={styles.backText}>
                {half ? half.second : "...dash"}
              </Text>
            </View>
          ) : null}

          {/* Choose Definition Button */}
          {defCards &&
          userScore.turnNum !== singleGame.turn &&
          userScore.accepted === true ? (
            <Buttons
              name="Choose Definition"
              func={() => handleChooseWord(def)}
              pulse="null"
            />
          ) : null}
        </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 50,
    padding: 20,
    boxShadow: "0 0 2px 2px black",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transitionDuration: "0.9s",
    minWidth: 350,
  },
  //   innerCard: {
  //     backgroundColor: "#88ebe6",
  //     padding: 10,
  //     borderRadius: 50,
  //     height: 330,
  //     width: 180,
  //     overflow: "scroll",
  //   },
  innerCard: {
    backgroundColor: "#88ebe6",
    padding: 10,
    borderRadius: 50,
    height: "100%", // Full height of the card
    // width: "100%", // Full width of the card
    minWidth: 300,
    overflow: "scroll",
  },
  topPortion: {
    height: "20%",
    width: "110%",
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
    paddingLeft: "10%",
    width: "90%",
  },
  backOfCard: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 65,
    fontWeight: "bold",
  },
});

export default CardFront;


// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
// import Timer from "./Games/Timer";
// import Buttons from "../Buttons"; // Assuming you have a custom Buttons component

// const CardFront = ({
//   baseCard,
//   notReverse,
//   moveOffScreen,
//   bottomCard,
//   checkIfTied,
//   half,
//   def,
//   handleChooseWord,
//   defCards,
//   top,
//   bottom,
//   side,
//   fullScreen,
//   flip,
//   timer,
//   game,
//   username,
//   userId,
//   userScore,
//   gameName,
//   playerTurnName,
//   reloadScores,
//   setDefinition,
//   setWord,
//   setTimer,
//   setChoseWord,
//   singleGame,
//   flippable,
// }) => {
//   const [sideState, setSideState] = useState(side);
//   const [tempBack, setTempBack] = useState(false);
//   const [hidden, setHidden] = useState(false);

//   const { width } = Dimensions.get("window");
//   const cardHeight = width * 1.5;

//   // Animated value for the flip
//   const flipAnim = useRef(new Animated.Value(0)).current;

//   // Card flipping animation
//   useEffect(() => {
//     if (flip) {
//       Animated.timing(flipAnim, {
//         toValue: 1, // Rotate to 180 degrees
//         duration: 800,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(flipAnim, {
//         toValue: 0, // Rotate to 0 degrees
//         duration: 800,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [flip]);

//   // Interpolating the flip animation from 0 to 180 degrees
//   const flipRotation = flipAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "180deg"], // From 0 degrees to 180 degrees
//   });

//   const cardDimensions = useMemo(() => {
//     return {
//       height: cardHeight,
//       width: "100%", // Full width of the screen
//     };
//   }, [cardHeight]);

//   useEffect(() => {
//     setSideState(side);
//   }, [side]);

//   const showBackOfCard = (sideX, X) => {
//     if (sideX === "front") {
//       setSideState(sideX);
//     } else if (sideX === "back") {
//       setTempBack(true);
//     }
//   };

//   const makeHidden = () => {
//     setHidden((prevHidden) => !prevHidden);
//   };

//   const cardBackgroundColor = useMemo(() => {
//     return sideState === "front" && !defCards && !hidden && !tempBack
//       ? "#88ebe6"
//       : "#e6e8dc";
//   }, [sideState, defCards, hidden, tempBack]);

//   const cardBorderStyle = useMemo(() => {
//     return hidden ? {} : { borderColor: "black", borderWidth: 2 };
//   }, [hidden]);

//   const frontCardStyle = useMemo(() => {
//     return {
//       minHeight: 600,
//       minWidth: "110%",
//       display: "flex",
//       flexDirection: "column",
//       borderTopWidth: hidden ? 0 : null,
//       position: "relative",
//     };
//   }, [hidden]);

//   return (
//     <Animated.View
//       style={[
//         styles.card,
//         {
//           backgroundColor: cardBackgroundColor,
//           ...cardDimensions,
//           ...cardBorderStyle,
//           transform: [{ rotateY: flipRotation }],
//         },
//       ]}
//     >
//       {/* Main Card */}
//       <View style={[styles.innerCard, cardBorderStyle]}>
//         {sideState === "front" ? (
//           <View style={frontCardStyle}>
//             {/* Top Portion of Front of Card */}
//             {!hidden && (
//               <View style={styles.topPortion}>
//                 <Text style={styles.topText}>
//                   {top && !hidden && !tempBack ? top : null}
//                 </Text>
//               </View>
//             )}
//             {/* Bottom portion of front of card */}
//             {!hidden && bottom && (
//               <View style={styles.bottomPortion}>
//                 <Text>{bottom}</Text>
//               </View>
//             )}
//             {/* Timer Component */}
//             {timer && (
//               <Timer
//                 checkIfTied={checkIfTied}
//                 setTempBack={setTempBack}
//                 showBackOfCard={showBackOfCard}
//                 makeHidden={makeHidden}
//                 top={top}
//                 game={game}
//                 username={username}
//                 userId={userId}
//                 userScore={userScore}
//                 gameName={gameName}
//                 gameId={game.id}
//                 playerTurnName={playerTurnName}
//                 definition={bottom}
//                 reloadScores={reloadScores}
//                 setDefinition={setDefinition}
//                 setWord={setWord}
//                 setTimer={setTimer}
//                 setChoseWord={setChoseWord}
//               />
//             )}
//           </View>
//         ) : null}

//         {/* Back of Card */}
//         {sideState === "back" || tempBack ? (
//           <View style={styles.backOfCard}>
//             <Text style={styles.backText}>
//               {half ? half.first : "Balder..."}
//             </Text>
//             <Text style={styles.backText}>
//               {half ? half.second : "...dash"}
//             </Text>
//           </View>
//         ) : null}

//         {/* Choose Definition Button */}
//         {defCards &&
//         userScore.turnNum !== singleGame.turn &&
//         userScore.accepted === true ? (
//           <Buttons
//             name="Choose Definition"
//             func={() => handleChooseWord(def)}
//             pulse="null"
//           />
//         ) : null}
//       </View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     borderRadius: 50,
//     padding: 20,
//     boxShadow: "0 0 2px 2px black",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     transitionDuration: "0.9s",
//     minWidth: 350,
//   },
//   innerCard: {
//     backgroundColor: "#88ebe6",
//     padding: 10,
//     borderRadius: 50,
//     height: "100%", // Full height of the card
//     minWidth: 300,
//     overflow: "scroll",
//   },
//   topPortion: {
//     height: "20%",
//     width: "110%",
//     backgroundColor: "#88ebe6",
//     justifyContent: "center",
//     borderBottomWidth: 5,
//     borderBottomColor: "#571122",
//   },
//   topText: {
//     fontSize: 40,
//     fontWeight: "bold",
//     textAlign: "center",
//     textDecorationLine: "underline",
//   },
//   bottomPortion: {
//     paddingLeft: "10%",
//     width: "90%",
//   },
//   backOfCard: {
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   backText: {
//     fontSize: 65,
//     fontWeight: "bold",
//   },
// });

// export default CardFront;


// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
// import Timer from "./Games/Timer";
// import Buttons from "../Buttons"; // Assuming you have a custom Buttons component

// const CardFront = ({
//   baseCard,
//   notReverse,
//   moveOffScreen,
//   bottomCard,
//   checkIfTied,
//   half,
//   def,
//   handleChooseWord,
//   defCards,
//   top,
//   bottom,
//   side,
//   fullScreen,
//   flip,
//   timer,
//   game,
//   username,
//   userId,
//   userScore,
//   gameName,
//   playerTurnName,
//   reloadScores,
//   setDefinition,
//   setWord,
//   setTimer,
//   setChoseWord,
//   singleGame,
//   flippable,
// }) => {
//   const [sideState, setSideState] = useState(side);
//   const [tempBack, setTempBack] = useState(false);
//   const [hidden, setHidden] = useState(false);

//   const { width } = Dimensions.get("window");
//   const cardHeight = width * 1.5;

//   // Animated value for the flip
//   const flipAnim = useRef(new Animated.Value(0)).current;

//   // Animated value for the X translation (move off screen)
//   const translateXAnim = useRef(new Animated.Value(0)).current;

//   // Card flipping animation
//   useEffect(() => {
//     if (flip) {
//       Animated.timing(flipAnim, {
//         toValue: 1, // Rotate to 180 degrees
//         duration: 800,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(flipAnim, {
//         toValue: 0, // Rotate to 0 degrees
//         duration: 800,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [flip]);

//   // Interpolating the flip animation from 0 to 180 degrees
//   const flipRotation = flipAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "180deg"], // From 0 degrees to 180 degrees
//   });

//   // Handle moving off-screen and back
//   useEffect(() => {
//     if (moveOffScreen) {
//       // Move card off the screen (left side)
//       Animated.sequence([
//         Animated.timing(translateXAnim, {
//           toValue: -width, // Move to the left by the screen's width
//           duration: 500,
//           useNativeDriver: true,
//         }),
//         // Move the card back to its original position
//         Animated.timing(translateXAnim, {
//           toValue: 0, // Return to the center
//           duration: 500,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   }, [moveOffScreen, width]);

//   const cardDimensions = useMemo(() => {
//     return {
//       height: cardHeight,
//       width: "100%", // Full width of the screen
//     };
//   }, [cardHeight]);

//   useEffect(() => {
//     setSideState(side);
//   }, [side]);

//   const showBackOfCard = (sideX, X) => {
//     if (sideX === "front") {
//       setSideState(sideX);
//     } else if (sideX === "back") {
//       setTempBack(true);
//     }
//   };

//   const makeHidden = () => {
//     setHidden((prevHidden) => !prevHidden);
//   };

//   const cardBackgroundColor = useMemo(() => {
//     return sideState === "front" && !defCards && !hidden && !tempBack
//       ? "#88ebe6"
//       : "#e6e8dc";
//   }, [sideState, defCards, hidden, tempBack]);

//   const cardBorderStyle = useMemo(() => {
//     return hidden ? {} : { borderColor: "black", borderWidth: 2 };
//   }, [hidden]);

//   const frontCardStyle = useMemo(() => {
//     return {
//       minHeight: 600,
//       minWidth: "110%",
//       display: "flex",
//       flexDirection: "column",
//       borderTopWidth: hidden ? 0 : null,
//       position: "relative",
//     };
//   }, [hidden]);

//   return (
//     <Animated.View
//       style={[
//         styles.card,
//         {
//           backgroundColor: cardBackgroundColor,
//           ...cardDimensions,
//           ...cardBorderStyle,
//           transform: [
//             { rotateY: flipRotation },
//             { translateX: translateXAnim },
//           ],
//         },
//       ]}
//     >
//       {/* Main Card */}
//       <View style={[styles.innerCard, cardBorderStyle]}>
//         {sideState === "front" ? (
//           <View style={frontCardStyle}>
//             {/* Top Portion of Front of Card */}
//             {!hidden && (
//               <View style={styles.topPortion}>
//                 <Text style={styles.topText}>
//                   {top && !hidden && !tempBack ? top : null}
//                 </Text>
//               </View>
//             )}
//             {/* Bottom portion of front of card */}
//             {!hidden && bottom && (
//               <View style={styles.bottomPortion}>
//                 <Text>{bottom}</Text>
//               </View>
//             )}
//             {/* Timer Component */}
//             {timer && (
//               <Timer
//                 checkIfTied={checkIfTied}
//                 setTempBack={setTempBack}
//                 showBackOfCard={showBackOfCard}
//                 makeHidden={makeHidden}
//                 top={top}
//                 game={game}
//                 username={username}
//                 userId={userId}
//                 userScore={userScore}
//                 gameName={gameName}
//                 gameId={game.id}
//                 playerTurnName={playerTurnName}
//                 definition={bottom}
//                 reloadScores={reloadScores}
//                 setDefinition={setDefinition}
//                 setWord={setWord}
//                 setTimer={setTimer}
//                 setChoseWord={setChoseWord}
//               />
//             )}
//           </View>
//         ) : null}

//         {/* Back of Card */}
//         {sideState === "back" || tempBack ? (
//           <View style={styles.backOfCard}>
//             <Text style={styles.backText}>
//               {half ? half.first : "Balder..."}
//             </Text>
//             <Text style={styles.backText}>
//               {half ? half.second : "...dash"}
//             </Text>
//           </View>
//         ) : null}

//         {/* Choose Definition Button */}
//         {defCards &&
//         userScore.turnNum !== singleGame.turn &&
//         userScore.accepted === true ? (
//           <Buttons
//             name="Choose Definition"
//             func={() => handleChooseWord(def)}
//             pulse="null"
//           />
//         ) : null}
//       </View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     borderRadius: 50,
//     padding: 20,
//     boxShadow: "0 0 2px 2px black",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     transitionDuration: "0.9s",
//     minWidth: 350,
//   },
//   innerCard: {
//     backgroundColor: "#88ebe6",
//     padding: 10,
//     borderRadius: 50,
//     height: "100%", // Full height of the card
//     minWidth: 300,
//     overflow: "scroll",
//   },
//   topPortion: {
//     height: "20%",
//     width: "110%",
//     backgroundColor: "#88ebe6",
//     justifyContent: "center",
//     borderBottomWidth: 5,
//     borderBottomColor: "#571122",
//   },
//   topText: {
//     fontSize: 40,
//     fontWeight: "bold",
//     textAlign: "center",
//     textDecorationLine: "underline",
//   },
//   bottomPortion: {
//     paddingLeft: "10%",
//     width: "90%",
//   },
//   backOfCard: {
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   backText: {
//     fontSize: 65,
//     fontWeight: "bold",
//   },
// });

// export default CardFront;



// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
// import Timer from "./Games/Timer";
// import Buttons from "../Buttons"; // Assuming you have a custom Buttons component

// const CardFront = ({
//   baseCard,
//   notReverse,
//   moveOffScreen,
//   bottomCard,
//   checkIfTied,
//   half,
//   def,
//   handleChooseWord,
//   defCards,
//   top,
//   bottom,
//   side,
//   fullScreen,
//   flip,
//   timer,
//   game,
//   username,
//   userId,
//   userScore,
//   gameName,
//   playerTurnName,
//   reloadScores,
//   setDefinition,
//   setWord,
//   setTimer,
//   setChoseWord,
//   singleGame,
//   flippable,
// }) => {
//   const [sideState, setSideState] = useState(side);
//   const [tempBack, setTempBack] = useState(false);
//   const [hidden, setHidden] = useState(false);

//   const { width } = Dimensions.get("window");
//   const cardHeight = width * 1.5;

//   // Animated value for the flip
//   const flipAnim = useRef(new Animated.Value(0)).current;

//   // Animated value for the X translation (move off screen)
//   const translateXAnim = useRef(new Animated.Value(0)).current;

//   // Card flipping animation
//   useEffect(() => {
//     if (flip) {
//       Animated.timing(flipAnim, {
//         toValue: 1, // Rotate to 180 degrees
//         duration: 800,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(flipAnim, {
//         toValue: 0, // Rotate to 0 degrees
//         duration: 800,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [flip]);

//   // Interpolating the flip animation from 0 to 180 degrees
//   const flipRotation = flipAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "180deg"], // From 0 degrees to 180 degrees
//   });

//   // Handle moving off-screen and back
//   useEffect(() => {
//     if (moveOffScreen) {
//       // Move card off the screen (left side)
//       Animated.sequence([
//         Animated.timing(translateXAnim, {
//           toValue: -width, // Move to the left by the screen's width
//           duration: 500,
//           useNativeDriver: true,
//         }),
//         // Move the card back to its original position
//         Animated.timing(translateXAnim, {
//           toValue: 0, // Return to the center
//           duration: 500,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   }, [moveOffScreen, width]);

//   const cardDimensions = useMemo(() => {
//     return {
//       height: cardHeight,
//       width: "100%", // Full width of the screen
//     };
//   }, [cardHeight]);

//   useEffect(() => {
//     setSideState(side);
//   }, [side]);

//   const showBackOfCard = (sideX, X) => {
//     if (sideX === "front") {
//       setSideState(sideX);
//     } else if (sideX === "back") {
//       setTempBack(true);
//     }
//   };

//   const makeHidden = () => {
//     setHidden((prevHidden) => !prevHidden);
//   };

//   const cardBackgroundColor = useMemo(() => {
//     return sideState === "front" && !defCards && !hidden && !tempBack
//       ? "#88ebe6"
//       : "#e6e8dc";
//   }, [sideState, defCards, hidden, tempBack]);

//   const cardBorderStyle = useMemo(() => {
//     return hidden ? {} : { borderColor: "black", borderWidth: 2 };
//   }, [hidden]);

//   const frontCardStyle = useMemo(() => {
//     return {
//       minHeight: 600,
//       minWidth: "110%",
//       display: "flex",
//       flexDirection: "column",
//       borderTopWidth: hidden ? 0 : null,
//       position: "relative",
//     };
//   }, [hidden]);

//   return (
//     <Animated.View
//       style={[
//         styles.card,
//         {
//           backgroundColor: cardBackgroundColor,
//           ...cardDimensions,
//           ...cardBorderStyle,
//           transform: [
//             { rotateY: flipRotation },
//             { translateX: translateXAnim },
//           ],
//         },
//       ]}
//     >
//       {/* Main Card */}
//       <View style={[styles.innerCard, cardBorderStyle]}>
//         {sideState === "front" ? (
//           <View style={frontCardStyle}>
//             {/* Top Portion of Front of Card */}
//             {!hidden && (
//               <View style={styles.topPortion}>
//                 <Text style={styles.topText}>
//                   {top && !hidden && !tempBack ? top : null}
//                 </Text>
//               </View>
//             )}
//             {/* Bottom portion of front of card */}
//             {!hidden && bottom && (
//               <View style={styles.bottomPortion}>
//                 <Text>{bottom}</Text>
//               </View>
//             )}
//             {/* Timer Component */}
//             {timer && (
//               <Timer
//                 checkIfTied={checkIfTied}
//                 setTempBack={setTempBack}
//                 showBackOfCard={showBackOfCard}
//                 makeHidden={makeHidden}
//                 top={top}
//                 game={game}
//                 username={username}
//                 userId={userId}
//                 userScore={userScore}
//                 gameName={gameName}
//                 gameId={game.id}
//                 playerTurnName={playerTurnName}
//                 definition={bottom}
//                 reloadScores={reloadScores}
//                 setDefinition={setDefinition}
//                 setWord={setWord}
//                 setTimer={setTimer}
//                 setChoseWord={setChoseWord}
//               />
//             )}
//           </View>
//         ) : null}

//         {/* Back of Card */}
//         {sideState === "back" || tempBack ? (
//           <View style={styles.backOfCard}>
//             <Text style={styles.backText}>
//               {half ? half.first : "Balder..."}
//             </Text>
//             <Text style={styles.backText}>
//               {half ? half.second : "...dash"}
//             </Text>
//           </View>
//         ) : null}

//         {/* Choose Definition Button */}
//         {defCards &&
//         userScore.turnNum !== singleGame.turn &&
//         userScore.accepted === true ? (
//           <Buttons
//             name="Choose Definition"
//             func={() => handleChooseWord(def)}
//             pulse="null"
//           />
//         ) : null}
//       </View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     borderRadius: 50,
//     padding: 20,
//     boxShadow: "0 0 2px 2px black",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     transitionDuration: "0.9s",
//     minWidth: 350,
//   },
//   innerCard: {
//     backgroundColor: "#88ebe6",
//     padding: 10,
//     borderRadius: 50,
//     height: "100%", // Full height of the card
//     minWidth: 300,
//     overflow: "scroll",
//   },
//   topPortion: {
//     height: "20%",
//     width: "110%",
//     backgroundColor: "#88ebe6",
//     justifyContent: "center",
//     borderBottomWidth: 5,
//     borderBottomColor: "#571122",
//   },
//   topText: {
//     fontSize: 40,
//     fontWeight: "bold",
//     textAlign: "center",
//     textDecorationLine: "underline",
//   },
//   bottomPortion: {
//     paddingLeft: "10%",
//     width: "90%",
//   },
//   backOfCard: {
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   backText: {
//     fontSize: 65,
//     fontWeight: "bold",
//   },
// });

// export default CardFront;
// import React, { useEffect, useState, useRef } from "react";
// import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
// import Timer from "./Games/Timer";
// import Buttons from "../Buttons"; // Assuming you have a custom Buttons component

// const CardFront = ({
//   baseCard,
//   notReverse,
//   moveOffScreen,
//   bottomCard,
//   checkIfTied,
//   half,
//   def,
//   handleChooseWord,
//   defCards,
//   top,
//   bottom,
//   side,
//   fullScreen,
//   flip,
//   timer,
//   game,
//   username,
//   userId,
//   userScore,
//   gameName,
//   playerTurnName,
//   reloadScores,
//   setDefinition,
//   setWord,
//   setTimer,
//   setChoseWord,
//   singleGame,
//   flippable,
// }) => {
//   const [sideState, setSideState] = useState(side);
//   const [tempBack, setTempBack] = useState(false);
//   const [hidden, setHidden] = useState(false);

//   const { width } = Dimensions.get("window");
//   const cardHeight = width * 1.5;

//   // Animated values for the flip and X translation
//   const flipAnim = useRef(new Animated.Value(0)).current;
//   const translateXAnim = useRef(new Animated.Value(0)).current;

//   // Flip Animation
//   useEffect(() => {
//     Animated.timing(flipAnim, {
//       toValue: flip ? 1 : 0,
//       duration: 800,
//       useNativeDriver: true,
//     }).start();
//   }, [flip]);

//   // Interpolating the flip animation
//   const flipRotation = flipAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ["0deg", "180deg"], // Flip from 0 degrees to 180 degrees
//   });

//   // Translation Animation (off-screen and back)
//   useEffect(() => {
//     if (moveOffScreen) {
//       Animated.sequence([
//         Animated.timing(translateXAnim, {
//           toValue: -width, // Move off-screen to the left
//           duration: 500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(translateXAnim, {
//           toValue: 0, // Move back to the original position
//           duration: 500,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   }, [moveOffScreen, width]);

//   // Update side state on prop change
//   useEffect(() => {
//     setSideState(side);
//   }, [side]);

//   const showBackOfCard = (sideX) => {
//     if (sideX === "front") {
//       setSideState(sideX);
//     } else if (sideX === "back") {
//       setTempBack(true);
//     }
//   };

//   const makeHidden = () => {
//     setHidden((prevHidden) => !prevHidden);
//   };

//   // Card styles based on current state
//   const cardBackgroundColor =
//     sideState === "front" && !defCards && !hidden && !tempBack
//       ? "#88ebe6"
//       : "#e6e8dc";

//   const cardDimensions = {
//     height: cardHeight,
//     width: "100%", // Full width of the screen
//   };


//   const transformStyles = {
//     transform: `${flip || side === "front" || notReverse ? "" : "rotateY(180deg)"}${
//       moveOffScreen ? " translate(-1000px, -1000px)" : ""
//     }`,
//   };

//   return (
//     <Animated.View
//       style={[
//         styles.card,
//         {
//           backgroundColor: cardBackgroundColor,
//           ...cardDimensions,
//           transform: [
//             { rotateY: flipRotation }, // Apply the flip rotation
//             { translateX: translateXAnim }, // Apply the X translation
//           ],
//         },
//       ]}
//     >
//       {/* Main Card Content */}
//       <View style={[styles.innerCard]}>
//         {sideState === "front" ? (
//           <View style={styles.frontCard}>
//             {/* Top Portion of Front of Card */}
//             {!hidden && (
//               <View style={styles.topPortion}>
//                 <Text style={styles.topText}>
//                   {top && !hidden && !tempBack ? top : null}
//                 </Text>
//               </View>
//             )}
//             {/* Bottom portion of front of card */}
//             {!hidden && bottom && (
//               <View style={styles.bottomPortion}>
//                 <Text>{bottom}</Text>
//               </View>
//             )}
//             {/* Timer Component */}
//             {timer && (
//               <Timer
//                 checkIfTied={checkIfTied}
//                 setTempBack={setTempBack}
//                 showBackOfCard={showBackOfCard}
//                 makeHidden={makeHidden}
//                 top={top}
//                 game={game}
//                 username={username}
//                 userId={userId}
//                 userScore={userScore}
//                 gameName={gameName}
//                 gameId={game.id}
//                 playerTurnName={playerTurnName}
//                 definition={bottom}
//                 reloadScores={reloadScores}
//                 setDefinition={setDefinition}
//                 setWord={setWord}
//                 setTimer={setTimer}
//                 setChoseWord={setChoseWord}
//               />
//             )}
//           </View>
//         ) : null}

//         {/* Back of Card */}
//         {sideState === "back" || tempBack ? (
//           <View style={styles.backOfCard}>
//             <Text style={styles.backText}>
//               {half ? half.first : "Balder..."}
//             </Text>
//             <Text style={styles.backText}>
//               {half ? half.second : "...dash"}
//             </Text>
//           </View>
//         ) : null}

//         {/* Choose Definition Button */}
//         {defCards &&
//         userScore.turnNum !== singleGame.turn &&
//         userScore.accepted === true ? (
//           <Buttons
//             name="Choose Definition"
//             func={() => handleChooseWord(def)}
//             pulse="null"
//           />
//         ) : null}
//       </View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 50,
//     padding: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     boxShadow: "0 0 2px 2px black",
//      backfaceVisibility: "hidden", // Hide the backface during flip
   
//   },
//   innerCard: {
//     backgroundColor: "#88ebe6",
//     padding: 10,
//     borderRadius: 50,
//     height: "100%", // Full height of the card
//     minWidth: 300,
//     overflow: "scroll",
//   },
//   topPortion: {
//     height: "20%",
//     width: "110%",
//     backgroundColor: "#88ebe6",
//     justifyContent: "center",
//     borderBottomWidth: 5,
//     borderBottomColor: "#571122",
//   },
//   topText: {
//     fontSize: 40,
//     fontWeight: "bold",
//     textAlign: "center",
//     textDecorationLine: "underline",
//   },
//   bottomPortion: {
//     paddingLeft: "10%",
//     width: "90%",
//   },
//   backOfCard: {
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   backText: {
//     fontSize: 65,
//     fontWeight: "bold",
//   },
// });

// export default CardFront;
