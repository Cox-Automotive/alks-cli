"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var unpackTags_1 = require("./unpackTags");
function checkResult(t) {
    it('should return the expected result', function () {
        var result = (0, unpackTags_1.unpackTags)(t.input);
        expect(result).toEqual(t.result);
    });
}
function shouldNotThrow(t) {
    it('should not throw an error', function () {
        var err;
        try {
            (0, unpackTags_1.unpackTags)(t.input);
        }
        catch (e) {
            err = e;
        }
        expect(err).toBeUndefined();
    });
}
function shouldThrow(t) {
    it('should throw an error', function () {
        expect(function () { return (0, unpackTags_1.unpackTags)(t.input); }).toThrow(SyntaxError);
    });
}
var testCases = [
    {
        description: 'when the input is a JSON string with a single tag',
        input: ['{"Key":"foo", "Value":"bar"}'],
        result: [{ key: 'foo', value: 'bar' }],
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is a single shorthand tag',
        input: ['Key=foo,Value=bar'],
        result: [{ key: 'foo', value: 'bar' }],
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is JSON string with multiple tags',
        input: ['[{"Key":"foo1", "Value":"bar1"}, {"Key":"foo2", "Value":"bar2"}]'],
        result: [
            { key: 'foo1', value: 'bar1' },
            { key: 'foo2', value: 'bar2' },
        ],
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is multiple shorthand tags',
        input: ['Key=foo1,Value=bar1', 'Key=foo2,Value=bar2'],
        result: [
            { key: 'foo1', value: 'bar1' },
            { key: 'foo2', value: 'bar2' },
        ],
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is not valid json ',
        input: [
            '[{"Key":"foo1", "Value":"bar1"}}, {"Key":"foo2", "Value":"bar2"}]',
        ],
        result: [],
        tests: [shouldThrow],
    },
    {
        description: 'when the input includes multiple JSON options ',
        input: ['{"Key":"foo1", "Value":"bar1"}', '{"Key":"foo2", "Value":"bar2"}'],
        result: [],
        tests: [shouldThrow],
    },
    {
        description: 'when the input is a JSON string with a single tag that has multiple comma seperated values',
        input: ['{"Key":"foo", "Value":"bar,bar2,bar3"}'],
        result: [{ key: 'foo', value: 'bar,bar2,bar3' }],
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is the wrong shorthand syntax',
        input: ['foo=bar'],
        result: [],
        tests: [shouldThrow],
    },
    {
        description: 'when the input is a variation of the wrong shorthand syntax',
        input: ['Key=key1,=Valueval1'],
        result: [],
        tests: [shouldThrow],
    },
    {
        description: 'when the input is multiple options with the wrong shorthand syntax',
        input: ['foo=bar', 'Key=foo1,Value=bar1'],
        result: [],
        tests: [shouldThrow],
    },
    {
        description: 'when the input is a mix of JSON items and key-value pairs',
        input: ['{"Key":"foo", "Value":"bar"}', 'Key=foo1,Value=bar1'],
        result: [],
        tests: [shouldThrow],
    },
    // {
    //   description: 'when the input is an empty string',
    //   input: [''],
    //   result: [],
    //   tests: [checkResult, shouldNotThrow],
    // },
];
describe('unpackTags', function () {
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
//# sourceMappingURL=unpackTags.test.js.map