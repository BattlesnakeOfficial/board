import React from "react";
import { render } from "react-dom";
// import { compose, createStore, applyMiddleware } from "redux";
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
  paused: true,
  highlightedSnake: null,
  theme: themes.light
};
const middleware = applyMiddleware(thunkMiddleware);
const store = createStore(rootReducer, initialState, middleware);
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(
//   rootReducer,
//   initialState,
//   composeEnhancers(applyMiddleware(thunkMiddleware))
// );

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
