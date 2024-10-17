// // ADD NEW WORD AND DEFINITON TO DATABASE FOR FUTURE USE IN GAME

// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";


// const api = axios?.create({
//   baseURL: "http://localhost:8080",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// export const addNewWord = createAsyncThunk(
//   "addNewWord",
//   async ({ word, definition }) => {
//     try {
//       const { data } = await api.post("/api/newWords", {
//         word: word,
//         definition: definition,
//       });
//       return data;
//     } catch (error) {
//       console.log("ERROR IN FETCH ALL SCORES PG THUNK: ", error);
//     }
//   }
// );
