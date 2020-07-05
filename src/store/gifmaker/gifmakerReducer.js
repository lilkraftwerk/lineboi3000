import id from '../../utils/id';

import {
    SAVE_TEMP_AS_FRAME,
    SET_GIF_OPTION_BY_KEY,
    SET_TEMP_BLOB,
    SET_FRAMES,
    SET_GIFMAKER_LOADING,
    ADD_ACTIVE_FRAME,
    DELETE_ACTIVE_FRAME,
    DELETE_LIBRARY_FRAME,
    SET_MASTER_GIF
} from './gifmakerActions';

const initialState = {
    frames: [],
    loading: false,
    tempBlob: null,
    activeFrames: [],
    masterGif: null,
    gifQuality: 1,
    gifBackgroundColor: 'white',
    gifHeight: 600,
    gifFrameDelay: 100,
    gifWidth: 800
};

const deleteFrame = (frames, idToDelete) => {
    return frames.filter((frame) => frame.id !== idToDelete);
};

const saveTempAsFrameHelper = (state) => {
    if (!state.tempBlob) {
        return state;
    }

    const newFrame = {
        id: id(),
        data: state.tempBlob
    };

    return {
        ...state,
        frames: [...state.frames, newFrame]
    };
};

const gifmakerReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GIFMAKER_LOADING:
            return {
                ...state,
                loading: action.value
            };
        case SAVE_TEMP_AS_FRAME:
            return saveTempAsFrameHelper(state);
        case SET_TEMP_BLOB:
            return {
                ...state,
                tempBlob: action.value
            };
        case SET_FRAMES:
            return {
                ...state,
                frames: action.value
            };
        case ADD_ACTIVE_FRAME:
            return {
                ...state,
                activeFrames: [...state.activeFrames, action.value]
            };
        case DELETE_ACTIVE_FRAME:
            return {
                ...state,
                activeFrames: deleteFrame(state.activeFrames, action.value)
            };
        case DELETE_LIBRARY_FRAME:
            return {
                ...state,
                frames: deleteFrame(state.frames, action.value)
            };
        case SET_MASTER_GIF:
            return {
                ...state,
                masterGif: action.value
            };
        case SET_GIF_OPTION_BY_KEY:
            return {
                ...state,
                [action.value.key]: action.value.value
            };
        default:
            return state;
    }
};

export default gifmakerReducer;
