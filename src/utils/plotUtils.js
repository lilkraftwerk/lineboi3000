import _ from 'lodash';

export const makePercentage = (part, whole) => {
    const result = (part / whole) * 100;
    return _.round(result, 4);
};

export const coordsToPercent = ([x, y], height, width) => [
    makePercentage(x, width),
    makePercentage(y, height)
];

export const addPercentageCoordinatesToLine = (line, width, height) => {
    const percentageCoordinates = line.pointArrayContainer.map((coords) => {
        return coordsToPercent(coords, height, width);
    });

    return {
        ...line,
        percentageCoordinates
    };
};

export const scaleLine = (line, scale = 1) => {
    const { pointArrayContainer } = line;
    const mappedPoints = pointArrayContainer.map(([x, y]) => {
        const newX = x * scale;
        const newY = y * scale;
        return [newX, newY];
    });

    return {
        ...line,
        pointArrayContainer: mappedPoints
    };
};

export const moveLine = (line, { xOffset = 0, yOffset = 0 } = {}) => {
    if (xOffset === 0 && yOffset === 0) {
        return line;
    }

    const { pointArrayContainer } = line;

    const mappedPoints = pointArrayContainer.map(([x, y]) => {
        const newX = x + xOffset;
        const newY = y + yOffset;
        return [newX, newY];
    });

    return {
        ...line,
        pointArrayContainer: mappedPoints
    };
};

export const getExtremePointsOfLines = (lines) => {
    const flatLines = _.flatten(lines);
    const flatScaledPointArrayContainers = flatLines.map(
        (line) => line.pointArrayContainer
    );

    const trulyFlattened = _.flatten(flatScaledPointArrayContainers);

    const allXValues = trulyFlattened.map((pointArray) => pointArray[0]);
    const allYValues = trulyFlattened.map((pointArray) => pointArray[1]);

    const minX = _.min(allXValues);
    const maxX = _.max(allXValues);

    const minY = _.min(allYValues);
    const maxY = _.max(allYValues);

    const totalLinesWidth = maxX - minX;
    const totalLinesHeight = maxY - minY;

    return {
        minX,
        maxX,
        minY,
        maxY,
        totalLinesHeight,
        totalLinesWidth
    };
};

export const getExtremePointsOfCoords = (flattenedCoords, radius = 0) => {
    const allXValues = flattenedCoords.map((pointArray) => pointArray[0]);
    const allYValues = flattenedCoords.map((pointArray) => pointArray[1]);

    const minX = _.min(allXValues) - radius;
    const maxX = _.max(allXValues) + radius;

    const minY = _.min(allYValues) - radius;
    const maxY = _.max(allYValues) + radius;

    return {
        minX,
        maxX,
        minY,
        maxY
    };
};

export const centerLines = (
    lines,
    {
        totalLinesHeight,
        totalLinesWidth,
        minX,
        minY,
        heightInPixels,
        widthInPixels,
        // true and add more logic to center each layer individually, maybe
        centerByAbsoluteDimensions = false
    }
) => {
    const centerX = widthInPixels / 2;
    const centerY = heightInPixels / 2;

    const widthForCenteringPurposes = centerByAbsoluteDimensions
        ? widthInPixels
        : totalLinesWidth;
    const heightForCenteringPurposes = centerByAbsoluteDimensions
        ? heightInPixels
        : totalLinesHeight;

    const xOffset = centerX - widthForCenteringPurposes / 2 - minX;
    const yOffset = centerY - heightForCenteringPurposes / 2 - minY;

    const centeredLines = lines.map((line) =>
        moveLine(line, { xOffset, yOffset })
    );

    return centeredLines;
};

// format line for plot display
// scale all lines
// get center coords and move all lines
// convert coords to percentages

export const formatLayersForPlotDisplayTwo = ({
    layers = [],
    scale = 1,
    paperHeightInPixels,
    paperWidthInPixels
}) => {
    const floatScale = scale * 0.01;

    const layersWithScaledLines = layers.map((layer) => {
        const scaledLines = layer.efxLines.map((line) =>
            scaleLine(line, floatScale)
        );
        return {
            ...layer,
            lines: scaledLines
        };
    });

    const justLines = layersWithScaledLines.map((layer) => layer.lines);
    const extremeResults = getExtremePointsOfLines(justLines);

    const onlyVisibleLayers = layersWithScaledLines.filter(
        (layer) => layer.visible === true
    );

    return onlyVisibleLayers.map((layer) => {
        const centeredLines = centerLines(layer.lines, {
            ...extremeResults,
            heightInPixels: paperHeightInPixels,
            widthInPixels: paperWidthInPixels
        });
        return {
            ...layer,
            lines: centeredLines
        };
    });
};

export const generatePlotBoundaries = ({ width, height, scale }) => {
    const floatScale = scale * 0.01;
    const boundaryRectangleInPx = {
        id: 'plotBoundaries',
        pointArrayContainer: [
            [0, 0],
            [0, height],
            [width, height],
            [width, 0],
            [0, 0]
        ]
    };

    const scaled = scaleLine(boundaryRectangleInPx, floatScale);
    const extremeResults = getExtremePointsOfLines([scaled]);

    const centeredLines = centerLines([scaled], {
        ...extremeResults,
        heightInPixels: height,
        widthInPixels: width
    });

    return centeredLines;
};
