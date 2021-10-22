import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers";
import settingsReducer from "../components/settings/settings-slice";

const store = configureStore({
  reducer: {
    game: rootReducer,
    settings: settingsReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    })
});

export default store;
