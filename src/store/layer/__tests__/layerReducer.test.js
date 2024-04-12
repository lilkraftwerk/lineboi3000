import * as actions from '../layerActions';
import layerReducer from '../layerReducer';

describe('layer reducer', () => {
    describe('ADD_LAYER', () => {
        it('should add a new layer', () => {
            const action = actions.addLayer();
            const result = layerReducer(
                {
                    layers: []
                },
                action
            );

            expect(result.layers.length).toEqual(1);
        });

        it('should set new layer to active', () => {
            const initLayerState = [
                {
                    id: 'xyz',
                    filters: [{ name: 'distort', enabled: true }]
                },
                {
                    id: 'cat',
                    filters: [{ name: 'move', enabled: true }]
                }
            ];

            const action = actions.addLayer();
            const result = layerReducer(
                {
                    layers: initLayerState
                },
                action
            );

            const newLayer = result.layers[2];
            expect(result.currentLayerID).toEqual(newLayer.id);
            expect(result.layers.length).toEqual(3);
        });
    });

    describe('UPDATE_LAYER_SETTING', () => {
        it('should update the settings for a specific layer', () => {
            const layerState = [
                {
                    id: 'xyz',
                    color: 'black',
                    visible: false
                }
            ];

            const action = actions.updateLayerSetting('xyz', 'color', 'pink');

            const result = layerReducer(
                {
                    layers: layerState
                },
                action
            );

            expect(result.layers[0].color).toEqual('pink');
        });
    });

    describe('SELECT_CURRENT_LAYER', () => {
        it('should change the currentLayerID', () => {
            const initState = {
                currentLayerID: 'dog'
            };

            const action = actions.selectCurrentLayer('xyz');

            const result = layerReducer(initState, action);

            expect(result.currentLayerID).toEqual('xyz');
        });
    });

    describe('MOVE_LAYER_UP', () => {
        it('should move the layer up when it is not the highest layer', () => {
            const initState = {
                layers: [
                    {
                        id: 'xyz'
                    },
                    {
                        id: 'cat'
                    },
                    {
                        id: 'dog'
                    }
                ]
            };

            const action = actions.moveLayerUp('cat');

            const result = layerReducer(initState, action);

            expect(result.layers).toEqual([
                {
                    id: 'xyz'
                },
                {
                    id: 'dog'
                },
                {
                    id: 'cat'
                }
            ]);
        });
    });

    it('should do nothing when the layer is the highest layer', () => {
        const initState = {
            layers: [
                {
                    id: 'xyz'
                },
                {
                    id: 'cat'
                },
                {
                    id: 'dog'
                }
            ]
        };

        const action = actions.moveLayerUp('dog');

        const result = layerReducer(initState, action);

        expect(result).toEqual(initState);
    });

    describe('MOVE_LAYER_DOWN', () => {
        it('should move the layer DOWN when it is not the highest layer', () => {
            const initState = {
                layers: [
                    {
                        id: 'xyz'
                    },
                    {
                        id: 'cat'
                    },
                    {
                        id: 'dog'
                    }
                ]
            };

            const action = actions.moveLayerDown('cat');

            const result = layerReducer(initState, action);

            expect(result.layers).toEqual([
                {
                    id: 'cat'
                },
                {
                    id: 'xyz'
                },
                {
                    id: 'dog'
                }
            ]);
        });
    });

    it('should do nothing when the layer is the lowest layer', () => {
        const initState = {
            layers: [
                {
                    id: 'xyz'
                },
                {
                    id: 'cat'
                },
                {
                    id: 'dog'
                }
            ]
        };

        const action = actions.moveLayerDown('xyz');

        const result = layerReducer(initState, action);

        expect(result).toEqual(initState);
    });

    describe('DUPLICATE_LAYER', () => {
        it('should properly duplicate the layer', () => {
            const initState = {
                layers: [
                    {
                        id: 'xyz',
                        name: 'hello',
                        color: 'pink'
                    },
                    {
                        id: 'doggo',
                        name: 'hi',
                        color: 'red'
                    }
                ]
            };

            const action = actions.duplicateLayer('doggo', 'catto');
            const result = layerReducer(initState, action);

            expect(result.layers).toEqual([
                {
                    id: 'xyz',
                    name: 'hello',
                    color: 'pink'
                },
                {
                    id: 'doggo',
                    name: 'hi',
                    color: 'red'
                },
                {
                    id: 'catto',
                    name: 'hi dupli',
                    color: 'red'
                }
            ]);
        });
    });

    describe('ADD_FILTER_TO_LAYER_BY_ID', () => {
        it('should add a new filter to the proper layer', () => {
            const initState = {
                layers: [
                    {
                        id: 'xyz',
                        name: 'hello',
                        color: 'pink',
                        filters: []
                    },
                    {
                        id: 'doggo',
                        name: 'hi',
                        color: 'red',
                        filters: [
                            { id: 'bong', name: 'distort', enabled: false }
                        ]
                    }
                ]
            };

            const action = actions.addFilterToLayerByID('doggo', {
                name: 'wiggle',
                enabled: false,
                id: 'abcde'
            });
            const result = layerReducer(initState, action);

            expect(result.layers).toEqual([
                {
                    id: 'xyz',
                    name: 'hello',
                    color: 'pink',
                    filters: []
                },
                {
                    id: 'doggo',
                    name: 'hi',
                    color: 'red',
                    filters: [
                        { id: 'bong', name: 'distort', enabled: false },
                        {
                            name: 'wiggle',
                            enabled: false,
                            id: 'abcde'
                        }
                    ]
                }
            ]);
        });
    });

    describe('DELETE_FILTER_FROM_LAYER', () => {
        it('should delete a filter from the layer', () => {
            const initState = {
                layers: [
                    {
                        id: 'layer1',
                        name: 'hello',
                        color: 'pink',
                        filters: [
                            { id: 'abc', name: 'wiggle', enabled: false },
                            { id: 'def', name: 'move', enabled: false },
                            { id: 'd0g', name: 'distort', enabled: false }
                        ]
                    }
                ]
            };

            const action = actions.deleteFilterFromLayer('layer1', 'def');

            const result = layerReducer(initState, action);

            expect(result.layers).toEqual([
                {
                    id: 'layer1',
                    name: 'hello',
                    color: 'pink',
                    filters: [
                        { id: 'abc', name: 'wiggle', enabled: false },
                        { id: 'd0g', name: 'distort', enabled: false }
                    ]
                }
            ]);
        });
    });

    describe('MOVE_FILTER_UP', () => {
        const initState = {
            layers: [
                {
                    id: 'layer1',
                    name: 'hello',
                    color: 'pink',
                    filters: [
                        { id: 'abc', name: 'wiggle', enabled: false },
                        { id: 'def', name: 'move', enabled: false },
                        { id: 'hji', name: 'distort', enabled: false }
                    ]
                }
            ]
        };

        it('should not move a filter up if it cannot move', () => {
            const action = actions.moveFilterUp('layer1', 'hji');
            const result = layerReducer(initState, action);
            expect(result).toEqual(initState);
        });

        it('should move a filter up if it can move', () => {
            const action = actions.moveFilterUp('layer1', 'def');
            const result = layerReducer(initState, action);
            expect(result.layers[0].filters.map((f) => f.id)).toEqual([
                'abc',
                'hji',
                'def'
            ]);
        });
    });

    describe('MOVE_FILTER_DOWN', () => {
        const initState = {
            layers: [
                {
                    id: 'layer1',
                    name: 'hello',
                    color: 'pink',
                    filters: [
                        { id: 'abc', name: 'wiggle', enabled: false },
                        { id: 'def', name: 'move', enabled: false },
                        { id: 'hji', name: 'distort', enabled: false }
                    ]
                }
            ]
        };

        it('should not move a filter down if it cannot move', () => {
            const action = actions.moveFilterDown('layer1', 'abc');
            const result = layerReducer(initState, action);
            expect(result).toEqual(initState);
        });

        it('should move a filter down if it can move', () => {
            const action = actions.moveFilterDown('layer1', 'def');
            const result = layerReducer(initState, action);
            expect(result.layers[0].filters.map((f) => f.id)).toEqual([
                'def',
                'abc',
                'hji'
            ]);
        });
    });

    describe('UPDATE_FILTER_BY_LAYER_ID_AND_FILTER_ID', () => {
        it('should add a new filter to the proper layer', () => {
            const initState = {
                layers: [
                    {
                        id: 'xyz',
                        name: 'hello',
                        color: 'pink',
                        filters: [
                            { id: 'asdfadf', name: 'wiggle', enabled: false }
                        ]
                    },
                    {
                        id: 'doggo',
                        name: 'hi',
                        color: 'red',
                        filters: [
                            { id: 'bong', name: 'distort', enabled: false },
                            {
                                name: 'wiggle',
                                enabled: false,
                                id: 'abcde'
                            }
                        ]
                    }
                ]
            };

            const action = actions.updateFilterByLayerIDandFilterID(
                'doggo',
                'bong',
                {
                    id: 'bong',
                    name: 'distort',
                    enabled: true,
                    maxWidth: 10
                }
            );

            const result = layerReducer(initState, action);

            expect(result.layers).toEqual([
                {
                    id: 'xyz',
                    name: 'hello',
                    color: 'pink',
                    filters: [{ id: 'asdfadf', name: 'wiggle', enabled: false }]
                },
                {
                    id: 'doggo',
                    name: 'hi',
                    color: 'red',
                    filters: [
                        {
                            id: 'bong',
                            name: 'distort',
                            enabled: true,
                            maxWidth: 10
                        },
                        {
                            name: 'wiggle',
                            enabled: false,
                            id: 'abcde'
                        }
                    ]
                }
            ]);
        });
    });
});
