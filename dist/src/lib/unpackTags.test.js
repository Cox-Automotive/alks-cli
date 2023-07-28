"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unpackTags_1 = require("./unpackTags");
function checkResult(t) {
    it('should return the expected result', () => {
        const result = (0, unpackTags_1.unpackTags)(t.input);
        expect(result).toEqual(t.result);
    });
}
function shouldNotThrow(t) {
    it('should not throw an error', () => {
        let err;
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
    it('should throw an error', () => {
        expect(() => (0, unpackTags_1.unpackTags)(t.input)).toThrow(SyntaxError);
    });
}
const testCases = [
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
        result: [
            { key: 'foo1', value: 'bar1' },
            { key: 'foo2', value: 'bar2' },
        ],
        tests: [checkResult, shouldNotThrow],
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
        input: ['{"Key":"foo1", "Value":"bar1"}', 'Key=foo2,Value=bar2'],
        result: [
            { key: 'foo1', value: 'bar1' },
            { key: 'foo2', value: 'bar2' },
        ],
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is an empty string',
        input: [''],
        result: [],
        tests: [shouldThrow],
    },
];
describe('unpackTags', () => {
    for (const t of testCases) {
        describe(t.description, () => {
            for (const test of t.tests) {
                test(t);
            }
        });
    }
});
//# sourceMappingURL=unpackTags.test.js.map