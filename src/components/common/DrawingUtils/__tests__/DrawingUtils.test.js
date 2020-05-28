import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { prepareLines, drawLines } from '../DrawingUtils';
import 'jest-canvas-mock';

import {
    testLines,
} from '../../../../../testing/LineFixtures';

expect.extend({ toMatchImageSnapshot });

const { createCanvas } = require('canvas');

describe('prepareLines', () => {
    it('should format', () => {

    });
});

describe('drawLines', () => {
    it('should draw lines properly', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');
        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();
        const formattedLines = prepareLines(testLines);
        drawLines(context, formattedLines);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });
});
