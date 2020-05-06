import {
    testOnStart,
    testOnMove,
    testOnEnd
} from '../../../../utils/testUtils';
import text from '../text.mode';

describe('text drawing mode', () => {
    describe('onStart', () => {
        it('returns valid points', () => {
            expect(testOnStart(text, 'text')).toBe(true);
        });
    });

    describe('onMove', () => {
        it('returns valid points', () => {
            expect(testOnMove(text, 'text')).toBe(true);
        });
    });

    describe('onEnd', () => {
        it('returns valid points', () => {
            expect(testOnEnd(text, 'text')).toBe(true);
        });
    });
});
