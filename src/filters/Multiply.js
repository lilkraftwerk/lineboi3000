import React, { Fragment } from 'react';
import {
    translateLineToPercentages,
    mapLineToAbsPercentages
} from '../utils/FilterUtils';

const filterName = 'multiply';
const displayName = 'multiply';

const MultiplyComponent = ({ filterSettings, updateOptions }) => {
    const { rectHeight, rectWidth } = filterSettings;

    const double = () => {
        updateOptions({
            rectWidth: rectWidth * 2,
            rectHeight: rectHeight * 2
        });
    };

    const half = () => {
        updateOptions({
            rectWidth: rectWidth / 2,
            rectHeight: rectHeight / 2
        });
    };

    return (
        <Fragment>
            <label>
                rectHeight
                <input
                    type="number"
                    min="1"
                    max="500"
                    value={rectHeight}
                    onChange={(e) => {
                        updateOptions({ rectHeight: e.target.value });
                    }}
                />
            </label>
            <label>
                rectWidth
                <input
                    type="number"
                    min="1"
                    max="500"
                    value={rectWidth}
                    onChange={(e) => {
                        updateOptions({ rectWidth: e.target.value });
                    }}
                />
            </label>
            <button
                onClick={() => {
                    double();
                }}
                type="button"
            >
                2x
            </button>
            <button
                onClick={() => {
                    half();
                }}
                type="button"
            >
                1/2
            </button>
        </Fragment>
    );
};

export const MultiplyFilter = ({
    globalSettings,
    filterSettings,
    pointArrays
}) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;
    const { rectHeight, rectWidth } = filterSettings;

    const multipliedPointArrays = [];
    const translatedPointArrays = pointArrays.map((line) =>
        translateLineToPercentages(
            line,
            globalSettings.height,
            globalSettings.width
        )
    );

    for (
        let currentX = 0;
        currentX < globalSettings.width;
        currentX += rectWidth
    ) {
        for (
            let currentY = 0;
            currentY < globalSettings.height;
            currentY += rectHeight
        ) {
            const endX = currentX + rectWidth;
            const endY = currentY + rectHeight;
            translatedPointArrays.forEach((line) => {
                const translatedLine = mapLineToAbsPercentages({
                    currentX,
                    currentY,
                    endX,
                    endY,
                    line
                });
                multipliedPointArrays.push(translatedLine);
            });
        }
    }

    return multipliedPointArrays;
};

const initSettings = (globalSettings) => ({
    filterName,
    enabled: true,
    rectWidth: globalSettings.width / 4,
    rectHeight: globalSettings.height / 4
});

export default {
    name: filterName,
    displayName,
    filter: MultiplyFilter,
    Component: MultiplyComponent,
    initSettings
};
