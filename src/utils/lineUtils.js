import _ from 'lodash';
import isPointInPolygon from 'point-in-polygon';
import { Line, Circle, Point, intersections } from '@mathigon/fermat';
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
            let intersectionCount = 0;

            polygons.forEach((polygon) => {
                const isInside = isPointInPolygon(currentPoints, polygon);

                if (isInside) {
                    intersectionCount += 1;
                }
            });

            if (intersectionCount % 2) {
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

export const allPointsWithinRadiusOfCoord = (centerX, centerY, radius) => {
    const points = [[centerX, centerY]];
    for (let x = centerX - radius; x <= centerX; x += 1) {
        for (let y = centerY - radius; y <= centerY; y += 1) {
            if (
                (x - centerX) * (x - centerX) + (y - centerY) * (y - centerY) <
                radius * radius
            ) {
                points.push([x, y]);
            }
        }
    }
    return points;
};

export const isPointWithinCircle = (
    circleX,
    circleY,
    circleRadius,
    pointX,
    pointY
) => {
    if (
        (pointX - circleX) * (pointX - circleX) +
            (pointY - circleY) * (pointY - circleY) <=
        circleRadius * circleRadius
    ) {
        return true;
    }

    return false;
};

export const addIntermediatePointsToLine = (line, passes = 1) => {
    let copiedLine = [...line];
    const onePass = (activeLine) => {
        const tempLine = [];
        activeLine.forEach(([currentX, currentY], index) => {
            tempLine.push([currentX, currentY]);
            if (activeLine[index + 1] != null) {
                const [nextX, nextY] = activeLine[index + 1];
                const midX = (currentX + nextX) / 2;
                const midY = (currentY + nextY) / 2;
                tempLine.push([midX, midY]);
            }
        });
        return tempLine;
    };

    _.times(passes, () => {
        copiedLine = onePass(copiedLine);
    });
    return copiedLine;
};

export const closestPointOnCircleFromCoords = (
    pointX,
    pointY,
    circleX,
    circleY,
    circleRadius
) => {
    const findDistance = (x1, y1, x2, y2) => {
        const a = x1 - x2;
        const b = y1 - y2;
        return Math.sqrt(a * a + b * b);
    };

    const startPoint = new Point(pointX, pointY);
    const circleCenterPoint = new Point(circleX, circleY);
    const line = new Line(startPoint, circleCenterPoint);
    const circle = new Circle(circleCenterPoint, circleRadius);
    const result = intersections(circle, line);

    if (result.length === 0) {
        return result;
    }

    const withDistance = result.map((intersection) => {
        return {
            ...intersection,
            distance: findDistance(
                pointX,
                pointY,
                intersection.x,
                intersection.y
            )
        };
    });

    const [closest] = withDistance.sort((a, b) => a.distance - b.distance);
    return [closest.x, closest.y];
};

export const splitLinesViaEraserCoords = ({
    lines,
    eraseCoords,
    eraserRadius,
    smoothOriginalLines = false,
    smoothPasses = 1
}) => {
    const splitLines = [];
    let tempPointArrays = [...lines];

    if (smoothOriginalLines) {
        _.times(smoothPasses, () => {
            tempPointArrays = tempPointArrays.map((pointArray) =>
                addIntermediatePointsToLine(pointArray, smoothPasses)
            );
        });
    }

    tempPointArrays.forEach((line) => {
        let currentTempLine = [];
        line.forEach(([currentX, currentY], index) => {
            let coordsAreWithinEraseRadius = false;
            // check if the current point is within any erase circle
            for (let i = 0; i < eraseCoords.length; i += 1) {
                const [eraseX, eraseY] = eraseCoords[i];
                const pointIsWithinThisCircle = isPointWithinCircle(
                    eraseX,
                    eraseY,
                    eraserRadius,
                    currentX,
                    currentY
                );

                if (pointIsWithinThisCircle) {
                    coordsAreWithinEraseRadius = true;
                    break;
                }
            }

            if (!coordsAreWithinEraseRadius) {
                currentTempLine.push([currentX, currentY]);

                if (index === line.length - 1) {
                    splitLines.push([...currentTempLine]);
                }
            } else if (currentTempLine.length > 0) {
                splitLines.push([...currentTempLine]);
                currentTempLine = [];
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
