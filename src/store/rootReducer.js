import { combineReducers } from 'redux';

import drawingReducer from './drawing/drawingReducer';
import gifmakerReducer from './gifmaker/gifmakerReducer';
import globalReducer from './global/globalReducer';
import layerReducer from './layer/layerReducer';
import {
    efxLinesReducer,
    undoableOriginalLinesReducer
} from './line/lineReducers';
import optionsReducer from './options/optionsReducer';
import plotReducer from './plot/plotReducer';

import { LOAD_PROJECT, NEW_PROJECT } from './rootActions';

const rootReducer = combineReducers({
    layerReducer,
    globalReducer,
    originalLinesReducer: undoableOriginalLinesReducer,
    efxLinesReducer,
    optionsReducer,
    drawingReducer,
    plotReducer,
    gifmakerReducer
});

const loadReducer = (state, action) => {
    switch (action.type) {
        case NEW_PROJECT:
            return rootReducer(undefined, action);
        case LOAD_PROJECT:
            return rootReducer(action.value, action);
        default:
            return rootReducer(state, action);
    }
};

export default loadReducer;
