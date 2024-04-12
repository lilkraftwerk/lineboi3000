import chaikinSmooth from 'chaikin-smooth';
import _ from 'lodash';
import React from 'react';
import smoothPolyline from 'smooth-polyline';

import PercentClicker from '../components/common/PercentClicker/PercentClicker';

const filterName = 'smooth';
const displayName = 'smooth';

const SmoothComponent = ({ filterSettings, updateOptions }) => {
    const { algo, passes } = filterSettings;

    return (
        <>
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ algo: Number(value) });
                }}
                float={false}
                title="algorithm"
                minLabel="chaikin"
                maxLabel="smooth polyline"
                minValue={1}
                maxValue={2}
                currentValue={algo}
            />
            <PercentClicker
                setValue={(value) => {
                    updateOptions({ passes: Number(value) });
                }}
                float={false}
                title="passes"
                minLabel="1"
                maxLabel="10"
                minValue={1}
                maxValue={10}
                currentValue={passes}
            />
        </>
    );
};

export const SmoothFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;
    const { algo, passes } = filterSettings;

    let tempPointArrays = [...pointArrays];
    const smoothPointArray = (pointArray) => {
        let result;

        if (algo === 1) {
            result = chaikinSmooth(pointArray);
        } else {
            result = smoothPolyline(pointArray);
        }
        return result;
    };

    _.times(passes, () => {
        tempPointArrays = tempPointArrays.map((pointArray) =>
            smoothPointArray(pointArray)
        );
    });

    return tempPointArrays;
};

const initSettings = () => ({
    filterName,
    enabled: true,
    algo: 1,
    passes: 1
});

export default {
    name: filterName,
    displayName,
    filter: SmoothFilter,
    Component: SmoothComponent,
    initSettings
};
