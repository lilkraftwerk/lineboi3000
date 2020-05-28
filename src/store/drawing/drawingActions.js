export const SELECT_DRAW_MODE = 'SELECT_DRAW_MODE';
export const SELECT_MAIN_MODE = 'SELECT_MAIN_MODE';
export const SET_TEXT_CONTENT = 'SET_TEXT_CONTENT';
export const SET_TEXT_SIZE = 'SET_TEXT_SIZE';
export const SET_FONT_NAME = 'SET_FONT_NAME';
export const SET_MULTIPLY_CANVAS_OPTIONS = 'SET_MULTIPLY_CANVAS_OPTIONS';
export const SET_SELECT_COORDS = 'SET_SELECT_COORDS';
export const SET_FILL_LINES = 'SET_FILL_LINES';
export const SET_SELECT_OPTION_BY_KEY = 'SET_SELECT_OPTION_BY_KEY';
export const SET_OPTION_BY_KEY = 'SET_OPTION_BY_KEY';

// action creators
export const selectMainMode = (mode) => {
    return {
        type: SELECT_MAIN_MODE,
        value: mode
    };
};

export const selectDrawMode = (mode) => {
    return {
        type: SELECT_DRAW_MODE,
        value: mode
    };
};

export const setTextContent = (string) => {
    return {
        type: SET_TEXT_CONTENT,
        value: string
    };
};

export const setTextSize = (size) => {
    return {
        type: SET_TEXT_SIZE,
        value: size
    };
};

export const setFontName = (fontName) => {
    return {
        type: SET_FONT_NAME,
        value: fontName
    };
};

export const setMultiplyCanvasOptions = (axis, multiplyFactor) => {
    return {
        type: SET_MULTIPLY_CANVAS_OPTIONS,
        value: { axis, multiplyFactor }
    };
};

export const setSelectCoords = ({ selectCoords, hullCoords }) => {
    return {
        type: SET_SELECT_COORDS,
        value: { selectCoords, hullCoords }
    };
};

export const setOptionByKey = ({ key, value }) => {
    return {
        type: SET_OPTION_BY_KEY,
        value: { key, value }
    };
};

export const setSelectOptionByKey = ({ key, value }) => {
    return {
        type: SET_SELECT_OPTION_BY_KEY,
        value: { key, value }
    };
};

export const setFillLines = ({ fillLines }) => {
    return {
        type: SET_FILL_LINES,
        value: { fillLines }
    };
};
