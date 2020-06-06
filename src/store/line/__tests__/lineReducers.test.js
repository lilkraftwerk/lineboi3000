import { originalLinesReducer, efxLinesReducer } from '../lineReducers';

import * as actions from '../lineActions';
import { duplicateLayer } from '../../layer/layerActions';

describe('originalLinesReducer', () => {
    describe('ADD_LINE_TO_LAYER_BY_ID', () => {
        it('should create an array and add the line to it when none exists', () => {
            const action = actions.addLineToLayerByID('xyz', [
                [1, 3],
                [1, 2]
            ]);
            const result = originalLinesReducer({}, action);
            const layer = result.xyz;
            expect(layer.length).toEqual(1);
        });
    });

    describe('ADD_MULTIPLE_LINES_TO_LAYER_BY_ID', () => {
        const firstCoords = [
            [1, 3],
            [2, 3]
        ];
        const secondCoords = [
            [1, 2],
            [10, 10]
        ];

        it('should create an array and add the lines to it when none exists', () => {
            const action = actions.addMultipleLinesToLayerByID('xyz', [
                firstCoords,
                secondCoords
            ]);
            const result = originalLinesReducer({}, action);
            const layer = result.xyz;
            expect(layer[0].pointArrayContainer).toEqual(firstCoords);
            expect(layer[1].pointArrayContainer).toEqual(secondCoords);
        });

        it('should add the lines to existing lines if they exist', () => {
            const action = actions.addMultipleLinesToLayerByID('xyz', [
                firstCoords,
                secondCoords
            ]);

            const result = originalLinesReducer(
                {
                    xyz: [
                        {
                            id: 'catto',
                            pointArrayContainer: [
                                [10, 15],
                                [100, 100]
                            ]
                        }
                    ]
                },
                action
            );
            const layer = result.xyz;
            expect(layer[1].pointArrayContainer).toEqual(firstCoords);
            expect(layer[2].pointArrayContainer).toEqual(secondCoords);
        });
    });

    describe('SET_LAYER_EFX_LINES', () => {
        it('should set the efxd lines for a layer', () => {
            const action = actions.setLayerEfxLines('xyz', [
                [1, 3],
                [1, 2]
            ]);
            const result = efxLinesReducer({}, action);
            expect(result.xyz).toEqual([
                [1, 3],
                [1, 2]
            ]);
        });
    });

    describe('DUPLICATE_LAYER', () => {
        it('should duplicate the lines for a layer in both reducers', () => {
            const originalLines = {
                dog: [
                    [1, 1],
                    [2, 2]
                ]
            };

            const efxLines = {
                dog: [
                    [6, 6],
                    [8, 8]
                ]
            };

            const action = duplicateLayer('dog', 'cat');
            const originalLineResult = originalLinesReducer(
                originalLines,
                action
            );
            const efxLineResult = efxLinesReducer(efxLines, action);
            expect(originalLineResult).toEqual({
                ...originalLines,
                cat: [
                    [1, 1],
                    [2, 2]
                ]
            });
            expect(efxLineResult).toEqual({
                ...efxLines,
                cat: [
                    [6, 6],
                    [8, 8]
                ]
            });
        });
    });
});
