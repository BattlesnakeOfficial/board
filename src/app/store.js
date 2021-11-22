import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers";
import settingsReducer, {
  settingsStoreListener
} from "../components/settings/settings-slice";

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

store.subscribe(() => {
  settingsStoreListener(store.getState());
});

export default store;
