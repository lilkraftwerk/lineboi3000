import hull from 'hull.js';
import { addMultipleLinesToLayerByID } from '../../../store/line/lineActions';
import { setSelectCoords } from '../../../store/drawing/drawingActions';
import { getFirstLineFromTempLines } from '../../../utils/drawingUtils';

const onStart = coords => {
    return [[coords]];
};

const onMove = (coords, tempLines) => {
    const firstLine = getFirstLineFromTempLines(tempLines);
    const lineWithNewCoords = [...firstLine, coords];
    return [lineWithNewCoords];
};

const onEndProcessor = (coords, tempLines) => {
    const firstLine = getFirstLineFromTempLines(tempLines);
    const lineWithNewCoords = [...firstLine, coords];
    return [lineWithNewCoords];
};

const onEnd = (coords, tempLines, options, dispatch) => {
    const { currentLayerID, mainMode } = options;
    const lineWithNewCoords = onEndProcessor(coords, tempLines);

    if (mainMode === 'select') {
        const hullCoords = hull(lineWithNewCoords, 20);
        dispatch(
            setSelectCoords({ selectCoords: lineWithNewCoords, hullCoords })
        );
    } else {
        dispatch(
            addMultipleLinesToLayerByID(currentLayerID, lineWithNewCoords)
        );
    }
};

export default {
    onStart,
    onMove,
    onEndProcessor,
    onEnd
};
