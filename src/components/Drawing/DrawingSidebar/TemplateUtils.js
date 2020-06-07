import _ from 'lodash';
import { addMultipleLinesToLayerByID } from 'store/line/lineActions';
import { allPointsBetweenTwoCoords } from '../../../utils/coordUtils';

const makeRectangleAtDistance = (height, width, distance, intensity) => {
    const topLeft = [distance, distance];
    const topRight = [width - distance, distance];
    const bottomRight = [width - distance, height - distance];
    const bottomLeft = [distance, height - distance];

    const pointsOnEachLine = intensity * 4;

    return [
        ...allPointsBetweenTwoCoords(topLeft, topRight, {
            maxPointCount: pointsOnEachLine
        }),
        ...allPointsBetweenTwoCoords(topRight, bottomRight, {
            maxPointCount: pointsOnEachLine
        }),
        ...allPointsBetweenTwoCoords(bottomRight, bottomLeft, {
            maxPointCount: pointsOnEachLine
        }),
        ...allPointsBetweenTwoCoords(bottomLeft, topLeft, {
            maxPointCount: pointsOnEachLine
        })
    ];
};

const makeRectangleAtCoords = (topLeftX, topLeftY, width, height) => {
    const topLeft = [topLeftX, topLeftY];
    const topRight = [topLeftX + width, topLeftY];
    const bottomRight = [topLeftX + width, topLeftY + height];
    const bottomLeft = [topLeftX, topLeftY + height];

    const pointsOnEachLine = 20;

    return [
        ...allPointsBetweenTwoCoords(topLeft, topRight, {
            maxPointCount: pointsOnEachLine
        }),
        ...allPointsBetweenTwoCoords(topRight, bottomRight, {
            maxPointCount: pointsOnEachLine
        }),
        ...allPointsBetweenTwoCoords(bottomRight, bottomLeft, {
            maxPointCount: pointsOnEachLine
        }),
        ...allPointsBetweenTwoCoords(bottomLeft, topLeft, {
            maxPointCount: pointsOnEachLine
        })
    ];
};

const frame = (options) => {
    const { globalHeight, globalWidth, templateIntensity } = options;
    const FRAME_DISTANCE = 10;
    const rectangle = makeRectangleAtDistance(
        globalHeight,
        globalWidth,
        FRAME_DISTANCE,
        templateIntensity
    );
    return [rectangle];
};

const rain = (options) => {
    const {
        globalHeight,
        globalWidth,
        rainTemplateLineCount,
        rainTemplatePointDistance,
        rainTemplateMinPercent,
        rainTemplateMaxPercent,
        rainTemplateStartFromTop
    } = options;
    const lineCount = Math.floor(globalWidth * rainTemplateLineCount * 0.01);
    const rainLines = [];

    const xValues = _.shuffle(Array.from(Array(globalWidth).keys()));
    const slicedXValues = _.slice(xValues, 0, lineCount);

    slicedXValues.forEach((xValue) => {
        if (rainTemplateStartFromTop) {
            const line = [[xValue, 0]];
            const heightOfLine = _.random(
                Math.floor(rainTemplateMinPercent * 0.01 * globalHeight),
                Math.floor(rainTemplateMaxPercent * 0.01 * globalHeight)
            );
            for (
                let i = rainTemplatePointDistance;
                i < heightOfLine;
                i += rainTemplatePointDistance
            ) {
                line.push([xValue, i]);
            }
            rainLines.push(line);
            return;
        }

        const line = [[xValue, globalHeight]];
        const heightOfLine = _.random(
            Math.floor(rainTemplateMinPercent * 0.01 * globalHeight),
            Math.floor(rainTemplateMaxPercent * 0.01 * globalHeight)
        );
        const adjustedHeight = Math.abs(heightOfLine - globalHeight);
        for (
            let i = globalHeight - rainTemplatePointDistance;
            i > adjustedHeight;
            i -= rainTemplatePointDistance
        ) {
            line.push([xValue, i]);
        }
        rainLines.push(line);

        // if FROM BOTTOM
    });

    return rainLines;
};

const squares = (options) => {
    const { globalHeight, globalWidth, templateIntensity } = options;

    const OFFSET = 20;
    const NUM_SQUARES = templateIntensity;
    const result = [];
    let currentWidth = globalWidth - OFFSET * 2;
    let currentHeight = globalHeight - OFFSET * 2;
    const heightOffset = (globalHeight - OFFSET * 2) / NUM_SQUARES;
    const widthOffset = (globalWidth - OFFSET * 2) / NUM_SQUARES;
    let currentX = OFFSET;
    for (
        let currentY = OFFSET;
        currentY < globalHeight / 2;
        currentY += heightOffset
    ) {
        const rectangle = makeRectangleAtCoords(
            currentX,
            currentY,
            currentWidth,
            currentHeight
        );
        console.log({
            currentX,
            currentY,
            currentWidth,
            currentHeight
        });

        if (currentWidth > 0 && currentHeight > 0) {
            result.push(rectangle);
        }
        currentX += widthOffset;
        currentWidth -= widthOffset * 2;
        currentHeight -= heightOffset * 2;
    }
    return result;
};

const templates = {
    frame,
    squares,
    rain
};

export const applyTemplate = ({ templateName, options, dispatch }) => {
    const { currentLayerID } = options;
    const selectedTemplate = templates[templateName];
    const lines = selectedTemplate(options);
    dispatch(addMultipleLinesToLayerByID(currentLayerID, lines));
};
