import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
// to do move those utils to utils folder
import {
    prepareLines,
    drawLines
} from '../components/common/DrawingUtils/DrawingUtils';
import { allPointsBetweenTwoCoords } from './coordUtils';
import { splitLinesViaEraserCoords } from './lineUtils';

import 'jest-canvas-mock';

import { makeVerticalLinesPointArrays } from '../testing/LineFixtures';

expect.extend({ toMatchImageSnapshot });

const { createCanvas } = require('canvas');

describe('Split Lines', () => {
    it('should split lines properly', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

        const eraserRadius = 15;

        const eraseLine = allPointsBetweenTwoCoords([0, 50], [800, 50], {
            maxPointCount: 100
        });

        const eraseLineTwo = allPointsBetweenTwoCoords([0, 300], [800, 300], {
            maxPointCount: 100
        });

        const eraseLineThree = allPointsBetweenTwoCoords([0, 450], [800, 450], {
            maxPointCount: 100
        });

        const eraseLineFour = allPointsBetweenTwoCoords([0, 0], [500, 500], {
            maxPointCount: 100
        });

        const eraseCoords = [
            eraseLine,
            eraseLineThree,
            eraseLineTwo,
            eraseLineFour
        ].flat();

        const testLines = makeVerticalLinesPointArrays(600, 800, eraserRadius);
        drawLines(
            context,
            [eraseLine, eraseLineThree, eraseLineTwo, eraseLineFour],
            15,
            'red'
        );

        const splitLines = splitLinesViaEraserCoords({
            lines: testLines,
            eraseCoords,
            eraserRadius,
            smoothOriginalLines: true,
            smoothPasses: 1
        });

        drawLines(context, splitLines);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });
});
