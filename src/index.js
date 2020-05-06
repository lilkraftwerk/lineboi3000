import React from 'react';
import { render } from 'react-dom';
import { ipcRenderer } from 'electron';

import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';

import thunk from 'redux-thunk';
import rootReducer from 'store/rootReducer';
import { createLogger } from 'redux-logger';
import AppContainer from './components/AppContainer';

import './globalStyles.css';

const sendToMainProcessMiddleware = store => next => action => {
    if (action.type === 'SEND_TO_MAIN_PROCESS') {
        ipcRenderer.send('main:sendReduxStore', store.getState());
    }
    return next(action);
};

const logger = createLogger({
    predicate: (_getState, action) => action.type !== 'SET_PEN_LOCATION'
});

const middleware = applyMiddleware(logger, sendToMainProcessMiddleware, thunk);
const store = createStore(rootReducer, middleware);

render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('root')
);
