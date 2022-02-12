import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers";
import settingsReducer, {
  settingsStoreListener
} from "../components/settings/settings-slice";
import { initialSettings } from "../components/settings/defaults";
import { themes } from "../theme";
import { rehydrateLocalSettings, storageAvailable } from "./storage";

function rehydrateInitialState() {
  let initialState = {
    game: {
      options: null,
      grid: [],
      frames: [],
      endEvent: null,
      paused: true,
      gameNotFound: false,
      highlightedSnake: null,
      theme: themes.light
    },
    settings: initialSettings
  };

  if (storageAvailable("localStorage")) {
    initialState.settings = rehydrateLocalSettings();
    initialState.settings.persistAvailable = true;
  } else {
    console.info(
      "Please enable localStorage for an improved experience that allows you to persist board settings."
    );
  }

  return initialState;
}

const store = configureStore({
  reducer: {
    game: rootReducer,
    settings: settingsReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    }),
  preloadedState: rehydrateInitialState()
});

store.subscribe(() => {
  settingsStoreListener(store.getState());
});

export default store;
