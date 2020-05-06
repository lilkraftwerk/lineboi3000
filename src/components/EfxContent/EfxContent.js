import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getVisibleEfxLines } from 'store/line/lineSelectors';
import { getCurrentOptions } from 'store/onions/onionsSelectors';
import { setTempBlob } from 'store/gifmaker/gifmakerActions';
import { CombinedLayer } from 'components/common/SvgLayer';

import styles from './EfxContent.styles.css';

class EfxContainer extends React.Component {
    shouldComponentUpdate(nextProps) {
        const { height, width, visibleEfxLines } = this.props;
        const areNotEqual = (a, b) => {
            return !_.isEqual(a, b);
        };

        if (areNotEqual(height, nextProps.height)) {
            return true;
        }

        if (areNotEqual(width, nextProps.width)) {
            return true;
        }

        if (areNotEqual(visibleEfxLines, nextProps.visibleEfxLines)) {
            return true;
        }

        return false;
    }

    render() {
        const { height, width, visibleEfxLines, dispatch } = this.props;

        return (
            <div style={{ height, width }} className={styles.container}>
                <CombinedLayer
                    layers={visibleEfxLines}
                    height={height}
                    width={width}
                    shouldSaveFrame
                    blobCallback={blob => {
                        dispatch(setTempBlob(blob));
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const visibleEfxLines = getVisibleEfxLines(state);
    const options = getCurrentOptions(state);

    return {
        ...options,
        visibleEfxLines
    };
};

export default connect(mapStateToProps)(EfxContainer);
