import _ from 'lodash';
import undoable, { includeAction } from 'redux-undo';
import {
    deletePointsViaSelection,
    splitLinesViaEraserCoords,
    createLineFromPointArray
} from '../../utils/lineUtils';
import idGenerator from '../../utils/id';

import {
    ADD_LINE_TO_LAYER_BY_ID,
    ADD_MULTIPLE_LINES_TO_LAYER_BY_ID,
    SET_LAYER_EFX_LINES,
    DELETE_ALL_EFX_LINES_FOR_LAYER,
    DELETE_ALL_ORIGINAL_LINES_FOR_LAYER,
    MULTIPLY_CANVAS,
    SHRINK_CANVAS,
    DELETE_FILL_LINES_FROM_LAYER_BY_ID,
    ERASE_POINTS_WITHIN_ERASER_COORDS
} from './lineActions';

import { DUPLICATE_LAYER } from '../layer/layerActions';

const addLineToLayerByIdHelper = (state, { layerID, line }) => {
    const layerLines = state[layerID] || [];
    return [...layerLines, line];
};

const addLinesToLayerByIdHelper = (state, { layerID, lines }) => {
    const layerLines = state[layerID] || [];
    return [...layerLines, ...lines];
};

const deleteFillLinesHelper = (state, { layerID, fillLines, inside }) => {
    const layerLines = state[layerID] || [];

    const justPoints = layerLines.map((x) => x.pointArrayContainer);
    const pointArrays = deletePointsViaSelection({
        lines: justPoints,
        selectedPolygon: fillLines,
        inside
    });

    return pointArrays.map((pointArray) =>
        createLineFromPointArray(pointArray)
    );
};

const eraseHelper = (state, { layerID, eraseCoords, eraserRadius }) => {
    const layerLines = state[layerID] || [];

    const justPoints = layerLines.map((x) => x.pointArrayContainer);
    const pointArrays = splitLinesViaEraserCoords({
        lines: justPoints,
        eraseCoords,
        eraserRadius
    });

    return pointArrays.map((pointArray) =>
        createLineFromPointArray(pointArray)
    );
};

const multiplyCanvasHelper = (
    state,
    { currentWidth, currentHeight, timesX, timesY }
) => {
    // loop through entire layer

    const layers = Object.entries(_.clone(state));
    const multiplyLayer = ([layerID, lines]) => {
        const originalPointArrayContainers = [
            ...lines.map((line) => line.pointArrayContainer)
        ];
        const newPointArrayContainers = [];
        _.times(timesX, (xIndex) => {
            _.times(timesY, (yIndex) => {
                originalPointArrayContainers.forEach((pAC) => {
                    const mapped = pAC.map(([x, y]) => {
                        return [
                            x + currentWidth * xIndex,
                            y + currentHeight * yIndex
                        ];
                    });
                    newPointArrayContainers.push(mapped);
                });
            });
        });

        const withId = newPointArrayContainers.map((x) => {
            return {
                id: idGenerator(),
                pointArrayContainer: x
            };
        });

        return { [layerID]: withId };
    };

    const result = layers.map((layer) => {
        return multiplyLayer(layer);
    });
    const newState = Object.assign({}, ...result);

    return newState;
};

const shrinkCanvasHelper = (state, { factor }) => {
    const layers = Object.entries(_.clone(state));

    const scaleLine = (line, scale = 1) => {
        const { pointArrayContainer } = line;
        const mappedPoints = pointArrayContainer.map(([x, y]) => {
            const newX = x * scale;
            const newY = y * scale;
            return [newX, newY];
        });

        return {
            ...line,
            pointArrayContainer: mappedPoints
        };
    };

    const scaleLayer = ([layerID, lines]) => {
        const mappedLines = lines.map((line) => {
            return scaleLine(line, factor);
        });
        return { [layerID]: mappedLines };
    };

    const result = layers.map((layer) => {
        return scaleLayer(layer);
    });
    const newState = Object.assign({}, ...result);

    return newState;
};

export const originalLinesReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_LINE_TO_LAYER_BY_ID:
            return {
                ...state,
                [action.value.layerID]: addLineToLayerByIdHelper(
                    state,
                    action.value
                )
            };
        case ADD_MULTIPLE_LINES_TO_LAYER_BY_ID:
            return {
                ...state,
                [action.value.layerID]: addLinesToLayerByIdHelper(
                    state,
                    action.value
                )
            };
        case DELETE_FILL_LINES_FROM_LAYER_BY_ID:
            return {
                ...state,
                [action.value.layerID]: deleteFillLinesHelper(
                    state,
                    action.value
                )
            };
        case ERASE_POINTS_WITHIN_ERASER_COORDS:
            return {
                ...state,
                [action.value.layerID]: eraseHelper(state, action.value)
            };
        case DELETE_ALL_ORIGINAL_LINES_FOR_LAYER:
            return {
                ...state,
                ..._.omit(state, action.value.layerID)
            };
        case DUPLICATE_LAYER:
            return {
                ...state,
                ...{
                    [action.value.newLayerID]:
                        state[action.value.originalLayerID]
                }
            };
        case MULTIPLY_CANVAS:
            return multiplyCanvasHelper(state, action.value);
        case SHRINK_CANVAS:
            return shrinkCanvasHelper(state, action.value);
        default:
            return state;
    }
};

export const undoableOriginalLinesReducer = undoable(originalLinesReducer, {
    filter: includeAction(
        ADD_MULTIPLE_LINES_TO_LAYER_BY_ID,
        MULTIPLY_CANVAS,
        SHRINK_CANVAS
    )
});

export const efxLinesReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_LAYER_EFX_LINES:
            return {
                ...state,
                [action.value.layerID]: action.value.efxLines
            };
        case DELETE_ALL_EFX_LINES_FOR_LAYER:
            return {
                ...state,
                ..._.omit(state, action.value.layerID)
            };
        case DUPLICATE_LAYER:
            return {
                ...state,
                ...{
                    [action.value.newLayerID]:
                        state[action.value.originalLayerID]
                }
            };
        default:
            return state;
    }
};
