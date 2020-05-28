// gifmaker actions

export const ADD_FRAME = 'ADD_FRAME';
export const SET_TEMP_BLOB = 'SET_TEMP_BLOB';
export const SAVE_TEMP_AS_FRAME = 'SAVE_TEMP_AS_FRAME';
export const SET_GIFMAKER_LOADING = 'SET_GIFMAKER_LOADING';
export const SET_FRAMES = 'SET_FRAMES';
export const ADD_ACTIVE_FRAME = 'ADD_ACTIVE_FRAME';
export const SET_MASTER_GIF = 'SET_MASTER_GIF';
export const MOVE_FRAME_UP = 'MOVE_FRAME_UP';
export const MOVE_FRAME_DOWN = 'MOVE_FRAME_DOWN';
export const DELETE_FRAME_FROM_GIF = 'DELETE_FRAME_FROM_GIF';

export const addFrame = (frame) => {
    return { type: ADD_FRAME, value: frame };
};

export const saveTempAsFrame = () => {
    return { type: SAVE_TEMP_AS_FRAME };
};

export const setTempBlob = (tempBlob) => {
    return { type: SET_TEMP_BLOB, value: tempBlob };
};

export const setGifmakerLoading = (isLoading) => {
    return { type: SET_GIFMAKER_LOADING, value: isLoading };
};

export const setFrames = (frames) => {
    return { type: SET_FRAMES, value: frames };
};

export const addActiveFrame = (frame) => {
    return { type: ADD_ACTIVE_FRAME, value: frame };
};

export const setMasterGif = (masterGif) => {
    return { type: SET_MASTER_GIF, value: masterGif };
};

export const moveFrameUp = (id) => {
    return { type: MOVE_FRAME_UP, value: id };
};

export const moveFrameDown = (id) => {
    return { type: MOVE_FRAME_DOWN, value: id };
};

export const deleteFrameFromGif = (id) => {
    return { type: DELETE_FRAME_FROM_GIF, value: id };
};
