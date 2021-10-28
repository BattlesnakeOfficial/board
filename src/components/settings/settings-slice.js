import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  frameRate: Number(getLocalSetting("frameRate")) || 20,
  theme: getLocalSetting("theme") || "light"
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    frameRateUpdated(state, action) {
      state.frameRate = action.payload;
    },
    themeSelected(state, action) {
      state.theme = action.payload;
    }
  }
});

// toolkit generates the actions for us
export const { frameRateUpdated, themeSelected } = settingsSlice.actions;

/*// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state) => state.counter.value;*/
export const currentFrameRate = state => state.settings.frameRate;
export const currentTheme = state => state.settings.theme;

function getLocalSetting(key) {
  if (window.localStorage) {
    return window.localStorage.getItem(key);
  }
}

function setLocalSetting(key, value) {
  if (window.localStorage) {
    window.localStorage.setItem(key, value);
  }
}

export function settingsStoreListener(state) {
  if (state.settings.frameRate !== getLocalSetting("frameRate")) {
    setLocalSetting("frameRate", state.settings.frameRate);
  }

  if (state.settings.theme !== getLocalSetting("theme")) {
    setLocalSetting("theme", state.settings.theme);
  }
}

export default settingsSlice.reducer;
