// layer actions

export const ADD_LAYER = 'ADD_LAYER';
export const REMOVE_LAYER = 'REMOVE_LAYER';
export const SELECT_CURRENT_LAYER = 'SELECT_CURRENT_LAYER';
export const UPDATE_LAYER_SETTING = 'UPDATE_LAYER_SETTING';
export const SET_VISIBILITY_FOR_ALL_LAYERS = 'SET_VISIBILITY_FOR_ALL_LAYERS';
export const MOVE_LAYER_UP = 'MOVE_LAYER_UP';
export const MOVE_LAYER_DOWN = 'MOVE_LAYER_DOWN';
export const DELETE_LAYER = 'DELETE_LAYER';
export const DUPLICATE_LAYER = 'DUPLICATE_LAYER';

// layer filters actions

export const ADD_FILTER_TO_LAYER_BY_ID = 'ADD_FILTER_TO_LAYER_BY_ID';
export const UPDATE_FILTER_BY_LAYER_ID_AND_FILTER_ID =
    'UPDATE_FILTER_BY_LAYER_ID_AND_FILTER_ID';
export const SET_FILTERS_FOR_LAYER_BY_ID = 'SET_FILTERS_FOR_LAYER_BY_ID';
export const SET_FILTERS_FOR_ALL_LAYERS = 'SET_FILTERS_FOR_ALL_LAYERS';
export const DELETE_FILTER_FROM_LAYER = 'DELETE_FILTER_FROM_LAYER';
export const MOVE_FILTER_UP = 'MOVE_FILTER_UP';
export const MOVE_FILTER_DOWN = 'MOVE_FILTER_DOWN';

// action creators

export const addLayer = () => {
    return { type: ADD_LAYER };
};

export const removeLayer = (layerId) => {
    return { type: REMOVE_LAYER, value: layerId };
};

export const selectCurrentLayer = (layerId) => {
    return { type: SELECT_CURRENT_LAYER, value: layerId };
};

export const setVisibilityForAllLayers = (visible) => {
    return { type: SET_VISIBILITY_FOR_ALL_LAYERS, value: visible };
};

export const updateLayerSetting = (layerID, settingKey, settingValue) => {
    return {
        type: UPDATE_LAYER_SETTING,
        value: { layerID, settingKey, settingValue }
    };
};

export const moveLayerUp = (layerID) => {
    return {
        type: MOVE_LAYER_UP,
        value: layerID
    };
};

export const moveLayerDown = (layerID) => {
    return {
        type: MOVE_LAYER_DOWN,
        value: layerID
    };
};

export const deleteLayer = (layerID) => {
    return {
        type: DELETE_LAYER,
        value: layerID
    };
};

export const duplicateLayer = (originalLayerID, newLayerID) => {
    return {
        type: DUPLICATE_LAYER,
        value: { originalLayerID, newLayerID }
    };
};

// filter actions

export const addFilterToLayerByID = (layerID, filterSettings) => {
    return {
        type: ADD_FILTER_TO_LAYER_BY_ID,
        value: { layerID, filterSettings }
    };
};

export const setFiltersForLayerByID = (layerID, filters) => {
    return {
        type: SET_FILTERS_FOR_LAYER_BY_ID,
        value: { layerID, filters }
    };
};

export const setFiltersForAllLayers = (filters) => {
    return {
        type: SET_FILTERS_FOR_ALL_LAYERS,
        value: { filters }
    };
};

export const updateFilterByLayerIDandFilterID = (
    layerID,
    filterID,
    filterSettings
) => {
    return {
        type: UPDATE_FILTER_BY_LAYER_ID_AND_FILTER_ID,
        value: { layerID, filterID, filterSettings }
    };
};

export const deleteFilterFromLayer = (layerID, filterID) => {
    return {
        type: DELETE_FILTER_FROM_LAYER,
        value: { layerID, filterID }
    };
};

export const moveFilterUp = (layerID, filterID) => {
    return {
        type: MOVE_FILTER_UP,
        value: { layerID, filterID }
    };
};

export const moveFilterDown = (layerID, filterID) => {
    return {
        type: MOVE_FILTER_DOWN,
        value: { layerID, filterID }
    };
};
