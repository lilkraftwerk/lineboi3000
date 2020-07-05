import React, { useState, Fragment } from 'react';
import _ from 'lodash';
import Popover from 'react-tiny-popover';
import Icon from 'components/common/Icon';
import ColorList from './ColorList';

import styles from './ColorPicker.styles.css';

const ColorPicker = ({ colorList, onColorSelect }) => {
    const [shuffledColors] = useState(_.take(_.shuffle(colorList), 32));
    const [lightTheme, toggleTheme] = useState(true);
    const [bordersEnabled, toggleBorder] = useState(false);
    const [hoveredColor, updateHoverColor] = useState(null);

    const mainColor = lightTheme ? '#f9f6f2' : '#364B44';
    const secondaryColor = lightTheme ? '#364B44' : '#f9f6f2';

    const borderStyle = bordersEnabled
        ? { border: '3px solid transparent' }
        : { border: `3px solid ${secondaryColor}` };

    return (
        <div style={{ backgroundColor: mainColor }} className={styles.wrapper}>
            <div style={{ color: secondaryColor }} className={styles.sidebar}>
                pika color
                <div
                    onClick={() => toggleTheme(!lightTheme)}
                    style={{
                        backgroundColor: secondaryColor,
                        border: `3px dotted ${mainColor}`
                    }}
                    className={styles.backgroundToggle}
                />
                <div
                    onClick={() => toggleBorder(!bordersEnabled)}
                    style={{
                        backgroundColor: secondaryColor,
                        ...borderStyle
                    }}
                    className={styles.borderToggle}
                />
                <div
                    style={{ backgroundColor: hoveredColor, ...borderStyle }}
                    className={styles.colorDisplay}
                />
            </div>
            <div className={styles.colorContainer}>
                {shuffledColors.map((hexString) => {
                    return (
                        <div
                            key={hexString}
                            style={{
                                backgroundColor: hexString,
                                ...borderStyle
                            }}
                            className={styles.oneColor}
                            onClick={() => {
                                onColorSelect(hexString);
                            }}
                            onMouseEnter={() => {
                                updateHoverColor(hexString);
                            }}
                            onMouseLeave={() => {
                                updateHoverColor(null);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const ColorPickerWrapper = ({
    type = 'icon',
    onColorSelect,
    selectedColor = '#364B44'
}) => {
    const [visible, toggleVisible] = useState(false);

    const selectAndClose = (hexColor) => {
        toggleVisible(false);
        onColorSelect(hexColor);
    };

    const iconToggle = (
        <Icon
            height={24}
            width={24}
            onClick={() => {
                toggleVisible(!visible);
            }}
            bgColor={selectedColor}
        />
    );

    const buttonToggle = (
        <button
            style={{ gridColumn: 'span 3' }}
            type="button"
            onClick={() => {
                toggleVisible(!visible);
            }}
        >
            background color
        </button>
    );

    return (
        <Fragment>
            <Popover
                isOpen={visible}
                position={['bottom', 'right', 'left', 'top']}
                padding={25}
                onClickOutside={() => {
                    toggleVisible(!visible);
                }}
                containerStyle={{ zIndex: 100, boxShadow: 'black 3px 3px 1px' }}
                transitionDuration={0.001}
                content={() => {
                    return (
                        <>
                            <ColorPicker
                                onColorSelect={selectAndClose}
                                colorList={ColorList}
                            />
                        </>
                    );
                }}
            >
                {type === 'icon' && iconToggle}
                {type === 'button' && buttonToggle}
            </Popover>
        </Fragment>
    );
};

export default ColorPickerWrapper;
