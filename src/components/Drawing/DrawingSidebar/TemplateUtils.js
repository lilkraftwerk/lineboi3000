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
        }),
        [topLeft]
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

const frame = (globalHeight, globalWidth, intensity = 50) => {
    const FRAME_DISTANCE = 10;
    const rectangle = makeRectangleAtDistance(
        globalHeight,
        globalWidth,
        FRAME_DISTANCE,
        intensity
    );
    return [rectangle];
};

// const bricks = (globalHeight, globalWidth, )

const squares = (globalHeight, globalWidth, intensity = 50) => {
    const OFFSET = 20;
    const NUM_SQUARES = intensity;
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
        console.log('hi');
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
    squares
};

export const applyTemplate = ({
    currentLayerID,
    templateIntensity,
    globalHeight,
    globalWidth,
    templateName,
    dispatch
}) => {
    const selectedTemplate = templates[templateName];
    const lines = selectedTemplate(
        globalHeight,
        globalWidth,
        templateIntensity
    );
    dispatch(addMultipleLinesToLayerByID(currentLayerID, lines));
};
