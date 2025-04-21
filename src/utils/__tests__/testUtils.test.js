import {
    createFakePoint,
    createFakePointArray,
    createFakePointArrayContainer,
    isLineValid,
    isPointArrayContainerValid,
    isPointArrayValid
} from '../testUtils';

describe('Test Utils', () => {
    describe('createFakePoint()', () => {
        it('creates a point with right length', () => {
            const fakePoint = createFakePoint();
            expect(fakePoint.length).toEqual(2);
        });

        it('creates a point with two numbers', () => {
            const [x, y] = createFakePoint();
            const xIsNum = typeof x === 'number';
            const yIsNum = typeof y === 'number';
            expect(xIsNum).toBe(true);
            expect(yIsNum).toBe(true);
        });

        it('creates a point with two numbers 0 or greater', () => {
            const [x, y] = createFakePoint();
            expect(x >= 0).toBe(true);
            expect(y >= 0).toBe(true);
        });
    });

    describe('createFakePointArray()', () => {
        it('creates a point array with right length', () => {
            const fakePointArray = createFakePointArray(10);
            expect(fakePointArray.length).toEqual(10);
        });
    });

    describe('createFakePointArrayContainer()', () => {
        it('creates an array with valid point arrays', () => {
            const fakePointArrayContainer = createFakePointArrayContainer();
            const allAreValid = fakePointArrayContainer.every(isPointArrayValid);
            expect(allAreValid).toEqual(true);
        });
    });

    describe('isPointArrayValid()', () => {
        it('returns true when point array is valid', () => {
            const pointArray = [
                [0, 10],
                [10, 15]
            ];
            expect(isPointArrayValid(pointArray)).toBe(true);
        });

        it('returns string reason when points are of wrong length', () => {
            const pointArray = [[0, 10], [10]];
            expect(isPointArrayValid(pointArray)).toEqual(['length wrong']);
        });

        it('returns string reason when points are of wrong type', () => {
            const pointArray = [
                [0, 10],
                ['cat', 'dog']
            ];
            expect(isPointArrayValid(pointArray)).toEqual([
                'contains non-numbers'
            ]);
        });

        it('returns string reason when points are negative', () => {
            const pointArray = [
                [-10, -10],
                [10, 10]
            ];
            expect(isPointArrayValid(pointArray)).toEqual([
                'contains negative numbers'
            ]);
        });

        it('returns multiple reasons when multiple errors are found', () => {
            const pointArray = [[10], [-10, 10], ['cat', 'dog'], [1, 2]];
            expect(isPointArrayValid(pointArray).sort()).toEqual(
                [
                    'contains negative numbers',
                    'contains non-numbers',
                    'length wrong'
                ].sort()
            );
        });
    });

    describe('isPointArrayContainerValid()', () => {
        it('returns true when point array container is valid', () => {
            const fakePointArrayContainer = [
                [
                    [10, 10],
                    [20, 20]
                ],
                [
                    [10, 10],
                    [20, 20]
                ]
            ];
            expect(isPointArrayContainerValid(fakePointArrayContainer)).toEqual(
                true
            );
        });

        it('returns false when point array container is not', () => {
            const fakePointArrayContainer = [
                [[10, 10], ['cat']],
                [
                    [10, 10],
                    [20, 20]
                ]
            ];
            expect(isPointArrayContainerValid(fakePointArrayContainer)).toEqual(
                false
            );
        });
    });

    describe('isLineValid()', () => {
        it('returns false with no line', () => {
            expect(isLineValid()).toEqual(['no line supplied']);
        });

        it('returns false when line has no id', () => {
            const pointArrayContainer = [
                [
                    [10, 10],
                    [20, 20]
                ],
                [
                    [10, 10],
                    [20, 20]
                ]
            ];

            const line = {
                pointArrayContainer
            };

            expect(isLineValid(line)).toEqual(['no id or id is not a string']);
        });

        it('returns false when line has invalid id', () => {
            const pointArrayContainer = [
                [
                    [10, 10],
                    [20, 20]
                ],
                [
                    [10, 10],
                    [20, 20]
                ]
            ];

            const line = {
                id: 1000,
                pointArrayContainer
            };

            expect(isLineValid(line)).toEqual(['no id or id is not a string']);
        });

        it('returns false when line has non-array point array container', () => {
            const pointArrayContainer = {};

            const line = {
                id: '_cats',
                pointArrayContainer
            };

            expect(isLineValid(line)).toEqual([
                'pointArrayContainer is not an array',
                'pointArrayContainer is not valid'
            ]);
        });

        it('returns false with invalid point array container', () => {
            const pointArrayContainer = [['cat']];

            const line = {
                id: '_cats',
                pointArrayContainer
            };

            expect(isLineValid(line)).toEqual([
                'pointArrayContainer is not valid'
            ]);
        });

        it('returns true when everything is valid', () => {
            const pointArrayContainer = [
                [
                    [10, 10],
                    [20, 20]
                ],
                [
                    [10, 10],
                    [20, 20]
                ]
            ];

            const line = {
                id: '_cats',
                pointArrayContainer
            };

            expect(isLineValid(line)).toEqual(true);
        });
    });
});
