import { createSlice } from "@reduxjs/toolkit";
import { storageAvailable } from "../../app/storage";

const initialState = {
  frameRate: Number(getLocalSetting("frameRate")) || 10,
  theme: getLocalSetting("theme") || "light",
  autoplay: getLocalSetting("autoplay") || true
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
    },
    autoPlayUpdated(state, action) {
      state.autoplay = action.payload;
    }
  }
});

// toolkit generates the actions for us
export const {
  frameRateUpdated,
  themeSelected,
  autoPlayUpdated
} = settingsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const currentFrameRate = state => state.settings.frameRate;
export const currentTheme = state => state.settings.theme;
export const currentAutoplay = state => state.settings.autoplay;

function getLocalSetting(key) {
  if (storageAvailable("localStorage")) {
    return window.localStorage.getItem(key);
  }
}

function setLocalSetting(key, value) {
  if (storageAvailable("localStorage")) {
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

  if (state.settings.autoplay !== getLocalSetting("autoplay")) {
    setLocalSetting("autoplay", state.settings.autoplay);
  }
}

export default settingsSlice.reducer;
