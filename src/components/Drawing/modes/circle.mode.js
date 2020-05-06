import { addMultipleLinesToLayerByID } from 'store/line/lineActions';
import { setSelectCoords } from 'store/drawing/drawingActions';
import hull from 'hull.js';

const makeCircle = (centerX, centerY, radius, pointsOnCircle = 50) => {
    const coords = [];
    for (let i = 0; i < pointsOnCircle; i += 1) {
        const thisX =
            centerX + radius * Math.cos((2 * Math.PI * i) / pointsOnCircle);
        const thisY =
            centerY + radius * Math.sin((2 * Math.PI * i) / pointsOnCircle);
        coords.push([thisX, thisY]);
    }
    const first = coords[0];
    return [...coords, first];
};

const onStart = coords => {
    return [[coords]];
};

const onMove = (coords, _templines, { startCoords, pointsOnCircle }) => {
    const [x1, y1] = startCoords;
    const [x2, y2] = coords;
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    const xFactor = x1 > x2 ? x1 - x2 : x2 - x1;
    const yFactor = y1 > y2 ? y1 - y2 : y2 - y1;
    const distance = Math.sqrt(xFactor ** 2 + yFactor ** 2);
    const circle = makeCircle(centerX, centerY, distance / 2, pointsOnCircle);
    return [circle];
};

const onEnd = (_coords, tempLines, options, dispatch) => {
    const { currentLayerID, mainMode } = options;
    if (mainMode === 'select') {
        const hullCoords = hull(tempLines[0], 20);
        dispatch(setSelectCoords({ selectCoords: tempLines[0], hullCoords }));
    } else {
        dispatch(addMultipleLinesToLayerByID(currentLayerID, tempLines));
    }
};

export default {
    onStart,
    onMove,
    onEnd
};
