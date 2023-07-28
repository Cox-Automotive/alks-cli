"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractAccountId_1 = require("./extractAccountId");
function checkResult(t) {
    it('should return the expected result', () => {
        const result = (0, extractAccountId_1.extractAccountId)(t.input);
        expect(result).toEqual(t.result);
    });
}
function shouldNotThrow(t) {
    it('should not throw an error', () => {
        let err;
        try {
            (0, extractAccountId_1.extractAccountId)(t.input);
        }
        catch (e) {
            err = e;
        }
        expect(err).toBeUndefined();
    });
}
const testCases = [
    {
        description: 'When an empty string is passed',
        input: '',
        result: undefined,
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'When a Valid Account is passed',
        input: '111111111111',
        result: '111111111111',
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'When Account/Role is passed',
        input: '111111111111/ALKSRole',
        result: '111111111111',
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'When invalid account is passed',
        input: '11111j111111/ALKSRole',
        result: undefined,
        tests: [checkResult, shouldNotThrow],
    },
];
describe('extractAccountId', () => {
    for (const t of testCases) {
        describe(t.description, () => {
            for (const test of t.tests) {
                test(t);
            }
        });
    }
});
//# sourceMappingURL=extractAccountId.test.js.map