import select, {
    getPointsAroundCoord,
    flatUniqueAndSortedCoords
} from '../select.mode';

describe.skip('select drawing mode', () => {
    const radius = 2;

    describe('flatAndUniqueSortedCoords', () => {
        it('does the right thing', () => {
            const coords = [10, 10];
            const tempLines = [
                [9, 9],
                [10, 10],
                [11, 11],
                [7, 7]
            ];
            const pointsAroundCoord = [
                [5, 5],
                [4, 4],
                [10, 10],
                [7, 7]
            ];
            const result = flatUniqueAndSortedCoords(
                coords,
                tempLines,
                pointsAroundCoord
            );
            expect(result).toEqual([
                [4, 4],
                [5, 5],
                [7, 7],
                [9, 9],
                [10, 10],
                [11, 11]
            ]);
        });
    });

    describe('get points around coord', () => {
        it('does the right thing', () => {
            const result = getPointsAroundCoord([10, 10], { radius });
            expect(result).toEqual([
                [9, 9],
                [9, 10],
                [9, 11],
                [10, 9],
                [10, 10],
                [10, 11],
                [11, 9],
                [11, 10],
                [11, 11]
            ]);
        });
    });

    describe('onStart', () => {
        it('returns valid points', () => {
            const result = select.onStart([10, 10], null, { radius });
            const expectedPoints = getPointsAroundCoord([10, 10], { radius });
            expect(result).toEqual(expectedPoints);
        });
    });

    describe('onMove', () => {
        it('returns valid adjacent points', () => {
            const existingPoints = getPointsAroundCoord([14, 14], { radius });
            const result = select.onMove([16, 16], existingPoints, { radius });
            expect(result).toEqual([
                [
                    [13, 13],
                    [13, 14],
                    [13, 15],
                    [14, 13],
                    [14, 14],
                    [14, 15],
                    [15, 13],
                    [15, 14],
                    [15, 15],
                    [15, 16],
                    [15, 17],
                    [16, 16],
                    [16, 15],
                    [16, 17],
                    [17, 15],
                    [17, 16],
                    [17, 17]
                ]
            ]);
        });

        it('returns valid not adjacent points', () => {
            const newCoords = [30, 30];
            const existingPoints = getPointsAroundCoord([14, 14], { radius });
            const result = select.onMove(newCoords, existingPoints, { radius });
            expect(result).toEqual([
                [
                    [13, 13],
                    [13, 14],
                    [13, 15],
                    [14, 13],
                    [14, 14],
                    [14, 15],
                    [15, 13],
                    [15, 14],
                    [15, 15],
                    [29, 29],
                    [29, 30],
                    [29, 31],
                    [30, 30],
                    [30, 29],
                    [30, 31],
                    [31, 29],
                    [31, 30],
                    [31, 31]
                ]
            ]);
        });
    });
});
