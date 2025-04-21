import React from 'react';
import { connect } from 'react-redux';
import {
    getVisibleEfxLines,
    getVisibleOriginalLines
} from 'store/line/lineSelectors';

import * as styles from './PointCounter.styles.css';

const PointCounter = ({ visibleEfxLines, visibleOriginalLines, mode }) => {
    let linesToCount;

    if (mode === 'draw') {
        linesToCount = visibleOriginalLines;
    } else {
        linesToCount = visibleEfxLines.map(
            (efxLineContainer) => efxLineContainer.efxLines
        );
    }

    const flattenedLines = Object.values(linesToCount).flat();
    const lineCount = flattenedLines.length;

    const pointCount = flattenedLines.reduce((sum, x) =>
        sum + (x.pointArrayContainer ? x.pointArrayContainer.length : 0), 0
    );

    return (
        <div className={styles.pointCounterContainer}>
            <div className={styles.left}>lines: {lineCount}</div>
            <div className={styles.right}>points: {pointCount}</div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const visibleOriginalLines = getVisibleOriginalLines(state);
    const visibleEfxLines = getVisibleEfxLines(state);

    return {
        mode: state.globalReducer.mode,
        visibleOriginalLines,
        visibleEfxLines
    };
};

export default connect(mapStateToProps)(PointCounter);
