import 'jest-canvas-mock';
import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { drawLines } from '../components/common/DrawingUtils/DrawingUtils';
import { printLinesViaFillCoords } from './lineUtils';
import { zShape } from '../testing/LineFixtures';

expect.extend({ toMatchImageSnapshot });

const { createCanvas } = require('canvas');

describe('Fill Lines', () => {
    it('should fill lines horizontally', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

        const resultingLines = printLinesViaFillCoords({
            fillCoords: zShape,
            radius: 15,
            fillHorizontal: true,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 5
        });
        drawLines(context, resultingLines, 1, 'black');
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });

    it('should fill lines vertically', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

        const resultingLines = printLinesViaFillCoords({
            fillCoords: zShape,
            radius: 15,
            fillHorizontal: false,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 5
        });
        drawLines(context, resultingLines, 1, 'black');
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });
});
