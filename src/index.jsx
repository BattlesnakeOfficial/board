import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers';
import App from './containers/app';
import thunkMiddleware from 'redux-thunk'

const middleware = applyMiddleware(thunkMiddleware);
const initialState = {
    options: null,
    grid: []
};
const store = createStore(rootReducer, initialState, middleware);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);