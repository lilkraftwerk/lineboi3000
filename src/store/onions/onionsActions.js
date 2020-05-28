export const SET_WIDTH = 'SET_WIDTH';
export const SET_HEIGHT = 'SET_HEIGHT';

// action creators

export const setHeight = (height) => {
    return {
        type: SET_HEIGHT,
        value: height
    };
};

export const setWidth = (width) => {
    return {
        type: SET_WIDTH,
        value: width
    };
};
