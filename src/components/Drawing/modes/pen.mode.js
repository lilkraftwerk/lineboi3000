import { addMultipleLinesToLayerByID } from 'store/line/lineActions';
import { setSelectCoords } from 'store/drawing/drawingActions';
import hull from 'hull.js';
import { getFirstLineFromTempLines } from '../../../utils/drawingUtils';

const onStart = coords => {
    return [[coords]];
};

const onMove = (coords, tempLines) => {
    const firstLine = getFirstLineFromTempLines(tempLines);
    const lineWithNewCoords = [...firstLine, coords];
    return [lineWithNewCoords];
};

const onEnd = (coords, tempLines, options, dispatch) => {
    const { currentLayerID, mainMode } = options;
    const firstLine = getFirstLineFromTempLines(tempLines);
    const lineWithNewCoords = [...firstLine, coords];
    if (mainMode === 'select') {
        const hullCoords = hull(lineWithNewCoords, 20);
        dispatch(
            setSelectCoords({ selectCoords: lineWithNewCoords, hullCoords })
        );
    } else {
        dispatch(
            addMultipleLinesToLayerByID(currentLayerID, [lineWithNewCoords])
        );
    }
};

export default {
    onStart,
    onMove,
    onEnd
};
