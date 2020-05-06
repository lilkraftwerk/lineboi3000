import undoable, { includeAction } from 'redux-undo';
import { SET_HEIGHT, SET_WIDTH } from './onionsActions';
import { MULTIPLY_CANVAS, SHRINK_CANVAS } from '../line/lineActions';

const initialState = {
    height: 600,
    width: 800
};

const onionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_HEIGHT:
            return { ...state, height: action.value };
        case SET_WIDTH:
            return { ...state, width: action.value };
        case MULTIPLY_CANVAS:
            return {
                ...state,
                height: state.height * action.value.timesY,
                width: state.width * action.value.timesX
            };
        case SHRINK_CANVAS:
            return {
                ...state,
                height: state.height * action.value.factor,
                width: state.width * action.value.factor
            };
        default:
            return state;
    }
};

export const undoableOnionsReducer = undoable(onionsReducer, {
    filter: includeAction(MULTIPLY_CANVAS, SHRINK_CANVAS)
});

export default onionsReducer;
