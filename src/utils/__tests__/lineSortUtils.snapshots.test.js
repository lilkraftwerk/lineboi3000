import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { createTestCanvas } from '../testUtils';
import { drawLines } from '../drawingUtils';

import {
    sortLinesForPlotter,
    getStartAndEndPointsOfCoords
} from '../lineSortUtils';
import { drawnRandomLines } from '../../../tests/LineFixtures';
import 'jest-canvas-mock';

const imageSnapshotOptions = {
    failureThreshold: 0.02,
    failureThresholdType: 'percent',
    customSnapshotsDir: 'tests/screenshots',
    customDiffDir: 'tmp/diffs'
};

expect.extend({ toMatchImageSnapshot });

describe('Sort Lines For Plotter', () => {
    it('should mark start and end of lines properly', () => {
        const { canvas, context } = createTestCanvas();
        const pointArrays = drawnRandomLines.map((x) => x.pointArrayContainer);
        drawLines({ context, pointArrays, strokeWidth: 4, color: 'black' });

        let counter = 0;

        pointArrays.forEach((pointArray) => {
            const { start, end } = getStartAndEndPointsOfCoords(pointArray);
            context.fillStyle = 'red';
            context.font = 'bold 25px Arial';
            context.fillText(`${counter}`, start[0], start[1]);
            counter += 1;
            context.fillText(`${counter}`, end[0], end[1]);
            counter += 1;
        });

        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should sort lines properly', () => {
        const { canvas, context } = createTestCanvas();
        const sortedLines = sortLinesForPlotter(drawnRandomLines);

        const pointArrays = sortedLines.map((x) => x.pointArrayContainer);
        drawLines({ context, pointArrays, strokeWidth: 4, color: 'black' });

        let counter = 0;

        pointArrays.forEach((pointArray) => {
            const { start, end } = getStartAndEndPointsOfCoords(pointArray);
            context.fillStyle = 'red';
            context.font = 'bold 25px Arial';
            context.fillText(`${counter}`, start[0], start[1]);
            counter += 1;
            context.fillText(`${counter}`, end[0], end[1]);
            counter += 1;
        });

        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should print the same lines sorted and not sorted', () => {
        const { canvas, context } = createTestCanvas();
        const sortedLines = sortLinesForPlotter(drawnRandomLines);
        const randomPoints = drawnRandomLines.map((x) => x.pointArrayContainer);

        const sortedPoints = sortedLines.map((x) => x.pointArrayContainer);
        drawLines({
            context,
            pointArrays: randomPoints,
            strokeWidth: 4,
            color: 'black'
        });
        drawLines({
            context,
            pointArrays: sortedPoints,
            strokeWidth: 4,
            color: 'black'
        });

        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });
});
