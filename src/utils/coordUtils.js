import bresenham from 'bresenham-js';
import _ from 'lodash';

export const roundDecimalToFourDigits = decimal => {
    return +`${Math.round(`${decimal}e+4`)}e-4`;
};

export const distanceBetweenTwoCoords = ([startX, startY], [endX, endY]) => {
    const distance = Math.hypot(endX - startX, endY - startY);
    return distance;
};

export const isPointOnLineBetweenTwoCoords = (
    startCoords,
    endCoords,
    coordsToCheck
) => {
    const firstDistance = distanceBetweenTwoCoords(startCoords, coordsToCheck);
    const secondDistance = distanceBetweenTwoCoords(coordsToCheck, endCoords);
    const totalDistance = distanceBetweenTwoCoords(startCoords, endCoords);

    return (
        roundDecimalToFourDigits(firstDistance + secondDistance) ===
        roundDecimalToFourDigits(totalDistance)
    );
};

export const allPointsBetweenTwoCoords = (
    startCoords,
    endCoords,
    {
        maxPointCount = null,
        includeStartCoords = true,
        includeEndCoords = true
    } = {}
) => {
    const withStartAndEnd = coordsToReturn => {
        const startIndex = includeStartCoords ? 0 : 1;
        const endIndex = includeEndCoords
            ? coordsToReturn.length
            : coordsToReturn.length - 1;
        return coordsToReturn.slice(startIndex, endIndex);
    };

    const coords = bresenham(startCoords, endCoords);
    if (maxPointCount == null || maxPointCount <= 1) {
        return withStartAndEnd(coords);
    }

    if (maxPointCount === 2) {
        return [startCoords, endCoords];
    }

    if (maxPointCount >= coords.length) {
        return withStartAndEnd(coords);
    }

    const [startX, startY] = startCoords;
    const [endX, endY] = endCoords;

    const xDistance = endX - startX;
    const yDistance = endY - startY;

    const xInterval = xDistance / (maxPointCount - 1);
    const yInterval = yDistance / (maxPointCount - 1);

    const points = [];

    _.times(maxPointCount, index => {
        const newX = _.round(startX + index * xInterval, 4);
        const newY = _.round(startY + index * yInterval, 4);
        points.push([newX, newY]);
    });

    if (includeStartCoords === false) {
        return points.slice(1);
    }

    return withStartAndEnd(points);
};
