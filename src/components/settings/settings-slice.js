import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light"
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // move to settings
    themeSelected(state, action) {
      state.theme = action.payload;
    }
  }
});

// toolkit generates the actions for us
export const { themeSelected } = settingsSlice.actions;

/*// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state) => state.counter.value;*/
// export const { requestFrames, fetchFrames } = state => state; // state.frames ???
export const currentTheme = state => state.settings.theme;

export default settingsSlice.reducer;
