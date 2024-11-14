// import React, { useState, useEffect, useContext } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { useSelector, useDispatch } from "react-redux";

// // SOCKET
// import { SocketContext } from "../../socketProvider";

// // SLICES/STATE REDUCERS
// import {
//   selectFakeWords,
//   getFakeDefinitions,
//   selectFakeDefinitions,
// } from "../../redux/gameplay";



// const Timer = ({
//   setDefInput,
//   startCountdown
// }) => {
//   // COMPONENT STATE
//   const [countdown, setCountdown] = useState(12);
//   const [playGame, setPlayGame] = useState(false);


//   const dispatch = useDispatch();

//   const fakeWords = useSelector(selectFakeWords);
//   const fakeDefinitions = useSelector(selectFakeDefinitions);

//   // Gets a "fake" definition for each "fake" word
//   const handleGetFakeDefinitions = () => {
//     fakeWords.forEach((word) => {
//       dispatch(getFakeDefinitions(word));
//     });
//   };

//  useEffect(() => {
//    const timer = setTimeout(() => {
//      if (countdown > 0) {
//        setDefInput(true);
//        setCountdown((countdown) => countdown - 1);
//      } else if (countdown === 0) {
//        handleGetFakeDefinitions();
//        setPlayGame(true);
//        setDefInput(false);
//        false;
//      } else {
//        setDefInput(false);
//      }
//    }, 1000);

//    return () => clearTimeout(timer);
//  }, [startCountdown]);



//   return (
//     <View style={styles.container}>
//       {/* Timer display */}
//       <View style={styles.timerContainer}>
//         <Text style={styles.timerText}>Time: {countdown}</Text>
//       </View>


//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   timerContainer: {
//     position: "absolute",
//     bottom: "8%",
//     left: "40%",
//   },
//   timerText: {
//     fontSize: 24,
//     color: "red",
//   },
// });

// export default Timer;


import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";

// SOCKET
import { SocketContext } from "../../socketProvider";

// Redux State and Actions
import {
  selectFakeWords,
  getFakeDefinitions,
  selectFakeDefinitions,
} from "../../redux/gameplay";

const Timer = ({ setDefInput, startCountdown }) => {
  // COMPONENT STATE
  const [countdown, setCountdown] = useState(12);
  const [playGame, setPlayGame] = useState(false);

  const dispatch = useDispatch();

  // Selectors to retrieve fake words and definitions from Redux state
  const fakeWords = useSelector(selectFakeWords);
  const fakeDefinitions = useSelector(selectFakeDefinitions);

  // Function to fetch "fake" definitions for each "fake" word
  const handleGetFakeDefinitions = () => {
    fakeWords.forEach((word) => {
      dispatch(getFakeDefinitions(word));
    });
  };

  // Countdown Timer Effect
  useEffect(() => {
    const timer = setTimeout(() => {
 
      if (countdown > 0) {
        setDefInput(true); // Enables definition input
        setCountdown((prevCountdown) => prevCountdown - 1);
      } else if (countdown === 0) {
        handleGetFakeDefinitions(); // Fetch fake definitions when timer reaches 0
       
        setPlayGame(true); // Starts the gameplay phase
        setDefInput(false); // Disables definition input
      } else {
        setDefInput(false); // Ensures definition input is disabled if timer < 0
      }
    }, 1000);

    // Cleanup the timer when component unmounts or countdown changes
    return () => clearTimeout(timer);
  }, [startCountdown]);

  return (
    <View style={styles.container}>
      {/* Timer display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Time: {countdown}</Text>
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
  timerContainer: {
    position: "absolute",
    bottom: "8%",
    left: "40%",
  },
  timerText: {
    fontSize: 24,
    color: "red",
  },
});

export default Timer;
