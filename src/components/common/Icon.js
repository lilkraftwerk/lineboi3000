import React from 'react';
import styles from './Icon.styles.css';

const Icon = ({
    disabled = false,
    fileName,
    bgColor,
    onClick = () => {},
    height = 32,
    width = 32,
    testID = ''
}) => {
    const stylesClass = disabled
        ? styles.iconWrapperDisabled
        : styles.iconWrapper;

    const bgStyles = bgColor ? { backgroundColor: bgColor } : {};
    const onClickFunc = disabled ? () => {} : onClick;

    return (
        <div
            id={testID}
            onClick={() => {
                onClickFunc();
            }}
            style={{ height: `${height}px`, width: `${width}px`, ...bgStyles }}
            className={stylesClass}
        >
            {fileName && (
                <img
                    className={styles.img}
                    src={`assets/icons/${fileName}.png`}
                />
            )}
        </div>
    );
};

export default Icon;
