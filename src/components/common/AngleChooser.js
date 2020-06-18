import React from 'react';

import styles from './AngleChooser.styles.css';

const AngleChooser = ({ currentValue = 50, setValue = () => {} }) => {
    const handleChange = (e) => {
        setValue(Number(e.target.value));
    };

    const backgroundString = `repeating-linear-gradient(${currentValue}deg, black 5px, white 10px)`;
    return (
        <div className={styles.clickoContainer}>
            <div
                style={{ background: backgroundString }}
                className={styles.leftAngle}
            />
            <div className={styles.angleTitle}>
                {`current angle: ${currentValue}`}
            </div>
            <div
                style={{ background: backgroundString }}
                className={styles.rightAngle}
            />
            <div className={styles.inputWrapper}>
                <input
                    onChange={(e) => {
                        handleChange(e);
                    }}
                    min={0}
                    max={180}
                    type="range"
                    value={currentValue}
                />
            </div>

            <button
                type="button"
                onClick={() => {
                    setValue(90);
                }}
                className={styles.button}
            >
                vertical
            </button>
            <button
                type="button"
                onClick={() => {
                    setValue(0);
                }}
                className={styles.button}
            >
                horizontal
            </button>
        </div>
    );
};

export default AngleChooser;
