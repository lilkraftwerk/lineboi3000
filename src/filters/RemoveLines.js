import { random } from 'es-toolkit';
import React from 'react';
import PercentClicker from '../components/common/PercentClicker/PercentClicker';

const filterName = 'remove lines';
const displayName = 'remove lines';

const RemoveLinesComponent = ({ filterSettings, updateOptions }) => {
    const { linePercentToRemove } = filterSettings;

    return (
        <>
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ linePercentToRemove: value });
                }}
                float={false}
                title="percent of lines to keep"
                minLabel="0"
                maxLabel="100"
                minValue={0}
                maxValue={100}
                currentValue={linePercentToRemove}
            />
        </>
    );
};

export const RemoveLinesFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;

    const { linePercentToRemove } = filterSettings;
    const totalNewLines = Math.floor(
        pointArrays.length * (linePercentToRemove * 0.01)
    );
    const difference = pointArrays.length - totalNewLines;

    for (let i = 0; i < difference; i += 1) {
        const index = random(0, pointArrays.length - 1);
        pointArrays.splice(index, 1); // Remove the item from the array
    }

    return pointArrays;
};

const initSettings = () => ({
    enabled: true,
    filterName,
    linePercentToRemove: 50
});

export default {
    name: filterName,
    displayName,
    filter: RemoveLinesFilter,
    Component: RemoveLinesComponent,
    initSettings,
    helpText: 'delete a certain percentage of lines on a layer'
};
