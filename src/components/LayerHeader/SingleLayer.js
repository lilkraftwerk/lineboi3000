import React, { Fragment, useState } from 'react';
import ColorPicker from 'components/common/ColorPicker';
import Icon from 'components/common/Icon';

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
        <Icon height={24} width={24} fileName="checkmark" disabled />
    ) : (
        <Icon
            height={24}
            width={24}
            fileName="checkmark"
            onClick={() => {
                onSelectLayer(layer.id);
            }}
        />
    );

    const nameContent = isNameEditable ? (
        <Fragment>
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
                fileName="floppy"
            />
        </Fragment>
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

    return (
        <div
            className={
                isSelected ? styles.singleLayerSelected : styles.singleLayer
            }
        >
            <div className={styles.nameContainer}>{nameContent}</div>
            <div className={styles.midControls}>
                <Icon
                    height={24}
                    width={24}
                    fileName="arrow-left"
                    disabled={!canMoveDown}
                    onClick={() => {
                        onMoveLayerDown(layer.id);
                    }}
                />
                <Icon
                    height={24}
                    width={24}
                    fileName="arrow-right"
                    disabled={!canMoveUp}
                    onClick={() => {
                        onMoveLayerUp(layer.id);
                    }}
                />
                <Icon
                    height={24}
                    width={24}
                    fileName="duplicate"
                    onClick={() => {
                        onDuplicateLayer(layer.id);
                    }}
                />
                <Icon
                    height={24}
                    width={24}
                    fileName="trash"
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
                    fileName={layer.visible ? 'eye-open' : 'eye-closed'}
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
                    fileName="cleanpaper"
                    onClick={() => {
                        onClearLayer(layer.id);
                    }}
                />
            </div>
        </div>
    );
};

export default SingleLayer;
