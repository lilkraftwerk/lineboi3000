import EfxProcessingUnit from '../EfxProcessingUnit';
import {
    createFakePointArrayContainer,
    isPointArrayContainerValid
} from '../../utils/testUtils';

const globalSettings = {
    height: 600,
    width: 800
};

const filterSettings = (enabled = true) => [
    {
        filterName: 'wiggle',
        enabled,
        percentAffect: 50,
        pixelOffset: 2
    },
    {
        filterName: 'experimental',
        enabled,
        chunkMin: 2,
        chunkMax: 5
    },
    {
        filterName: 'simplify',
        enabled,
        tolerance: 2,
        highQuality: true
    },
    {
        filterName: 'dots',
        enabled,
        additionalDots: 2,
        distance: 2
    }
];

describe('EfxProcessingUnit', () => {
    it('should return same point arrays with no filters enabled', () => {
        const pointArrays = createFakePointArrayContainer();
        const [layerID, returnedPointArrays] = EfxProcessingUnit({
            pointArrays,
            filters: filterSettings(false),
            globalSettings,
            layerID: 'doggo'
        });

        expect(layerID).toEqual('doggo');
        expect(returnedPointArrays).toEqual(pointArrays);
    });

    it('should return valid point arrays with one filter enabled', () => {
        const pointArrays = createFakePointArrayContainer();

        const [layerID, returnedPointArrays] = EfxProcessingUnit({
            pointArrays,
            filters: filterSettings().slice(0, 1),
            globalSettings,
            layerID: 'doggo'
        });

        expect(layerID).toEqual('doggo');
        expect(isPointArrayContainerValid(returnedPointArrays)).toBe(true);
    });

    it('should return same valid point arrays with all filters enabled', () => {
        const pointArrays = createFakePointArrayContainer(2, 2);

        const [layerID, returnedPointArrays] = EfxProcessingUnit({
            pointArrays,
            filters: filterSettings(true),
            globalSettings,
            layerID: 'doggo'
        });

        expect(layerID).toEqual('doggo');
        expect(isPointArrayContainerValid(returnedPointArrays)).toBe(true);
    });
});
