import {
    testOnStart,
    testOnMove,
    testOnEnd
} from '../../../../utils/testUtils';
import pen from '../pen.mode';

describe('pen drawing mode', () => {
    describe('onStart', () => {
        it('returns valid points', () => {
            expect(testOnStart(pen, 'pen')).toBe(true);
        });
    });

    describe('onMove', () => {
        it('returns valid points', () => {
            expect(testOnMove(pen, 'pen')).toBe(true);
        });
    });

    describe('onEnd', () => {
        it('returns valid points', () => {
            expect(testOnEnd(pen, 'pen')).toBe(true);
        });
    });
});
