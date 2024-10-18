import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FirebaseAuth } from "./Firebase/FirebaseConfig";

// Create the UserContext
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {
      setUser(user); // Set the authenticated user
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
