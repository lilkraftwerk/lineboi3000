import React, { Fragment } from 'react';
import simplify from 'simplify-js';
import PercentClicker from '../components/common/PercentClicker';

const filterName = 'simplify';
const displayName = 'simplify lines';

const SimplifyComponent = ({ filterSettings, updateOptions }) => {
    const { tolerance, highQuality } = filterSettings;

    return (
        <Fragment>
            <PercentClicker
                setValue={value => {
                    updateOptions({ tolerance: Number(value) });
                }}
                float
                title="pixel tolerance"
                minLabel="0.01"
                maxLabel="9.99"
                minValue={0.01}
                maxValue={9.99}
                currentValue={tolerance}
            />
            <label>
                hii-quality
                <input
                    type="checkbox"
                    defaultChecked={highQuality}
                    onChange={() => {
                        updateOptions({ highQuality: !highQuality });
                    }}
                />
            </label>
        </Fragment>
    );
};

export const SimplifyFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;

    const { tolerance, highQuality } = filterSettings;

    const simplifyPointArray = pointArray => {
        const pointsAsCoordObjects = pointArray.map(([x, y]) => {
            return {
                x,
                y
            };
        });

        const simplifiedCoordObjs = simplify(
            pointsAsCoordObjects,
            tolerance,
            highQuality
        );

        return simplifiedCoordObjs.map(({ x, y }) => [x, y]);
    };

    const simplifiedPointArrays = pointArrays.map(pointArray =>
        simplifyPointArray(pointArray)
    );

    return simplifiedPointArrays;
};

const initSettings = () => ({
    filterName,
    enabled: true,
    tolerance: 1.5,
    highQuality: true
});

export default {
    name: filterName,
    displayName,
    filter: SimplifyFilter,
    Component: SimplifyComponent,
    initSettings
};

SimplifyComponent.propTypes = {};
