export const SWITCH_MODE = 'SWITCH_MODE';
export const TOGGLE_GRID_VISIBILITY = 'TOGGLE_GRID_VISIBILITY';
export const TOGGLE_POINT_VISIBILITY = 'TOGGLE_POINT_VISIBILITY';
export const SET_GRID_OPTIONS = 'SET_GRID_OPTIONS';

// action creators

export const switchMode = mode => {
    return { type: SWITCH_MODE, value: mode };
};

export const toggleGridVisibility = () => {
    return { type: TOGGLE_GRID_VISIBILITY };
};

export const togglePointVisibility = () => {
    return { type: TOGGLE_POINT_VISIBILITY };
};

export const setGridOptions = options => {
    return { type: SET_GRID_OPTIONS, value: options };
};
