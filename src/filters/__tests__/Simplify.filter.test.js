import _ from 'lodash';
import { SimplifyFilter } from '../Simplify';
import {
    isPointArrayContainerValid,
    createFakePointArrayContainer
} from '../../utils/testUtils';

describe('Simplify filter', () => {
    it('returns original point array with no settings', () => {
        const pointArrays = createFakePointArrayContainer();
        const filtered = SimplifyFilter({
            pointArrays
        });
        expect(filtered).toEqual(pointArrays);
    });

    it('returns original point array when disabled', () => {
        const pointArrays = createFakePointArrayContainer();
        const filtered = SimplifyFilter({
            pointArrays,
            filterSettings: {
                enabled: false
            }
        });
        expect(filtered).toEqual(pointArrays);
    });

    it('returns valid point array with valid settings', () => {
        const pointArrays = createFakePointArrayContainer(2, 2);

        const filteredPointArrays = SimplifyFilter({
            pointArrays,
            filterSettings: {
                tolerance: 2,
                highQuality: true,
                enabled: true
            }
        });

        const valid = isPointArrayContainerValid(filteredPointArrays);
        expect(valid).toBe(true);
    });
});
