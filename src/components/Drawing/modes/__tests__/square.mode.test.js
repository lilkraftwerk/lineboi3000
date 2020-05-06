import {
    testOnStart,
    testOnMove,
    testOnEnd
} from '../../../../utils/testUtils';
import square from '../square.mode';

describe('square drawing mode', () => {
    describe('onStart', () => {
        it('returns valid points', () => {
            expect(testOnStart(square, 'square')).toBe(true);
        });
    });

    describe('onMove', () => {
        it('returns valid points', () => {
            expect(testOnMove(square, 'square')).toBe(true);
        });
    });

    describe('onEnd', () => {
        it('returns valid points', () => {
            expect(testOnEnd(square, 'square')).toBe(true);
        });
    });
});
