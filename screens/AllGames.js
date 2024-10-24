import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

// COMPONENTS
import CardBack from "./Cards/CardBack"; // Ensure CardBack is implemented for React Native

const AllGames = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("CreateGame")}>
          <CardBack
            notReverse={true}
            top="Create Game"
            side="back"
            title={{ first: "Create", second: "Game" }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SearchGame")}>
          <CardBack
            notReverse={true}
            top="Search Game"
            side="back"
            title={{ first: "Find", second: "Game" }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserGames", { type: "all-games" })
          }
        >
          <CardBack
            notReverse={true}
            side="back"
            top="All Games"
            title={{ first: "All", second: "Games" }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserGames", { type: "started-games" })
          }
        >
          <CardBack
            notReverse={true}
            side="back"
            top="Started Games"
            title={{ first: "Started", second: "Games" }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("UserGames", { type: "unstarted-games" })
          }
        >
          <CardBack
            notReverse={true}
            side="back"
            top="Pending Games"
            title={{ first: "Pending", second: "Games" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor: "#fff",
  },
  cardsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

export default AllGames;
