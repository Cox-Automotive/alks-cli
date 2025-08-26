"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const getAlks_1 = require("./getAlks");
const alks_js_1 = tslib_1.__importDefault(require("alks.js"));
jest.mock('alks.js');
let mockCreate;
let mockAlksInstance;
let createChain;
beforeEach(() => {
    createChain = [];
    mockAlksInstance = {
        getAccessToken: jest.fn().mockResolvedValue({ accessToken: 'testtoken' }),
    };
    mockCreate = jest.fn().mockImplementation((opts) => {
        createChain.push(opts);
        // First call returns an object with create for chaining
        if (createChain.length === 1) {
            return Object.assign(Object.assign({}, mockAlksInstance), { create: mockCreate });
        }
        // Second call returns the mock client
        return mockAlksInstance;
    });
    alks_js_1.default.create = mockCreate;
});
describe('getAlks', () => {
    it('should pass custom headers to ALKS client', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const customHeaders = { 'X-Test-Header': 'value' };
        yield (0, getAlks_1.getAlks)({ token: 'sometoken', headers: customHeaders });
        // Check that headers were passed in params (first call)
        expect(createChain[0]).toEqual(expect.objectContaining({ headers: customHeaders }));
    }));
    it('should set Authorization header when using token', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield (0, getAlks_1.getAlks)({ token: 'sometoken' });
        expect(mockAlksInstance.getAccessToken).toHaveBeenCalledWith({
            refreshToken: 'sometoken',
        });
        // The second call to create should include the Authorization header
        expect(createChain[1]).toEqual(expect.objectContaining({
            headers: { Authorization: 'Bearer testtoken' },
        }));
    }));
});
//# sourceMappingURL=getAlks.test.js.map