import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

const DefinitionInput = ({ handleAskAI, definition, setDefinition }) => {

  const handleButtonPress = () => {
    handleAskAI(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Your Definition:</Text>

      {/* TextInput component to capture user input */}
      <TextInput
        style={styles.input}
        placeholder="Type here..."
        value={definition}
        onChangeText={setDefinition} // Update state with user input
        multiline={true} // Enable multiple lines
        numberOfLines={6}
        blurOnSubmit={true} // Dismiss the keyboard on submit
        returnKeyType="done"
      />

      {/* Button to submit text */}
      <Button title="Submit" onPress={handleAskAI} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 100,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlignVertical: "top",
    backgroundColor: "white"
  },
  //   output: {
  //      marginTop: 20,
  //     fontSize: 18,
  //   },
});

export default DefinitionInput;


// import React from "react";
// import { View, Text, TextInput, Button, StyleSheet } from "react-native";

// const DefinitionInput = ({ handleAskAI, definition, setDefinition }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Enter Your Definition:</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Type here..."
//         value={definition}
//         onChangeText={setDefinition}
//         multiline={true}
//         numberOfLines={6}
//         blurOnSubmit={true}
//         returnKeyType="done"
//       />

//       <Button title="Submit Definition" onPress={handleAskAI} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 20,
//   },
//   label: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   input: {
//     height: 100,
//     width: 300,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//     textAlignVertical: "top",
//   },
// });

// export default DefinitionInput;
