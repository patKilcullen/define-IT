import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FireBaseDB, RealTimeDB } from "../Firebase/FirebaseConfig";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const api = axios?.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// GET ALL GAME'S SCORES
export const fetchAllGameScores = createAsyncThunk(
  "allScores",
  async (gameId, { rejectWithValue }) => {
    try {
      const scoresRef = collection(FireBaseDB, "scores");

      const q = query(scoresRef, where("gameId", "==", gameId));

      const querySnapshot = await getDocs(q);

      const scores = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return scores;
    } catch (error) {
      console.log("ERROR IN FETCH ALL SCORES THUNK: ", error);
      return rejectWithValue(error.message); // Reject with error message
    }
  }
);

export const fetchPlayerRequests = createAsyncThunk(
  "fetchPlayerRequests",
  async (gameId, { rejectWithValue }) => {
    try {
      const joinRequestsRef = ref(RealTimeDB, `games/${gameId}/join_requests`);
      const snapshot = await get(joinRequestsRef);
      const requests = snapshot.val();

      return requests ? Object.values(requests) : [];
    } catch (error) {
      console.error("Error fetching player requests: ", error);
      return rejectWithValue(error.message);
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
export const createScore = createAsyncThunk(
  "createScore",
  async ({ score, accepted, turn, turnNum, gameId, userId, displayName }) => {
    try {
      const docRef = await addDoc(collection(FireBaseDB, "scores"), {
        score: score || 0,
        accepted: accepted || false,
        turn: turn || false,
        turnNum: turnNum || null,
        gameId: gameId || "",
        userId: userId || "",
        displayName: displayName || "",
      });

      return {
        id: docRef.id,
        score,
        accepted,
        turn,
        turnNum,
        gameId,
        userId,
        displayName,
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
      const { data } = await api.put(`/api/scores/${userId}/subtract3Points`, {
        userId,
        gameId,
      });
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

// const allScoresSlice = createSlice({
//   name: "allScores",
//   initialState: [],
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchAllGameScores.fulfilled, (state, action) => {
//       console.log("ACTION PAY:L ", action.payload);
//       return action.payload;
//     }),
//       builder.addCase(fetchPlayerRequests.fulfilled, (state, action) => {
//         console.log("ACTION PAY:L ", action.payload);
//         return action.payload;
//       }),
//       builder.addCase(createScore.fulfilled, (state, action) => {
//         state.push(action.payload);
//       }),
//       builder.addCase(editScore.fulfilled, (state, action) => {
//         state.push(action.payload);
//       }),
//       builder.addCase(addPoint.fulfilled, (state, action) => {
//         state.push(action.payload);
//       }),
//       builder.addCase(add3Points.fulfilled, (state, action) => {
//         state.push(action.payload);
//       }),
//       builder.addCase(subtract3Points.fulfilled, (state, action) => {
//         state.push(action.payload);
//       });
//   },
// });

// export const selectAllScores = (state) => {
//   return state.allScores;
// };
// export const playerRequests = (state) => {
//   return state.requests;
// };

// export default allScoresSlice.reducer;

const allScoresSlice = createSlice({
  name: "allScores",
  initialState: {
    scores: [],
    playerRequests: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGameScores.fulfilled, (state, action) => {
        console.log("ACTION PAYLOAD - Scores: ", action.payload);
        state.scores = action.payload; // Update only the scores part of the state
      })
      .addCase(fetchPlayerRequests.fulfilled, (state, action) => {
        console.log("ACTION PAYLOAD - Player Requests: ", action.payload);
        state.playerRequests = action.payload; // Update only the player requests part of the state
      })
      .addCase(createScore.fulfilled, (state, action) => {
        state.scores.push(action.payload);
      })
      .addCase(editScore.fulfilled, (state, action) => {
        state.scores.push(action.payload);
      })
      .addCase(addPoint.fulfilled, (state, action) => {
        state.scores.push(action.payload);
      })
      .addCase(add3Points.fulfilled, (state, action) => {
        state.scores.push(action.payload);
      })
      .addCase(subtract3Points.fulfilled, (state, action) => {
        state.scores.push(action.payload);
      });
  },
});

export const selectAllScores = (state) => {
  return state.allScores.scores; // Select only the scores
};

export const selectPlayerRequests = (state) => {
  return state.allScores.playerRequests; // Select only the player requests
};

export default allScoresSlice.reducer;