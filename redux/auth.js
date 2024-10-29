import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseAuth } from "../Firebase/FirebaseConfig";
import { signInWithEmailAndPassword} from 'firebase/auth'
 
const TOKEN = "token";

const api = axios?.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});


// REFRESH => add username argument to thunk and use that to getItem(username)
export const me = createAsyncThunk("auth/me", async (username, thunkAPI) => {
    console.log("AUTH ME")
  try {
    // Retrieve the token using AsyncStorage
    const token = await AsyncStorage.getItem(username || TOKEN);

    if (token) {
      const res = await api.get("/auth/me", {
        headers: {
          authorization: token,
        },
      });
      return res.data;
    } else {
      return {};
    }
  } catch (err) {
    if (err.response && err.response.data) {
      return thunkAPI.rejectWithValue(err.response.data);
    } else {
      return "There was an issue with your request.";
    }
  }
});

// export const authenticate = createAsyncThunk(
//   "auth/authenticate",
//   async ({ username, password, method }, thunkAPI) => {
//     try {
//       const res = await api.post(`/auth/${method}`, { username, password });

//       // Store the token using AsyncStorage
//       await AsyncStorage.setItem(username || TOKEN, res.data.token);

//       // Dispatch the 'me' thunk with the username to load user data
//       thunkAPI.dispatch(me(username));
//     } catch (err) {
//       if (err.response && err.response.data) {
//         return thunkAPI.rejectWithValue(err.response.data);
//       } else {
//         return "There was an issue with your request.";
//       }
//     }
//   }
// );


export const authenticate = createAsyncThunk(
  "auth/authenticate",
  async ({ username, password, method }, thunkAPI) => {
    try {
      const res = await signInWithEmailAndPassword(
        FirebaseAuth,
        username,
        passwordr
      );

      console.log("RES IN AUTH: ", res)
      // Store the token using AsyncStorage
      await AsyncStorage.setItem(username || TOKEN, res.data.token);

      // Dispatch the 'me' thunk with the username to load user data
      thunkAPI.dispatch(me(username));
    } catch (err) {
      if (err.response && err.response.data) {
        return thunkAPI.rejectWithValue(err.response.data);
      } else {
        return "There was an issue with your request.";
      }
    }
  }
);
/*
  SLICE
*/
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    me: {},
    error: null,
  },
  reducers: {
    logout(state, action) {
      AsyncStorage.removeItem(TOKEN); // Remove the token from AsyncStorage
      state.me = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(me.fulfilled, (state, action) => {
      state.me = action.payload;
    });
    builder.addCase(me.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(authenticate.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

/*
  ACTIONS
*/
export const { logout } = authSlice.actions;

export const selectMe = (state) => {
  return state.auth.me;
};

/*
  REDUCER
*/
export default authSlice.reducer;
