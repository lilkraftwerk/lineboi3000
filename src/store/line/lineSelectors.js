import { createSelector } from 'reselect';
import {
    getLayers,
    getVisibleLayerIDs,
    getVisibleLayers
} from '../layer/layerSelectors';

export const getOriginalLines = (state) => state.originalLinesReducer.present;
export const getEfxLines = (state) => state.efxLinesReducer;

export const getVisibleOriginalLines = createSelector(
    [getVisibleLayerIDs, getOriginalLines],
    (visibleLayerIDs, originalLines) => {
        return { originalLines, visibleLayerIDs };
    }
);

export const getAllOriginalLines = createSelector(
    [getVisibleLayerIDs, getOriginalLines],
    (visibleLayerIDs, originalLines) => {
        return originalLines;
    }
);

export const getVisibleEfxLines = createSelector(
    [getVisibleLayers, getEfxLines],
    (visibleLayers, efxLines) => {
        return visibleLayers.map((layer) => {
            return {
                id: layer.id,
                color: layer.color,
                efxLines: efxLines[layer.id] || []
            };
        });
    }
);

export const getAllEfxLines = createSelector(
    [getLayers, getEfxLines],
    (layers, efxLines) => {
        return layers.map((layer) => {
            return {
                id: layer.id,
                color: layer.color,
                efxLines: efxLines[layer.id] || [],
                visible: layer.visible
            };
        });
    }
);
