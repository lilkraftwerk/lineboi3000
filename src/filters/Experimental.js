import _ from 'lodash';
import React, { Fragment } from 'react';
import PercentClicker from '../components/common/PercentClicker';

const filterName = 'experimental';
const displayName = 'xxxperimental';

const ExperimentalComponent = ({ filterSettings, updateOptions }) => {
    const { chunkMin, chunkMax } = filterSettings;
    return (
        <Fragment>
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ chunkMin: Number(value) });
                }}
                float
                title="min size"
                minLabel="1"
                maxLabel="10"
                minValue={1}
                maxValue={10}
                currentValue={chunkMin}
            />
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ chunkMax: Number(value) });
                }}
                float
                title="max size"
                minLabel="2"
                maxLabel="15"
                minValue={2}
                maxValue={15}
                currentValue={chunkMax}
            />
        </Fragment>
    );
};

export const ExperimentalFilter = ({
    globalSettings,
    filterSettings,
    pointArrays
}) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;

    const { chunkMin, chunkMax } = filterSettings;

    const chunkedLines = pointArrays.map((line) => {
        const toChunkBy = _.random(chunkMin, chunkMax);
        return _.chunk(line, toChunkBy);
    });

    return _.flatten(chunkedLines);
};

const initSettings = () => ({
    filterName,
    enabled: true,
    chunkMin: 3,
    chunkMax: 5
});

export default {
    name: filterName,
    displayName,
    filter: ExperimentalFilter,
    Component: ExperimentalComponent,
    initSettings
};
