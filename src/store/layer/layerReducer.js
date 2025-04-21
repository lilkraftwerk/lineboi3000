import arrayMove from 'array-move';
import { sample as _sample } from 'es-toolkit';
import id from '../../utils/id';

import {
    // filter stuff
    ADD_FILTER_TO_LAYER_BY_ID,
    ADD_LAYER,
    DELETE_FILTER_FROM_LAYER,
    DELETE_LAYER,
    DUPLICATE_LAYER,
    MOVE_FILTER_DOWN,
    MOVE_FILTER_UP,
    MOVE_LAYER_DOWN,
    MOVE_LAYER_UP,
    SELECT_CURRENT_LAYER,
    SET_FILTERS_FOR_ALL_LAYERS,
    SET_FILTERS_FOR_LAYER_BY_ID,
    SET_VISIBILITY_FOR_ALL_LAYERS,
    UPDATE_FILTER_BY_LAYER_ID_AND_FILTER_ID,
    UPDATE_LAYER_SETTING
} from './layerActions';

const move = (array, oldIndex, newIndex) => {
    return arrayMove(array, oldIndex, newIndex);
};

const getNewLayerState = (count = 0) => ({
    id: id(),
    filters: [],
    color: _sample([
        'black',
        'red',
        'pink',
        'orange',
        'purple',
        'blue',
        'white',
        'pink'
    ]),
    name: `layer ${count + 1}`,
    visible: true,
    loading: false
});

const getInitialState = () => {
    const firstLayerId = id();

    const firstLayer = {
        ...getNewLayerState(false),
        id: firstLayerId
    };

    return {
        currentLayerID: firstLayerId,
        layers: [firstLayer]
    };
};

// to do make this flat, not a nested object
const updateLayerSetting = (layers, { layerID, settingKey, settingValue }) => {
    return layers.map((layer) => {
        if (layer.id === layerID) {
            return {
                ...layer,
                [settingKey]: settingValue
            };
        }

        return layer;
    });
};

const moveLayer = (layers, layerID, up = true) => {
    const down = !up;

    const currentIndex = layers.findIndex((layer) => layer.id === layerID);
    const atBeginning = Boolean(currentIndex === 0);
    const atEnd = Boolean(currentIndex === layers.length - 1);

    if (atBeginning && down) {
        return layers;
    }

    if (atEnd && up) {
        return layers;
    }

    const newIndex = up ? currentIndex + 1 : currentIndex - 1;
    return move(layers, currentIndex, newIndex);
};

const deleteLayer = ({ layers, currentLayerID }, layerToDeleteId) => {
    const filteredLayers = layers.filter(
        (layer) => layer.id !== layerToDeleteId
    );

    if (currentLayerID === layerToDeleteId) {
        return {
            layers: filteredLayers,
            currentLayerID: filteredLayers[0].id
        };
    }

    return {
        layers: filteredLayers
    };
};

const duplicateLayer = (layers, { originalLayerID, newLayerID }) => {
    const originalLayer = layers.find((layer) => layer.id === originalLayerID);

    const duplicatedLayer = {
        ...originalLayer,
        id: newLayerID,
        name: `${originalLayer.name} dupli`
    };

    return [...layers, duplicatedLayer];
};

const addFilterToLayer = (layers, { layerID, filterSettings }) => {
    return layers.map((layer) => {
        if (layer.id !== layerID) {
            return layer;
        }

        return {
            ...layer,
            filters: [...layer.filters, filterSettings]
        };
    });
};

const deleteFilterFromLayer = (layers, { layerID, filterID }) => {
    return layers.map((layer) => {
        if (layer.id !== layerID) {
            return layer;
        }

        const filtered = layer.filters.filter(
            (filter) => filter.id !== filterID
        );

        return {
            ...layer,
            filters: [...filtered]
        };
    });
};

const moveFilter = (layers, { layerID, filterID }, up = true) => {
    const down = !up;

    return layers.map((layer) => {
        if (layer.id !== layerID) {
            return layer;
        }

        const { filters } = layer;

        const currentIndex = filters.findIndex((filter) => filter.id === filterID);

        const atBeginning = Boolean(currentIndex === 0);
        const atEnd = Boolean(currentIndex === filters.length - 1);

        if ((atBeginning && down) || (atEnd && up)) {
            return layer;
        }

        const newIndex = up ? currentIndex + 1 : currentIndex - 1;
        const newFilters = move(filters, currentIndex, newIndex);

        return {
            ...layer,
            filters: newFilters
        };
    });
};

const setFiltersForLayerHelper = (layers, { layerID, filters }) => {
    return layers.map((layer) => {
        if (layer.id !== layerID) {
            return layer;
        }

        return {
            ...layer,
            filters
        };
    });
};

const setFiltersAllForLayersHelper = (layers, { filters }) => {
    return layers.map((layer) => {
        return {
            ...layer,
            filters
        };
    });
};

const updateFilterSettings = (
    layers,
    { layerID, filterID, filterSettings }
) => {
    return layers.map((layer) => {
        if (layer.id !== layerID) {
            return layer;
        }

        const mappedFilters = layer.filters.map((filter) => {
            if (filter.id !== filterID) {
                return filter;
            }

            return {
                ...filter,
                ...filterSettings
            };
        });

        return {
            ...layer,
            filters: mappedFilters
        };
    });
};

const layerReducer = (state = getInitialState(), action) => {
    switch (action.type) {
        case ADD_LAYER: {
            const newLayer = getNewLayerState(state.layers.length); // eslint-disable-line
            return {
                ...state,
                layers: [...state.layers, newLayer],
                currentLayerID: newLayer.id
            };
        }
        case SELECT_CURRENT_LAYER:
            return {
                ...state,
                currentLayerID: action.value
            };
        case UPDATE_LAYER_SETTING:
            return {
                ...state,
                layers: updateLayerSetting(state.layers, action.value)
            };
        case MOVE_LAYER_UP:
            return {
                ...state,
                layers: moveLayer(state.layers, action.value, true)
            };
        case MOVE_LAYER_DOWN:
            return {
                ...state,
                layers: moveLayer(state.layers, action.value, false)
            };
        case DELETE_LAYER:
            return {
                ...state,
                ...deleteLayer(state, action.value)
            };
        case DUPLICATE_LAYER:
            return {
                ...state,
                layers: duplicateLayer(state.layers, action.value)
            };
        case SET_VISIBILITY_FOR_ALL_LAYERS:
            return {
                ...state,
                layers: state.layers.map((layer) => {
                    return {
                        ...layer,
                        visible: action.value
                    };
                })
            };
        case ADD_FILTER_TO_LAYER_BY_ID:
            return {
                ...state,
                layers: addFilterToLayer(state.layers, action.value)
            };
        case SET_FILTERS_FOR_LAYER_BY_ID:
            return {
                ...state,
                layers: setFiltersForLayerHelper(state.layers, action.value)
            };
        case SET_FILTERS_FOR_ALL_LAYERS:
            return {
                ...state,
                layers: setFiltersAllForLayersHelper(state.layers, action.value)
            };
        case DELETE_FILTER_FROM_LAYER:
            return {
                ...state,
                layers: deleteFilterFromLayer(state.layers, action.value)
            };
        case MOVE_FILTER_UP:
            return {
                ...state,
                layers: moveFilter(state.layers, action.value, true)
            };
        case MOVE_FILTER_DOWN:
            return {
                ...state,
                layers: moveFilter(state.layers, action.value, false)
            };
        case UPDATE_FILTER_BY_LAYER_ID_AND_FILTER_ID:
            return {
                ...state,
                layers: updateFilterSettings(state.layers, action.value)
            };
        default:
            return state;
    }
};

export default layerReducer;
