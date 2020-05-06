import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getVisibleEfxLines } from 'store/line/lineSelectors';
import { getCurrentOptions } from 'store/onions/onionsSelectors';
import { setTempBlob } from 'store/gifmaker/gifmakerActions';
import { CombinedLayer } from 'components/common/SvgLayer';

import styles from './EfxLabContent.styles.css';

class EfxLabContainer extends React.Component {
    render() {
        return (
            <div  className={styles.container}>
                laab
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

export default connect(mapStateToProps)(EfxLabContainer);
