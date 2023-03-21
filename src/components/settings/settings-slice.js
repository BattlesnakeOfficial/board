import { createSlice } from "@reduxjs/toolkit";
import { getLocalSetting, setLocalSetting } from "../../app/storage";
import { initialSettings as initialState } from "./defaults";

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
    },
    showFrameScrubberUpdated(state, action) {
      state.showFrameScrubber = action.payload;
    },
    showCoordinateLabelsUpdated(state, action) {
      state.showCoordinateLabels = action.payload;
    }
  }
});

// toolkit generates the actions for us
export const {
  frameRateUpdated,
  themeSelected,
  autoPlayUpdated,
  showFrameScrubberUpdated,
  showCoordinateLabelsUpdated
} = settingsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const currentFrameRate = state => state.settings.frameRate;
export const currentTheme = state => state.settings.theme;
export const currentAutoplay = state => state.settings.autoplay;
export const currentShowFrameScrubber = state =>
  state.settings.showFrameScrubber;
export const currentShowCoordinateLabels = state =>
  state.settings.showCoordinateLabels;

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

  if (
    state.settings.showFrameScrubber !== getLocalSetting("showFrameScrubber")
  ) {
    setLocalSetting("showFrameScrubber", state.settings.showFrameScrubber);
  }

  if (
    state.settings.showCoordinateLabels !==
    getLocalSetting("showCoordinateLabels")
  ) {
    setLocalSetting(
      "showCoordinateLabels",
      state.settings.showCoordinateLabels
    );
  }
}

export default settingsSlice.reducer;
