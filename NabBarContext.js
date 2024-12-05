// import React, { createContext, useState, useContext } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { FirebaseAuth } from "./Firebase/FirebaseConfig";

// // Create the UserContext
// export const NavBarContext = createContext(null);

// export const NavBarProvider = ({ children }) => {
//   const [navBarVisible, setnavBarVisible] = useState(true);

// const hideNavBar = () =>{
//     console.log("HIOFE NAV IN CONTEXt")
//     setnavBarVisible(false)
// }
// const showNavBar = () => {
//   setnavBarVisible(true);
// };


//   return (
//     <NavBarContext.Provider value={{ hideNavBar, showNavBar }}>
//       {children}
//     </NavBarContext.Provider>
//   );
// };

// export const useNavbar = () => useContext(NavBarContext);
import React, { createContext, useContext, useState } from "react";

const NavBarContext = createContext();

export const NavBarProvider = ({ children }) => {
  const [isNavbarVisible, setNavbarVisible] = useState(true);

  const hideNavbar = () => setNavbarVisible(false);
  const showNavbar = () => setNavbarVisible(true);
  const toggleNavbar = () => setNavbarVisible((prev) => !prev);

  return (
    <NavBarContext.Provider
      value={{ isNavbarVisible, hideNavbar, showNavbar, toggleNavbar }}
    >
      {children}
    </NavBarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavBarContext);

  if (context === undefined) {
    throw new Error("useNavbar must be used within a NavBarProvider");
  }

  return context;
};
