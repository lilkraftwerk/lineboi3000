import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {
    EnabledToggleButton,
    SidebarButton
} from 'components/common/SidebarButton/SidebarButton';
import {
    SidebarContainer,
    SidebarItem
} from 'components/common/SidebarContainer/SidebarContainer';
import { getShowPoints } from 'store/global/globalSelectors';

import {
    setGridOptions,
    toggleGridVisibility,
    togglePointVisibility
} from 'store/global/globalActions';

import { getCurrentOptions } from 'store/options/optionsSelectors';

const GridControls = ({
    gridVisible,
    globalHeight,
    globalWidth,
    showPoints,
    dispatch
}) => {
    const LINE_COUNTS = [2, 4, 8, 16, 32, 64];
    const [gridLineCountIndex, setGridLineCountIndex] = useState(1);

    const currentLineCount = LINE_COUNTS[gridLineCountIndex];

    useEffect(() => {
        const heightFactor = globalHeight / currentLineCount;
        const widthFactor = globalWidth / currentLineCount;
        dispatch(
            setGridOptions({
                height: heightFactor,
                width: widthFactor
            })
        );
    }, [globalHeight, globalWidth, gridLineCountIndex]);

    return (
        <SidebarContainer>
            <SidebarItem
                title="grid/point display"
                height={2}
                styleOverride={{
                    gridTemplateColumns: '1fr 1fr 30px 30px',
                    fontSize: '.75em'
                }}
            >
                <EnabledToggleButton
                    style={{ gridColumn: 'span 1' }}
                    onClick={() => {
                        dispatch(togglePointVisibility());
                    }}
                    active={showPoints}
                    labelActive="points on 📍"
                    labelInactive="points off 📍"
                />

                <EnabledToggleButton
                    style={{ gridColumn: 'span 1' }}
                    onClick={() => {
                        dispatch(toggleGridVisibility());
                    }}
                    active={gridVisible}
                    labelActive="grid on 📏"
                    labelInactive="grid off 📏"
                />
                <SidebarButton
                    span={1}
                    style={{ gridColumn: 'span 1' }}
                    onClick={() => {
                        setGridLineCountIndex(gridLineCountIndex - 1);
                    }}
                    disabled={gridLineCountIndex === 0}
                    label="⬇️"
                />
                <SidebarButton
                    span={1}
                    label="⬆️"
                    disabled={gridLineCountIndex === 3}
                    onClick={() => {
                        setGridLineCountIndex(gridLineCountIndex + 1);
                    }}
                    type="button"
                />
            </SidebarItem>
        </SidebarContainer>
    );
};

const mapStateToProps = (state) => {
    const options = getCurrentOptions(state);
    const showPoints = getShowPoints(state);

    return {
        gridState: state.globalReducer.grid,
        globalHeight: options.height,
        globalWidth: options.width,
        showPoints,
        gridVisible: state.globalReducer.grid.visible
    };
};

export default connect(mapStateToProps)(GridControls);
