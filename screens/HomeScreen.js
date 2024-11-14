import React, { useState } from "react";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,

  SafeAreaView,

  ScrollView,
 Dimensions
} from "react-native";

import DefinitionInput from "../components/DefinitionInput";

import axios from "axios";

import  pic from '../pic.png'

import AllGames from "./AllGames";
import Navbar from "../NavBar";
import { balderdashWords } from "../Words";

export default function HomeScreen() {
  const username = useSelector((state) => state.auth.me.username);
  const screenWidth = Dimensions.get("window").width;
      const [word, setWord] = useState(null);

       const [definition, setDefinition] = useState("");


    

         
      const handleGetWord = async () => {
        
        setError(null);
let newWord = balderdashWords[Math.random() * balderdashWords.length]
console.log("NEW WORD: ", newWord)
          setWord(newWord.word);
         setDefinition(newWord.definition);
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


