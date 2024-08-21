import React from 'react';

import * as styles from './NumberInput.styles.css';

const NumberInput = ({
    value,
    suffix,
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
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                disabled={disabled}
                className={styles.numberInput}
            />
            {suffix && <div className={styles.suffix}>{suffix}</div>}
        </div>
    );
};

export default NumberInput;
