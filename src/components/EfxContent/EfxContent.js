import { CombinedLayer } from 'components/common/SvgLayer/SvgLayer';
import { isEqual as _isEqual } from 'es-toolkit';
import React from 'react';
import { connect } from 'react-redux';
import { setTempBlob } from 'store/gifmaker/gifmakerActions';
import { getShowPoints } from 'store/global/globalSelectors';
import { getVisibleEfxLines } from 'store/line/lineSelectors';
import { getCurrentOptions } from 'store/options/optionsSelectors';

import * as styles from './EfxContent.styles.css';

class EfxContainer extends React.Component {
    shouldComponentUpdate(nextProps) {
        const { height, width, visibleEfxLines, showPoints } = this.props;
        const areNotEqual = (a, b) => {
            return !_isEqual(a, b);
        };

        const shouldUpdate = [
            areNotEqual(height, nextProps.height),
            areNotEqual(width, nextProps.width),
            areNotEqual(visibleEfxLines, nextProps.visibleEfxLines),
            areNotEqual(showPoints, nextProps.showPoints)
        ].some(Boolean);
        return shouldUpdate;
    }

    hasEfxLinesToShow = () => {
        const { visibleEfxLines } = this.props;

        if (visibleEfxLines.length === 0) {
            return false;
        }

        const hasLines = visibleEfxLines
            .map((line) => line.efxLines?.length)
            .reduce((sum, currentValue) => sum + currentValue);
        return hasLines;
    };

    render() {
        const {
            height,
            width,
            visibleEfxLines,
            showPoints,
            pointShowRadius,
            pointShowColor,
            dispatch
        } = this.props;
        return (
            <div
                style={{ height, width }}
                id="efxContent"
                className={styles.container}
            >
                {!this.hasEfxLinesToShow() && (
                    <div className={styles.noLineContainer}>
                        <div className={styles.noLineMessage}>
                            run efx on layers with lines
                        </div>
                    </div>
                )}
                <CombinedLayer
                    layers={visibleEfxLines}
                    height={height}
                    width={width}
                    shouldSaveFrame
                    showPoints={showPoints}
                    pointShowColor={pointShowColor}
                    pointShowRadius={pointShowRadius}
                    blobCallback={(blob) => {
                        dispatch(setTempBlob(blob));
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const visibleEfxLines = getVisibleEfxLines(state);
    const options = getCurrentOptions(state);
    const showPoints = getShowPoints(state);

    return {
        ...options,
        visibleEfxLines,
        showPoints
    };
};

export default connect(mapStateToProps)(EfxContainer);
