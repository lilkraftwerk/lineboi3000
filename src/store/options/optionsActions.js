export const SET_GLOBAL_OPTION_BY_KEY = 'SET_GLOBAL_OPTION_BY_KEY';

// action creators

export const setGlobalOptionByKey = ({ key, value }) => {
    return {
        type: SET_GLOBAL_OPTION_BY_KEY,
        value: { key, value }
    };
};
