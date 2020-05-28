/* eslint-disable no-param-reassign */
const _ = require('lodash');

export const prepareLines = (lines = []) => {
    if (lines.length <= 0) {
        return null;
    }

    const pointArrayContainers = lines.map(line => line.pointArrayContainer);

    const pointArraysWithoutZeroLength = pointArrayContainers.filter(
        container => container.length > 0
    );

    return pointArraysWithoutZeroLength;
};

export const drawLines = (
    context,
    pointArrays,
    strokeWidth = 3,
    color = 'black'
) => {
    pointArrays.forEach(pointArray => {
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

export const drawPointCircles = (
    context,
    pointArrays,
    color = 'black',
    radius = 1
) => {
    context.strokeStyle = 'black';
    const flatPoints = _.flatten(pointArrays);
    flatPoints.forEach(([pointX, pointY]) => {
        context.beginPath();
        context.arc(pointX, pointY, radius, 0, Math.PI + Math.PI * 360);
        context.stroke();
    });
};

