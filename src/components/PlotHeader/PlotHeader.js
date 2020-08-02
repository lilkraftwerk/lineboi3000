import React from 'react';
import { connect } from 'react-redux';

import styles from './PlotHeader.styles.css';

export const PlotHeader = ({
    currentPlotPercentage,
    totalPlotLineCount,
    currentPlotLineIndex,
    plotting
}) => {
    const plotComplete = currentPlotPercentage === 100;
    const textString = plotting ? 'PLOTTING' : 'NOT PLOTTING';
    const plottingClass = plotting
        ? styles.currentlyPlotting
        : styles.notCurrentlyPlotting;

    return (
        <div className={styles.plotHeaderContainer}>
            <div className={styles.plotMessage}>
                <div className={[styles.plotInfo, plottingClass].join(' ')}>
                    {plotComplete ? 'DONE' : textString}
                </div>
                <div className={styles.plotInfo}>
                    <div className={styles.plotInfoTitle}>lines done</div>
                    <div className={styles.plotInfoBody}>
                        {currentPlotLineIndex}
                    </div>
                </div>
                <div className={styles.plotInfo}>
                    <div className={styles.plotInfoTitle}>total lines</div>
                    <div className={styles.plotInfoBody}>
                        {totalPlotLineCount}
                    </div>
                </div>
                <div className={styles.plotInfo}>
                    <div className={styles.plotInfoTitle}>percent done</div>
                    <div className={styles.plotInfoBody}>
                        {Math.round(currentPlotPercentage)}%
                    </div>
                </div>
            </div>
            <div
                style={{ width: `${currentPlotPercentage}%` }}
                className={styles.loadingContainer}
            >
                <div
                    className={
                        plotComplete
                            ? styles.finishedPlot
                            : styles.loadingBackground
                    }
                />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        ...state.plotReducer
    };
};

export default connect(mapStateToProps)(PlotHeader);
