import React, { Fragment, useState } from 'react';
import ColorPicker from 'components/common/Colors/ColorPicker';
import Icon from 'components/common/Icon/Icon';

import styles from './LayerHeader.styles.css';

const SingleLayer = ({
    layer,
    isSelected,
    onSelectLayer,
    onUpdateLayerSetting,
    onMoveLayerDown,
    onMoveLayerUp,
    onDeleteLayer,
    onDuplicateLayer,
    onClearLayer,
    canMoveUp,
    canMoveDown,
    canDelete
}) => {
    const [isNameEditable, toggleNameEdit] = useState(false);

    const selectLayerIcon = isSelected ? (
        <Icon height={24} width={24} emoji="greencheck" disabled />
    ) : (
        <Icon
            height={24}
            width={24}
            emoji="check"
            onClick={() => {
                onSelectLayer(layer.id);
            }}
        />
    );

    const nameContent = isNameEditable ? (
        <>
            <input
                type="text"
                maxLength="20"
                className={styles.nameInput}
                value={layer.name}
                onChange={(e) => {
                    onUpdateLayerSetting(layer.id, 'name', e.target.value);
                }}
            />
            <Icon
                height={24}
                width={24}
                onClick={() => {
                    toggleNameEdit(!isNameEditable);
                }}
                emoji="floppy"
            />
        </>
    ) : (
        <div
            onClick={() => {
                toggleNameEdit(!isNameEditable);
            }}
            className={styles.name}
        >
            {layer.name}
        </div>
    );

    const classNames = `${
        isSelected ? styles.singleLayerSelected : styles.singleLayer
    } singleLayer`;

    return (
        <div className={classNames}>
            <div className={styles.nameContainer}>{nameContent}</div>
            <div className={styles.midControls}>
                <Icon
                    height={24}
                    width={24}
                    emoji="leftarrow"
                    disabled={!canMoveDown}
                    onClick={() => {
                        onMoveLayerDown(layer.id);
                    }}
                />
                <Icon
                    height={24}
                    width={24}
                    emoji="rightarrow"
                    disabled={!canMoveUp}
                    onClick={() => {
                        onMoveLayerUp(layer.id);
                    }}
                />
                <Icon
                    height={24}
                    width={24}
                    emoji="repeat"
                    onClick={() => {
                        onDuplicateLayer(layer.id);
                    }}
                />
                <Icon
                    height={24}
                    width={24}
                    emoji="trashperson"
                    disabled={!canDelete}
                    onClick={() => {
                        onDeleteLayer(layer.id);
                    }}
                />
            </div>
            <div className={styles.lowerControls}>
                {selectLayerIcon}
                <Icon
                    height={24}
                    width={24}
                    emoji={layer.visible ? 'eye' : 'closedeye'}
                    onClick={() => {
                        onUpdateLayerSetting(
                            layer.id,
                            'visible',
                            !layer.visible
                        );
                    }}
                />
                <ColorPicker
                    selectedColor={layer.color}
                    onColorSelect={(newColor) => {
                        onUpdateLayerSetting(layer.id, 'color', newColor);
                    }}
                />
                <Icon
                    height={24}
                    width={24}
                    emoji="recycling"
                    onClick={() => {
                        onClearLayer(layer.id);
                    }}
                />
            </div>
        </div>
    );
};

export default SingleLayer;
