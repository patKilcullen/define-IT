import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

// SLICES/STATE REDUCERS, ETC.
// import { fetchSingleUser } from "../users/singleUserSlice";
import { fetchSingleUser } from "../../redux/users";

// COMPONENTS
// import Navbar from "../navbar/Navbar"; // Adapt Navbar to React Native or remove if not necessary
// Ensure CardBack is a React Native component
import CardBack from "../Cards/CardBack";

import { UserContext } from "../../UserContext";
const UserGames = () => {
  const [displayGames, setDisplayGames] = useState([]);
  //   const userId = useSelector((state) => state.auth.me.id);
  const { user } = useContext(UserContext);
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();

  const games = route.params?.type; // Get 'games' from the route params

  // Fetch and filter games based on the route params
  useEffect(() => {
    if (games === "all-games") {
      console.log("USAAA");
      let user = fetchSingleUser(user.uid);

      dispatch(fetchSingleUser(user.uid)).then((res) => {
        setDisplayGames(res.payload.games);
      });
    } else if (games === "started-games") {
      dispatch(fetchSingleUser(user.uid)).then((res) => {
        setDisplayGames(
          res.payload.games.filter((game) => game.started === true)
        );
      });
    } else if (games === "unstarted-games") {
      dispatch(fetchSingleUser(user.uid)).then((res) => {
        setDisplayGames(
          res.payload.games.filter((game) => game.started === false)
        );
      });
    }
  }, [games]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* You can adapt Navbar for React Native or remove it if not necessary */}
        {/* <Navbar /> */}
        <View style={styles.gamesContainer}>
          {displayGames && displayGames.length ? (
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
