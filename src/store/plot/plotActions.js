export const SET_PLOT_SETTING_BY_KEY = 'SET_PLOT_SETTING_BY_KEY';
export const TOGGLE_PLOT_BOUNDARY = 'TOGGLE_PLOT_BOUNDARY';
export const SET_PEN_LOCATION = 'SET_PEN_LOCATION';
export const SET_CURRENT_LINE_ID = 'SET_CURRENT_LINE_ID';
export const SET_CURRENT_PLOT_PERCENTAGE = 'SET_CURRENT_PLOT_PERCENTAGE';

// action creators

export const setPlotSettingByKey = (key, value) => {
    return {
        type: SET_PLOT_SETTING_BY_KEY,
        value: { key, value }
    };
};

export const setPenLocation = (coords) => {
    return {
        type: SET_PEN_LOCATION,
        value: coords
    };
};

export const setCurrentLineId = (lineId) => {
    return {
        type: SET_CURRENT_LINE_ID,
        value: lineId
    };
};

export const setCurrentPlotPercentage = (percentage) => {
    return {
        type: SET_CURRENT_PLOT_PERCENTAGE,
        value: percentage
    };
};

export const togglePlotBoundary = () => {
    return {
        type: TOGGLE_PLOT_BOUNDARY
    };
};
