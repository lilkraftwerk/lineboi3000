import { MULTIPLY_CANVAS, SHRINK_CANVAS } from '../line/lineActions';
import { SET_GLOBAL_OPTION_BY_KEY } from './optionsActions';

const initialState = {
    height: 600,
    width: 800,
    pointShowRadius: 3,
    pointShowColor: 'black',
    shiftToDraw: true
};

const optionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GLOBAL_OPTION_BY_KEY:
            return {
                ...state,
                [action.value.key]: action.value.value
            };
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

export default optionsReducer;
