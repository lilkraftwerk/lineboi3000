import _ from 'lodash';
import TextToSVG from 'text-to-svg';
import { pathDataToPolys } from 'svg-path-to-polygons';
import { getExtremePointsOfCoords } from '../../../utils/plotUtils';
import {
    removePointsOutsidePolygons,
    generateLinesAtAngle
} from '../../../utils/lineUtils';
import { getFirstAndLastCoordsFromTempCoords } from '../../../utils/drawingUtils';

const getMinMaxValues = (polygon) => {
    const xValues = polygon.map((arr) => arr[0]);
    const yValues = polygon.map((arr) => arr[1]);
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
        fillAngle,
        fontName,
        distanceBetweenLines,
        distanceBetweenPoints
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
        .filter((command) => command[0] !== 'Q')
        .join('');

    const polygons = pathDataToPolys(commands);

    const justCoords = _.flatten(polygons);

    // const combinedOptions = {
    // ...getMinMaxValues(justCoords),
    // distanceBetweenLines,
    // distanceBetweenPoints
    // };

    const { minX, minY, maxX, maxY } = getExtremePointsOfCoords(justCoords, 50);
    const allLines = generateLinesAtAngle({
        minX,
        maxX,
        minY,
        maxY,
        distanceBetweenLines,
        distanceBetweenPoints,
        angle: fillAngle
    });

    // library returns a weird object
    const mappedPolys = polygons.map((polygon) => {
        return polygon.map((x) => x);
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

const generateTextCoords = (tempCoords, options) => {
    const { textDistanceBetweenLetters, textDistanceBetweenWords } = options;
    const [, endCoords] = getFirstAndLastCoordsFromTempCoords(tempCoords);
    let currentX = endCoords[0];

    const letterCoords = options.textContent.split('').map((letter) => {
        if (letter === ' ') {
            currentX += textDistanceBetweenWords;
            return [];
        }

        const letterPolygons = createTextCoords(
            [currentX, endCoords[1]],
            letter,
            options
        );

        const newMaxX = getMinMaxValues(_.flatten(letterPolygons)).maxX;
        currentX = newMaxX + textDistanceBetweenLetters;

        return letterPolygons;
    });

    return _.flatten(letterCoords);
};

export default {
    formatTempCoords: generateTextCoords,
    formatFinalCoords: generateTextCoords
};
