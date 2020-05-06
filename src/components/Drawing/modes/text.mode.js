import { addMultipleLinesToLayerByID } from 'store/line/lineActions';
import _ from 'lodash';
import TextToSVG from 'text-to-svg';
import { pathDataToPolys } from 'svg-path-to-polygons';
import {
    generateHorizontalLines,
    generateVerticalLines,
    removePointsOutsidePolygons
} from '../../../utils/lineUtils';

const getMinMaxValues = polygon => {
    const xValues = polygon.map(arr => arr[0]);
    const yValues = polygon.map(arr => arr[1]);
    const minX = _.min(xValues);
    const maxX = _.max(xValues);
    const minY = _.min(yValues);
    const maxY = _.max(yValues);

    return {
        minX,
        maxX,
        minY,
        maxY
    };
};

const createTextCoords = (coords, textContent = 'no text', options) => {
    const [currentX, currentY] = coords;
    const {
        textFill,
        textOutline,
        textSize,
        fontName,
        textFillIsHorizontal,
        textDistanceBetweenLines,
        textDistanceBetweenPoints
    } = options;
    const textToSVG = TextToSVG.loadSync(`src/assets/fonts/${fontName}`);

    const textOptions = {
        x: currentX,
        y: currentY,
        fontSize: textSize,
        anchor: 'left baseline',
        attributes: { fill: 'black', stroke: 'black' }
    };

    // just remove quadratic curves for now and it seems to work?
    const svgD = textToSVG.getD(textContent, textOptions);
    const commands = svgD
        .split(/(?=[LMCQ])/)
        .filter(command => command[0] !== 'Q')
        .join('');

    const polygons = pathDataToPolys(commands);

    const justCoords = _.flatten(polygons);

    const combinedOptions = {
        ...getMinMaxValues(justCoords),
        distanceBetweenLines: textDistanceBetweenLines,
        distanceBetweenPoints: textDistanceBetweenPoints
    };

    const allLines = textFillIsHorizontal
        ? generateHorizontalLines(combinedOptions)
        : generateVerticalLines(combinedOptions);

    // library returns a weird object
    const mappedPolys = polygons.map(polygon => {
        return polygon.map(x => x);
    });

    const splitLines = removePointsOutsidePolygons({
        allLines,
        polygons: mappedPolys
    });

    return [
        ...(textOutline ? mappedPolys : []),
        ...(textFill ? splitLines : [])
    ];
};

const generateTextCoords = (coords, _templines, options) => {
    const { textDistanceBetweenLetters, textDistanceBetweenWords } = options;
    let currentX = coords[0];

    const letterCoords = options.textContent.split('').map(letter => {
        if (letter === ' ') {
            currentX += textDistanceBetweenWords;
            return [];
        }

        const letterPolygons = createTextCoords(
            [currentX, coords[1]],
            letter,
            options
        );

        const newMaxX = getMinMaxValues(_.flatten(letterPolygons)).maxX;
        currentX = newMaxX + textDistanceBetweenLetters;

        return letterPolygons;
    });

    return _.flatten(letterCoords);
};

const onEnd = (coords, _templines, options, dispatch) => {
    const { currentLayerID } = options;
    const generatedCoords = generateTextCoords(coords, _templines, options);
    dispatch(addMultipleLinesToLayerByID(currentLayerID, generatedCoords));
};

export default {
    onStart: generateTextCoords,
    onMove: generateTextCoords,
    onEnd
};
