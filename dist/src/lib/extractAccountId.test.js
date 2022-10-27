"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extractAccountId_1 = require("./extractAccountId");
function checkResult(t) {
    it('should return the expected result', function () {
        var result = (0, extractAccountId_1.extractAccountId)(t.input);
        expect(result).toEqual(t.result);
    });
}
function shouldNotThrow(t) {
    it('should not throw an error', function () {
        var err;
        try {
            (0, extractAccountId_1.extractAccountId)(t.input);
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
//# sourceMappingURL=extractAccountId.test.js.map