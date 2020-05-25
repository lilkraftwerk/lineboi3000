import _ from 'lodash';
import hull from 'hull.js';
import { addMultipleLinesToLayerByID } from '../../../store/line/lineActions';
import { setSelectCoords } from '../../../store/drawing/drawingActions';
import { allPointsBetweenTwoCoords } from '../../../utils/coordUtils';
import { getStartCoordsFromFirstTempLines } from '../../../utils/drawingUtils';

const onStart = coords => {
    return [[coords]];
};

const onMove = ([endX, endY], tempLines) => {
    const [startX, startY] = getStartCoordsFromFirstTempLines(tempLines);
    const fourCorners = _.clone([
        [startX, startY],
        [startX, endY],
        [endX, endY],
        [endX, startY],
        [startX, startY]
    ]);

    return [fourCorners];
};

const onEndProcessor = ([endX, endY], tempLines, options) => {
    const { pointsOnEachLine } = options;
    const [startX, startY] = getStartCoordsFromFirstTempLines(tempLines);

    const topLeft = [startX, startY];
    const topRight = [endX, startY];
    const bottomRight = [endX, endY];
    const bottomLeft = [startX, endY];
    const squareLines = [
        ...allPointsBetweenTwoCoords(topLeft, topRight, {
            maxPointCount: pointsOnEachLine
        }),
        ...allPointsBetweenTwoCoords(topRight, bottomRight, {
            maxPointCount: pointsOnEachLine
        }),
        ...allPointsBetweenTwoCoords(bottomRight, bottomLeft, {
            maxPointCount: pointsOnEachLine
        }),
        ...allPointsBetweenTwoCoords(bottomLeft, topLeft, {
            maxPointCount: pointsOnEachLine
        })
    ];
    return [squareLines];
};

const onEnd = ([endX, endY], tempLines, options, dispatch) => {
    const { currentLayerID, mainMode } = options;
    const squareLines = onEndProcessor([endX, endY], tempLines, options);

    if (mainMode === 'select') {
        const hullCoords = hull(squareLines, 20);
        dispatch(setSelectCoords({ selectCoords: squareLines, hullCoords }));
    } else {
        dispatch(addMultipleLinesToLayerByID(currentLayerID, squareLines));
    }
};

export default {
    onStart,
    onMove,
    onEndProcessor,
    onEnd
};
