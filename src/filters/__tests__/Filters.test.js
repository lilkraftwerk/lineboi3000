import {
    createFakePointArrayContainer,
    isPointArrayContainerValid
} from '../../utils/testUtils';

import Distort from '../Distort';
import Dots from '../Dots';
import Exes from '../Exes';
import Experimental from '../Experimental';
import Move from '../Move';
import RemoveLines from '../RemoveLines';
import ShortenLines from '../ShortenLine';
import Simplify from '../Simplify';
import Smooth from '../Smooth';
import SplitLines from '../SplitLines';
import SplitLinesRandom from '../SplitLinesRandom';
import Wiggle from '../Wiggle';

const ALL_FILTERS = [
    Wiggle,
    Distort,
    RemoveLines,
    ShortenLines,
    SplitLines,
    SplitLinesRandom,
    Simplify,
    Experimental,
    Dots,
    Move,
    Exes,
    Smooth
];

ALL_FILTERS.forEach(({ name, filter, initSettings }) => {
    describe(`${name} filter`, () => {
        it('returns original point array with no settings', () => {
            const pointArrays = createFakePointArrayContainer();
            const filtered = filter({
                pointArrays
            });
            expect(filtered).toEqual(pointArrays);
        });

        it('returns original point array when disabled', () => {
            const pointArrays = createFakePointArrayContainer();
            const filtered = filter({
                pointArrays,
                filterSettings: {
                    enabled: false
                }
            });
            expect(filtered).toEqual(pointArrays);
        });

        it('returns valid point array with valid settings', () => {
            const pointArrays = createFakePointArrayContainer(5, 5);

            const filteredPointArrays = filter({
                pointArrays,
                filterSettings: initSettings
            });

            const valid = isPointArrayContainerValid(filteredPointArrays);
            expect(valid).toBe(true);
        });
    });
});
