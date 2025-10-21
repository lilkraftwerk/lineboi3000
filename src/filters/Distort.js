import _ from 'lodash';
import React from 'react';
import PercentClicker from '../components/common/PercentClicker/PercentClicker';

const filterName = 'distort';
const displayName = 'dist0rt';

const DistortComponent = ({ filterSettings, updateOptions }) => {
    const { percentToAffect, distortionAmount, horizontal, vertical } =
        filterSettings;

    return (
        <>
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
            <label>
                horizontal
                <input
                    type="checkbox"
                    defaultChecked={horizontal}
                    onChange={() => {
                        updateOptions({ horizontal: !horizontal });
                    }}
                />
            </label>
            <label>
                vertical
                <input
                    type="checkbox"
                    defaultChecked={vertical}
                    onChange={() => {
                        updateOptions({ vertical: !vertical });
                    }}
                />
            </label>
        </>
    );
};

export const DistortFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;

    const { percentToAffect, distortionAmount, horizontal, vertical } =
        filterSettings;

    const yValueMap = {};
    const xValueMap = {};

    pointArrays.forEach((pointArray) => {
        pointArray.forEach(([x, y]) => {
            const flooredY = Math.floor(y);
            const flooredX = Math.floor(x);

            if (yValueMap[flooredY.toString()] == null) {
                yValueMap[flooredY.toString()] = _.random(
                    -distortionAmount,
                    distortionAmount
                );
            }

            if (xValueMap[flooredX.toString()] == null) {
                xValueMap[flooredX.toString()] = _.random(
                    -distortionAmount,
                    distortionAmount
                );
            }
        });
    });

    const distortLine = (pointArray) => {
        return pointArray.map(([x, y]) => {
            let newX = x;
            let newY = y;

            if (horizontal && _.random(0, 100) < percentToAffect) {
                const flooredY = Math.floor(y);
                newX = x + yValueMap[flooredY.toString()];
            }

            if (vertical && _.random(0, 100) < percentToAffect) {
                const flooredX = Math.floor(x);
                newY = y + xValueMap[flooredX.toString()];
            }

            return [newX, newY];
        });
    };

    return pointArrays.map((line) => distortLine(line));
};

const initSettings = () => ({
    filterName,
    enabled: true,
    percentToAffect: 90,
    distortionAmount: 5,
    horizontal: true,
    vertical: false
});

export default {
    name: filterName,
    displayName,
    filter: DistortFilter,
    Component: DistortComponent,
    initSettings,
    helpText: 'move points horizontally or vertically'
};
