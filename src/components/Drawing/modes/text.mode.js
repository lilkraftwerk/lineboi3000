import { pathDataToPolys } from 'svg-path-to-polygons';
import TextToSVG from 'text-to-svg';
import { getFirstAndLastCoordsFromTempCoords } from '../../../utils/drawingUtils';
import {
    generateLinesAtAngle,
    removePointsOutsidePolygons
} from '../../../utils/lineUtils';
import { getExtremePointsOfCoords } from '../../../utils/plotUtils';

const getMinMaxValues = (polygon) => {
    const xValues = polygon.map((arr) => arr[0]);
    const yValues = polygon.map((arr) => arr[1]);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);

    return {
        minX,
        maxX,
        minY,
        maxY
    };
};

const createTextCoords = (coords, textContent, options) => {
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

    const justCoords = polygons.flat();

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

        const newMaxX = getMinMaxValues(letterPolygons.flat()).maxX;
        currentX = newMaxX + textDistanceBetweenLetters;

        return letterPolygons;
    });

    return letterCoords.flat();
};

export default {
    formatTempCoords: generateTextCoords,
    formatFinalCoords: generateTextCoords
};
