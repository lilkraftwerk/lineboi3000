import { combineReducers } from 'redux';

import globalReducer from './global/globalReducer';
import layerReducer from './layer/layerReducer';
import {
    efxLinesReducer,
    undoableOriginalLinesReducer
} from './line/lineReducers';
import { undoableOnionsReducer } from './onions/onionsReducer';
import drawingReducer from './drawing/drawingReducer';
import plotReducer from './plot/plotReducer';
import gifmakerReducer from './gifmaker/gifmakerReducer';

import { LOAD_PROJECT, NEW_PROJECT } from './rootActions';

const rootReducer = combineReducers({
    layerReducer,
    globalReducer,
    originalLinesReducer: undoableOriginalLinesReducer,
    efxLinesReducer,
    onionsReducer: undoableOnionsReducer,
    drawingReducer,
    plotReducer,
    gifmakerReducer
});

const loadReducer = (state, action) => {
    switch (action.type) {
        case NEW_PROJECT:
            state = undefined; // eslint-disable-line
            return rootReducer(state, action);
        case LOAD_PROJECT:
            state = action.value; // eslint-disable-line
            return rootReducer(state, action);
        default:
            return rootReducer(state, action);
    }
};

export default loadReducer;
