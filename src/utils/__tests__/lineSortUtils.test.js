import _ from 'lodash';

import {
    getStartAndEndPointsOfCoords,
    findNearestLine,
    sortLinesForPlotter
} from '../lineSortUtils';

import { addPercentageCoordinatesToLine } from '../plotUtils';

import { zShape, drawnRandomLines } from '../../../tests/LineFixtures';

describe('getStartAndEndPointsOfLine', () => {
    it('should get the start and end of a set of coords properly', () => {
        const result = getStartAndEndPointsOfCoords(zShape);
        expect(result.start).toEqual([230, 111]);
        expect(result.end).toEqual([513, 360]);
    });
});

describe('sortLinesForPlotter', () => {
    it('should return the same number of lines', () => {
        const result = sortLinesForPlotter(drawnRandomLines);
        expect(result.length).toEqual(10);
    });

    it('should return the same line IDs', () => {
        const result = sortLinesForPlotter(drawnRandomLines);
        const originals = new Set(drawnRandomLines.map((line) => line.id));
        const results = new Set(result.map((line) => line.id));

        expect(results).toEqual(originals);
    });

    it('should have the exact same coords', () => {
        const result = sortLinesForPlotter(drawnRandomLines);

        const getSortedCoords = (lines) => {
            const justPointArrays = lines.map((x) => x.pointArrayContainer);
            const flat = _.flatten(justPointArrays);
            const strings = flat.map((y) => y.toString());
            return _.flatten(strings).sort();
        };

        const sortedOriginal = getSortedCoords(drawnRandomLines);
        const sortedNew = getSortedCoords(result);

        expect(sortedOriginal).toEqual(sortedNew);
    });
});

describe('sortLines with percentages', () => {
    it('should create the same percentages sorted and not', () => {
        const paperHeightInPixels = 600;
        const paperWidthInPixels = 800;
        const sortedRandom = sortLinesForPlotter(drawnRandomLines);

        const mappedSorted = sortedRandom.map((line) =>
            addPercentageCoordinatesToLine(
                line,
                paperWidthInPixels,
                paperHeightInPixels
            )
        );

        const mappedOriginal = drawnRandomLines.map((line) =>
            addPercentageCoordinatesToLine(
                line,
                paperWidthInPixels,
                paperHeightInPixels
            )
        );

        const justPercentages = (line) =>
            _.flatten(line.map((x) => x.percentageCoordinates));

        const sortedCoords = justPercentages(mappedSorted)
            .map((y) => y.toString())
            .sort();
        const originalCoords = justPercentages(mappedOriginal)
            .map((y) => y.toString())
            .sort();
        expect(sortedCoords).toEqual(originalCoords);
    });
});

describe('findNearestLine', () => {
    const remainingLines = [
        {
            id: 'b',
            pointArrayContainer: [
                [305, 305],
                [200, 200],
                [900, 900]
            ]
        },
        {
            id: 'c',
            pointArrayContainer: [
                [700, 700],
                [200, 200],
                [100, 100]
            ]
        },
        {
            id: 'd',
            pointArrayContainer: [
                [50, 50],
                [200, 200],
                [500, 500]
            ]
        }
    ];

    it('should find nearest line to current line endpoint by start or endpoints', () => {
        const currentLine = {
            id: 'a',
            pointArrayContainer: [
                [100, 100],
                [200, 200],
                [300, 300]
            ]
        };

        const { id, reverse } = findNearestLine(currentLine, remainingLines);
        expect(id).toEqual('b');
        expect(reverse).toEqual(false);
    });

    it('should find nearest line to current line if endpoint', () => {
        const currentLine = {
            id: 'a',
            pointArrayContainer: [
                [100, 100],
                [200, 200],
                [99, 99]
            ]
        };

        const { id, reverse } = findNearestLine(currentLine, remainingLines);
        expect(id).toEqual('c');
        expect(reverse).toEqual(true);
    });
});
