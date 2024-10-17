// import { configureStore } from "@reduxjs/toolkit";
//  import logger from "redux-logger";
//  import authReducer from "../features/auth/authSlice";
// // import singleGameSlice from "../features/games/singleGameSlice";
// // import singleUserSlice from "../features/users/singleUserSlice";
// // import allScoreSlice from "../features/scores/scoresSlice";
// // import gamePlaySlice from "../features/gamePlay/gamePlaySlice";

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     // singleGame: singleGameSlice,
//     // singleUser: singleUserSlice,
//     // allScores: allScoreSlice,
//     // gamePlay: gamePlaySlice,
//   },

//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
// });

// export default store;
// export * from "../features/auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
// import logger from "redux-logger";
import authReducer from "./auth";
// Uncomment these slices when you need them in the app
// import singleGameSlice from "../features/games/singleGameSlice";
// import singleUserSlice from "../features/users/singleUserSlice";
// import allScoreSlice from "../features/scores/scoresSlice";
// import gamePlaySlice from "../features/gamePlay/gamePlaySlice";
import singleGameSlice from "./singleGame";
import singleUserSlice from "./users";
import allScoreSlice from "./scores";
import gamePlaySlice from "./gameplay";

// Configure the store
const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add these when needed
     singleGame: singleGameSlice,
     singleUser: singleUserSlice,
     allScores: allScoreSlice,
     gamePlay: gamePlaySlice,
  },
  // Add logger middleware for debugging purposes
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
//   .concat(logger),
});

export default store;

// Export everything from the auth slice for easy access
export * from "./auth";
