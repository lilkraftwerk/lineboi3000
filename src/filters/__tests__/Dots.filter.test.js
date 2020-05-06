import _ from 'lodash';
import { DotsFilter } from '../Dots';
import {
    isPointArrayContainerValid,
    createFakePointArrayContainer
} from '../../utils/testUtils';

describe('Dots filter', () => {
    it('returns original point array with no settings', () => {
        const pointArrays = createFakePointArrayContainer();
        const filtered = DotsFilter({
            pointArrays
        });
        expect(filtered).toEqual(pointArrays);
    });

    it('returns original point array when disabled', () => {
        const pointArrays = createFakePointArrayContainer();
        const filtered = DotsFilter({
            pointArrays,
            filterSettings: {
                enabled: false
            }
        });
        expect(filtered).toEqual(pointArrays);
    });

    it('returns valid point array with valid settings', () => {
        const pointArrays = createFakePointArrayContainer(2, 2);
        const filteredPointArrays = DotsFilter({
            pointArrays,
            filterSettings: {
                additionalDots: 2,
                distance: 2,
                enabled: true
            }
        });

        const valid = isPointArrayContainerValid(filteredPointArrays);
        expect(valid).toBe(true);
    });

    it('returns a specific number of new point arrays and points based on settings', () => {
        const pointArrays = createFakePointArrayContainer(2, 2);
        const filteredPointArrays = DotsFilter({
            pointArrays,
            filterSettings: {
                additionalDots: 10,
                distance: 2,
                enabled: true
            }
        });

        // 11 because original point + 10 additional dots
        const allHaveCorrectLength = _.every(
            filteredPointArrays,
            container => container.length === 11
        );

        // 4 because original is 2 containers with 2 point arrays in each
        expect(filteredPointArrays.length).toEqual(4);
        expect(allHaveCorrectLength).toEqual(true);
    });
});
