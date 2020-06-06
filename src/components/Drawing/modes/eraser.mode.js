import { erasePointsAtCoords } from '../../../store/line/lineActions';
import { getFirstLineFromTempLines } from '../../../utils/drawingUtils';

const onStart = (coords) => {
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
    return lineWithNewCoords;
};

const onEnd = (coords, tempLines, options, dispatch) => {
    const { currentLayerID, eraserRadius } = options;
    const eraseCoords = onEndProcessor(coords, tempLines);
    dispatch(erasePointsAtCoords(currentLayerID, eraseCoords, eraserRadius));
};

export default {
    onStart,
    onMove,
    onEndProcessor,
    onEnd
};
