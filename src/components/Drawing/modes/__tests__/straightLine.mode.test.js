import {
    testOnStart,
    testOnMove,
    testOnEnd
} from '../../../../utils/testUtils';
import straightLine from '../straightLine.mode';

describe('straight line drawing mode', () => {
    describe('onStart', () => {
        it('returns valid points', () => {
            expect(testOnStart(straightLine, 'straightLine')).toBe(true);
        });
    });

    describe('onMove', () => {
        it('returns valid points', () => {
            expect(testOnMove(straightLine, 'straightLine')).toBe(true);
        });
    });

    describe('onEnd', () => {
        it('returns valid points', () => {
            expect(testOnEnd(straightLine, 'straightLine')).toBe(true);
        });
    });
});
