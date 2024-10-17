import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Buttons = ({ name, func, pulse, small }) => {
  return (
    <TouchableOpacity
      onPress={func}
      style={[styles.button, pulse && styles.pulse]}
    >
      <Text style={[styles.text, small && styles.smallText]}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3f51b5", // Default button background color
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    color: "#ffffff", // Default text color
  },
  smallText: {
    fontSize: 20,
  },
  pulse: {
    // Add any additional styles you want for the "pulse" effect
    borderWidth: 2,
    borderColor: "#ff0000", // Example pulse effect (red border)
  },
});

export default Buttons;
