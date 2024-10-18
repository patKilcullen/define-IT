import React, { useState } from "react";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Pressable,
  TouchableOpacity,
  Button,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image,
  ScrollView,
  Modal, Dimensions
} from "react-native";

import DefinitionInput from "../components/DefinitionInput";

import axios from "axios";

import  pic from '../pic.png'

import AllGames from "./AllGames";
import Navbar from "../NavBar";


export default function HomeScreen() {
  const username = useSelector((state) => state.auth.me.username);
  const screenWidth = Dimensions.get("window").width;
      const [word, setWord] = useState(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
       const [definition, setDefinition] = useState("");
       const [answer, setAnswer] = useState("");
       const [openModal, setOpenModal] = useState(false)

       
      const handleGetWord = async () => {
   
        setLoading(true);
        setError(null);

        try {
          // API call using Axios
          const response = await axios.get(
            "http://192.168.4.188:3000/api/newWords/8"
          );
     
          setWord(response.data);
        } catch (err) {
          setError("Failed to fetch word");
        } finally {
          setLoading(false);
        }
      };

        const handleAskAI = async () => {
          setLoading(true);
          setError(null);

          try {
            // API call using Axios
            const response = await axios.post(
              "http://192.168.4.188:3000/api/askAI",
              { word: word, definition: definition }
            );
            
            setAnswer(response.data);
          } catch (err) {
            setError("Failed to fetch word");
          } finally {
            setLoading(false);
          }
        };

function handleOpenModal (){
  setOpenModal((prev) => !prev)
}
       return (
         <SafeAreaView style={styles.container}>
           {/* <View style={{width: screenWidth}}>
             <Navbar />
           </View> */}
           <ScrollView style={styles.scroll}>
             <AllGames></AllGames>
           </ScrollView>
         </SafeAreaView>
       );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "pink",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  wordContainer: {
    marginTop: 20,
  },
  word: {
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginTop: 20,
  },
  pic: {
    marginTop: 500,
    height: 200,
    width: 300,
  },
  scroll: {
    padding: 16,
    backgroundColor: "pink",
  },
  inner: {
    marginTop: 100,
  },
  modal: {
    marginTop: 100,
    height: 200,
    width: 200,

  },
  navbar: {

  }
});



// import React, { useState } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Button,

//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import {Picker } from "@react-native-picker/picker"
// import DefinitionInput from "../components/DefinitionInput";
// import axios from "axios";

// export default function HomeScreen() {
//   const [gradeLevel, setGradeLevel] = useState("1");
//   const [word, setWord] = useState(null);
//   const [definition, setDefinition] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [score, setScore] = useState(0);
//   const [rounds, setRounds] = useState(0); // Keep track of rounds

//   const handleGetWord = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.get(
//         `http://192.168.4.188:3000/api/newWords/${gradeLevel}`
//       );
//       setWord(response.data); // Assuming response contains a "word" key
//     } catch (err) {
//       setError("Failed to fetch word");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAskAI = async () => {
//     if (rounds >= 10) {
//       Alert.alert(`Game Over! Your final score is: ${score}`);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post("http://192.168.4.188:3000/api/askAI", {
//         word: word,
//         definition: definition,
//       });
//       const aiAnswer = response.data; // Assuming the API returns a simple "yes" or "no"

//       if (aiAnswer.toLowerCase() === "yes") {
//         setScore(score + 1);
//       }

//       setAnswer(aiAnswer);
//       setRounds(rounds + 1); // Increment round count
//     } catch (err) {
//       setError("Failed to fetch response from AI");
//     } finally {
//       setLoading(false);
//       setWord(null); // Reset word for the next round
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Define AI</Text>
//       <Text style={styles.subtitle}>Score: {score}</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <>
//           <Picker
//             selectedValue={gradeLevel}
//             style={styles.picker}
//             onValueChange={(itemValue) => setGradeLevel(itemValue)}
//           >
//             <Picker.Item label="Grade 1" value="1" />
//             <Picker.Item label="Grade 2" value="2" />
//             <Picker.Item label="Grade 3" value="3" />
//             {/* Add more grade levels as needed */}
//           </Picker>

//           <Button title="Get Word" onPress={handleGetWord} />
//         </>
//       )}

//       {word && (
//         <>
//           <View style={styles.wordContainer}>
//             <Text style={styles.word}>{word}</Text>
//           </View>
//           <DefinitionInput
//             handleAskAI={handleAskAI}
//             definition={definition}
//             setDefinition={setDefinition}
//           />
//         </>
//       )}

//       {answer && <Text style={styles.answer}>{answer}</Text>}
//       {error && <Text style={styles.error}>{error}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   subtitle: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   wordContainer: {
//     marginTop: 20,
//   },
//   word: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   picker: {
//     height: 50,
//     width: 150,
//   },
//   error: {
//     color: "red",
//     marginTop: 20,
//   },
//   answer: {
//     marginTop: 20,
//     fontSize: 18,
//   },
// });
