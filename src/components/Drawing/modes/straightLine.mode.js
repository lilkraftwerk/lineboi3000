import { allPointsBetweenTwoCoords } from '../../../utils/coordUtils';
import { getFirstAndLastCoordsFromTempCoords } from '../../../utils/drawingUtils';

const formatTempCoords = (tempCoords, { pointsOnEachLine }) => {
    const [startCoords, endCoords] = getFirstAndLastCoordsFromTempCoords(
        tempCoords
    );

    const allPoints = allPointsBetweenTwoCoords(startCoords, endCoords, {
        maxPointCount: pointsOnEachLine
    });

    return allPoints;
};

export default {
    formatTempCoords
};
