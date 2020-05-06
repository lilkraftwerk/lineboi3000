import {
    SET_CURRENT_LINE_ID,
    SET_PLOT_SETTING_BY_KEY,
    TOGGLE_PLOT_BOUNDARY,
    SET_PEN_LOCATION
} from './plotActions';

const initState = {
    paperWidth: 11.81,
    paperHeight: 8.58,
    penUpHeight: 0.25,
    penDownHeight: 0.7,
    scale: 50,
    center: true,
    isPlotBoundaryVisible: false,
    penLocation: [0, 0],
    currentLineId: null
};

const plotReducer = (state = initState, action) => {
    switch (action.type) {
        case SET_PLOT_SETTING_BY_KEY:
            return {
                ...state,
                [action.value.key]: action.value.value
            };
        case TOGGLE_PLOT_BOUNDARY:
            return {
                ...state,
                isPlotBoundaryVisible: !state.isPlotBoundaryVisible
            };
        case SET_PEN_LOCATION:
            return {
                ...state,
                penLocation: action.value
            };
        case SET_CURRENT_LINE_ID:
            return {
                ...state,
                currentLineId: action.value
            };
        default:
            return state;
    }
};

export default plotReducer;
