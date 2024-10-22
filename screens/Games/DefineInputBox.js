import React, { useState, useContext, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
// SOCKET
import { SocketContext } from "../../socketProvider";

import { addPlayerFakeDef } from "../../redux/gameplay";
import { ref, set, onValue } from "firebase/database";
import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";
const DefInputBox = ({
  //  showBackOfCard,
  gameName,
  userId,
  playerTurnName,
}) => {
  // COMPONENT STATE
  const [playerDef, setPlayerDef] = useState("");
  const [seeInput, setSeeInput] = useState(true);

  const dispatch = useDispatch();
  const clientSocket = useContext(SocketContext);

  const inputRef = useRef();

  // Set focus on input box
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Sends player's fake definition to the player whose turn it is via a socket
  const handleEnterFakeDef = (e) => {
    e.preventDefault();
    dispatch(addPlayerFakeDef(playerDef));

    set(ref(RealTimeDB, `games/${gameName}/fake__playe_definition`), {
      playerDef,
      room: gameName,
      userId,
      playerTurnName,
    });
    setSeeInput(false);
    setPlayerDef("");
    // showBackOfCard("back");
  };

  return (
    <View style={styles.container}>
      {seeInput && (
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.form}>
            <TextInput
              style={styles.textInput}
              placeholder="Write your definition here..."
              multiline={true}
              numberOfLines={10}
              ref={inputRef}
              value={playerDef}
              onChangeText={(text) => setPlayerDef(text)}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleEnterFakeDef}
            >
              <Text style={styles.submitText}>Submit Definition</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  textInput: {
    height: 200,
    width: "100%",
    backgroundColor: "white",
    borderColor: "#571122",
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    textAlignVertical: "top", // Ensures text starts from the top
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#3f51b5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  submitText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DefInputBox;
