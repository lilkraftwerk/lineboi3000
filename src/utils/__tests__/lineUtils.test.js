import {
    createLineFromPointArray,
    addIntermediatePointsToLine,
    isPointWithinCircle,
    closestPointOnCircleFromCoords,
    getPointArraysFromLine,
    allPointsWithinRadiusOfCoord
} from '../lineUtils';
import { isLineValid } from '../testUtils';

describe('line utils', () => {
    const pointArrayContainer = [
        [
            [1, 2],
            [3, 4]
        ],
        [
            [5, 6],
            [7, 8]
        ]
    ];

    describe('getPointArrayContainersFromLine', () => {
        it('should return just point arrays from a line', () => {
            const fakeLine = {
                id: 'doggo',
                pointArrayContainer
            };

            expect(getPointArraysFromLine(fakeLine)).toEqual(
                pointArrayContainer
            );
        });
    });

    describe('createLinesFromPointArrayContainers', () => {
        it('should create valid lines from point arrays', () => {
            const line = createLineFromPointArray(pointArrayContainer);

            expect(isLineValid(line)).toBe(true);
        });
    });

    describe.skip('allPointsWithinRadiusOfCoord', () => {
        it('should generate every point within a given radius of a coordinate', () => {
            const result = allPointsWithinRadiusOfCoord(50, 50, 5);
            expect(result).toEqual(true);
        });
    });

    describe.skip('closestPointFromCoordsToCircle', () => {
        it('should work true when point is within circle', () => {
            const result = closestPointOnCircleFromCoords(5, 5, 50, 50, 5);
            expect(result).toEqual(true);
        });
    });

    describe('isPointWithinCircle', () => {
        it('should return true when point is within circle', () => {
            const result = isPointWithinCircle(50, 50, 10, 55, 55);
            expect(result).toEqual(true);
        });

        it('should work with floats', () => {
            const result = isPointWithinCircle(50, 50, 10, 53.2, 53.2);
            expect(result).toEqual(true);
        });

        it('should return false when point is not within circle', () => {
            const result = isPointWithinCircle(50, 50, 10, 90, 100);
            expect(result).toEqual(false);
        });
    });

    describe('addIntermediatePointsToLine', () => {
        it('should add intermediate points to line', () => {
            const currentTest = [
                [0, 0],
                [10, 10],
                [20, 20]
            ];

            const expected = [
                [0, 0],
                [5, 5],
                [10, 10],
                [15, 15],
                [20, 20]
            ];

            const result = addIntermediatePointsToLine(currentTest);
            expect(result).toEqual(expected);
        });

        it('should work with multiple passes', () => {
            const currentTest = [
                [0, 0],
                [10, 10],
                [20, 20]
            ];

            const expected = [
                [0, 0],
                [2.5, 2.5],
                [5, 5],
                [7.5, 7.5],
                [10, 10],
                [12.5, 12.5],
                [15, 15],
                [17.5, 17.5],
                [20, 20]
            ];

            const result = addIntermediatePointsToLine(currentTest, 2);
            expect(result).toEqual(expected);
        });
    });
});
