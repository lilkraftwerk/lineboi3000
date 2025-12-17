import 'jest-canvas-mock';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import _ from 'lodash';
import { makeVerticalLinesPointArrays } from '../../../tests/LineFixtures';
import { allPointsBetweenTwoCoords } from '../coordUtils';
import { drawCircles, drawLines, drawPoints } from '../drawingUtils';
import { isPointWithinCircle, splitLinesViaEraserCoords } from '../lineUtils';
import { createTestCanvas } from '../testUtils';

const imageSnapshotOptions = {
    failureThreshold: 0.02,
    failureThresholdType: 'percent',
    customSnapshotsDir: 'tests/screenshots',
    customDiffDir: 'tmp/diffs'
};

expect.extend({ toMatchImageSnapshot });

describe('Split Lines', () => {
    it('should split lines properly', () => {
        const { canvas, context } = createTestCanvas();
        const eraserRadius = 15;

        const eraseLine = allPointsBetweenTwoCoords([0, 50], [800, 50], {
            maxPointCount: 100
        });

        const eraseLineTwo = allPointsBetweenTwoCoords([0, 300], [800, 300], {
            maxPointCount: 100
        });

        const eraseLineThree = allPointsBetweenTwoCoords([0, 450], [800, 450], {
            maxPointCount: 100
        });

        const eraseLineFour = allPointsBetweenTwoCoords([0, 0], [500, 500], {
            maxPointCount: 100
        });

        const eraseCoords = [
            eraseLine,
            eraseLineThree,
            eraseLineTwo,
            eraseLineFour
        ].flat();

        const testLines = makeVerticalLinesPointArrays(600, 800, 20);
        drawLines({
            context,
            pointArrays: [
                eraseLine,
                eraseLineThree,
                eraseLineTwo,
                eraseLineFour
            ],
            strokeWidth: eraserRadius,
            color: 'red'
        });

        const splitLines = splitLinesViaEraserCoords({
            lines: testLines,
            eraseCoords,
            eraserRadius,
            smoothOriginalLines: true,
            smoothPasses: 1
        });

        drawLines({ context, pointArrays: splitLines });
        const buffer = canvas.toBuffer('image/png');
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });
});

describe('isPointWithinCircle', () => {
    it('should highlight all points within a circle with edges', () => {
        const { canvas, context } = createTestCanvas();

        const circleLocations = [
            [100, 100],
            [350, 350],
            [500, 500]
        ];

        const radius = 30;

        const allPoints = [];
        for (let x = 0; x < 800; x += 10) {
            for (let y = 0; y < 600; y += 10) {
                allPoints.push([x, y]);
            }
        }

        const finalPoints = [];

        allPoints.forEach(([currentX, currentY]) => {
            const isInAnyCircle = _.some(
                circleLocations,
                ([circleX, circleY]) => {
                    return isPointWithinCircle(
                        circleX,
                        circleY,
                        radius,
                        currentX,
                        currentY,
                        true
                    );
                }
            );
            if (!isInAnyCircle) {
                finalPoints.push([currentX, currentY]);
            }
        });

        drawCircles({ context, coords: circleLocations, radius, color: 'red' });
        drawPoints({ context, coords: finalPoints });

        const buffer = canvas.toBuffer('image/png');
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });

    it('should highlight all points within a circle without edges', () => {
        const { canvas, context } = createTestCanvas();

        const circleLocations = [
            [100, 100],
            [350, 350],
            [500, 500]
        ];

        const radius = 30;

        const allPoints = [];
        for (let x = 0; x < 800; x += 10) {
            for (let y = 0; y < 600; y += 10) {
                allPoints.push([x, y]);
            }
        }

        const finalPoints = [];

        allPoints.forEach(([currentX, currentY]) => {
            const isInAnyCircle = _.some(
                circleLocations,
                ([circleX, circleY]) => {
                    return isPointWithinCircle(
                        circleX,
                        circleY,
                        radius,
                        currentX,
                        currentY,
                        false
                    );
                }
            );
            if (!isInAnyCircle) {
                finalPoints.push([currentX, currentY]);
            }
        });
        drawCircles({ context, coords: circleLocations, radius, color: 'red' });
        drawPoints({ context, coords: finalPoints });

        const buffer = canvas.toBuffer('image/png');
        expect(buffer).toMatchImageSnapshot(imageSnapshotOptions);
    });
});
