"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tryToExtractRole_1 = require("./tryToExtractRole");
function checkResult(t) {
    it('should return the expected result', function () {
        var result = (0, tryToExtractRole_1.tryToExtractRole)(t.input);
        expect(result).toEqual(t.result);
    });
}
function shouldNotThrow(t) {
    it('should not throw an error', function () {
        var err;
        try {
            (0, tryToExtractRole_1.tryToExtractRole)(t.input);
        }
        catch (e) {
            err = e;
        }
        expect(err).toBeUndefined();
    });
}
var testCases = [
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
describe('extractAccountId', function () {
    var _loop_1 = function (t) {
        describe(t.description, function () {
            for (var _i = 0, _a = t.tests; _i < _a.length; _i++) {
                var test_1 = _a[_i];
                test_1(t);
            }
        });
    };
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var t = testCases_1[_i];
        _loop_1(t);
    }
});
//# sourceMappingURL=tryToExtractRole.test.js.map