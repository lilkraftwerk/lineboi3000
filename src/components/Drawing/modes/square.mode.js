import { allPointsBetweenTwoCoords } from '../../../utils/coordUtils';
import { getFirstAndLastCoordsFromTempCoords } from '../../../utils/drawingUtils';

const formatTempCoords = (coords) => {
    const [startCoords, endCoords] =
        getFirstAndLastCoordsFromTempCoords(coords);
    const [startX, startY] = startCoords;
    const [endX, endY] = endCoords;
    const fourCorners = [
        [startX, startY],
        [startX, endY],
        [endX, endY],
        [endX, startY],
        [startX, startY]
    ];

    return fourCorners;
};

const formatFinalCoords = (coords, options) => {
    const { pointsOnEachLine } = options;
    const [startCoords, endCoords] =
        getFirstAndLastCoordsFromTempCoords(coords);
    const [startX, startY] = startCoords;
    const [endX, endY] = endCoords;

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
    return squareLines;
};

export default {
    formatTempCoords,
    formatFinalCoords
};
