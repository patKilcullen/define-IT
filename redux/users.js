import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios?.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// GET SINGLE USER
export const fetchSingleUser = createAsyncThunk("singleUser", async (id) => {
  try {
    const { data } = await api.get(`/api/users/${id}`);

    return data;
  } catch (error) {
    console.log("ERROR IN SINBGLE User THUNK: ", error);
  }
});

const singleUserSlice = createSlice({
  name: "singleUser",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSingleUser.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectSingleUser = (state) => {
  return state.singleUser;
};

export default singleUserSlice.reducer;
