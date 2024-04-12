import {
    SET_GRID_OPTIONS,
    SWITCH_MODE,
    TOGGLE_GRID_VISIBILITY,
    setGridOptions,
    switchMode,
    toggleGridVisibility
} from '../globalActions';

describe('global actions', () => {
    describe('switchMode', () => {
        it('should switch mode properly', () => {
            const result = switchMode('draw');

            expect(result).toEqual({
                type: SWITCH_MODE,
                value: 'draw'
            });
        });
    });

    describe('toggleGridVisibility', () => {
        it('should toggle grid visibility', () => {
            const result = toggleGridVisibility();

            expect(result).toEqual({
                type: TOGGLE_GRID_VISIBILITY
            });
        });
    });

    describe('setGridOptions', () => {
        it('should set grid options', () => {
            const result = setGridOptions({
                height: 10,
                width: 10
            });

            expect(result).toEqual({
                type: SET_GRID_OPTIONS,
                value: {
                    height: 10,
                    width: 10
                }
            });
        });
    });
});
