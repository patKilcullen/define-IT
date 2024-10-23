import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Slices/Reducers
import { findGameByName } from "../../redux/singleGame";

// Components
import CardFront from "../CardFront";

const SearchGame = () => {
  const [gameName, setGameName] = useState("");
  const [error, setError] = useState(false);
  const [foundGame, setFoundGame] = useState(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  // SEARCH FOR A GAME
  const handleSearchGame = () => {
    setError("");
    dispatch(findGameByName(gameName)).then((game) => {

      game.error
        ? setError("Can't find that game...")
        : setFoundGame(game.payload);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.title}>Search for a Game</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Game Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter game name..."
            value={gameName}
            onChangeText={(text) => setGameName(text)}
            required
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchGame}
          >
            <Text style={styles.searchButtonText}>Search Game</Text>
          </TouchableOpacity>
        </View>
      </View>

      {foundGame && foundGame.name ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SingleGame", { id: foundGame.id })
          }
        >
          <CardFront
            notReverse={true}
            side={"back"}
            title={{
              first: `${
                foundGame.name.length < 20
                  ? foundGame.name
                  : foundGame.name.slice(
                      0,
                      Math.ceil(foundGame.name.length / 2)
                    )
              }`,
              second:
                foundGame.name.length < 20
                  ? null
                  : foundGame.name.slice(Math.ceil(foundGame.name.length / 2)),
            }}
          />
        </TouchableOpacity>
      ) : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.homeButtonText}>Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  searchContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "#88ebe6",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 20,
  },
  searchButton: {
    width: "100%",
    backgroundColor: "#283330",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
  homeButton: {
    marginTop: 20,
    padding: 10,
  },
  homeButtonText: {
    color: "blue",
    fontSize: 18,
    textDecorationLine: "underline",
  },
});

export default SearchGame;
