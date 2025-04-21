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
        rainTemplateMinDistanceBetweenLines,
        rainTemplateStartFromTop
    } = options;
    const lineCount = Math.floor(globalWidth * rainTemplateLineCount * 0.01);
    const rainLines = [];

    const xValues = _.shuffle(Array.from(Array(globalWidth).keys()));
    const doneXValues = [];
    const slicedXValues = xValues.slice(0, lineCount);

    slicedXValues.forEach((xValue) => {
        const tooClose = _.findIndex(doneXValues, (usedValue) => {
            const distance = Math.abs(usedValue - xValue);
            return distance < rainTemplateMinDistanceBetweenLines;
        });

        if (tooClose !== -1) {
            return;
        }
        doneXValues.push(xValue);

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
    });
    return _.sortBy(rainLines, (coords) => coords[0]);
};

const circleFrame = (options) => {
    const {
        globalHeight,
        globalWidth,
        circleFrameTemplateRadius,
        circleFrameTemplatePointsOnCircle
    } = options;

    const maxRadius = Math.min(globalHeight / 2, globalWidth / 2) - 10;

    const centerX = globalWidth / 2;
    const centerY = globalHeight / 2;

    const r = circleFrameTemplateRadius * 0.01 * maxRadius;
    const line = [];
    for (let i = 0; i < circleFrameTemplatePointsOnCircle + 1; i += 1) {
        const x =
            centerX +
            r * Math.cos((2 * Math.PI * i) / circleFrameTemplatePointsOnCircle);
        const y =
            centerY +
            r * Math.sin((2 * Math.PI * i) / circleFrameTemplatePointsOnCircle);

        line.push([x, y]);
    }
    return [line];
};

const manyCircles = (options) => {
    const {
        globalHeight,
        globalWidth,
        manyCirclesTemplateCount,
        manyCirclesTemplatePoints
    } = options;

    const maxRadius = Math.min(globalHeight / 2, globalWidth / 2) - 10;
    const radiusOffset = maxRadius / manyCirclesTemplateCount;
    let currentRadius = maxRadius;

    const centerX = globalWidth / 2;
    const centerY = globalHeight / 2;

    const circleLines = [];

    const makeCircle = () => {
        const r = currentRadius;
        const pointsOnCircle = currentRadius * manyCirclesTemplatePoints;
        const line = [];

        const startOffset = _.random(0, pointsOnCircle);

        for (
            let i = startOffset;
            i < startOffset + pointsOnCircle + 1;
            i += 1
        ) {
            const x =
                centerX + r * Math.cos((2 * Math.PI * i) / pointsOnCircle);
            const y =
                centerY + r * Math.sin((2 * Math.PI * i) / pointsOnCircle);

            line.push([x, y]);
        }
        circleLines.push(line);
        currentRadius -= radiusOffset;
    };

    for (let i = 0; i < manyCirclesTemplateCount; i += 1) {
        makeCircle();
    }

    return circleLines;
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
    circleFrame,
    squares,
    rain,
    manyCircles
};

export const applyTemplate = ({ templateName, options, dispatch }) => {
    const { currentLayerID } = options;
    const selectedTemplate = templates[templateName];
    const lines = selectedTemplate(options);
    dispatch(addMultipleLinesToLayerByID(currentLayerID, lines));
};
