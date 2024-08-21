import _ from 'lodash';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
    addLayer,
    deleteLayer,
    duplicateLayer,
    moveLayerDown,
    moveLayerUp,
    selectCurrentLayer,
    setVisibilityForAllLayers,
    updateLayerSetting
} from 'store/layer/layerActions';
import idGenerator from 'utils/id';

import { clearLayer } from 'store/line/lineActions';

import Icon from 'components/common/Icon/Icon';
import SingleLayer from './SingleLayer';

import * as styles from './LayerHeader.styles.css';

export const LayerControls = ({ layers, currentLayerID, dispatch }) => {
    const firstLayerId = _.first(layers).id;
    const finalLayerId = _.last(layers).id;

    const [showAll, toggleShowAll] = useState(true);

    const onSelectLayer = (id) => {
        dispatch(selectCurrentLayer(id));
    };

    const onUpdateLayerSetting = (id, settingKey, settingValue) => {
        dispatch(updateLayerSetting(id, settingKey, settingValue));
    };

    const onMoveLayerUp = (id) => {
        dispatch(moveLayerUp(id));
    };

    const onMoveLayerDown = (id) => {
        dispatch(moveLayerDown(id));
    };

    const onDeleteLayer = (id) => {
        dispatch(deleteLayer(id));
    };

    const onDuplicateLayer = (id) => {
        const newID = idGenerator();
        dispatch(duplicateLayer(id, newID));
    };

    const onClearLayer = (id) => {
        dispatch(clearLayer(id));
    };

    const canDelete = layers.length > 1;
    const mappedLayers = layers.map((layer) => {
        const isSelected = layer.id === currentLayerID;
        const canMoveUp = layer.id !== finalLayerId;
        const canMoveDown = layer.id !== firstLayerId;

        return (
            <SingleLayer
                key={layer.id}
                layer={layer}
                isSelected={isSelected}
                onSelectLayer={onSelectLayer}
                onUpdateLayerSetting={onUpdateLayerSetting}
                onMoveLayerUp={onMoveLayerUp}
                onMoveLayerDown={onMoveLayerDown}
                onDeleteLayer={onDeleteLayer}
                onDuplicateLayer={onDuplicateLayer}
                canMoveDown={canMoveDown}
                canMoveUp={canMoveUp}
                canDelete={canDelete}
                onClearLayer={onClearLayer}
            />
        );
    });

    return (
        <div className={styles.layerContainer}>
            <div className={styles.layerControls}>
                <Icon
                    testID="addNewLayerIcon"
                    height={32}
                    width={32}
                    emoji="plus"
                    onClick={() => {
                        dispatch(addLayer());
                    }}
                />
                <Icon
                    height={32}
                    width={32}
                    emoji={showAll ? 'eye' : 'closedeye'}
                    onClick={() => {
                        toggleShowAll(!showAll);
                        dispatch(setVisibilityForAllLayers(!showAll));
                    }}
                />
            </div>
            <div className={styles.individualLayersContainer}>
                {mappedLayers}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        layers: state.layerReducer.layers,
        currentLayerID: state.layerReducer.currentLayerID
    };
};

export default connect(mapStateToProps)(LayerControls);
