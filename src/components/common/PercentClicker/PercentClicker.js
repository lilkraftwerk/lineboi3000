import _ from 'lodash';
import React from 'react';

import * as styles from './PercentClicker.styles.css';

const PercentClicker = ({
    title,
    minLabel,
    maxLabel,
    minValue = 0,
    maxValue = 100,
    float = false,
    currentValue = 50,
    setValue = () => {},
    showValue = false
}) => {
    const valueToPercentOfRange =
        ((currentValue - minValue) * 100) / (maxValue - minValue);

    const percentToValueWithinRange = (absPercent) => {
        return (absPercent * (maxValue - minValue)) / 100 + minValue;
    };

    const titleDisplay =
        title || showValue
            ? <div className={styles.title}>
                  {title} {currentValue && `=> ${currentValue}`}
              </div>
            : null;

    const rangeContainerClass = title
        ? styles.rangeContainerWithTitle
        : styles.rangeContainerWithoutTitle;

    const innerRangeClass = styles.rangeWithoutLabels;

    const handleChange = (e) => {
        const clickValueInPercent = Number(e.target.value);

        const valueWithinRange = percentToValueWithinRange(clickValueInPercent);

        if (!float) {
            setValue(_.round(valueWithinRange));
            return;
        }
        setValue(_.round(valueWithinRange, 4));
    };

    return (
        <div className={styles.clickoContainer}>
            {minLabel && (
                <div
                    onClick={() => {
                        setValue(minValue);
                    }}
                    className={`${styles.extremeLabels} ${styles.minLabel}`}
                >
                    {minLabel}
                </div>
            )}
            {titleDisplay}
            {maxLabel && (
                <div
                    onClick={() => {
                        setValue(maxValue);
                    }}
                    className={`${styles.extremeLabels} ${styles.maxLabel}`}
                >
                    {maxLabel}
                </div>
            )}
            <div className={`${rangeContainerClass} ${styles.rangeGrid}`}>
                <div className={innerRangeClass}>
                    <input
                        onChange={(e) => {
                            handleChange(e);
                        }}
                        min={0}
                        max={100}
                        type="range"
                        value={valueToPercentOfRange}
                    />
                </div>
            </div>
        </div>
    );
};

export default PercentClicker;
