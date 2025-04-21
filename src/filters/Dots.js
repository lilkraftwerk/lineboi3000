import { random as _random } from 'es-toolkit';
import React from 'react';
import PercentClicker from '../components/common/PercentClicker/PercentClicker';

const filterName = 'dots';
const displayName = 'dotz';

const DotsComponent = ({ filterSettings, updateOptions }) => {
    const { additionalDots, distance } = filterSettings;

    return (
        <>
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ additionalDots: value });
                }}
                float
                title="pixel tolerance"
                minLabel="0.01"
                maxLabel="9.99"
                minValue={0.01}
                maxValue={9.99}
                currentValue={additionalDots}
            />
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ distance: value });
                }}
                float
                title="distance"
                minLabel="0"
                maxLabel="30"
                minValue={0}
                maxValue={30}
                currentValue={distance}
            />
        </>
    );
};

export const DotsFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;
    const { additionalDots, distance } = filterSettings;

    // get all points in one array
    const flatPoints = pointArrays.flat();

    // for each point, create a new point array with
    // x additional points
    const mappedLines = flatPoints.map(([x, y]) => {
        const points = [[x, y]];
        for (let i = 0; i < additionalDots; i++) {
            const randX = _random(-distance, distance);
            const randY = _random(-distance, distance);
            points.push([x + randX, y + randY]);
        };
        return points;
    });
    return mappedLines;
};

const initSettings = () => ({
    filterName,
    enabled: true,
    additionalDots: 2,
    distance: 2
});

export default {
    name: filterName,
    displayName,
    filter: DotsFilter,
    Component: DotsComponent,
    initSettings,
    helpText: 'turn points on lines into dots or exes'
};
