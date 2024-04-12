import {
    addPercentageCoordinatesToLine,
    coordsToPercent,
    getExtremePointsOfLines,
    makePercentage,
    moveLine,
    scaleLine
    // centerLines
} from '../plotUtils';

describe('makePercentage()', () => {
    it('should do percentages correctly', () => {
        expect(makePercentage(0, 100)).toEqual(0);
        expect(makePercentage(100, 100)).toEqual(100);
        expect(makePercentage(50, 100)).toEqual(50);
        expect(makePercentage(1, 3)).toEqual(33.3333);
    });
});

describe('coordsToPercent()', () => {
    test('full values', () => {
        const coords = [100, 100];
        expect(coordsToPercent(coords, 100, 100)).toEqual([100, 100]);
    });

    test('min values', () => {
        const coords = [0, 0];
        expect(coordsToPercent(coords, 100, 100)).toEqual([0, 0]);
    });

    test('intermediate values', () => {
        const coords = [425, 550];
        expect(coordsToPercent(coords, 1100, 850)).toEqual([50, 50]);
    });

    test('intermediate values', () => {
        const coords = [100, 900];
        expect(coordsToPercent(coords, 1000, 1000)).toEqual([10, 90]);
    });
});

describe('addPercentageCoordinatesToLine()', () => {
    test('it should convert a line to percentages', () => {
        const line = {
            pointArrayContainer: [
                [10, 10],
                [20, 20],
                [45, 45]
            ]
        };

        const result = addPercentageCoordinatesToLine(line, 50, 50);
        expect(result.percentageCoordinates).toEqual([
            [20, 20],
            [40, 40],
            [90, 90]
        ]);
    });
});

describe('scaleLine()', () => {
    test('it should scale a line down', () => {
        const line = {
            pointArrayContainer: [
                [10, 10],
                [20, 20],
                [45, 45]
            ]
        };

        const result = scaleLine(line, 0.5);
        expect(result.pointArrayContainer).toEqual([
            [5, 5],
            [10, 10],
            [22.5, 22.5]
        ]);
    });

    test('it should scale a line up', () => {
        const line = {
            pointArrayContainer: [
                [10, 10],
                [20, 20],
                [45, 45]
            ]
        };

        const result = scaleLine(line, 1.5);
        expect(result.pointArrayContainer).toEqual([
            [15, 15],
            [30, 30],
            [67.5, 67.5]
        ]);
    });

    test('it should do nothing at 100% scale', () => {
        const line = {
            pointArrayContainer: [
                [10, 10],
                [20, 20],
                [45, 45]
            ]
        };

        const result = scaleLine(line, 1);
        expect(result.pointArrayContainer).toEqual([
            [10, 10],
            [20, 20],
            [45, 45]
        ]);
    });
});

describe('moveLine()', () => {
    test('it should move a line with positive values', () => {
        const line = {
            pointArrayContainer: [
                [10, 10],
                [20, 20],
                [45, 45]
            ]
        };

        const result = moveLine(line, { xOffset: 10, yOffset: 10 });
        expect(result.pointArrayContainer).toEqual([
            [20, 20],
            [30, 30],
            [55, 55]
        ]);
    });

    test('it should move a line with negative values', () => {
        const line = {
            pointArrayContainer: [
                [30, 30],
                [40, 40],
                [65, 65]
            ]
        };

        const result = moveLine(line, { xOffset: -10, yOffset: -10 });
        expect(result.pointArrayContainer).toEqual([
            [20, 20],
            [30, 30],
            [55, 55]
        ]);
    });

    test('it should do nothing with no offsets', () => {
        const line = {
            pointArrayContainer: [
                [10, 10],
                [20, 20],
                [45, 45]
            ]
        };

        const result = moveLine(line);
        expect(result.pointArrayContainer).toEqual([
            [10, 10],
            [20, 20],
            [45, 45]
        ]);
    });
});

describe('getExtremePointsOfLines()', () => {
    it('should get the proper height and width of a set of lines', () => {
        const lineOne = {
            pointArrayContainer: [
                [3, 0],
                [1, 17]
            ]
        };
        const lineTwo = {
            pointArrayContainer: [
                [3, 16],
                [31, 16]
            ]
        };

        const { totalLinesWidth, totalLinesHeight } = getExtremePointsOfLines([
            lineOne,
            lineTwo
        ]);
        expect(totalLinesWidth).toEqual(30);
        expect(totalLinesHeight).toEqual(17);
    });

    it('should get the max values', () => {
        const lineOne = {
            pointArrayContainer: [
                [13, 19],
                [97, 19]
            ]
        };
        const lineTwo = {
            pointArrayContainer: [
                [54, 32],
                [31, 20]
            ]
        };
        const lineThree = {
            pointArrayContainer: [
                [14, 100],
                [25, 100]
            ]
        };

        const { maxX, maxY, minX, minY } = getExtremePointsOfLines([
            lineOne,
            lineTwo,
            lineThree
        ]);
        expect(maxX).toEqual(97);
        expect(maxY).toEqual(100);
        expect(minX).toEqual(13);
        expect(minY).toEqual(19);
    });
});

describe('centerLines()', () => {
    it.skip('should move lines to center', () => {
        // const squareOne = {
        //     pointArrayContainer: [
        //         [10, 10],
        //         [10, 60],
        //         [60, 60],
        //         [60, 10],
        //         [10, 10]
        //     ]
        // };
        // const squareTwo = {
        //     pointArrayContainer: [
        //         [225, 225],
        //         [225, 275],
        //         [275, 275],
        //         [275, 225],
        //         [225, 225]
        //     ]
        // };
        // const result = centerLines([squareOne, squareTwo], {});
    });

    it('should get the max values', () => {
        const lineOne = {
            pointArrayContainer: [
                [13, 19],
                [97, 19]
            ]
        };
        const lineTwo = {
            pointArrayContainer: [
                [54, 32],
                [31, 20]
            ]
        };
        const lineThree = {
            pointArrayContainer: [
                [14, 100],
                [25, 100]
            ]
        };

        const { maxX, maxY, minX, minY } = getExtremePointsOfLines([
            lineOne,
            lineTwo,
            lineThree
        ]);
        expect(maxX).toEqual(97);
        expect(maxY).toEqual(100);
        expect(minX).toEqual(13);
        expect(minY).toEqual(19);
    });
});
