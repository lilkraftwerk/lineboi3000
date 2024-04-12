import * as actions from '../globalActions';
import globalReducer from '../globalReducer';

describe('global reducer', () => {
    describe('SWITCH_MODE', () => {
        it('should switch mode', () => {
            const action = actions.switchMode('draw');

            expect(globalReducer({}, action)).toEqual({ mode: 'draw' });
        });
    });

    describe('TOGGLE_GRID_VISIBILITY', () => {
        it('should set grid visible', () => {
            const action = actions.toggleGridVisibility();

            expect(
                globalReducer(
                    {
                        grid: {
                            visible: false
                        }
                    },
                    action
                )
            ).toEqual({ grid: { visible: true } });
        });

        it('should set grid to not visible', () => {
            const action = actions.toggleGridVisibility();

            expect(
                globalReducer(
                    {
                        grid: {
                            visible: true
                        }
                    },
                    action
                )
            ).toEqual({ grid: { visible: false } });
        });
    });

    describe('SET_GRID_OPTIONS', () => {
        it('should set grid options', () => {
            const action = actions.setGridOptions({
                height: 10,
                width: 10
            });

            expect(
                globalReducer(
                    {
                        grid: {
                            visible: true
                        }
                    },
                    action
                )
            ).toEqual({
                grid: {
                    visible: true,
                    height: 10,
                    width: 10
                }
            });
        });
    });
});
