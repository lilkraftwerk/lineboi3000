import _ from 'lodash';
import id from './id';

export const createFakePoint = (
    maxHeight = 800,
    maxWidth = 800,
    offset = 100
) => {
    const x = _.random(0, maxHeight) + offset;
    const y = _.random(0, maxWidth) + offset;
    return [x, y];
};

export const createFakePointArray = (pointCount = 10) => {
    const pointArray = [];
    _.times(pointCount, () => {
        pointArray.push(createFakePoint());
    });
    return pointArray;
};

export const createFakePointArrayContainer = (count = 10, pointsPer = 10) => {
    const pointArrayContainer = [];
    _.times(count, () => {
        pointArrayContainer.push(createFakePointArray(pointsPer));
    });
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
    _.times(count, () => {
        lines.push(createFakeLine());
    });
    return lines;
};

export const isPointArrayValid = pointArray => {
    const invalidReasons = [];

    if (!_.isArray(pointArray)) {
        invalidReasons.push('not array');
        return invalidReasons;
    }

    pointArray.forEach(points => {
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
    return _.uniq(invalidReasons);
};

export const isPointArrayContainerValid = pointArrayContainer => {
    if (!_.isArray(pointArrayContainer)) {
        return false;
    }
    const allAreValid = _.every(pointArrayContainer, pointArray => {
        return isPointArrayValid(pointArray) === true;
    });

    return allAreValid;
};

export const isLineValid = line => {
    const invalidReasons = [];
    if (!line) {
        invalidReasons.push('no line supplied');
        return invalidReasons;
    }

    if (!line.id || !_.isString(line.id)) {
        invalidReasons.push('no id or id is not a string');
    }

    if (!_.isArray(line.pointArrayContainer)) {
        invalidReasons.push('pointArrayContainer is not an array');
    }

    if (isPointArrayContainerValid(line.pointArrayContainer) !== true) {
        invalidReasons.push('pointArrayContainer is not valid');
    }

    if (invalidReasons.length === 0) {
        return true;
    }
    return _.uniq(invalidReasons);
};

const getDrawingOptions = (drawingMode = 'pen') => {
    return {
        textContent: 'ab',
        fontSize: 50,
        fontName: 'VCR_OSD_MONO.ttf',
        drawingMode
    };
};

export const testOnStart = (drawObj, modeString) => {
    const { onStart } = drawObj;
    if (!onStart) return false;
    const fakeCoords = createFakePoint();
    const result = onStart(fakeCoords, null, getDrawingOptions(modeString));

    return isPointArrayContainerValid(result);
};

export const testOnMove = (drawObj, modeString) => {
    const { onMove } = drawObj;

    if (!onMove) return false;

    const tempLines = createFakePointArrayContainer(2);
    const fakeCoords = createFakePoint();
    const result = onMove(fakeCoords, tempLines, getDrawingOptions(modeString));
    const isValid = isPointArrayContainerValid(result);
    return isValid;
};

export const testOnEnd = (drawObj, modeString) => {
    const { onEnd } = drawObj;
    if (!onEnd) return false;

    const tempLines = createFakePointArrayContainer(5);
    const fakeCoords = createFakePoint();
    const result = onEnd(fakeCoords, tempLines, getDrawingOptions(modeString));
    const isValid = isPointArrayContainerValid(result);
    return isValid;
};
