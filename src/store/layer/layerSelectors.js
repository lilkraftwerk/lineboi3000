import { partition as _partition } from 'es-toolkit';
import { createSelector } from 'reselect';

export const getLayers = (state) => {
    return state.layerReducer.layers;
};

export const getCurrentLayerID = (state) => state.layerReducer.currentLayerID;

export const getCurrentLayer = createSelector(
    [getLayers, getCurrentLayerID],
    (layers, currentLayerId) => {
        return layers.find((layer) => layer.id === currentLayerId);
    }
);

export const getRenderLines = createSelector([getLayers], (layers) => {
    const visibleLayers = layers.filter((layer) => layer.visible === true);
    return visibleLayers.flatMap(({ lines }) => lines);
});

export const getVisibleAndInvisibleLayers = createSelector(
    [getLayers],
    (layers) => {
        const [visibleLayers, invisibleLayers] = _partition(
            layers,
            (layer) => layer.visible
        );
        return { visibleLayers, invisibleLayers };
    }
);

export const getVisibleEfxLayers = createSelector(
    [getVisibleAndInvisibleLayers],
    ({ visibleLayers }) => {
        const mapped = visibleLayers.map((layer) => {
            return {
                id: layer.id,
                color: layer.color
            };
        });
        return mapped;
    }
);

export const getVisibleLayers = createSelector([getLayers], (layers) => {
    const visibleLayers = layers.filter((layer) => layer.visible === true);
    return visibleLayers;
});

export const getVisibleLayerIDs = createSelector([getLayers], (layers) => {
    const visibleLayers = layers.filter((layer) => layer.visible === true);
    return visibleLayers.map((layer) => layer.id);
});
