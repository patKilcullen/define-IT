import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Dimensions} from "react-native";
import { NavigationContainer } from "@react-navigation/native"; // Correct import for NavigationContainer
import { createStackNavigator } from "@react-navigation/stack"; // Correct import for Stack Navigator
import { Provider } from "react-redux";
import HomeScreen from "./screens/HomeScreen";
import AuthForm from "./screens/Auth";
import UserGames from "./screens/Games/UserGames";
import CreateGame from "./screens/Games/CreateGame";
import SearchGame from "./screens/Games/SearchGame";
// import Tester from "./screens/tester";
import store from "./redux/store";
import SingleGame from "./screens/Games/SingleGame";
import { SocketProvider } from "./socketProvider";
import { useState, useEffect } from "react";
import {onAuthStateChanged, User} from 'firebase/auth'
import { FirebaseAuth } from "./Firebase/FirebaseConfig";
import Navbar from "./NavBar";
import { UserProvider } from "./UserContext";  

// import { AppRegistry } from "react-native";

// AppRegistry.registerComponent("defineIT", () => App);

// Create a Stack Navigator
const Stack = createStackNavigator();
// COMMMENT

export default function App() {
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {

      setUser(user);
    });


    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);
 console.log("THIS USERRee: ", user);
const screenWidth = Dimensions.get("window").width;
  return (
    <SocketProvider>
      <Provider store={store}>
        <UserProvider>
          <NavigationContainer style={{ backgroundColor: "red" }}>
            {user && <Navbar />}

            <Stack.Navigator>
              {/* If the user is not authenticated, show the Auth screen */}
              {!user ? (
                <Stack.Screen
                  name="Auth"
                  component={AuthForm}
                  options={{ headerShown: false }}
                />
              ) : (
                <>
                  {/* If the user is authenticated, show the Home and other screens */}
                  <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="UserGames"
                    component={UserGames}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="CreateGame"
                    component={CreateGame}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="SingleGame"
                    component={SingleGame}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="SearchGame"
                    component={SearchGame}
                    options={{ headerShown: false }}
                  />
                </>
              )}
            </Stack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </UserProvider>
      </Provider>
    </SocketProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

