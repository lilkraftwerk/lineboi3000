import React from 'react';
import * as styles from './Icon.styles.css';

const Icon = ({
    disabled = false,
    emoji,
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
    const imgStyles = disabled
        ? `${styles.img} ${styles.imgDisabled}`
        : styles.img;

    return (
        <div
            id={testID}
            onClick={() => {
                onClickFunc();
            }}
            style={{ height: `${height}px`, width: `${width}px`, ...bgStyles }}
            className={stylesClass}
        >
            {' '}
            {emoji && (
                <img className={imgStyles} src={`assets/emojis/${emoji}.png`} />
            )}
        </div>
    );
};

export default Icon;
