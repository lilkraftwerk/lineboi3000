import { addMultipleLinesToLayerByID } from '../../../store/line/lineActions';
import { allPointsBetweenTwoCoords } from '../../../utils/coordUtils';
import { getStartCoordsFromFirstTempLines } from '../../../utils/drawingUtils';

const onStart = coords => {
    return [[coords]];
};

const onMove = (coords, tempLines) => {
    const firstCoords = getStartCoordsFromFirstTempLines(tempLines);
    return [[firstCoords, coords]];
};

const onEndProcessor = (coords, tempLines, options) => {
    const { pointsOnEachLine } = options;
    const firstCoords = getStartCoordsFromFirstTempLines(tempLines);
    const allPoints = allPointsBetweenTwoCoords(firstCoords, coords, {
        maxPointCount: pointsOnEachLine
    });
    return [allPoints];
};

const onEnd = (coords, tempLines, options, dispatch) => {
    const { currentLayerID } = options;
    const allPoints = onEndProcessor(coords, tempLines, options);
    dispatch(addMultipleLinesToLayerByID(currentLayerID, allPoints));
};

export default {
    onStart,
    onMove,
    onEnd,
    onEndProcessor
};
