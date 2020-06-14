import _ from 'lodash';
import React from 'react';

import styles from './ToggleButton.styles.css';

const ToggleButton = ({
    label,
    enabled,
}) => {
    return (
        <div className={styles.toggleContainer}>
           <label class="switch">
  <input typeName="checkbox" />
  <span className="slider"></span>
            </label>
        </div>
    );
};

export default ToggleButton;
