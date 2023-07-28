"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trim_1 = require("./trim");
describe('trim', () => {
    const testCases = [
        {
            description: 'when the input has no padding',
            input: 'hello',
            result: 'hello',
        },
        {
            description: 'when the input is left-padded',
            input: '  bob',
            result: 'bob',
        },
        {
            description: 'when the input is right-padded',
            input: 'market  ',
            result: 'market',
        },
        {
            description: 'when the input is padded on both sides',
            input: '    frisbee  ',
            result: 'frisbee',
        },
        {
            description: 'when the padding contains spaces, tabs, and newlines',
            input: '\n\r \t  what\t \r\t\n',
            result: 'what',
        },
    ];
    for (const t of testCases) {
        describe(t.description, () => {
            let result;
            beforeEach(() => {
                result = (0, trim_1.trim)(t.input);
            });
            it('returns the correct result', () => {
                expect(result).toEqual(t.result);
            });
        });
    }
});
//# sourceMappingURL=trim.test.js.map