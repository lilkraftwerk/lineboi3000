import React, { Fragment } from 'react';
import PercentClicker from '../components/common/PercentClicker/PercentClicker';

const filterName = 'move';
const displayName = 'move it';

const MoveLinesComponent = ({ filterSettings, updateOptions }) => {
    const { xMove, yMove } = filterSettings;

    return (
        <Fragment>
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ xMove: Number(value) });
                }}
                float
                title="x move"
                minLabel="-20"
                maxLabel="20"
                minValue={-20}
                maxValue={20}
                currentValue={xMove}
            />
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ yMove: Number(value) });
                }}
                title="y move"
                minLabel="min"
                maxLabel="max"
                minValue={-20}
                maxValue={20}
                currentValue={yMove}
            />
        </Fragment>
    );
};

export const MoveFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;
    const { xMove, yMove } = filterSettings;

    const moveLine = (line) =>
        line.map(([x, y]) => {
            return [x + xMove, y + yMove];
        });

    const mappedLines = pointArrays.map((line) => moveLine(line));
    return mappedLines;
};

const initSettings = () => ({
    filterName,
    enabled: true,
    xMove: 0,
    yMove: 0
});

export default {
    name: filterName,
    displayName,
    filter: MoveFilter,
    Component: MoveLinesComponent,
    initSettings
};
