import _ from 'lodash';
import React, { Fragment } from 'react';
import PercentClicker from '../components/common/PercentClicker';

const filterName = 'distort';
const displayName = 'dist0rt';

const DistortComponent = ({ filterSettings, updateOptions }) => {
    const { percentToAffect, distortionAmount } = filterSettings;

    return (
        <Fragment>
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ percentToAffect: value });
                }}
                float={false}
                title="% affected"
                minLabel="0"
                maxLabel="100"
                minValue={0}
                maxValue={100}
                currentValue={percentToAffect}
            />
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ distortionAmount: value });
                }}
                float={false}
                title="distortion amount"
                minLabel="0"
                maxLabel="15"
                minValue={0}
                maxValue={100}
                currentValue={distortionAmount}
            />
        </Fragment>
    );
};

export const DistortFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;

    const { percentToAffect, distortionAmount } = filterSettings;

    const yValueMap = {};

    // height goes here
    // doesn't work for fractions, should loop probably
    // or floor values
    pointArrays.forEach((pointArray) =>
        pointArray.forEach(([_x, y]) => {
            const flooredY = Math.floor(y);
            if (yValueMap[flooredY.toString()] == null) {
                yValueMap[flooredY.toString()] = _.random(
                    -distortionAmount,
                    distortionAmount
                );
            }
        })
    );

    const distortLine = (pointArray) => {
        return pointArray.map(([x, y]) => {
            let newX = x;

            if (_.random(0, 100) < percentToAffect) {
                const flooredY = Math.floor(y);
                newX = x + yValueMap[flooredY.toString()];
            }
            return [newX, y];
        });
    };

    return pointArrays.map((line) => distortLine(line));
};

const initSettings = () => ({
    filterName,
    enabled: true,
    percentToAffect: 90,
    distortionAmount: 5
});

export default {
    name: filterName,
    displayName,
    filter: DistortFilter,
    Component: DistortComponent,
    initSettings
};

DistortComponent.propTypes = {};
