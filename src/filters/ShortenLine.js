import _ from 'lodash';
import React from 'react';
import PercentClicker from '../components/common/PercentClicker/PercentClicker';

const filterName = 'shorten lines';
const displayName = 'shorten lines';

const ShortenLineComponent = ({ filterSettings, updateOptions }) => {
    const { lineLength, startAtBeginning } = filterSettings;

    return (
        <>
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ lineLength: value });
                }}
                float={false}
                title="new line length in %"
                minLabel="0"
                maxLabel="100"
                minValue={0}
                maxValue={100}
                currentValue={lineLength}
            />
            <button
                style={{ gridColumn: 'span 4' }}
                type="button"
                onClick={() => {
                    updateOptions({ startAtBeginning: !startAtBeginning });
                }}
            >
                {startAtBeginning ? 'start at beginning' : 'start mid line'}
            </button>
        </>
    );
};

export const ShortenLineFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;

    const { lineLength, startAtBeginning } = filterSettings;
    const shortLines = [];

    pointArrays.forEach((currentLine) => {
        const thisLine = [];
        const numberOfPoints = Math.floor(
            currentLine.length * (lineLength * 0.01)
        );
        const maxStartIndex = currentLine.length - numberOfPoints;
        const startIndex = startAtBeginning ? 0 : _.random(0, maxStartIndex);

        for (let i = startIndex; i < numberOfPoints + startIndex; i += 1) {
            thisLine.push(currentLine[i]);
        }
        shortLines.push(thisLine);
    });

    return shortLines;
};

const initSettings = () => ({
    filterName,
    enabled: true,
    startAtBeginning: true,
    lineLength: 50
});

export default {
    name: filterName,
    displayName,
    filter: ShortenLineFilter,
    Component: ShortenLineComponent,
    initSettings
};
