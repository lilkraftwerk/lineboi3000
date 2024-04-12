import { EmojiButton } from 'components/common/SidebarButton/SidebarButton';
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

            <EmojiButton
                style={{ gridColumn: 'span 2' }}
                text="vertical"
                emoji="updownarrow"
                onClick={() => {
                    setValue(90);
                }}
            />

            <EmojiButton
                style={{ gridColumn: 'span 2' }}
                text="horizontal"
                emoji="leftrightarrow"
                onClick={() => {
                    setValue(0);
                }}
            />
        </div>
    );
};

export default AngleChooser;
