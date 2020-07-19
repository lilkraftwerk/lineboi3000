import React from 'react';
import _ from 'lodash';
import id from '../utils/id';

import { sortLinesForPlotter } from '../utils/lineSortUtils';

const filterName = 'connect';
const displayName = 'connect lines';

const ConnectLinesComponent = () => {
    return <>connect</>;
};

export const ConnectLinesFilter = ({ filterSettings, pointArrays }) => {
    if (!filterSettings || !filterSettings.enabled) return pointArrays;

    const pointArraysWithId = pointArrays.map((pointArrayContainer) => {
        return {
            id: id(),
            pointArrayContainer
        };
    });

    const sortedLines = sortLinesForPlotter(pointArraysWithId);
    const justPointArrays = sortedLines.map((x) => x.pointArrayContainer);
    const oneLine = _.flatten(justPointArrays);
    return [oneLine];
};

const initSettings = () => ({
    filterName,
    enabled: true
});

export default {
    name: filterName,
    displayName,
    filter: ConnectLinesFilter,
    Component: ConnectLinesComponent,
    initSettings,
    helpText: 'connect all lines on the layer into a single line'
};
