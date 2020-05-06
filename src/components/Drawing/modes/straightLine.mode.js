import { addMultipleLinesToLayerByID } from 'store/line/lineActions';
import { allPointsBetweenTwoCoords } from '../../../utils/coordUtils';
import { getStartCoordsFromFirstTempLines } from '../../../utils/drawingUtils';

const onStart = coords => {
    return [[coords]];
};

const onMove = (coords, tempLines) => {
    const firstCoords = getStartCoordsFromFirstTempLines(tempLines);
    return [[firstCoords, coords]];
};

const onEnd = (coords, tempLines, options, dispatch) => {
    const { pointsOnEachLine, currentLayerID } = options;
    const firstCoords = getStartCoordsFromFirstTempLines(tempLines);
    const allPoints = allPointsBetweenTwoCoords(firstCoords, coords, {
        maxPointCount: pointsOnEachLine
    });
    dispatch(addMultipleLinesToLayerByID(currentLayerID, [allPoints]));
};

export default {
    onStart,
    onMove,
    onEnd
};
