import React from "react";
import { render } from "react-dom";
import { compose, createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducers";
import App from "./containers/app";
import { themes } from "./theme";
import thunkMiddleware from "redux-thunk";

let component;

// NOTE: Because we don't want to introduce a routing library just to add a single endpoint,
// we check if the incoming request is for the version page specifically, otherwise we boot the app.
if (window.location.href.endsWith("/version")) {
  const version =
    process.env.REACT_APP_APP_VERSION ||
    "REACT_APP_APP_VERSION environment variable undefined";

  component = <div>{version}</div>;
} else {
  const initialState = {
    options: null,
    grid: [],
    frames: [],
    paused: true,
    highlightedSnake: null,
    theme: themes.light,
  };
  const middleware = applyMiddleware(thunkMiddleware);

  let store;
  if (process.env.REACT_APP_APP_VERSION !== "development") {
    store = createStore(rootReducer, initialState, middleware);
  } else {
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(
      rootReducer,
      initialState,
      composeEnhancers(applyMiddleware(thunkMiddleware))
    );
  }

  component = (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

render(component, document.getElementById("root"));
