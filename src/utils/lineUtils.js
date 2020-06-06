import _ from 'lodash';
import isPointInPolygon from 'point-in-polygon';
import smoothPolyline from 'smooth-polyline';
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

export const splitLinesViaEraserCoords = ({
    lines,
    eraseCoords,
    eraserRadius,
    smoothOriginalLines = false,
    smoothPasses = 1
}) => {
    // for each current line, add each point to a new temp line until you hit a point that is within
    // erase radius. once you find this, save the previous temp line
    // then, find next point that is not in erase radius.
    // add that to the start of a new temp line. back to square 1
    const splitLines = [];

    let tempPointArrays = [...lines];

    if (smoothOriginalLines) {
        _.times(smoothPasses, () => {
            tempPointArrays = tempPointArrays.map(pointArray => addIntermediatePointsToLine(pointArray, smoothPasses))
        });
    }

    tempPointArrays.forEach((line) => {
        let currentTempLine = [];
        line.forEach(([currentX, currentY], index) => {
            let coordsAreWithinEraseRadius = false;
            eraseCoords.forEach(([eraseX, eraseY]) => {
                const pointIsWithinThisCircle = isPointWithinCircle(
                    eraseX,
                    eraseY,
                    eraserRadius,
                    currentX,
                    currentY
                );
                if (pointIsWithinThisCircle) {
                    coordsAreWithinEraseRadius = true;
                }
            });

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

export const deletePointsViaEraserCoords = ({
    lines,
    eraseCoords,
    eraserRadius
}) => {
    const splitLines = [];
    // go throughe very point on line
    // if next point is within polygon, add to current line
    // if not, push current line (if >= 2 length) to splitLines
    // start next line at next
    lines.forEach((line) => {
        let currentLine = [];
        line.forEach((coords) => {
            let isInEraseCoordRadius = false;
            for (let i = 0; i < eraseCoords.length; i += 1) {
                const [eraseX, eraseY] = eraseCoords[i];
                if (
                    isPointWithinCircle(
                        eraseX,
                        eraseY,
                        eraserRadius,
                        coords[0],
                        coords[1]
                    )
                ) {
                    isInEraseCoordRadius = true;
                }
                if (isInEraseCoordRadius) {
                    break;
                }
            }

            if (!isInEraseCoordRadius) {
                currentLine.push(coords);
            } else {
                // if (currentLine.length >= 2) {
                splitLines.push(currentLine);
                // }
                currentLine = [];
            }
        });
    });

    return splitLines;

    // return lines.map((line) => {
    //     return line.filter((coords) => {
    //         let isInEraseCoordRadius = false;
    //         for (let i = 0; i < eraseCoords.length; i += 1) {
    //             const [eraseX, eraseY] = eraseCoords[i];
    //             if (
    //                 isPointWithinCircle(
    //                     eraseX,
    //                     eraseY,
    //                     eraserRadius,
    //                     coords[0],
    //                     coords[1]
    //                 )
    //             ) {
    //                 isInEraseCoordRadius = true;
    //             }
    //                 if (isInEraseCoordRadius) {
    //                     break;
    //                 }
    //         }

    //         return !isInEraseCoordRadius;
    //     });
    // });
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
