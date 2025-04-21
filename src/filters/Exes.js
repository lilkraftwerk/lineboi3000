import _ from 'lodash';
import React from 'react';
import PercentClicker from '../components/common/PercentClicker/PercentClicker';
import { allPointsBetweenTwoCoords } from '../utils/coordUtils';

const filterName = 'exes';
const displayName = 'exes';

const ExesComponent = ({ filterSettings, updateOptions }) => {
    const { length, percentToAffect, shape } = filterSettings;
    return (
        <>
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ length: Number(value) });
                }}
                float
                title="length"
                minLabel="0"
                maxLabel="100"
                minValue={0}
                maxValue={100}
                currentValue={length}
            />
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ percentToAffect: Number(value) });
                }}
                float
                title="percent of points to circle"
                minLabel="1"
                maxLabel="100"
                minValue={1}
                maxValue={100}
                currentValue={percentToAffect}
            />
            <button
                onClick={() => {
                    const newShape = shape === 'circle' ? 'ex' : 'circle';
                    updateOptions({
                        shape: newShape
                    });
                }}
                type="button"
            >
                {shape}
            </button>
        </>
    );
};

export const ExesFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;

    const { length, shape, percentToAffect } = filterSettings;

    const halfLength = length / 2;

    const rotateCoords = (coordsToRotate, centerCoords, angle) => {
        const [x, y] = coordsToRotate;
        const [centerX, centerY] = centerCoords;
        const adjustedAngle = angle * (Math.PI / 180); // Convert to radians

        const rotatedX =
            Math.cos(adjustedAngle) * (x - centerX) -
            Math.sin(adjustedAngle) * (y - centerY) +
            centerX;

        const rotatedY =
            Math.sin(adjustedAngle) * (x - centerX) +
            Math.cos(adjustedAngle) * (y - centerY) +
            centerY;

        return [rotatedX, rotatedY];
    };

    const makeCircles = (centerCoords) => {
        const [centerX, centerY] = centerCoords;
        const r = length;
        const pointsOnCircle = 100;
        const points = [];
        for (let i = 0; i < pointsOnCircle; i += 1) {
            const x =
                centerX + r * Math.cos((2 * Math.PI * i) / pointsOnCircle);
            const y =
                centerY + r * Math.sin((2 * Math.PI * i) / pointsOnCircle);

            points.push([x, y]);
        }
        return [...points];
    };

    const makeX = (centerCoords) => {
        const [x, y] = centerCoords;
        const topLeft = [x - halfLength, y + halfLength];
        const topRight = [x + halfLength, y + halfLength];
        const bottomLeft = [x - halfLength, y - halfLength];
        const bottomRight = [x + halfLength, y - halfLength];

        const first = allPointsBetweenTwoCoords(topLeft, bottomRight);
        const second = allPointsBetweenTwoCoords(bottomLeft, topRight);

        const rotation = _.random(0, 360);

        const rotatedFirst = first.map((coords) => {
            return rotateCoords(coords, centerCoords, rotation);
        });

        const rotatedSecond = second.map((coords) => {
            return rotateCoords(coords, centerCoords, rotation);
        });

        return [rotatedFirst, rotatedSecond];
    };

    const flatPoints = pointArrays.flat();
    const exes = [];
    flatPoints.forEach((coords) => {
        if (_.random(0, 100) < percentToAffect) {
            if (shape === 'circle') {
                const circle = makeCircles(coords);
                exes.push(circle);
            } else {
                const [first, second] = makeX(coords);
                exes.push(first);
                exes.push(second);
            }
        }
    });
    return exes;
};

const initSettings = () => ({
    filterName,
    enabled: true,
    shape: 'circle',
    percentToAffect: 50,
    length: 10
});

export default {
    name: filterName,
    displayName,
    filter: ExesFilter,
    Component: ExesComponent,
    initSettings
};
