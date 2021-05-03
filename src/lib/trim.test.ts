import { trim } from './trim';
describe('trim', () => {
  it('should trim strings', () => {
    const result = trim('   thing ');
    expect(result).toEqual('thing');
  });
});
