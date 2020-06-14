import { getFirstAndLastCoordsFromTempCoords } from '../../../utils/drawingUtils';

const makeCircle = (centerX, centerY, radius, pointsOnCircle = 50) => {
    const coords = [];
    for (let i = 0; i < pointsOnCircle; i += 1) {
        const thisX =
            centerX + radius * Math.cos((2 * Math.PI * i) / pointsOnCircle);
        const thisY =
            centerY + radius * Math.sin((2 * Math.PI * i) / pointsOnCircle);
        coords.push([thisX, thisY]);
    }
    const [first] = coords;
    return [...coords, first];
};

const formatTempCoords = (tempCoords, { pointsOnCircle }) => {
    const [startCoords, endCoords] = getFirstAndLastCoordsFromTempCoords(
        tempCoords
    );

    const [x1, y1] = startCoords;
    const [x2, y2] = endCoords;
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const xFactor = x1 > x2 ? x1 - x2 : x2 - x1;
    const yFactor = y1 > y2 ? y1 - y2 : y2 - y1;
    const distance = Math.sqrt(xFactor ** 2 + yFactor ** 2);
    const circle = makeCircle(centerX, centerY, distance / 2, pointsOnCircle);
    return circle;
};

export default {
    formatTempCoords
};
