import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FireBaseDB } from "../Firebase/FirebaseConfig";
import { addDoc, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const api = axios?.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// // GET ALL GAME'S SCORES
// export const fetchAllGameScores = createAsyncThunk(
//   "allScores",
//   async (gameId) => {
//     try {
//       const { data } = await api.get(`/api/scores/game/${gameId}`);

//       return data;
//     } catch (error) {
//       console.log("ERROR IN FETCH ALL SCORES THUNK: ", error);
//     }
//   }
// );
// GET ALL GAME'S SCORES
export const fetchAllGameScores = createAsyncThunk(
  "allScores",
  async (gameId, { rejectWithValue }) => {
    try {
    
      // Reference to the "scores" collection
      const scoresRef = collection(FireBaseDB, 'scores');
      
      // Query to get all scores for the specific gameId
      const q = query(scoresRef, where('gameId', '==', gameId));
      
      // Get all documents matching the query
      const querySnapshot = await getDocs(q);

      // Map over the documents and return the data with document ID
      const scores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return scores;  // Return all scores
    } catch (error) {
      console.log("ERROR IN FETCH ALL SCORES THUNK: ", error);
      return rejectWithValue(error.message);  // Reject with error message
    }
  }
);

// GET HIGHEST SCORE IN GAME
export const fetchHighestGameScores = createAsyncThunk(
  "highestScores",
  async (gameId) => {
    try {
      const { data } = await api.get(
        `/api/scores/game/${gameId}/highestScores`
      );
      return data;
    } catch (error) {
      console.log("ERROR IN FETCH ALL SCORES THUNK: ", error);
    }
  }
);

// CREATE SCORE
// export const createScore = createAsyncThunk(
//   "createScore",
//   async ({ score, accepted, turn, turnNum, gameId, userId }) => {
//     try {
//       const { data } = await api.post("/api/scores", {
//         score,
//         accepted,
//         turn,
//         turnNum,
//         gameId,
//         userId,
//       });
//       return data;
//     } catch (error) {
//       console.log("ERROR IN CREAT Score THUNK: ", error);
//     }
//   }
// );

export const createScore = createAsyncThunk(
  "createScore",
  async ({ score, accepted, turn, turnNum, gameId, userId }) => {
    try {
    const docRef = await addDoc(collection(FireBaseDB, "scores"), {
      score: score || 0,
      accepted: accepted || false,
      turn: turn || false,
      turnNum: turnNum || null,
      gameId: gameId || "",
      userId: userId || "",
    });

       return {
         id: docRef.id, // Returning the document ID
         score,
         accepted,
         turn,
         turnNum,
         gameId,
         userId,
       };
    } catch (error) {
      console.log("ERROR IN CREAT Score THUNK: ", error);
    }
  }
);


// EDIT SCORE
export const editScore = createAsyncThunk("editScore", async (score) => {

  try {
    const scoreRef = doc(FireBaseDB, "scores", score.scoreId);
  
    
    await updateDoc(scoreRef, {
      accepted: score.accepted,
      gameId: score.gameId,
      userId: score.userId,
      turnNum: score.turnNum,
    });
    
    return score;
  } catch (err) {
    console.log("Error in editScore:", err);
  }
});


// ADD POINT TO SCORE
export const addPoint = createAsyncThunk(
  "addPoint",
  async ({ userId, gameId }) => {
    try {
      const { data } = await api.put(`/api/scores/${userId}/addPoint`, {
        userId,
        gameId,
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

// ADD POINT TO SCORE
export const add3Points = createAsyncThunk(
  "add3Points",
  async ({ userId, gameId }) => {
    try {
      const { data } = await api.put(`/api/scores/${userId}/add3Points`, {
        userId,
        gameId,
      });

      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

// ADD POINT TO SCORE
export const subtract3Points = createAsyncThunk(
  "subtract3Points",
  async ({ userId, gameId }) => {
    try {
      const { data } = await api.put(
        `/api/scores/${userId}/subtract3Points`,
        {
          userId,
          gameId,
        }
      );
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

// DELETE SCORE - for now used only when game owner denies request
export const deleteScore = createAsyncThunk("deleteScore", async (score) => {
  try {
    await api.delete(`/api/scores/${score.gameId}/${score.userId}`);
    return { gameId: score.gameId, userId: score.userId };
  } catch (err) {
    console.log(err);
  }
});

const allScoresSlice = createSlice({
  name: "allScores",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllGameScores.fulfilled, (state, action) => {
   
      return action.payload;
    }),
      builder.addCase(createScore.fulfilled, (state, action) => {
        state.push(action.payload);
      }),
      builder.addCase(editScore.fulfilled, (state, action) => {
        state.push(action.payload);
      }),
      builder.addCase(addPoint.fulfilled, (state, action) => {
        state.push(action.payload);
      }),
      builder.addCase(add3Points.fulfilled, (state, action) => {
        state.push(action.payload);
      }),
      builder.addCase(subtract3Points.fulfilled, (state, action) => {
        state.push(action.payload);
      });
  },
});

export const selectAllScores = (state) => {
  return state.allScores;
};

export default allScoresSlice.reducer;
