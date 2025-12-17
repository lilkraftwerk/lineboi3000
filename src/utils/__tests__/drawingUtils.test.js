import 'jest-canvas-mock';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { zShape } from '../../../tests/LineFixtures';
import {
    drawCircles,
    drawLines,
    drawPointCircles,
    drawPoints,
    drawSquares
} from '../drawingUtils';
import { createTestCanvas } from '../testUtils';

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
            drawLines({ context, pointArrays: [zShape] });
            const buffer = canvas.toBuffer('image/png');
            expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
        });
    });

    describe('drawCircles', () => {
        it('should draw circles properly', () => {
            const { canvas, context } = createTestCanvas();
            drawCircles({ context, coords: zShape, radius: 5 });
            const buffer = canvas.toBuffer('image/png');
            expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
        });
    });

    describe('drawPoints', () => {
        it('should draw points properly', () => {
            const { canvas, context } = createTestCanvas();
            drawPoints({ context, coords: [zShape] });
            const buffer = canvas.toBuffer('image/png');
            expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
        });
    });
    describe('drawSquares', () => {
        it('should draw squares properly', () => {
            const { canvas, context } = createTestCanvas();
            drawSquares({ context, coords: [zShape] });
            const buffer = canvas.toBuffer('image/png');
            expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
        });
    });

    describe('drawPointCircles', () => {
        it('should draw point circles properly', () => {
            const { canvas, context } = createTestCanvas();
            drawPointCircles({ context, coords: [zShape] });
            const buffer = canvas.toBuffer('image/png');
            expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
        });
    });
});
