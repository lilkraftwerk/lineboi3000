import { createLineFromPointArray, getPointArraysFromLine } from '../lineUtils';
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
});
