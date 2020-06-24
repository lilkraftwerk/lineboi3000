import fs from 'fs';
import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

import { DistortFilter } from '../Distort';
import { drawLines } from '../../utils/drawingUtils';
import { createTestCanvas } from '../../utils/testUtils';

import 'jest-canvas-mock';
import { makeVerticalLinesPointArrays } from '../../../tests/LineFixtures';

expect.extend({ toMatchImageSnapshot });

describe('Distort filter', () => {
    it('example 1', () => {
        const { canvas, context } = createTestCanvas();
        const pointArrays = makeVerticalLinesPointArrays(600, 800, 20);
        const filtered = DistortFilter({
            pointArrays,
            filterSettings: {
                enabled: true,
                percentToAffect: 10,
                distortionAmount: 5,
                horizontal: true,
                vertival: true
            }
        });

        drawLines(context, filtered, 5, 'black');

        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        const filename = './tests/filterExamples/distort-horizontal.png';
        fs.writeFile(filename, buffer, (err) => {
            if (err) throw err;
        });
    });
});
