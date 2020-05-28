import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getVisibleEfxLines } from 'store/line/lineSelectors';
import { getCurrentOptions } from 'store/onions/onionsSelectors';
import { setTempBlob } from 'store/gifmaker/gifmakerActions';
import { CombinedLayer } from 'components/common/SvgLayer';
import { getShowPoints } from 'store/global/globalSelectors';

import styles from './EfxContent.styles.css';

class EfxContainer extends React.Component {
    shouldComponentUpdate(nextProps) {
        const { height, width, visibleEfxLines, showPoints } = this.props;
        const areNotEqual = (a, b) => {
            return !_.isEqual(a, b);
        };

        const shouldUpdate = _.some([
            areNotEqual(height, nextProps.height),
            areNotEqual(width, nextProps.width),
            areNotEqual(visibleEfxLines, nextProps.visibleEfxLines),
            areNotEqual(showPoints, nextProps.showPoints)
        ]);
        return shouldUpdate;
    }

    render() {
        const {
            height,
            width,
            visibleEfxLines,
            showPoints,
            dispatch
        } = this.props;
        return (
            <div style={{ height, width }} className={styles.container}>
                <CombinedLayer
                    layers={visibleEfxLines}
                    height={height}
                    width={width}
                    shouldSaveFrame
                    showPoints={showPoints}
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
