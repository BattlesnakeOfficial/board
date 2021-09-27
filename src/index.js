import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers";
import App from "./containers/app";
import { themes } from "./theme";
import thunkMiddleware from "redux-thunk";

const initialState = {
  options: null,
  grid: [],
  frames: [],
  endEvent: {},
  paused: true,
  gameNotFound: false,
  highlightedSnake: null,
  theme: themes.light
};
const middleware = applyMiddleware(thunkMiddleware);
const store = createStore(rootReducer, initialState, middleware);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
