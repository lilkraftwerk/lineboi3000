import {
    SET_GRID_OPTIONS,
    SWITCH_MODE,
    TOGGLE_GRID_VISIBILITY,
    TOGGLE_POINT_VISIBILITY
} from './globalActions';

const initialState = {
    mode: 'draw',
    showPoints: false,
    grid: {
        visible: false,
        height: 10,
        width: 10
    }
};

const globalReducer = (state = initialState, action) => {
    switch (action.type) {
        case SWITCH_MODE:
            return { ...state, mode: action.value };
        case TOGGLE_GRID_VISIBILITY:
            return {
                ...state,
                grid: {
                    ...state.grid,
                    visible: !state.grid.visible
                }
            };
        case TOGGLE_POINT_VISIBILITY:
            return {
                ...state,
                showPoints: !state.showPoints
            };
        case SET_GRID_OPTIONS:
            return {
                ...state,
                grid: {
                    ...state.grid,
                    ...action.value
                }
            };
        default:
            return state;
    }
};

export default globalReducer;
