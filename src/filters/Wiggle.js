import _ from 'lodash';
import React from 'react';
import PercentClicker from '../components/common/PercentClicker/PercentClicker';

const filterName = 'wiggle';
const displayName = 'wiggle';

const WiggleLinesComponent = ({ filterSettings, updateOptions }) => {
    const { percentAffect, pixelOffset } = filterSettings;

    return (
        <>
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ percentAffect: Number(value) });
                }}
                float
                title="percent affected"
                minLabel="0"
                maxLabel="100"
                minValue={0}
                maxValue={100}
                currentValue={percentAffect}
            />
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ pixelOffset: Number(value) });
                }}
                title="pixel offset"
                minLabel="min"
                maxLabel="max"
                minValue={1}
                maxValue={30}
                currentValue={pixelOffset}
            />
        </>
    );
};

export const WiggleFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;
    const { percentAffect, pixelOffset } = filterSettings;

    const wiggleLine = (pointArray) =>
        pointArray.map(([x, y]) => {
            let xOffset = 0;
            let yOffset = 0;
            if (_.random(0, 100) < percentAffect) {
                xOffset = _.random(-pixelOffset, pixelOffset);
            }

            if (_.random(0, 100) < percentAffect) {
                yOffset = _.random(-pixelOffset, pixelOffset);
            }

            return [x + xOffset, y + yOffset];
        });

    return pointArrays.map((line) => wiggleLine(line));
};

const initSettings = () => ({
    filterName,
    enabled: true,
    percentAffect: 50,
    pixelOffset: 5
});

export default {
    name: filterName,
    displayName,
    filter: WiggleFilter,
    Component: WiggleLinesComponent,
    initSettings
};
