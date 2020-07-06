import 'jest-canvas-mock';
import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { drawLines } from '../drawingUtils';
import { createTestCanvas } from '../testUtils';
import { generateLinesAtAngle } from '../lineUtils';
import { getExtremePointsOfCoords } from '../plotUtils';
import { zShape } from '../../../tests/LineFixtures';

expect.extend({ toMatchImageSnapshot });

const imageSnapshotOptions = {
    customSnapshotsDir: 'tests/screenshots',
    customDiffDir: 'tmp/diffs',
    failureThreshold: 0.02,
    failureThresholdType: 'percent'
};

const testAngle = (angle) => {
    const { canvas, context } = createTestCanvas();
    const { minX, maxX, minY, maxY } = getExtremePointsOfCoords(zShape);
    const square = [
        [minX, minY],
        [maxX, minY],
        [maxX, maxY],
        [minX, maxY],
        [minX, minY]
    ];

    const lines = generateLinesAtAngle({
        minX,
        maxX,
        minY,
        maxY,
        distanceBetweenLines: 10,
        distanceBetweenPoints: 1,
        angle
    });

    drawLines({ context, pointArrays: lines, strokeWidth: 1, color: 'black' });
    drawLines({ context, pointArrays: [square], strokeWidth: 2, color: 'red' });

    context.fillStyle = 'black';
    context.font = 'bold 50px Arial';
    context.fillText(`angle: ${angle}`, 50, 50);
    return canvas;
};

describe('GenerateLinesAtAngle', () => {
    it('should generate lines at angle 0', () => {
        const canvas = testAngle(0);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should generate lines at angle 37', () => {
        const canvas = testAngle(37);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should generate lines at angle 45', () => {
        const canvas = testAngle(45);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should generate lines at angle 67', () => {
        const canvas = testAngle(67);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should generate lines at angle 90', () => {
        const canvas = testAngle(90);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should generate lines at angle 110', () => {
        const canvas = testAngle(110);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should generate lines at angle 130', () => {
        const canvas = testAngle(130);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should generate lines at angle 160', () => {
        const canvas = testAngle(160);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should generate lines at angle 180', () => {
        const canvas = testAngle(180);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });
});
