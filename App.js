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

// import { AppRegistry } from "react-native";

// AppRegistry.registerComponent("defineIT", () => App);

// Create a Stack Navigator
const Stack = createStackNavigator();
// COMMMENT

export default function App() {
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {
      console.log("USER: ", user);
      setUser(user);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

const screenWidth = Dimensions.get("window").width;
  return (
    <SocketProvider>
      <Provider store={store}>
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
      </Provider>
    </SocketProvider>
  );
}
// export default function App() {
//   const [user, setUser]= useState(null)
// useEffect(()=>{

//   onAuthStateChanged(FirebaseAuth, (user)=>{
//     console.log("USER: ", user)
//     setUser(user)
//   });
// },[])

//   return (
//     <SocketProvider>
//       <Provider store={store}>
//         <NavigationContainer>
          
//           <Stack.Navigator initialRouteName="Auth">
//             <Stack.Screen name="Home" component={HomeScreen} />
//             <Stack.Screen name="Auth" component={AuthForm} />
//             <Stack.Screen name="UserGames" component={UserGames} />
//             <Stack.Screen name="CreateGame" component={CreateGame} />
//             <Stack.Screen name="SingleGame" component={SingleGame} />
//             <Stack.Screen name="SearchGame" component={SearchGame} />
//             {/* <Stack.Screen name="Tester" component={Tester} /> */}
//           </Stack.Navigator>
//           <StatusBar style="auto" />
//         </NavigationContainer>
//       </Provider>
//     </SocketProvider>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View, TouchableWithoutFeedback, Button, Alert } from 'react-native';
// import { NavigationContainer } from "@react-navigation/native";
//   import { createStackNavigator } from "@react-navigation/stack";
// import { Provider } from 'react-redux';  // Import the Provider
// import HomeScreen from './screens/HomeScreen';
// import Tester from './screens/tester';
// import AuthForm from './screens/Auth';
// import store from "./redux/store";

// const Stack = createStackNavigator();

// export default function App() {

//   return (
//     <NavigationContainer>
//       <Provider store={store}>
//         <View style={styles.container}>
//           {/* <HomeScreen></HomeScreen> */}
//           <AuthForm></AuthForm>
//           <StatusBar style="auto" />
//         </View>
//       </Provider>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     //  alignItems: 'center',
//     //  justifyContent: 'center',
//   },
// });

// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import HomeScreen from "./screens/HomeScreen";

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
