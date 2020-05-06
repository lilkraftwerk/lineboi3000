import { WiggleFilter } from '../Wiggle';
import {
    isPointArrayContainerValid,
    createFakePointArrayContainer
} from '../../utils/testUtils';

describe('Wiggle filter', () => {
    it('returns original point array with no settings', () => {
        const pointArrays = createFakePointArrayContainer();
        const filtered = WiggleFilter({
            pointArrays
        });
        expect(filtered).toEqual(pointArrays);
    });

    it('returns original point array when disabled', () => {
        const pointArrays = createFakePointArrayContainer();
        const filtered = WiggleFilter({
            pointArrays,
            filterSettings: {
                enabled: false
            }
        });
        expect(filtered).toEqual(pointArrays);
    });

    it('returns valid point array with valid settings', () => {
        const pointArrays = createFakePointArrayContainer(2, 2);

        const filteredPointArrays = WiggleFilter({
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
