import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Icon from 'components/common/Icon';

import {
    toggleGridVisibility,
    togglePointVisibility,
    setGridOptions
} from 'store/global/globalActions';

import { getCurrentOptions } from 'store/onions/onionsSelectors';

import styles from './GridControls.styles.css';

const GridControls = ({ globalHeight, globalWidth, dispatch }) => {
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
        <div className={styles.gridControlsContainer}>
            <Icon
                onClick={() => {
                    dispatch(togglePointVisibility());
                }}
                fileName="showpoint"
            />

            <Icon
                onClick={() => {
                    dispatch(toggleGridVisibility());
                }}
                fileName="grid"
            />

            <Icon
                onClick={() => {
                    setGridLineCountIndex(gridLineCountIndex - 1);
                }}
                fileName="grid-shrink"
                disabled={gridLineCountIndex === 0}
            />

            <Icon
                disabled={gridLineCountIndex === 3}
                onClick={() => {
                    setGridLineCountIndex(gridLineCountIndex + 1);
                }}
                fileName="grid-enlarge"
            />
        </div>
    );
};

const mapStateToProps = state => {
    const options = getCurrentOptions(state);
    return {
        gridState: state.globalReducer.grid,
        globalHeight: options.height,
        globalWidth: options.width
    };
};

export default connect(mapStateToProps)(GridControls);

GridControls.propTypes = {};
