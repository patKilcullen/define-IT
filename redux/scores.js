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

import { ref, get, orderByChild, equalTo, update } from "firebase/database";

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

// GET USER SCORE
export const getUserScore = createAsyncThunk(
  "userScore",
  async ({ gameId, userId }, { rejectWithValue }) => {
    try {
      const scoresRef = collection(FireBaseDB, "scores");

      const q = query(
        scoresRef,
        where("gameId", "==", gameId, "userId", "==", userId)
      );

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

// FETCH PLAYER REQUESTS
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

// ACCEPT REQUEST TO JOIN
export const acceptJoinRequestByScoreId = async ({ game, scoreId }) => {
  try {
    const joinRequestsRef = ref(RealTimeDB, `games/${game.id}/join_requests`);

    // Query the requests where scoreId matches
    const queryRef = query(joinRequestsRef, orderByChild("scoreId"));
    console.log("queryRef: ", queryRef);

    const snapshot = await get(queryRef);
    console.log("snapshot.val(): ", snapshot.val());

    if (snapshot.exists()) {
      const requests = snapshot.val();

      const matchingRequestKey = Object.keys(requests).find(
        (key) => requests[key].scoreId === scoreId
      );

      if (matchingRequestKey) {
        console.log("Matching request key: ", matchingRequestKey);

        const requestRef = ref(
          RealTimeDB,
          `games/${game.id}/join_requests/${matchingRequestKey}`
        );

        await update(requestRef, {
          accepted: true,
        });

        console.log("Join request successfully accepted.");
      } else {
        console.error("No matching request found for scoreId:", scoreId);
      }
    } else {
      console.error("No join requests found for the game.");
    }
  } catch (error) {
    console.error("Error updating join request by scoreId:", error);
  }
};

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
      //   userId: score.userId,
      turnNum: score.turnNum,
    });

    return score;
  } catch (err) {
    console.log("Error in editScore:", err);
  }
});

// APP POINT TO SCORE
export const addPoint = createAsyncThunk(
  "scores/addPoint",
  async ({ userId, gameId }, { rejectWithValue }) => {
    console.log("ASS POIINT: ")
    try {
      // Reference to the specific scores collection
      const scoreDocRef = collection(FireBaseDB, "scores");

      // Query to find the document with matching gameId and userId
      const q = query(
        scoreDocRef,
        where("gameId", "==", gameId),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const currentScore = doc.data().score;

        const newScore = currentScore + 1;

        await updateDoc(doc.ref, { score: newScore });

        console.log("Score updated successfully:", newScore);
        return { userId, gameId, score: newScore };
      } else {
        console.error("Score document not found.");
        return rejectWithValue("Score document not found.");
      }
    } catch (err) {
      console.error("Error updating score:", err);
      return rejectWithValue("Failed to add point to score");
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

const allScoresSlice = createSlice({
  name: "allScores",
  initialState: {
    scores: [],
    playerRequests: [],
    userScore: {},
  },
  reducers: {
    clearScores(state) {
      state.scores = [];
    },
    clearPlayerRequests(state) {
      state.playerRequests = [];
    },
    clearAll(state) {
      state.scores = [];
      state.playerRequests = [];
    },
    clearUserScore(state) {
      state.userScore = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserScore.fulfilled, (state, action) => {
        state.scores.push(action.payload);
      })
      .addCase(fetchAllGameScores.fulfilled, (state, action) => {
        state.scores = action.payload;
      })
      .addCase(fetchPlayerRequests.fulfilled, (state, action) => {
        state.playerRequests = action.payload;
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

export const { clearScores, clearPlayerRequests, clearAll } =
  allScoresSlice.actions;

export const selectAllScores = (state) => {
  return state.allScores.scores;
};

export const selectPlayerRequests = (state) => {
  return state.allScores.playerRequests;
};

export default allScoresSlice.reducer;
