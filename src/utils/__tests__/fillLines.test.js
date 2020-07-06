import 'jest-canvas-mock';
import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { drawLines, drawCircles, drawSquares } from '../drawingUtils';
import { createTestCanvas } from '../testUtils';
import { printLinesViaFillCoords, generateLinesAtAngle } from '../lineUtils';
import { getExtremePointsOfCoords } from '../plotUtils';
import { zShape } from '../../../tests/LineFixtures';

const imageSnapshotOptions = {
    failureThreshold: 0.02,
    failureThresholdType: 'percent',
    customSnapshotsDir: 'tests/screenshots',
    customDiffDir: 'tmp/diffs'
};

expect.extend({ toMatchImageSnapshot });

const radius = 30;

describe('Fill Lines', () => {
    it('should fill lines horizontally', () => {
        const { canvas, context } = createTestCanvas();

        const resultingLines = printLinesViaFillCoords({
            fillCoords: zShape,
            fillCircle: true,
            radius: 30,
            fillHorizontal: true,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 1,
            angle: 0
        });
        drawLines({
            context,
            pointArrays: resultingLines,
            strokeWidth: 1,
            color: 'black'
        });
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should fill lines vertically, with circle shape', () => {
        const { canvas, context } = createTestCanvas();

        const resultingLines = printLinesViaFillCoords({
            fillCoords: zShape,
            fillCircle: true,
            radius,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 1,
            angle: 90
        });

        drawCircles({ context, coords: zShape, radius, color: 'red' });
        drawLines({
            context,
            pointArrays: resultingLines,
            strokeWidth: 1,
            color: 'black'
        });
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should fill lines vertically, with square shape', () => {
        const { canvas, context } = createTestCanvas();

        const resultingLines = printLinesViaFillCoords({
            fillCoords: zShape,
            fillCircle: false,
            radius,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 1,
            angle: 90
        });

        drawSquares({ context, coords: zShape, fillStyle: 'red', radius });
        drawLines({
            context,
            pointArrays: resultingLines,
            strokeWidth: 1,
            color: 'black'
        });
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should fill lines at an angle with square shape', () => {
        const { canvas, context } = createTestCanvas();

        const linesToUse = printLinesViaFillCoords({
            fillCoords: zShape,
            fillCircle: false,
            radius,
            distanceBetweenLines: 5,
            distanceBetweenPoints: 1,
            angle: 111
        });

        drawSquares({ context, coords: zShape, fillStyle: 'red', radius });
        drawLines({
            context,
            pointArrays: linesToUse,
            strokeWidth: 1,
            color: 'black'
        });
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });
});

const testLinesAtAngle = (context, angle) => {
    const { minX, minY, maxX, maxY } = getExtremePointsOfCoords(zShape, radius);

    const linesToUse = generateLinesAtAngle({
        minX,
        maxX,
        minY,
        maxY,
        distanceBetweenLines: 5,
        distanceBetweenPoints: 1,
        angle
    });

    drawCircles({ context, coords: zShape, radius, color: 'red' });
    drawLines({
        context,
        pointArrays: linesToUse,
        strokeWidth: 1,
        color: 'black'
    });
};

describe('Draw Lines At Angle', () => {
    it('should work with angles less than 44', () => {
        const { canvas, context } = createTestCanvas();
        const angle = 44;
        testLinesAtAngle(context, angle);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should work with angles less than 89', () => {
        const { canvas, context } = createTestCanvas();
        const angle = 85;
        testLinesAtAngle(context, angle);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should work with angles less than 134', () => {
        const { canvas, context } = createTestCanvas();
        const angle = 120;
        testLinesAtAngle(context, angle);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should work with angles less than 180', () => {
        const { canvas, context } = createTestCanvas();
        const angle = 175;
        testLinesAtAngle(context, angle);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });
});
