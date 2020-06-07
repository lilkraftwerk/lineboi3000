import React, { useState } from 'react';
import PropTypes, { LayerType } from 'customPropTypes';
import { connect } from 'react-redux';
import idGenerator from 'utils/id';
import _ from 'lodash';
import {
    addLayer,
    selectCurrentLayer,
    setVisibilityForAllLayers,
    updateLayerSetting,
    moveLayerUp,
    moveLayerDown,
    deleteLayer,
    duplicateLayer
} from 'store/layer/layerActions';

import { clearLayer } from 'store/line/lineActions';

import Icon from 'components/common/Icon';
import SingleLayer from './SingleLayer';

import styles from './LayerHeader.styles.css';

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
                    height={32}
                    width={32}
                    fileName="plus"
                    onClick={() => {
                        dispatch(addLayer());
                    }}
                />
                <Icon
                    height={32}
                    width={32}
                    fileName={showAll ? 'eye-open' : 'eye-closed'}
                    onClick={() => {
                        toggleShowAll(!showAll);
                        dispatch(setVisibilityForAllLayers(!showAll));
                    }}
                />
            </div>
            {mappedLayers}
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

LayerControls.defaultProps = {};

LayerControls.propTypes = {
    dispatch: PropTypes.func.isRequired,
    layers: PropTypes.arrayOf(LayerType).isRequired,
    currentLayerID: PropTypes.string.isRequired
};
