import fs from 'node:fs';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

import {
    makeHorizontalLinesPointArrays,
    makeVerticalLinesPointArrays
} from '../../../tests/LineFixtures';
import { drawLines } from '../../utils/drawingUtils';
import { createTestCanvas } from '../../utils/testUtils';

import 'jest-canvas-mock';

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

expect.extend({ toMatchImageSnapshot });

ALL_FILTERS.forEach(({ name, filter, initSettings }) => {
    describe(`${name} filter - vertical`, () => {
        it('vertical', () => {
            const { canvas, context } = createTestCanvas();
            const pointArrays = makeHorizontalLinesPointArrays(600, 800, 20);
            const filtered = filter({
                pointArrays,
                filterSettings: {
                    ...initSettings()
                }
            });

            drawLines({
                context,
                pointArrays: filtered,
                strokeWidth: 5,
                color: 'black'
            });

            const buffer = canvas.toBuffer('image/png');
            const filename = `./tests/filterExamples/${name}-horizontal.png`;
            fs.writeFile(filename, buffer, (err) => {
                if (err) throw err;
            });
        });
    });

    describe(`${name} filter - vertical`, () => {
        it('vertical', () => {
            const { canvas, context } = createTestCanvas();
            const pointArrays = makeVerticalLinesPointArrays(600, 800, 20);
            const filtered = filter({
                pointArrays,
                filterSettings: {
                    ...initSettings()
                }
            });

            drawLines({
                context,
                pointArrays: filtered,
                strokeWidth: 5,
                color: 'black'
            });

            const buffer = canvas.toBuffer('image/png');
            const filename = `./tests/filterExamples/${name}-vertical.png`;
            fs.writeFile(filename, buffer, (err) => {
                if (err) throw err;
            });
        });
    });

    it('squares', () => {
        const { canvas, context } = createTestCanvas();
        const horiz = makeHorizontalLinesPointArrays(600, 800, 20);
        const vert = makeVerticalLinesPointArrays(600, 800, 20);
        const pointArrays = [...horiz, ...vert];
        const filtered = filter({
            pointArrays,
            filterSettings: {
                ...initSettings()
            }
        });

        drawLines({
            context,
            pointArrays: filtered,
            strokeWidth: 5,
            color: 'black'
        });

        const buffer = canvas.toBuffer('image/png');
        const filename = `./tests/filterExamples/${name}-squares.png`;
        fs.writeFile(filename, buffer, (err) => {
            if (err) throw err;
        });
    });
});
