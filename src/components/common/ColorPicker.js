import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
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
                {shuffledColors.map(hexString => {
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

ColorPicker.propTypes = {
    colorList: PropTypes.arrayOf(PropTypes.string).isRequired,
    onColorSelect: PropTypes.func.isRequired
};

const ColorPickerWrapper = ({ onColorSelect, selectedColor = '#364B44' }) => {
    const [visible, toggleVisible] = useState(false);

    const selectAndClose = hexColor => {
        toggleVisible(false);
        onColorSelect(hexColor);
    };

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
                        <Fragment>
                            <ColorPicker
                                onColorSelect={selectAndClose}
                                colorList={ColorList}
                            />
                        </Fragment>
                    );
                }}
            >
                <Icon
                    height={24}
                    width={24}
                    onClick={() => {
                        toggleVisible(!visible);
                    }}
                    bgColor={selectedColor}
                />
            </Popover>
        </Fragment>
    );
};

ColorPickerWrapper.propTypes = {
    selectedColor: PropTypes.string.isRequired,
    onColorSelect: PropTypes.func.isRequired
};

export default ColorPickerWrapper;
