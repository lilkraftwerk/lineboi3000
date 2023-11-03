import {
    allPointsBetweenTwoCoords,
    distanceBetweenTwoCoords,
    isPointOnLineBetweenTwoCoords,
    roundDecimalToFourDigits
} from '../coordUtils';

describe('roundDecimalToFourDigits()', () => {
    it('should round decimals correctly', () => {
        expect(roundDecimalToFourDigits(10)).toEqual(10);
        expect(roundDecimalToFourDigits(1.9999999)).toEqual(2);
        expect(roundDecimalToFourDigits(1.5555555)).toEqual(1.5556);
        expect(roundDecimalToFourDigits(1.5555)).toEqual(1.5555);
        expect(roundDecimalToFourDigits(1.01)).toEqual(1.01);
        expect(roundDecimalToFourDigits(0.1234)).toEqual(0.1234);
    });
});

describe('allPointsBetweenTwoCoords()', () => {
    it('should return all points between two coords going forward', () => {
        const coords = allPointsBetweenTwoCoords([0, 0], [5, 5]);
        const expected = [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5]
        ];
        expect(coords).toEqual(expected);
    });

    it('should all coords with value of one', () => {
        const coords = allPointsBetweenTwoCoords([0, 0], [5, 5], {
            maxPointCount: 1
        });
        const expected = [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5]
        ];
        expect(coords).toEqual(expected);
    });

    it('should return first and last point with exactly two points', () => {
        const coords = allPointsBetweenTwoCoords([0, 0], [99, 99], {
            maxPointCount: 2
        });
        const expected = [
            [0, 0],
            [99, 99]
        ];
        expect(coords).toEqual(expected);
    });

    it('should return all points between two coords with an count of 3', () => {
        const coords = allPointsBetweenTwoCoords([0, 0], [5, 5], {
            maxPointCount: 3
        });
        const expected = [
            [0, 0],
            [2.5, 2.5],
            [5, 5]
        ];
        expect(coords).toEqual(expected);
    });

    it('should have a minimum pixel distance of one', () => {
        const coords = allPointsBetweenTwoCoords([0, 0], [5, 5], {
            maxPointCount: 100
        });
        const expected = [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5]
        ];
        expect(coords).toEqual(expected);
    });

    it('should work backwards', () => {
        const coords = allPointsBetweenTwoCoords([5, 5], [0, 0]);
        const expected = [
            [5, 5],
            [4, 4],
            [3, 3],
            [2, 2],
            [1, 1],
            [0, 0]
        ];
        expect(coords).toEqual(expected);
    });

    it('should return the right amount of points', () => {
        const coords = allPointsBetweenTwoCoords([0, 200], [17, 200], {
            maxPointCount: 17
        });
        expect(coords.length).toEqual(17);
    });

    it('should not return first coords point if param is false', () => {
        const coords = allPointsBetweenTwoCoords([0, 0], [5, 5], {
            includeStartCoords: false
        });
        const expected = [
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
            [5, 5]
        ];
        expect(coords).toEqual(expected);
    });

    it('should not return coords point if param is false', () => {
        const coords = allPointsBetweenTwoCoords([0, 0], [5, 5], {
            includeStartCoords: false,
            includeEndCoords: false
        });
        const expected = [
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4]
        ];
        expect(coords).toEqual(expected);
    });

    it('should work', () => {
        const coords = allPointsBetweenTwoCoords([12, 12], [1, 1], {
            maxPointCount: 8
        });

        const expected = [
            [12, 12],
            [10.4286, 10.4286],
            [8.8571, 8.8571],
            [7.2857, 7.2857],
            [5.7143, 5.7143],
            [4.1429, 4.1429],
            [2.5714, 2.5714],
            [1, 1]
        ];
        expect(coords).toEqual(expected);
    });
});

describe('distanceBetweenTwoCoords()', () => {
    it('should return distances properly', () => {
        expect(distanceBetweenTwoCoords([0, 0], [100, 0])).toEqual(100);
        expect(distanceBetweenTwoCoords([1, 2], [5, 5])).toEqual(5);
        expect(distanceBetweenTwoCoords([1, 2], [7, 6])).toEqual(
            7.211102550927979
        );
        expect(distanceBetweenTwoCoords([3, 12], [14, 2])).toEqual(
            14.866068747318504
        );
    });
});

describe('isPointOnLineBetweenTwoCoords()', () => {
    it('should return true when point is on line', () => {
        const startCoords = [0, 0];
        const endCoords = [100, 100];
        const result = isPointOnLineBetweenTwoCoords(
            startCoords,
            endCoords,
            [10, 10]
        );
        expect(result).toBe(true);
    });

    it('should return false when point is not on line', () => {
        const startCoords = [0, 0];
        const endCoords = [100, 100];
        const result = isPointOnLineBetweenTwoCoords(
            startCoords,
            endCoords,
            [10, 50]
        );
        expect(result).toBe(false);
    });
});
