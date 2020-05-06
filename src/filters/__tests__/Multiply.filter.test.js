import {
    isPointArrayContainerValid,
    createFakePointArrayContainer
} from '../../utils/testUtils';
import { MultiplyFilter } from '../Multiply';

describe('Multiply filter', () => {
    const globalSettings = {
        height: 100,
        width: 100
    };

    it('returns original point array with no settings', () => {
        const pointArrays = createFakePointArrayContainer();
        const filtered = MultiplyFilter({
            pointArrays
        });
        expect(filtered).toEqual(pointArrays);
    });

    it('returns original point array when disabled', () => {
        const pointArrays = createFakePointArrayContainer();
        const filteredPointArrays = MultiplyFilter({
            pointArrays,
            filterSettings: {
                enabled: false
            }
        });
        expect(filteredPointArrays).toEqual(pointArrays);
    });

    it('returns valid point array with valid settings', () => {
        const pointArrays = createFakePointArrayContainer(2, 2);
        const filteredPointArrays = MultiplyFilter({
            pointArrays,
            globalSettings,
            filterSettings: {
                rectHeight: 10,
                rectWidth: 10,
                enabled: true
            }
        });

        const valid = isPointArrayContainerValid(filteredPointArrays);
        expect(valid).toBe(true);
    });

    it('returns the correct number of new point arrays and points based on settings', () => {
        const pointArrays = [
            [
                [1, 1],
                [99, 99]
            ],
            [
                [2, 2],
                [98, 98]
            ]
        ];
        const filteredPointArrays = MultiplyFilter({
            globalSettings,
            pointArrays,
            filterSettings: {
                rectHeight: 10,
                rectWidth: 10,
                enabled: true
            }
        });

        // 10width * 10height * 2 lines = 200;
        expect(filteredPointArrays.length).toEqual(200);
    });
});
