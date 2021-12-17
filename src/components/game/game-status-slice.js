import { createSlice } from "@reduxjs/toolkit";

export const GAME_STATUS_LOADING = "loading";
export const GAME_STATUS_ERROR = "error";
export const GAME_STATUS_PAUSED = "paused";
export const GAME_STATUS_PLAYING = "playing";

const initialState = {
  error: null,
  status: GAME_STATUS_LOADING
};

const gameStatusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    load(state) {
      state.status = GAME_STATUS_LOADING;
    },
    setError(state, action) {
      state.status = GAME_STATUS_ERROR;
      state.error = action.payload;
    },
    pause(state, action) {
      state.status = GAME_STATUS_PAUSED;
      if (action.payload) {
        console.log("Pause at frame", action.payload);
      }
    },
    play(state, action) {
      state.status = GAME_STATUS_PLAYING;
      if (action.payload) {
        console.log("Play from frame", action.payload);
      }
    }
  }
});

export const { load, setError, pause, play } = gameStatusSlice.actions;
export default gameStatusSlice.reducer;
