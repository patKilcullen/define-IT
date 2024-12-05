import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { View, Text, Button, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

// STATE FROM STORE STORE
import { logout } from "./redux/store";

import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { FirebaseAuth } from "./Firebase/FirebaseConfig";



const Navbar = () => {

  const navigation = useNavigation();

  const logoutAndRedirectHome = () => {
  signOut(FirebaseAuth)
    .then(() => {

      console.log("User signed out");
      navigation.navigate("Auth"); // Navigate to Login screen after logout
    })
    .catch((error) => {
      // Handle error
      console.error("Error signing out: ", error);
    });

  };

    const [user, setUser] = useState(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {
   
        setUser(user);
      });

      // Clean up the subscription on unmount
      return () => unsubscribe();
    }, []);
const screenWidth = Dimensions.get("window").width;
  return (
    <View style={styles.card}>
    <View style={[styles.innerCard, {width:  screenWidth}]}>
      <View id="header" style={styles.header}>
        <Text id="title" style={styles.title}>
          Define-IT
        </Text>
        <View style={styles.divider}></View>
        <View id="nav">
          {user ? (
            <View style={styles.navLinks}>
              {/* The navbar will show these buttons after you log in */}
              <Button
                title="Home"
                color="#558ABB"
                onPress={() => navigation.navigate("Home")} // Assuming you have a "Home" screen
              />
              <Button
                title="Logout"
                color="#558ABB"
                onPress={logoutAndRedirectHome}
              />
            </View>
          ) : (
            <View />
          )}
        </View>
      </View>
    </View>
     </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderColor: "black",

    backgroundColor: "#88ebe6",

    zIndex: 5,
  },
  innerCard: {
    // padding: 10,
    shadowColor: "#88ebe6",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  header: {
    padding: 10,
    backgroundColor: "#88ebe6",
  },
  title: {
    fontWeight: "bold",
    color: "#571122",
    textAlign: "center",
    fontSize: 24,
  },
  divider: {
    height: 2,
    backgroundColor: "#571122",
    width: "95%",
    alignSelf: "center",
    marginVertical: 10,
    shadowColor: "#558ABB",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
  },
  navLinks: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});

export default Navbar;
