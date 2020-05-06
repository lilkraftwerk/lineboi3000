import React from 'react';

import styles from './ToggleSwitch.styles.css';

const ToggleSwitch = ({
    label,
    checked,
    onChange = () => {},
    disabled = false
}) => {
    return (
        <div className={styles.toggleSwitch}>
            <label className={styles.switch}>
                <span>{label}</span>
                <input className={styles.input} type="checkbox" />{' '}
                <div className={styles.sideDiv} />
            </label>
        </div>
    );
};

export default ToggleSwitch;
