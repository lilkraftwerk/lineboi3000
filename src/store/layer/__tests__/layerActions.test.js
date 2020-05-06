import * as actions from '../layerActions';

describe('layer actions', () => {
    describe('ADD_LAYER', () => {
        it('should send the correct action type', () => {
            expect(actions.addLayer()).toEqual({
                type: actions.ADD_LAYER
            });
        });
    });

    describe('REMOVE_LAYER', () => {
        it('should send the correct action type', () => {
            expect(actions.removeLayer()).toEqual({
                type: actions.REMOVE_LAYER
            });
        });
    });

    describe('SELECT_CURRENT_LAYER', () => {
        it('should send the correct action type and value', () => {
            expect(actions.selectCurrentLayer('dog')).toEqual({
                type: actions.SELECT_CURRENT_LAYER,
                value: 'dog'
            });
        });
    });

    describe('SET_VISIBILITY_FOR_ALL_LAYERS', () => {
        it('should send the correct action type and value', () => {
            expect(actions.setVisibilityForAllLayers(true)).toEqual({
                type: actions.SET_VISIBILITY_FOR_ALL_LAYERS,
                value: true
            });
        });
    });

    describe('UPDATE_LAYER_SETTING', () => {
        it('should send the correct action type and value', () => {
            expect(actions.updateLayerSetting('xyz', 'color', 'pink')).toEqual({
                type: actions.UPDATE_LAYER_SETTING,
                value: {
                    layerID: 'xyz',
                    settingKey: 'color',
                    settingValue: 'pink'
                }
            });
        });
    });

    describe('MOVE_LAYER_UP', () => {
        it('should send the correct action type and value', () => {
            expect(actions.moveLayerUp('xyz')).toEqual({
                type: actions.MOVE_LAYER_UP,
                value: 'xyz'
            });
        });
    });

    describe('MOVE_LAYER_DOWN', () => {
        it('should send the correct action type and value', () => {
            expect(actions.moveLayerDown('xyz')).toEqual({
                type: actions.MOVE_LAYER_DOWN,
                value: 'xyz'
            });
        });
    });

    describe('DELETE_LAYER', () => {
        it('should send the correct action type and value', () => {
            expect(actions.deleteLayer('xyz')).toEqual({
                type: actions.DELETE_LAYER,
                value: 'xyz'
            });
        });
    });
});
