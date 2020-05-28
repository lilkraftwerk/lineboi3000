import React from 'react';
import { connect } from 'react-redux';
import { getCurrentOptions } from 'store/onions/onionsSelectors';
import { CanvasLayer } from '../common/SvgLayer';

import styles from './GridContent.styles.css';

const GridContent = ({
    gridHeight,
    gridWidth,
    globalHeight,
    globalWidth,
    visible
}) => {
    if (!visible) {
        return null;
    }

    const lines = [];
    for (let x = 0; x <= globalWidth; x += gridWidth) {
        const line = [];
        for (let y = 0; y <= globalHeight; y += gridHeight) {
            line.push([x, y]);
        }
        lines.push(line);
    }

    for (let y = 0; y <= globalHeight; y += gridHeight) {
        const line = [];
        for (let x = 0; x <= globalWidth; x += gridWidth) {
            line.push([x, y]);
        }
        lines.push(line);
    }

    const withContainers = lines.map((lineLines) => {
        return { pointArrayContainer: lineLines };
    });

    return (
        <div className={styles.gridContainer}>
            <CanvasLayer
                lines={withContainers}
                height={globalHeight}
                width={globalWidth}
                strokeWidth={1}
                color="gray"
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    const options = getCurrentOptions(state);

    return {
        gridHeight: state.globalReducer.grid.height,
        gridWidth: state.globalReducer.grid.width,
        visible: state.globalReducer.grid.visible,
        globalHeight: options.height,
        globalWidth: options.width
    };
};

export default connect(mapStateToProps)(GridContent);
