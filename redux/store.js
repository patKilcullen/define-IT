import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import singleGameSlice from "./singleGame";
import singleUserSlice from "./users";
import allScoreSlice from "./scores";
import gamePlaySlice from "./gameplay";

// Configure the store
const store = configureStore({
  reducer: {
    auth: authReducer,
    singleGame: singleGameSlice,
    singleUser: singleUserSlice,
    allScores: allScoreSlice,
    gamePlay: gamePlaySlice,
  },
  // Add logger middleware for debugging purposes
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  //   .concat(logger),
});

export default store;

// Export everything from the auth slice for easy access
export * from "./auth";
