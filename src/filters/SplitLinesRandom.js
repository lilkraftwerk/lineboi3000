import _ from 'lodash';
import React, { Fragment } from 'react';
import PercentClicker from '../components/common/PercentClicker/PercentClicker';

const filterName = 'split linez random';
const displayName = 'split linez random';

const SplitLinesRandomComponent = ({ filterSettings, updateOptions }) => {
    const { maxOn, maxOff } = filterSettings;
    return (
        <Fragment>
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ maxOn: Number(value) });
                }}
                title="max points on"
                minLabel="2"
                maxLabel="20"
                minValue={2}
                maxValue={20}
                currentValue={maxOn}
            />
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ maxOff: Number(value) });
                }}
                title="max points off"
                minLabel="1"
                maxLabel="20"
                minValue={1}
                maxValue={20}
                currentValue={maxOff}
            />
        </Fragment>
    );
};

export const SplitLinesRandomFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;

    const { maxOn, maxOff } = filterSettings;

    const newLines = [];

    pointArrays.forEach((pointArray) => {
        const pointsOn = () => _.random(2, maxOn);
        const pointsOff = () => _.random(1, maxOff);
        let currentPointsOn = pointsOn();
        let currentPointsOff = pointsOff();
        let onCount = 0;
        let offCount = 0;
        let on = true;
        let tempLine = [];

        pointArray.forEach((coords) => {
            if (on) {
                tempLine.push(coords);
                onCount += 1;

                if (onCount === currentPointsOn) {
                    onCount = 0;
                    on = false;
                    currentPointsOn = pointsOn();
                    newLines.push(tempLine);
                    tempLine = [];
                }
                return;
            }
            // if off
            offCount += 1;
            if (offCount === currentPointsOff) {
                on = true;
                currentPointsOff = pointsOff();
                offCount = 0;
            }
        });
    });

    return newLines;
};

const initSettings = () => ({
    filterName,
    enabled: true,
    maxOn: 10,
    maxOff: 10
});

export default {
    name: filterName,
    displayName,
    filter: SplitLinesRandomFilter,
    Component: SplitLinesRandomComponent,
    initSettings
};
