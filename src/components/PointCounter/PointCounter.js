import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {
    getVisibleOriginalLines,
    getVisibleEfxLines
} from 'store/line/lineSelectors';

import styles from './PointCounter.styles.css';

const PointCounter = ({ visibleEfxLines, visibleOriginalLines, mode }) => {
    let linesToCount;

    if (mode === 'draw') {
        linesToCount = visibleOriginalLines;
    } else {
        linesToCount = visibleEfxLines.map(
            efxLineContainer => efxLineContainer.efxLines
        );
    }

    const lineCount = _.flatten(Object.values(linesToCount)).length;
    const pointCount = _.sum(
        _.flatten(Object.values(linesToCount)).map(
            x => x.pointArrayContainer.length
        )
    );

    return (
        <div className={styles.pointCounterContainer}>
            <div className={styles.left}>lines: {lineCount}</div>
            <div className={styles.right}>points: {pointCount}</div>
        </div>
    );
};

const mapStateToProps = state => {
    const visibleOriginalLines = getVisibleOriginalLines(state);
    const visibleEfxLines = getVisibleEfxLines(state);

    return {
        mode: state.globalReducer.mode,
        visibleOriginalLines,
        visibleEfxLines
    };
};

export default connect(mapStateToProps)(PointCounter);

PointCounter.propTypes = {};
