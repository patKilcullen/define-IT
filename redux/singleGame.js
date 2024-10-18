import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {FireBaseDB} from '../Firebase/FirebaseConfig'
import {addDoc, collection}  from 'firebase/firestore'

const api = axios?.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});



// export const createGame  = async  ({
//     userId,
//     name,
//     rounds,
//     roundsLeft,
//     winner,
//     started,
//     complete,
//     ownerId,
//     publicX,
//     numPlayers,
//     turn,
//   })=>{

//  try {
//       const docRef = await addDoc(collection(FireBaseDB, "games"), {
//         userId,
//         name,
//         rounds,
//         roundsLeft,
//         winner,
//         started,
//         complete,
//         ownerId,
//         publicX,
//         numPlayers,
//         turn,
//       });
//       console.log("DocRef: ", docRef);

//       return {
//         id: docRef.id, // Returning the document ID
//         userId,
//         name,
//         rounds,
//         roundsLeft,
//         winner,
//         started,
//         complete,
//         ownerId,
//         publicX,
//         numPlayers,
//         turn,
//       };
//     } catch (error) {
//       console.log("ERROR IN CREATE GAME THUNK: ", error);
//     }


// }
 

    

// CREATE GAME
export const createGame = createAsyncThunk(
  "createGame",
  async (
    {
      userId,
      name,
      rounds,
      roundsLeft,
      winner,
      started,
      complete,
      ownerId,
      publicX,
      numPlayers,
      turn,
    },
    { rejectWithValue }
  ) => {
    try {
      const docRef = await addDoc(collection(FireBaseDB, "games"), {
        userId: userId || "", // Default value or validation
        name: name || "Untitled Game",
        rounds: rounds || 0,
        roundsLeft: roundsLeft || 0,
        winner: winner || null,
        started: started || false,
        complete: complete || false,
        ownerId: ownerId || "",
        publicX: publicX || false,
        numPlayers: numPlayers || 1,
        turn: turn || "",
      });
      console.log("DocRef: ".docRef);

      return {
        id: docRef.id, // Returning the document ID
        userId,
        name,
        rounds,
        roundsLeft,
        winner,
        started,
        complete,
        ownerId,
        publicX,
        numPlayers,
        turn,
      };
    } catch (error) {
      console.log("ERROR IN CREATE GAME THUNK: ", error);
    }
  }
);

// // GET SIGNLE GAME
export const fetchSingleGame = createAsyncThunk("singleGame", async (id) => {
  try {
    const { data } = await api.get(`/api/games/${id}`);
    return data;
  } catch (error) {
    console.log("ERROR IN SINGLE GAME THUNK: ", error);
  }
});

// GET SINGLE GAME BY NAME - for search
export const findGameByName = createAsyncThunk(
  "findGameByName",
  async (gameName) => {
    try {
      const { data } = await api.get(`/api/games/findGame/${gameName}`);
      return data;
    } catch (error) {
      console.log("ERROR IN FETCH ALL GAMES THUNK: ", error);
    }
  }
);

// EDIT GAME
export const editGame = createAsyncThunk("editGame", async (game) => {
  try {
    const { data } = await api.put(`/api/games/${game.id}`, game);
    return data;
  } catch (err) {
    console.log(err);
  }
});

// EDIT GAME TURN
export const editGameTurn = createAsyncThunk(
  "editGameTurn",
  async ({ gameId, turn, roundsLeft, started }) => {
    try {
      const { data } = await api.patch(`/api/games/${gameId}/changeTurn`, {
        turn,
        roundsLeft,
        started,
      });
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

// // CREATE GAME
// export const createGame = createAsyncThunk(
//   "createGame",
//   async ({
//     userId,
//     name,
//     rounds,
//     roundsLeft,
//     winner,
//     started,
//     complete,
//     ownerId,
//     publicX,
//     numPlayers,
//     turn,
//   }) => {
//     try {
//       const { data } = await api.post("/api/games", {
//         userId,
//         name,
//         rounds,
//         roundsLeft,
//         winner,
//         started,
//         complete,
//         ownerId,
//         publicX,
//         numPlayers,
//         turn,
//       });

//       return data;
//     } catch (error) {
//       console.log("ERROR IN CREATE GAME THUNK: ", error);
//     }
//   }
// );

const singleGameSlice = createSlice({
  name: "singleGame",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSingleGame.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(findGameByName.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(editGameTurn.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(editGame.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(createGame.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectSingleGame = (state) => {
  return state.singleGame;
};

export default singleGameSlice.reducer;
