import { createLineFromPointArray } from '../../utils/lineUtils';

export const ADD_LINE_TO_LAYER_BY_ID = 'ADD_LINE_TO_LAYER_BY_ID';
export const ADD_MULTIPLE_LINES_TO_LAYER_BY_ID =
    'ADD_MULTIPLE_LINES_TO_LAYER_BY_ID';
export const SET_LAYER_EFX_LINES = 'SET_LAYER_EFX_LINES';
export const DELETE_ALL_EFX_LINES_FOR_LAYER = 'DELETE_ALL_EFX_LINES_FOR_LAYER';
export const DELETE_ALL_ORIGINAL_LINES_FOR_LAYER =
    'DELETE_ALL_ORIGINAL_LINES_FOR_LAYER';
export const MULTIPLY_CANVAS = 'MULTIPLY_CANVAS';
export const SHRINK_CANVAS = 'SHRINK_CANVAS';
export const DELETE_FILL_LINES_FROM_LAYER_BY_ID =
    'DELETE_FILL_LINES_FROM_LAYER_BY_ID';

// action creators
export const addLineToLayerByID = (layerID, pointArray) => {
    const lineWithId = createLineFromPointArray(pointArray);

    return {
        type: ADD_LINE_TO_LAYER_BY_ID,
        value: { layerID, line: lineWithId }
    };
};

export const addMultipleLinesToLayerByID = (layerID, pointArrays) => {
    const lines = pointArrays.map(pointArray =>
        createLineFromPointArray(pointArray)
    );

    return {
        type: ADD_MULTIPLE_LINES_TO_LAYER_BY_ID,
        value: { layerID, lines }
    };
};

export const deleteFillLinesFromLayerByID = (layerID, fillLines, inside) => {
    return {
        type: DELETE_FILL_LINES_FROM_LAYER_BY_ID,
        value: { layerID, fillLines, inside }
    };
};

export const setLayerEfxLines = (layerID, efxLines) => {
    return {
        type: SET_LAYER_EFX_LINES,
        value: { layerID, efxLines }
    };
};

export const deleteLayerEfxLines = layerID => {
    return {
        type: DELETE_ALL_EFX_LINES_FOR_LAYER,
        value: layerID
    };
};

export const deleteLayerOriginalLines = layerID => {
    return {
        type: DELETE_ALL_ORIGINAL_LINES_FOR_LAYER,
        value: layerID
    };
};

export const multiplyCanvas = ({
    currentWidth,
    currentHeight,
    timesX,
    timesY
}) => {
    return {
        type: MULTIPLY_CANVAS,
        value: { currentWidth, currentHeight, timesX, timesY }
    };
};

export const shrinkCanvas = ({ currentWidth, currentHeight, factor }) => {
    return {
        type: SHRINK_CANVAS,
        value: { currentWidth, currentHeight, factor }
    };
};
