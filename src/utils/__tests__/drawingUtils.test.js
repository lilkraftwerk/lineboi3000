import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import {
    drawLines,
    drawCircles,
    drawPoints,
    drawSquares
} from '../drawingUtils';
import 'jest-canvas-mock';
import { createTestCanvas } from '../testUtils';
import { zShape } from '../../../tests/LineFixtures';

const imageSnapshotOptions = {
    failureThreshold: 0.02,
    failureThresholdType: 'percent',
    customSnapshotsDir: 'tests/screenshots',
    customDiffDir: 'tmp/diffs'
};

expect.extend({ toMatchImageSnapshot });

describe('drawing utils', () => {
    describe('drawLines', () => {
        it('should draw lines properly', () => {
            const { canvas, context } = createTestCanvas();
            drawLines(context, [zShape]);
            const frame = new Frame(canvas);
            const buffer = frame.toBuffer();
            expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
        });
    });

    describe('drawCircles', () => {
        it('should draw circles properly', () => {
            const { canvas, context } = createTestCanvas();
            drawCircles(context, zShape, 5);
            const frame = new Frame(canvas);
            const buffer = frame.toBuffer();
            expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
        });
    });

    describe('drawPoints', () => {
        it('should draw points properly', () => {
            const { canvas, context } = createTestCanvas();
            drawPoints(context, [zShape]);
            const frame = new Frame(canvas);
            const buffer = frame.toBuffer();
            expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
        });
    });
    describe('drawSquares', () => {
        it('should draw squares properly', () => {
            const { canvas, context } = createTestCanvas();
            drawSquares(context, zShape);
            const frame = new Frame(canvas);
            const buffer = frame.toBuffer();
            expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
        });
    });

    describe('drawPointCircles', () => {
        it('should draw point circles properly', () => {
            const { canvas, context } = createTestCanvas();
            drawSquares(context, [zShape]);
            const frame = new Frame(canvas);
            const buffer = frame.toBuffer();
            expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
        });
    });
});
