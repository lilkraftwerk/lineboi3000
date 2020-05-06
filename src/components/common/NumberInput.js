import React from 'react';

import styles from './NumberInput.styles.css';

const NumberInput = ({
    value,
    suffix,
    minValue,
    maxValue,
    label,
    onChange = () => {},
    disabled = false
}) => {
    return (
        <div className={styles.numberWrapper}>
            <div className={styles.label}>{label}</div>
            <input
                value={`${value}`}
                type="text"
                onChange={() => {
                    onChange();
                }}
                disabled={disabled}
                className={styles.numberInput}
            />
            {suffix && <div className={styles.suffix}>{suffix}</div>}
        </div>
    );
};

export default NumberInput;
