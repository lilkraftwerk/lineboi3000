import React, { Fragment } from 'react';
import PercentClicker from '../components/common/PercentClicker';

const filterName = 'split linez';
const displayName = 'split linez';

const SplitLinesComponent = ({ filterSettings, updateOptions }) => {
    const { pointsOn, pointsOff } = filterSettings;
    return (
        <Fragment>
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ pointsOn: Number(value) });
                }}
                title="min size"
                minLabel="1"
                maxLabel="20"
                minValue={2}
                maxValue={20}
                currentValue={pointsOn}
            />
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ pointsOff: Number(value) });
                }}
                title="points off"
                minLabel="1"
                maxLabel="20"
                minValue={1}
                maxValue={20}
                currentValue={pointsOff}
            />
        </Fragment>
    );
};

export const SplitLinesFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;

    const { pointsOn, pointsOff } = filterSettings;

    const newLines = [];

    pointArrays.forEach((pointArray) => {
        let onCount = 0;
        let offCount = 0;
        let on = true;
        let tempLine = [];

        pointArray.forEach((coords) => {
            if (on) {
                tempLine.push(coords);
                onCount += 1;

                if (onCount === pointsOn) {
                    onCount = 0;
                    on = false;
                    newLines.push(tempLine);
                    tempLine = [];
                }
                return;
            }
            // if off
            offCount += 1;
            if (offCount === pointsOff) {
                on = true;
                offCount = 0;
            }
        });
    });

    return newLines;
};

const initSettings = () => ({
    filterName,
    enabled: true,
    pointsOn: 5,
    pointsOff: 5
});

export default {
    name: filterName,
    displayName,
    filter: SplitLinesFilter,
    Component: SplitLinesComponent,
    initSettings
};
