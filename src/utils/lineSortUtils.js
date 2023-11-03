import _ from 'lodash';
import { distanceBetweenTwoCoords } from './coordUtils';

export const getStartAndEndPointsOfCoords = (coords) => {
    return {
        start: _.first(coords),
        end: _.last(coords)
    };
};

export const findNearestLine = (currentLine, remainingLines) => {
    const results = [];
    const currentLineEnd = getStartAndEndPointsOfCoords(
        currentLine.pointArrayContainer
    ).end;

    remainingLines.forEach(({ id, pointArrayContainer }) => {
        const { start, end } =
            getStartAndEndPointsOfCoords(pointArrayContainer);

        const startDistance = distanceBetweenTwoCoords(currentLineEnd, start);
        const endDistance = distanceBetweenTwoCoords(currentLineEnd, end);

        const smallestDistance = _.min([startDistance, endDistance]);

        if (smallestDistance === endDistance) {
            results.push({
                id,
                distance: smallestDistance,
                end: true
            });
        } else {
            results.push({
                id,
                distance: smallestDistance,
                end: false
            });
        }
    });

    const { id, end } = _.minBy(results, 'distance');

    return {
        id,
        reverse: end
    };
};

export const sortLinesForPlotter = (lines) => {
    // to do add option that doesn't reverse line direction
    let clonedLines = _.clone(lines);
    const firstLine = clonedLines.shift();
    const sortedLines = [firstLine];

    while (sortedLines.length < lines.length) {
        const lastLine = _.last(sortedLines);

        const { id, reverse } = findNearestLine(lastLine, clonedLines);

        const foundLine = _.find(clonedLines, (clonedLine) => {
            return clonedLine.id === id;
        });

        clonedLines = clonedLines.filter((clonedLine) => {
            return clonedLine.id !== id;
        });

        if (foundLine) {
            if (reverse) {
                sortedLines.push({
                    id: foundLine.id,
                    pointArrayContainer: foundLine.pointArrayContainer.reverse()
                });
            } else {
                sortedLines.push(foundLine);
            }
        }
    }
    return sortedLines;
};
