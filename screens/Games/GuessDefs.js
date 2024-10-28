// import React, { useState, useEffect, useContext } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { View, Text, ScrollView, StyleSheet } from "react-native";

// // SLICES/STATE REDUCERS
// import {
//   addTempScoreCardMessage,
//   clearFakeWords,
//   selectWord,
//   selectFakeDefinitions,
//   selectRealDefinition,
// } from "../../redux/gameplay";
// import { addPoint } from "../../redux/scores";
// import { editGameTurn, selectSingleGame } from "../../redux/singleGame";

// // SOCKET
// import { SocketContext } from "../../socketProvider";

// // COMPONENTS
// import TempScoreCard from "../../screens/scores/TempScoreCard";
// const CardFront = React.lazy(() => import("../Cards/CardBack.js"));

// import { ref, set, onValue } from "firebase/database";
// import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";

// const GuessDefs = ({

// }) => {
//   const [fakeDefs, setFakeDefs] = useState([]);
//   const [defList, setDefList] = useState(false);
//   const [guessed, setGuessed] = useState(false);
//   const [countdown, setCountdown] = useState(10);

//   const dispatch = useDispatch();
//   const word = useSelector(selectWord);
//   const clientSocket = useContext(SocketContext);

//   const singleGame = useSelector(selectSingleGame);

//   const fakies = useSelector(selectFakeDefinitions);
//   const real = useSelector(selectRealDefinition);





//   return (
//     <View style={styles.container}>
//       <Text style={styles.timerText}>Time: {countdown}</Text>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text>Guesssss</Text>
   

//         {guessed && <CardFront flip={true} side={"back"} fullScreen={true} />}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   timerText: {
//     fontSize: 20,
//     color: "red",
//     position: "absolute",
//     top: "5%",
//   },
//   scrollContainer: {
//     padding: 10,
//     alignItems: "center",
//   },
// });

// export default GuessDefs;



import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, ScrollView, StyleSheet } from "react-native";

// SLICES/STATE REDUCERS
import {
  addTempScoreCardMessage,
  clearFakeWords,
  selectWord,
  selectFakeDefinitions,
  selectRealDefinition,
} from "../../redux/gameplay";
import { addPoint } from "../../redux/scores";
import { editGameTurn, selectSingleGame } from "../../redux/singleGame";

// SOCKET
import { SocketContext } from "../../socketProvider";

// COMPONENTS
import TempScoreCard from "../../screens/scores/TempScoreCard";
const CardFront = React.lazy(() => import("../Cards/CardFront.js"));

import { ref, set, onValue } from "firebase/database";
import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";

const GuessDefs = () => {
  const [combinedDefs, setCombinedDefs] = useState([]);
  const [defList, setDefList] = useState(false);
  const [guessed, setGuessed] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const dispatch = useDispatch();
  const word = useSelector(selectWord);
  const clientSocket = useContext(SocketContext);

  const singleGame = useSelector(selectSingleGame);

  const fakies = useSelector(selectFakeDefinitions);
  const real = useSelector(selectRealDefinition);

  useEffect(() => {
    // Randomly insert `real` into `fakies`
    const randomIndex = Math.floor(Math.random() * (fakies.length + 1));
    const definitions = [...fakies];
    definitions.splice(randomIndex, 0, real); // Insert `real` at the random index
    setCombinedDefs(definitions);
  }, [fakies, real]);
  console.log("combined: ", combinedDefs)
  console.log("real: ", real);
  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Time: {countdown}</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text>Guess the Definition</Text>

        {combinedDefs.map((definition, index) => (
              
          <CardFront
            key={index}
            definition={definition.definition}
            word={word}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 20,
    color: "red",
    position: "absolute",
    top: "5%",
  },
  scrollContainer: {
    padding: 10,
    alignItems: "center",
  },
});

export default GuessDefs;
