import { createCanvas } from 'canvas';
import { random as _random } from 'es-toolkit';
import id from './id';

export const createFakePoint = (
    maxHeight = 800,
    maxWidth = 800,
    offset = 100
) => {
    const x = _random(0, maxHeight) + offset;
    const y = _random(0, maxWidth) + offset;
    return [x, y];
};

export const createFakePointArray = (pointCount = 10) => {
    const pointArray = [];
    for (let i = 0; i < pointCount; i++) {
        pointArray.push(createFakePoint());
    }
    return pointArray;
};

export const createFakePointArrayContainer = (count = 10, pointsPer = 10) => {
    const pointArrayContainer = [];
    for (let i = 0; i < count; i++) {
        pointArrayContainer.push(createFakePointArray(pointsPer));
    }
    return pointArrayContainer;
};

export const createFakeLine = () => {
    return {
        id: id(),
        pointArrayContainer: createFakePointArrayContainer()
    };
};

export const createFakeLineArray = (count = 10) => {
    const lines = [];
    for (let i = 0; i < count; i++) {
        lines.push(createFakeLine());
    }
    return lines;
};

export const isPointArrayValid = (pointArray) => {
    const invalidReasons = [];

    if (!Array.isArray(pointArray)) {
        invalidReasons.push('not array');
        return invalidReasons;
    }

    pointArray.forEach((points) => {
        if (points.length !== 2) {
            invalidReasons.push('length wrong');
        }

        const [x, y] = points;

        if (
            (x != null && typeof x !== 'number') ||
            (y != null && typeof y !== 'number')
        ) {
            invalidReasons.push('contains non-numbers');
        }

        if (x < 0 || y < 0) {
            invalidReasons.push('contains negative numbers');
        }
    });
    if (invalidReasons.length === 0) {
        return true;
    }
    return [...new Set(invalidReasons)];
};

export const isPointArrayContainerValid = (pointArrayContainer) => {
    if (!Array.isArray(pointArrayContainer)) {
        return false;
    }
    const allAreValid = pointArrayContainer.every((pointArray) => {
        return isPointArrayValid(pointArray) === true;
    });

    return allAreValid;
};

export const isLineValid = (line) => {
    const invalidReasons = [];
    if (!line) {
        invalidReasons.push('no line supplied');
        return invalidReasons;
    }

    if (!line.id || typeof line.id !== 'string') {
        invalidReasons.push('no id or id is not a string');
    }

    if (!Array.isArray(line.pointArrayContainer)) {
        invalidReasons.push('pointArrayContainer is not an array');
    }

    if (isPointArrayContainerValid(line.pointArrayContainer) !== true) {
        invalidReasons.push('pointArrayContainer is not valid');
    }

    if (invalidReasons.length === 0) {
        return true;
    }
    return [...new Set(invalidReasons)];
};

export const createTestCanvas = () => {
    const canvas = createCanvas(800, 600);
    const context = canvas.getContext('2d');

    context.beginPath();
    context.lineWidth = '6';
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.rect(0, 0, 800, 600);
    context.stroke();
    context.fill();

    return { context, canvas };
};
