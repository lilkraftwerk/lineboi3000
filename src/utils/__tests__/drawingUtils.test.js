import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { prepareLines, drawLines } from '../drawingUtils';
import 'jest-canvas-mock';
import { createTestCanvas } from '../testUtils';
import { testLines } from '../../../tests/LineFixtures';

const imageSnapshotOptions = {
    failureThreshold: 0.02,
    failureThresholdType: 'percent',
    customSnapshotsDir: 'tests/screenshots',
    customDiffDir: 'tmp/diffs'
};

expect.extend({ toMatchImageSnapshot });

describe('prepareLines', () => {
    it('should format', () => {});
});

describe('drawLines', () => {
    it('should draw lines properly', () => {
        const { canvas, context } = createTestCanvas();
        const formattedLines = prepareLines(testLines);
        drawLines(context, formattedLines);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });
});
