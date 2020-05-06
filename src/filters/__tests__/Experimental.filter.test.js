import { ExperimentalFilter } from '../Experimental';
import {
    isPointArrayContainerValid,
    createFakePointArrayContainer
} from '../../utils/testUtils';

describe('experimental filter', () => {
    it('returns original point array with no settings', () => {
        const pointArrays = createFakePointArrayContainer();
        const filtered = ExperimentalFilter({
            pointArrays
        });
        expect(filtered).toEqual(pointArrays);
    });

    it('returns original point array when disabled', () => {
        const pointArrays = createFakePointArrayContainer();
        const filtered = ExperimentalFilter({
            pointArrays,
            filterSettings: {
                enabled: false
            }
        });
        expect(filtered).toEqual(pointArrays);
    });

    it('returns valid point array with valid settings', () => {
        const pointArrays = createFakePointArrayContainer(2, 2);

        const filteredPointArrays = ExperimentalFilter({
            pointArrays,
            filterSettings: {
                chunkMin: 2,
                chunkMax: 3,
                enabled: true
            }
        });

        const valid = isPointArrayContainerValid(filteredPointArrays);
        expect(valid).toBe(true);
    });
});
