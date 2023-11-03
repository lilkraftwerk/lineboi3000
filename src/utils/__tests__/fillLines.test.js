import 'jest-canvas-mock';
import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { drawLines, drawCircles, drawSquares } from '../drawingUtils';
import { createTestCanvas } from '../testUtils';
import {
    printLinesViaFillCoords,
    generateLinesAtAngle,
    printFillLinesForCircle
} from '../lineUtils';
import { getExtremePointsOfCoords } from '../plotUtils';
import { zShape, circleLine } from '../../../tests/LineFixtures';

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

const ANGLES = [
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
    170, 180
];

describe('Draw Lines At Angle', () => {
    ANGLES.forEach((angle) => {
        it(`should draw lines at angle ${angle}`, () => {
            const { canvas, context } = createTestCanvas();
            testLinesAtAngle(context, angle);
            const frame = new Frame(canvas);
            const buffer = frame.toBuffer();
            expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
        });
    });
});

const circleOptions = {
    circleLine,
    distanceBetweenPoints: 1,
    distanceBetweenLines: 10
};

const lineOptions = {
    strokeWidth: 1,
    color: 'black'
};

describe('printFillLinesForCircle', () => {
    ANGLES.forEach((angle) => {
        it(`should fill circle at angle ${angle}`, () => {
            const { canvas, context } = createTestCanvas();
            const lines = printFillLinesForCircle({
                angle,
                ...circleOptions
            });
            drawLines({
                context,
                pointArrays: lines,
                ...lineOptions
            });
            const frame = new Frame(canvas);
            const buffer = frame.toBuffer();
            expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
        });
    });
});
