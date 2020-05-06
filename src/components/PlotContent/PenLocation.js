import _ from 'lodash';
import React from 'react';

import styles from './PenLocation.styles.css';

const PenLocation = ({ width, height, penX, penY }) => {
    return (
        <div
            className={styles.PenLocation}
            style={{
                width,
                height
            }}
        />
    );
};

export default PenLocation;
