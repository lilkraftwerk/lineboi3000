import {
    isPointArrayContainerValid,
    createFakePointArrayContainer
} from '../../utils/testUtils';

import Multiply from '../Multiply';
import Wiggle from '../Wiggle';
import Distort from '../Distort';
import RemoveLines from '../RemoveLines';
import ShortenLines from '../ShortenLine';
import SplitLines from '../SplitLines';
import SplitLinesRandom from '../SplitLinesRandom';
import Simplify from '../Simplify';
import Experimental from '../Experimental';
import Dots from '../Dots';
import Move from '../Move';
import Exes from '../Exes';
import Smooth from '../Smooth';

const ALL_FILTERS = [
    Multiply,
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
