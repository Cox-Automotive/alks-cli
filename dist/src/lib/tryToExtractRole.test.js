"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tryToExtractRole_1 = require("./tryToExtractRole");
function checkResult(t) {
    it('should return the expected result', () => {
        const result = (0, tryToExtractRole_1.tryToExtractRole)(t.input);
        expect(result).toEqual(t.result);
    });
}
function shouldNotThrow(t) {
    it('should not throw an error', () => {
        let err;
        try {
            (0, tryToExtractRole_1.tryToExtractRole)(t.input);
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
        description: 'When Account And Role is passed',
        input: '111111111111/ALKSRole',
        result: 'Role',
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'When account and role is passed in incorrect format',
        input: '111111111111/Role',
        result: undefined,
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'When legacy account/role is passed',
        input: '111111111111/ALKSRole-OldRole',
        result: 'Role',
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
//# sourceMappingURL=tryToExtractRole.test.js.map