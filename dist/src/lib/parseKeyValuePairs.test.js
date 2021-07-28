"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parseKeyValuePairs_1 = require("./parseKeyValuePairs");
function checkResult(t) {
    it('should return the expected result', function () {
        var result = parseKeyValuePairs_1.parseKeyValuePairs(t.input);
        expect(result).toEqual(t.result);
    });
}
function shouldNotThrow(t) {
    it('should not throw an error', function () {
        var err;
        try {
            parseKeyValuePairs_1.parseKeyValuePairs(t.input);
        }
        catch (e) {
            err = e;
        }
        expect(err).toBeUndefined();
    });
}
var testCases = [
    {
        description: 'when the input is a single key=value item',
        input: 'alpha=beta',
        result: {
            alpha: 'beta',
        },
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is multiple key=value items',
        input: 'alpha=beta,gamma=delta',
        result: {
            alpha: 'beta',
            gamma: 'delta',
        },
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is a single JSON style item',
        input: '{"alpha":"beta"}',
        result: {
            alpha: 'beta',
        },
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is multiple JSON style items',
        input: '{"alpha":"beta","gamma":"delta"}',
        result: {
            alpha: 'beta',
            gamma: 'delta',
        },
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is an empty string',
        input: '',
        result: {},
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is invalid JSON',
        input: '{"alpha":"beta',
        result: {},
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is invalid comma-separated key=value pairs',
        input: 'alpha,beta,=gamma,delta=',
        result: {},
        tests: [checkResult, shouldNotThrow],
    },
];
describe('parseKeyValuePairs', function () {
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
//# sourceMappingURL=parseKeyValuePairs.test.js.map