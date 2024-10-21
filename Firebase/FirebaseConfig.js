// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
 
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6jN1feU3Apdj6oBVKGHTe_7h0XEJLqZ8",
  authDomain: "define-it-977f4.firebaseapp.com",
  projectId: "define-it-977f4",
  storageBucket: "define-it-977f4.appspot.com",
  messagingSenderId: "446729024380",
  appId: "1:446729024380:web:fd4a5207bf8afe3b67eaf9",
  measurementId: "G-16SX6TJGJJ",
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FireBaseDB = getFirestore(FirebaseApp)

// const analytics = getAnalytics(app);
const auth = initializeAuth(FirebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

