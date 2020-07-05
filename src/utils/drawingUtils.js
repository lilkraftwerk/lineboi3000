/* eslint-disable no-param-reassign */
const _ = require('lodash');

export const prepareLines = (lines = []) => {
    if (lines.length <= 0) {
        return null;
    }

    const pointArrayContainers = lines.map((line) => line.pointArrayContainer);

    const pointArraysWithoutZeroLength = pointArrayContainers.filter(
        (container) => container.length > 0
    );

    return pointArraysWithoutZeroLength;
};

export const drawLines = (
    context,
    pointArrays,
    strokeWidth = 3,
    color = 'black'
) => {
    pointArrays.forEach((pointArray) => {
        context.strokeStyle = color;
        context.beginPath();
        context.lineWidth = strokeWidth;
        context.lineJoin = 'miter';

        for (let index = 0; index < pointArray.length; index += 1) {
            const [currentX, currentY] = pointArray[index];
            if (currentX != null && currentY != null) {
                if (index === 0) {
                    context.moveTo(currentX, currentY);
                }
                context.lineTo(currentX, currentY);
            }
        }

        context.stroke();
    });
};

export const drawCircles = (context, coords, radius = 10, color = 'black') => {
    context.fillStyle = color;
    context.lineWidth = 0;
    context.strokeStyle = color;
    coords.forEach(([centerX, centerY]) => {
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.stroke();
        context.fill();
    });
};

export const drawPoints = (
    context,
    coords,
    fillStyle = 'white',
    strokeStyle = 'black'
) => {
    context.strokeStyle = strokeStyle;
    context.fillStyle = fillStyle;
    coords.forEach(([pointX, pointY]) => {
        context.fillRect(pointX, pointY, 1, 1);
    });
    context.fill();
    context.stroke();
};

export const drawSquares = (context, coords, fillStyle = 'black', radius) => {
    context.fillStyle = fillStyle;
    context.strokeStyle = fillStyle;
    coords.forEach(([centerX, centerY]) => {
        const startX = centerX - radius;
        const startY = centerY - radius;
        context.fillRect(startX, startY, radius * 2, radius * 2);
    });
};

export const drawPointCircles = (
    context,
    pointArrays,
    color = 'black',
    radius = 1
) => {
    context.fillStyle = 'white';
    context.strokeStyle = color;
    const flatPoints = _.flatten(pointArrays);
    flatPoints.forEach(([pointX, pointY]) => {
        context.beginPath();
        context.arc(pointX, pointY, radius, 0, Math.PI + Math.PI * 360);
        context.stroke();
    });
};

export const getStartCoordsFromFirstTempLines = (tempLines) => {
    if (tempLines[0] == null) {
        return false;
    }
    if (tempLines[0][0] == null) {
        return false;
    }
    if (tempLines[0][0][0] == null) {
        return false;
    }

    if (tempLines[0][0][1] == null) {
        return false;
    }

    return _.clone([tempLines[0][0][0], tempLines[0][0][1]]);
};

export const getFirstLineFromTempLines = (tempLines) => {
    if (tempLines[0] == null) {
        return false;
    }

    return _.clone(tempLines[0]);
};

export const getFirstAndLastCoordsFromTempCoords = (coords) => {
    const first = coords[0];
    const last = coords[coords.length - 1];
    return [first, last];
};
