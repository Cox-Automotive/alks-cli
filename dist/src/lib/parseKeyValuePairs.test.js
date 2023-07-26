"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseKeyValuePairs_1 = require("./parseKeyValuePairs");
function checkResult(t) {
    it('should return the expected result', () => {
        const result = (0, parseKeyValuePairs_1.parseKeyValuePairs)(t.input);
        expect(result).toEqual(t.result);
    });
}
function shouldNotThrow(t) {
    it('should not throw an error', () => {
        let err;
        try {
            (0, parseKeyValuePairs_1.parseKeyValuePairs)(t.input);
        }
        catch (e) {
            err = e;
        }
        expect(err).toBeUndefined();
    });
}
const testCases = [
    {
        description: 'when the input is a single key=value item',
        input: ['alpha=beta'],
        result: {
            alpha: 'beta',
        },
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is multiple key=value items in the same string',
        input: ['alpha=beta,gamma=delta'],
        result: {
            alpha: 'beta',
            gamma: 'delta',
        },
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is a single JSON style item',
        input: ['{"alpha":"beta"}'],
        result: {
            alpha: 'beta',
        },
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is a JSON object with multiple items',
        input: ['{"alpha":"beta","gamma":"delta"}'],
        result: {
            alpha: 'beta',
            gamma: 'delta',
        },
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is multiple JSON items',
        input: ['{"alpha":"beta"}', '{"gamma":"delta"}'],
        result: {
            alpha: 'beta',
            gamma: 'delta',
        },
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is a mix of JSON items and key-value pairs',
        input: ['{"alpha":"beta"}', 'gamma=delta'],
        result: {
            alpha: 'beta',
            gamma: 'delta',
        },
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is an empty string',
        input: [''],
        result: {},
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is invalid JSON',
        input: ['{"alpha":"beta'],
        result: {},
        tests: [checkResult, shouldNotThrow],
    },
    {
        description: 'when the input is invalid comma-separated key=value pairs',
        input: ['alpha,beta,=gamma,delta='],
        result: {},
        tests: [checkResult, shouldNotThrow],
    },
];
describe('parseKeyValuePairs', () => {
    for (const t of testCases) {
        describe(t.description, () => {
            for (const test of t.tests) {
                test(t);
            }
        });
    }
});
//# sourceMappingURL=parseKeyValuePairs.test.js.map