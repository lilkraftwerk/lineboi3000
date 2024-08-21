import React from 'react';

import * as styles from './PaperCanvas.styles.css';

const PaperCanvas = ({ width, height }) => {
    return (
        <div
            className={styles.paperCanvas}
            style={{
                width,
                height
            }}
        />
    );
};

export default PaperCanvas;
