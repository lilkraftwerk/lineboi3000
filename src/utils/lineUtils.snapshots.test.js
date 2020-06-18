import _ from 'lodash';
import Frame from 'canvas-to-buffer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
// to do move those utils to utils folder
import {
    // prepareLines,
    drawLines,
    drawCircles,
    drawPoints
} from '../components/common/DrawingUtils/DrawingUtils';
import { allPointsBetweenTwoCoords } from './coordUtils';
import { splitLinesViaEraserCoords, isPointWithinCircle } from './lineUtils';

import 'jest-canvas-mock';

import { makeVerticalLinesPointArrays } from '../testing/LineFixtures';

expect.extend({ toMatchImageSnapshot });

const { createCanvas } = require('canvas');

describe('Split Lines', () => {
    it('should split lines properly', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

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
        drawLines(
            context,
            [eraseLine, eraseLineThree, eraseLineTwo, eraseLineFour],
            eraserRadius,
            'red'
        );

        const splitLines = splitLinesViaEraserCoords({
            lines: testLines,
            eraseCoords,
            eraserRadius,
            smoothOriginalLines: true,
            smoothPasses: 1
        });

        drawLines(context, splitLines);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });
});

describe('isPointWithinCircle', () => {
    it('should highlight all points within a circle with edges', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

        const circleLocations = [
            [100, 100],
            [350, 350],
            [500, 500]
        ];

        const circleRadius = 30;

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
                        circleRadius,
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

        drawCircles(context, circleLocations, circleRadius, 'red');
        drawPoints(context, finalPoints);

        // const splitLines = splitLinesViaEraserCoords({
        //     lines: testLines,
        //     eraseCoords,
        //     eraserRadius,
        //     smoothOriginalLines: true,
        //     smoothPasses: 1
        // });

        // drawLines(context, splitLines);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });

    it('should highlight all points within a circle without edges', () => {
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        context.beginPath();
        context.lineWidth = '6';
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.rect(0, 0, 800, 600);
        context.stroke();
        context.fill();

        const circleLocations = [
            [100, 100],
            [350, 350],
            [500, 500]
        ];

        const circleRadius = 30;

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
                        circleRadius,
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

        drawCircles(context, circleLocations, circleRadius, 'red');
        drawPoints(context, finalPoints);

        // const splitLines = splitLinesViaEraserCoords({
        //     lines: testLines,
        //     eraseCoords,
        //     eraserRadius,
        //     smoothOriginalLines: true,
        //     smoothPasses: 1
        // });

        // drawLines(context, splitLines);
        const frame = new Frame(canvas);
        const buffer = frame.toBuffer();
        expect(buffer).toMatchImageSnapshot();
    });
});
