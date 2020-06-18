import 'jest-canvas-mock';
import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import {
    drawLines,
    drawCircles,
    drawSquares
} from '../components/common/DrawingUtils/DrawingUtils';
import { printLinesViaFillCoords, generateLinesAtAngle } from './lineUtils';
import { getExtremePointsOfCoords } from '../plotting/plotUtils';
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
            fillCircle: true,
            radius: 30,
            fillHorizontal: true,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 1,
            angle: 0
        });
        drawLines(context, resultingLines, 1, 'black');
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });

    it('should fill lines vertically, with circle shape', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        const radius = 30;

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

        const resultingLines = printLinesViaFillCoords({
            fillCoords: zShape,
            fillCircle: true,
            radius,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 1,
            angle: 90
        });

        drawCircles(context, zShape, radius, 'red');
        drawLines(context, resultingLines, 1, 'black');
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });

    it('should fill lines vertically, with square shape', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        const radius = 30;

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

        const resultingLines = printLinesViaFillCoords({
            fillCoords: zShape,
            fillCircle: false,
            radius,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 1,
            angle: 90
        });

        drawSquares(context, zShape, 'red', radius);
        drawLines(context, resultingLines, 1, 'black');
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });

    it('should fill lines at an angle with square shape', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        const radius = 30;

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

        const resultingLines = printLinesViaFillCoords({
            fillCoords: zShape,
            fillCircle: false,
            radius,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 1,
            angle: 111
        });

        drawSquares(context, zShape, 'red', radius);
        drawLines(context, resultingLines, 1, 'black');
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });
});

describe('Draw Lines At Angle', () => {
    it('should work with angles less than 44', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        const radius = 30;
        const angle = 44;

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

        const { minX, minY, maxX, maxY } = getExtremePointsOfCoords(
            zShape,
            radius
        );
        const linesToUse = generateLinesAtAngle({
            minX,
            maxX,
            minY,
            maxY,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 1,
            angle
        });

        drawCircles(context, zShape, radius, 'red');
        drawLines(context, linesToUse, 1, 'black');
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });

    it('should work with angles less than 89', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        const radius = 30;
        const angle = 85;

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

        const { minX, minY, maxX, maxY } = getExtremePointsOfCoords(
            zShape,
            radius
        );
        const linesToUse = generateLinesAtAngle({
            minX,
            maxX,
            minY,
            maxY,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 1,
            angle
        });

        drawCircles(context, zShape, radius, 'red');
        drawLines(context, linesToUse, 1, 'black');
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });

    it('should work with angles less than 134', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        const radius = 30;
        const angle = 120;

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

        const { minX, minY, maxX, maxY } = getExtremePointsOfCoords(
            zShape,
            radius
        );
        const linesToUse = generateLinesAtAngle({
            minX,
            maxX,
            minY,
            maxY,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 1,
            angle
        });

        drawCircles(context, zShape, radius, 'red');
        drawLines(context, linesToUse, 1, 'black');
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });

    it('should work with angles less than 180', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        const radius = 30;
        const angle = 175;

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

        const { minX, minY, maxX, maxY } = getExtremePointsOfCoords(
            zShape,
            radius
        );
        const linesToUse = generateLinesAtAngle({
            minX,
            maxX,
            minY,
            maxY,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 1,
            angle
        });

        drawCircles(context, zShape, radius, 'red');
        drawLines(context, linesToUse, 1, 'black');
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });
});
