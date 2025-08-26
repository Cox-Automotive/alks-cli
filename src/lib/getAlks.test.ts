import { getAlks } from './getAlks';
import ALKS from 'alks.js';

jest.mock('alks.js');

let mockCreate: jest.Mock;
let mockAlksInstance: any;
let createChain: any[];

beforeEach(() => {
  createChain = [];
  mockAlksInstance = {
    getAccessToken: jest.fn().mockResolvedValue({ accessToken: 'testtoken' }),
  };
  mockCreate = jest.fn().mockImplementation((opts) => {
    createChain.push(opts);
    // First call returns an object with create for chaining
    if (createChain.length === 1) {
      return { ...mockAlksInstance, create: mockCreate };
    }
    // Second call returns the mock client
    return mockAlksInstance;
  });
  (ALKS.create as unknown as jest.Mock) = mockCreate;
});

describe('getAlks', () => {
  it('should pass custom headers to ALKS client', async () => {
    const customHeaders = { 'X-Test-Header': 'value' };
    await getAlks({ token: 'sometoken', headers: customHeaders });
    // Check that headers were passed in params (first call)
    expect(createChain[0]).toEqual(
      expect.objectContaining({ headers: customHeaders })
    );
  });

  it('should set Authorization header when using token', async () => {
    await getAlks({ token: 'sometoken' });
    expect(mockAlksInstance.getAccessToken).toHaveBeenCalledWith({
      refreshToken: 'sometoken',
    });
    // The second call to create should include the Authorization header
    expect(createChain[1]).toEqual(
      expect.objectContaining({
        headers: { Authorization: 'Bearer testtoken' },
      })
    );
  });
});
