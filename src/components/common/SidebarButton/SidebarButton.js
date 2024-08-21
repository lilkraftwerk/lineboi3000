import React from 'react';

import * as styles from './SidebarButton.styles.css';

export const SidebarButton = ({
    label,
    onClick = () => {},
    disabled = false,
    span = 1
}) => {
    return (
        <button
            style={{ gridColumn: `span ${span}` }}
            type="button"
            onClick={() => {
                onClick();
            }}
            disabled={disabled}
            className={styles.sidebarButton}
        >
            {label}
        </button>
    );
};

export const EmojiButton = ({
    onClick = () => {},
    disabled = false,
    style = {},
    text = '',
    emoji = ''
}) => {
    return (
        <button
            style={style}
            className={styles.emojiButton}
            type="button"
            onClick={() => {
                onClick();
            }}
            disabled={disabled}
        >
            <img
                className={styles.emojiButtonEmoji}
                src={`assets/emojis/${emoji}.png`}
            />
            <div className={styles.emojiButtonText}>{text}</div>
        </button>
    );
};

export const EnabledToggleButton = ({
    labelActive,
    labelInactive,
    onClick = () => {},
    active,
    disabled = false,
    style = {}
}) => {
    return (
        <button
            style={style}
            type="button"
            onClick={() => {
                onClick(!active);
            }}
            disabled={disabled}
            className={`${styles.enabledToggleButton} ${
                active ? styles.active : styles.inactive
            }`}
        >
            {active ? labelActive : labelInactive}
        </button>
    );
};

export default SidebarButton;
