import isPointInPolygon from 'point-in-polygon';
import id from './id';

export const getPointArraysFromLine = (line) => {
    return line.pointArrayContainer;
};

export const createLineFromPointArray = (pointArrays) => {
    return {
        id: id(),
        pointArrayContainer: pointArrays
    };
};

export const generateVerticalLines = ({
    minX,
    maxX,
    minY,
    maxY,
    distanceBetweenLines,
    distanceBetweenPoints,
    offset = 20
}) => {
    const allLines = [];
    for (let x = minX - offset; x <= maxX + offset; x += distanceBetweenLines) {
        const thisLine = [];
        for (
            let y = minY - offset;
            y <= maxY + offset;
            y += distanceBetweenPoints
        ) {
            thisLine.push([x, y]);
        }
        allLines.push(thisLine);
    }
    return allLines;
};

export const generateHorizontalLines = ({
    minX,
    maxX,
    minY,
    maxY,
    distanceBetweenLines,
    distanceBetweenPoints,
    offset = 20
}) => {
    const allLines = [];
    for (let y = minY - offset; y <= maxY + offset; y += distanceBetweenLines) {
        const thisLine = [];
        for (
            let x = minX - offset;
            x <= maxX + offset;
            x += distanceBetweenPoints
        ) {
            thisLine.push([x, y]);
        }
        allLines.push(thisLine);
    }
    return allLines;
};

export const removePointsOutsidePolygons = ({ allLines, polygons }) => {
    const splitLines = [];
    allLines.forEach((line) => {
        let currentLine = [];
        line.forEach((currentPoints) => {
            let intersections = 0;

            polygons.forEach((polygon) => {
                const isInside = isPointInPolygon(currentPoints, polygon);

                if (isInside) {
                    intersections += 1;
                }
            });

            if (intersections % 2) {
                currentLine.push(currentPoints);
            } else {
                if (currentLine.length >= 2) {
                    splitLines.push(currentLine);
                }
                currentLine = [];
            }
        });
    });

    return splitLines;
};

export const deletePointsViaSelection = ({
    lines,
    selectedPolygon,
    inside
}) => {
    return lines.map((line) => {
        return line.filter((coords) => {
            const pointIsInside = isPointInPolygon(coords, selectedPolygon);
            if (inside && pointIsInside) {
                return true;
            }

            if (!inside && !pointIsInside) {
                return true;
            }

            return false;
        });
    });
};
