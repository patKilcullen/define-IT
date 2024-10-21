import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {FireBaseDB} from '../Firebase/FirebaseConfig'
import {addDoc, collection, doc, getDoc, query, where, getDocs, updateDoc, arrayUnion}  from 'firebase/firestore'

const api = axios?.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});




    

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
        players: [userId]
      });
    

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


// FIND GAME BY NAME
export const fetchAllGames = createAsyncThunk(
  "findGameByName",
  async (user, { rejectWithValue }) => {
    try {
      // Reference to the "games" collection
      const gamesRef = collection(FireBaseDB, "games");

      // Query to find games where the "name" field matches gameName
      const q = query(gamesRef, where("", "==", gameName));

      // Get all documents matching the query
      const querySnapshot = await getDocs(q);

      // Check if we got any results
      if (querySnapshot.empty) {
        throw new Error(`No game found with name: ${gameName}`);
      }

      // Extract the data from the document(s)
      const games = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Return the first game found (or all games, if needed)
      return games.length > 0 ? games[0] : null;
    } catch (error) {
      console.log("ERROR IN FIND GAME BY NAME THUNK: ", error);
      return rejectWithValue(error.message);
    }
  }
);


// // // GET SIGNLE GAME
// export const fetchSingleGame = createAsyncThunk("singleGame", async (id) => {
//   try {
//     const { data } = await api.get(`/api/games/${id}`);
//     return data;
//   } catch (error) {
//     console.log("ERROR IN SINGLE GAME THUNK: ", error);
//   }
// });
// GET SINGLE GAME
export const fetchSingleGame = createAsyncThunk("singleGame", async (id, { rejectWithValue }) => {
  try {
    const gameRef = doc(FireBaseDB, 'games', id);  // Reference to the document
    const gameDoc = await getDoc(gameRef);

    if (gameDoc.exists()) {
      return { id: gameDoc.id, ...gameDoc.data() };  // Return game data with its ID
    } else {
      throw new Error("Game not found");
    }
  } catch (error) {
    console.log("ERROR IN SINGLE GAME THUNK: ", error);
    return rejectWithValue(error.message);  // Reject with error message
  }
});

// GET SINGLE GAME BY NAME - for search
// export const findGameByName = createAsyncThunk(
//   "findGameByName",
//   async (gameName) => {
//     try {
//       const { data } = await api.get(`/api/games/findGame/${gameName}`);
//       return data;
//     } catch (error) {
//       console.log("ERROR IN FETCH ALL GAMES THUNK: ", error);
//     }
//   }
// );

// FIND GAME BY NAME
export const findGameByName = createAsyncThunk(
  "findGameByName",
  async (gameName, { rejectWithValue }) => {
    try {
      // Reference to the "games" collection
      const gamesRef = collection(FireBaseDB, "games");

      // Query to find games where the "name" field matches gameName
      const q = query(gamesRef, where("name", "==", gameName));

      // Get all documents matching the query
      const querySnapshot = await getDocs(q);

      // Check if we got any results
      if (querySnapshot.empty) {
        throw new Error(`No game found with name: ${gameName}`);
      }

      // Extract the data from the document(s)
      const games = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Return the first game found (or all games, if needed)
      return games.length > 0 ? games[0] : null;
    } catch (error) {
      console.log("ERROR IN FIND GAME BY NAME THUNK: ", error);
      return rejectWithValue(error.message);
    }
  }
);


// EDIT GAME
export const editGame = createAsyncThunk("editGame", async (game) => {
  try {
    //   const gamesRef = collection(FireBaseDB, "games");

          const gameRef = doc(FireBaseDB, "games", game.id);
        await updateDoc(gameRef, {
          ...game,

          players: arrayUnion({ user: game.userId, score: 0 }),
          players2: arrayUnion({ user: game.userId, score: 0 }),
        });
    return game;
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
        console.log("CREATE GAME REDUCER")
      return action.payload;
    });
  },
});

export const selectSingleGame = (state) => {
  return state.singleGame;
};

export default singleGameSlice.reducer;
