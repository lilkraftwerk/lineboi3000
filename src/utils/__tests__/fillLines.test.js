import 'jest-canvas-mock';
import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { drawLines, drawCircles, drawSquares } from '../drawingUtils';
import { createTestCanvas } from '../testUtils';
import { printLinesViaFillCoords, generateLinesAtAngle } from '../lineUtils';
import { getExtremePointsOfCoords } from '../plotUtils';
import { zShape } from '../../../tests/LineFixtures';

const imageSnapshotOptions = {
    failureThreshold: 0.1,
    failureThresholdType: 'percent',
    customSnapshotsDir: 'tests/screenshots',
    customDiffDir: 'tmp/diffs'
};

expect.extend({ toMatchImageSnapshot });

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
        drawLines(context, resultingLines, 1, 'black');
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should fill lines vertically, with circle shape', () => {
        const { canvas, context } = createTestCanvas();
        const radius = 30;

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
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should fill lines vertically, with square shape', () => {
        const { canvas, context } = createTestCanvas();
        const radius = 30;

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
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should fill lines at an angle with square shape', () => {
        const { canvas, context } = createTestCanvas();
        const radius = 30;

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
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });
});

describe('Draw Lines At Angle', () => {
    it('should work with angles less than 44', () => {
        const { canvas, context } = createTestCanvas();
        const radius = 30;
        const angle = 44;

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
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should work with angles less than 89', () => {
        const { canvas, context } = createTestCanvas();
        const radius = 30;
        const angle = 85;

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
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should work with angles less than 134', () => {
        const { canvas, context } = createTestCanvas();
        const angle = 120;
        const radius = 30;

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
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should work with angles less than 180', () => {
        const { canvas, context } = createTestCanvas();
        const radius = 30;
        const angle = 175;

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
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });
});
