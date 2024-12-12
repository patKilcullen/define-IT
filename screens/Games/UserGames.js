import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

// Redux Actions
import { fetchSingleUser } from "../../redux/users";

// Components
import CardBack from "../Cards/CardBack";

// Context
import { UserContext } from "../../UserContext";

const UserGames = () => {
  // COMPONENT STATE
  const [displayGames, setDisplayGames] = useState([]);

  const { user } = useContext(UserContext);
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();

  // Route parameter to determine game type (all, started, unstarted)
  const games = route.params?.type;

  // Fetch and filter games based on 'games' route param
  useEffect(() => {
    // Check the type of games to display
    if (games === "all-games") {
      // Fetch all games for the user
      dispatch(fetchSingleUser(user.uid)).then((res) => {
        setDisplayGames(res.payload.games);
      });
    } else if (games === "started-games") {
      // Fetch only started games for the user
      dispatch(fetchSingleUser(user.uid)).then((res) => {
        setDisplayGames(
          res.payload.games.filter((game) => game.started === true)
        );
      });
    } else if (games === "unstarted-games") {
      // Fetch only unstarted games for the user
      dispatch(fetchSingleUser(user.uid)).then((res) => {
        setDisplayGames(
          res.payload.games.filter((game) => game.started === false)
        );
      });
    }
  }, [games]);

  return (
    <View style={styles.container}>
      {/* Scrollable container for displaying games */}
      <ScrollView>
        <View style={styles.gamesContainer}>
          {displayGames && displayGames.length ? (
            // Map through the games and render each as a card
            displayGames.map((game) => (
              <TouchableOpacity
                key={game.id}
                onPress={() =>
                  navigation.navigate("SingleGame", { id: game.id })
                }
              >
                <CardBack
                  notReverse={true}
                  side="back"
                  half={{
                    first: `${
                      game.name.length < 20
                        ? game.name
                        : game.name.slice(0, Math.ceil(game.name.length / 2))
                    }`,
                    second:
                      game.name.length < 20
                        ? null
                        : game.name.slice(Math.ceil(game.name.length / 2)),
                  }}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text>NO GAMES</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  gamesContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
});

export default UserGames;
