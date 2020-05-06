import id from '../id';

describe('id()', () => {
    it('generates a 20 character id', () => {
        const newID = id();
        expect(newID.length).toEqual(20);
    });
});
