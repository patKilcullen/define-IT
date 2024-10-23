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

  // const cardDimensions = useMemo(() => {
  //   return {
  //     height: timer || (fullScreen && !hidden) ? "100%" : 350,
  //     width: defCards ? "85%" : 200,
  //     marginLeft: fullScreen && !hidden ? "-1vw" : defCards ? "2vw" : "0",
  //   };
  // }, [timer, fullScreen, defCards, hidden]);

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
        style={
          flippable && [
            styles.card,
            {
              backgroundColor: cardBackgroundColor,
              ...cardDimensions,
              ...cardBorderStyle,
              ...transformStyles,
            },
          ]
        }
      >
        {/* Inner Card */}
        <View style={[styles.innerCard, cardBorderStyle]}>
          {sideState === "front" ? (
            <View style={frontCardStyle}>
              {/* Top Portion of Front of Card */}
              {!hidden && (
                <View style={styles.topPortion}>
                  <Text style={styles.topText}>
                    {typeof top === "string" && top && !hidden && !tempBack
                      ? top
                      : "Default Text"}
                    {/* {typeof top === 'string' && top && !hidden && !tempBack ? top : null} */}
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
                  top={top || ""}
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

// import React, { useEffect, useState, useMemo } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import Timer from "./Games/Timer"; // Assuming you have a Timer component
// import Buttons from "../Buttons"; // Assuming you have a custom Buttons component

// const CardFront = ({
//   //   def,
//   //   handleChooseWord,
//   //   defCards,
//   //   top,
//   //   bottom,
//   //   flip,
//   //   timer,
//   //   userScore,
//   //   singleGame,
//   //   userId,
//   //    gameId,
//   //   game,
//   //   gameName,
//   //   playerTurnName,
//   // ////////////
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
//   const [sideState, setSideState] = useState("front");
//   //   const [tempBack, setTempBack] = useState(false);
//   //   const showBackOfCard = (sideX, X) => {
//   //     if (sideX === "front") {
//   //       setSideState(sideX);
//   //     } else if (sideX === "back") {
//   //       setTempBack(true);
//   //     }
//   //   };
//   useEffect(() => {
//     setSideState("front");
//   }, []);

//   return (
//     <View style={styles.card}>
//       {/* Show word (top) */}
//       <View style={styles.topPortion}>
//         <Text style={styles.topText}>{top || "Default Word"}</Text>
//       </View>

//       {/* Show definition (bottom) */}
//       <View style={styles.bottomPortion}>
//         <Text style={styles.bottomText}>{bottom || "Default Definition"}</Text>
//       </View>

//       {/* Timer Component */}
//       {/* {timer && userScore && userScore.turnNum !== undefined && (
//         <Timer
//           checkIfTied={() => {}}
//           ={() => {}}
//           showBackOfCard={() => {}}
//           makeHidden={() => {}}
//           top={top || ""}
//           game={game}
//           username={playerTurnName}
//           userId={userId}
//           userScore={userScore} // Make sure userScore exists before passing it
//           gameName={gameName}
//           gameId={game.id}
//           playerTurnName={playerTurnName}
//           definition={bottom}
//           reloadScores={() => {}}
//           setDefinition={() => {}}
//           setWord={() => {}}
//           setTimer={() => {}}
//           setChoseWord={() => {}}
//         />
//       )} */}
//       {timer && (
//         <Timer
//           checkIfTied={checkIfTied}
//           //   setTempBack={setTempBack}
//           //   showBackOfCard={showBackOfCard}
//           //  makeHidden={makeHidden}
//           top={top || ""}
//           game={game}
//           username={username}
//           userId={userId}
//           userScore={userScore}
//           gameName={gameName}
//           gameId={game.id}
//           playerTurnName={playerTurnName}
//           definition={bottom}
//           reloadScores={reloadScores}
//           setDefinition={setDefinition}
//           setWord={setWord}
//           setTimer={setTimer}
//           setChoseWord={setChoseWord}
//         />
//       )}

//       {/* Choose Definition Button */}
//       {/* {defCards &&
//         userScore &&
//         userScore.turnNum !== singleGame.turn &&
//         userScore.accepted === true && (
//           <Buttons
//             name="Choose Definition"
//             func={() => handleChooseWord(def)}
//           />
//         )} */}
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
