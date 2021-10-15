"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trim_1 = require("./trim");
describe('trim', function () {
    var testCases = [
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
    var _loop_1 = function (t) {
        describe(t.description, function () {
            var result;
            beforeEach(function () {
                result = trim_1.trim(t.input);
            });
            it('returns the correct result', function () {
                expect(result).toEqual(t.result);
            });
        });
    };
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var t = testCases_1[_i];
        _loop_1(t);
    }
});
//# sourceMappingURL=trim.test.js.map