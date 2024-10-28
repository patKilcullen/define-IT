// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
//  import { authenticate } from "../redux/store";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Button,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native"; // For navigation
// import { FirebaseAuth } from "../Firebase/FirebaseConfig";
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, } from "firebase/auth";
// // import { GoogleSignin } from "@react-native-google-signin/google-signin";



// const AuthForm = () => {
//   const { error } = useSelector((state) => state.auth);

//   const dispatch = useDispatch();
//   const navigation = useNavigation(); // For navigating between screens
//   const [selectedForm, setSelectedForm] = useState("login");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
// const [err,setErr] = useState(false)
//   const handleSelectForm = (formType) => {
//     setSelectedForm(formType);
//   };

//   // const handleSubmit = (evt) => {
//   //   evt.preventDefault();

//   //   dispatch(
//   //     authenticate({
//   //       username: userName,
//   //       password: password,
//   //       method: selectedForm,
//   //     })
//   //   ).then((res)=>{
//   //     console.log("RESSSSSS: ", res.meta.requestStatus === "fulfilled" )
//   //   if(res.meta.requestStatus === "fulfilled")  {
//   //     navigation.navigate("Home");
//   //   }
//   //   })
//   // };

//   const handleSubmit = async () => {
    
//     if (selectedForm === "signup") {
//       try {
//         const res = await createUserWithEmailAndPassword(
//           FirebaseAuth,
//           email,
//           password
//         );
//        alert("Login Succcess, check email.");
//       } catch (err) {
//         setErr(true);
//         alert("Sign up failed " + err.message);
//       }
//     }

//      if (selectedForm === "login") {
//        try {
//          const res = await signInWithEmailAndPassword(
//            FirebaseAuth,
//            email,
//            password
//          );

//        } catch (err) {
//          setErr(true);
//          alert("Sign in failed " + err.message);
//        }
//      }
//   };


//   // GOOGLE AUTH DO NOT DELETE
//   // useEffect(() => {
//   //   GoogleSignin.configure({
//   //     webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_ID, // From Firebase Console
//   //     offlineAccess: true, // If you want to access Google API on behalf of the user FROM your server
//   //   });
//   // }, []);


//     // const handleGoogleLogin = async () => {
//     //   try {
//     //     // Initiate the Google sign-in process
//     //     await GoogleSignin.hasPlayServices();
//     //     const { idToken } = await GoogleSignin.signIn();

//     //     // Create a Firebase credential with the Google token
//     //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);

//     //     // Sign-in the user with the credential
//     //     await auth().signInWithCredential(googleCredential);

//     //     console.log("User signed in with Google");
//     //   } catch (error) {
//     //     console.error("Google login failed:", error);
//     //   }
//     // };


//     // async function handleGoogleLogin() {
//     //   // Check if your device supports Google Play
//     //   await GoogleSignin.hasPlayServices({
//     //     showPlayServicesUpdateDialog: true,
//     //   });
//     //   // Get the users ID token
//     //   const { idToken } = await GoogleSignin.signIn();

//     //   // Create a Google credential with the token
//     //   const googleCredential = auth.GoogleAuthProvider.credential(idToken);

//     //   // Sign-in the user with the credential
//     //   return auth().signInWithCredential(googleCredential);
//     // }

//     const handleLogout = async () => {
//       try {
//         await GoogleSignin.revokeAccess();
//         await GoogleSignin.signOut();
//         await auth().signOut();
//         console.log("User logged out");
//       } catch (error) {
//         console.error("Logout failed:", error);
//       }
//     };
    

//   return (
//     // <View style={styles.container}>
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"} // Set behavior for each platform
//       keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0} // Offset for iOS (optional)
//     >
//       <View style={styles.formContainer}>
//         <KeyboardAvoidingView>
//           <Text style={styles.title}>Define-IT</Text>
//           <View style={styles.switchContainer}>
//             <TouchableOpacity onPress={() => handleSelectForm("login")}>
//               <Text
//                 style={[
//                   styles.switchText,
//                   selectedForm === "login" && styles.selectedText,
//                 ]}
//               >
//                 Log In
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleSelectForm("signup")}>
//               <Text
//                 style={[
//                   styles.switchText,
//                   selectedForm === "signup" && styles.selectedText,
//                 ]}
//               >
//                 Sign Up
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <View>
//             <Text style={styles.label}>Email:</Text>
//             <TextInput
//               style={styles.input}
//               onChangeText={(text) => setEmail(text)}
//               value={email}
//               autoCapitalize="none"
//               autoCorrect={false}
//             />

//             <Text style={styles.label}>Password:</Text>
//             <TextInput
//               style={styles.input}
//               onChangeText={(text) => setPassword(text)}
//               value={password}
//               secureTextEntry
//             />

//             <Button
//               title={selectedForm === "login" ? "Log In" : "Sign Up"}
//               onPress={handleSubmit}
//               color="#6200ee"
//             />
//           </View>

//           {/* <View style={styles.container}>
//           <Button title="Login with Google" onPress={handleGoogleLogin} />
//         </View> */}
//           {err ? <Text style={styles.errorText}>{err}</Text> : null}
//           {error ? <Text style={styles.errorText}>{error}</Text> : null}
//         </KeyboardAvoidingView>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
// fontSize: 50,
// marginBottom: 50,
// marginTop: -40
//   },
//   formContainer: {
//     backgroundColor: "#88ebe6",
//     padding: 20,
//     // borderRadius: 25,
//     borderWidth: 3,
//     borderColor: "#000",
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   switchContainer: {
//     flexDirection: "row",
//      justifyContent: "center",
//     marginBottom: 20,
//    gap: 30
//   },
//   switchText: {
//     fontSize: 18,
//     color: "grey",
//   },
//   selectedText: {
//     fontWeight: "bold",
//     color: "black",
//     textDecorationLine: "underline",
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
//   input: {
//     height: 50,
//     width: 300,
//     borderColor: "black",
//     borderWidth: 2,
//     borderRadius: 10,
//     padding: 10,
//     backgroundColor: "white",
//   },
//   errorText: {
//     color: "red",
//     marginTop: 10,
//   },
// });

// export default AuthForm;


// 

// import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Button,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { FirebaseAuth } from "../Firebase/FirebaseConfig";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   updateProfile,
// } from "firebase/auth";

// const AuthForm = () => {
//   const { error } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigation = useNavigation(); // For navigating between screens
//   const [selectedForm, setSelectedForm] = useState("login");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [userName, setUserName] = useState(""); // For the displayName
//   const [err, setErr] = useState(false);

//   const handleSelectForm = (formType) => {
//     setSelectedForm(formType);
//   };

//   const handleSubmit = async () => {
//     if (selectedForm === "signup") {
//       try {
//         // Create the user with Firebase Authentication
//         const res = await createUserWithEmailAndPassword(
//           FirebaseAuth,
//           email,
//           password
//         );
// console.log("RESSSSS: ",res.user)
//         // Update the user's displayName
//         const user = FirebaseAuth.currentUser;
//         await updateProfile(user, {
//           displayName: userName,
//         });

//         alert("Signup Successful, check your email.");
//         navigation.navigate("Home"); // Navigate to Home after signup
//       } catch (err) {
//         setErr(true);
//         alert("Sign up failed " + err.message);
//       }
//     }

//     if (selectedForm === "login") {
//       try {
//         const res = await signInWithEmailAndPassword(
//           FirebaseAuth,
//           email,
//           password
//         );
//         navigation.navigate("Home"); // Navigate to Home after login
//       } catch (err) {
//         setErr(true);
//         alert("Sign in failed " + err.message);
//       }
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
//     >
//       <View style={styles.formContainer}>
//         <KeyboardAvoidingView>
//           <Text style={styles.title}>Define-IT</Text>
//           <View style={styles.switchContainer}>
//             <TouchableOpacity onPress={() => handleSelectForm("login")}>
//               <Text
//                 style={[
//                   styles.switchText,
//                   selectedForm === "login" && styles.selectedText,
//                 ]}
//               >
//                 Log In
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleSelectForm("signup")}>
//               <Text
//                 style={[
//                   styles.switchText,
//                   selectedForm === "signup" && styles.selectedText,
//                 ]}
//               >
//                 Sign Up
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {selectedForm === "signup" && (
//             <>
//               <Text style={styles.label}>Username:</Text>
//               <TextInput
//                 style={styles.input}
//                 onChangeText={(text) => setUserName(text)}
//                 value={userName}
//                 autoCapitalize="none"
//                 autoCorrect={false}
//               />
//             </>
//           )}

//           <Text style={styles.label}>Email:</Text>
//           <TextInput
//             style={styles.input}
//             onChangeText={(text) => setEmail(text)}
//             value={email}
//             autoCapitalize="none"
//             autoCorrect={false}
//           />

//           <Text style={styles.label}>Password:</Text>
//           <TextInput
//             style={styles.input}
//             onChangeText={(text) => setPassword(text)}
//             value={password}
//             secureTextEntry
//           />

//           <Button
//             title={selectedForm === "login" ? "Log In" : "Sign Up"}
//             onPress={handleSubmit}
//             color="#6200ee"
//           />

//           {err ? <Text style={styles.errorText}>{err}</Text> : null}
//           {error ? <Text style={styles.errorText}>{error}</Text> : null}
//         </KeyboardAvoidingView>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 50,
//     marginBottom: 50,
//     marginTop: -40,
//   },
//   formContainer: {
//     backgroundColor: "#88ebe6",
//     padding: 20,
//     borderWidth: 3,
//     borderColor: "#000",
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   switchContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 20,
//     gap: 30,
//   },
//   switchText: {
//     fontSize: 18,
//     color: "grey",
//   },
//   selectedText: {
//     fontWeight: "bold",
//     color: "black",
//     textDecorationLine: "underline",
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
//   input: {
//     height: 50,
//     width: 300,
//     borderColor: "black",
//     borderWidth: 2,
//     borderRadius: 10,
//     padding: 10,
//     backgroundColor: "white",
//   },
//   errorText: {
//     color: "red",
//     marginTop: 10,
//   },
// });

// export default AuthForm;




import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth"; // Use these Firebase methods

const AuthForm = () => {
  const [selectedForm, setSelectedForm] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [err, setErr] = useState("");
  const navigation = useNavigation();

  const handleSelectForm = (formType) => {
    setSelectedForm(formType);
  };

  const handleSubmit = async () => {
    const auth = getAuth();

    if (selectedForm === "signup") {
      try {
        // Create the user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Ensure the user's displayName is set after the account is created
        await updateProfile(user, {
          displayName: userName,
        });

        console.log("Profile updated with displayName:", userName);
        alert("Signup Successful!");
        navigation.navigate("Home"); // Navigate to Home after signup
      } catch (err) {
        console.error("Error during signup:", err);
        setErr("Sign up failed: " + err.message);
      }
    }

    if (selectedForm === "login") {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate("Home");
      } catch (err) {
        console.error("Error during login:", err);
        setErr("Sign in failed: " + err.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Define-IT</Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => handleSelectForm("login")}>
            <Text
              style={[
                styles.switchText,
                selectedForm === "login" && styles.selectedText,
              ]}
            >
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelectForm("signup")}>
            <Text
              style={[
                styles.switchText,
                selectedForm === "signup" && styles.selectedText,
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {selectedForm === "signup" && (
          <>
            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setUserName(text)}
              value={userName}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </>
        )}

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />

        <Button
          title={selectedForm === "login" ? "Log In" : "Sign Up"}
          onPress={handleSubmit}
          color="#6200ee"
        />
        {err && <Text style={styles.errorText}>{err}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "#88ebe6",
    padding: 20,
    borderWidth: 3,
    borderColor: "#000",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 50,
    marginBottom: 50,
    marginTop: -40,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  switchText: {
    fontSize: 18,
    color: "grey",
  },
  selectedText: {
    fontWeight: "bold",
    color: "black",
    textDecorationLine: "underline",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    height: 50,
    width: 300,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default AuthForm;
