"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKeyValuePairs = void 0;
/**
 * Parses key-value pairs into an object whose keys are the keys and whose values are the values
 *
 * @param inputs - a string containing key-value pairs in one of two forms consistent with the AWS CLI
 * @see https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-shorthand.html
 *
 * @example
 * parseKeyValuePairs('key1=value1,key2=value2')
 *
 * @example
 * parseKeyValuePairs('{"key1":"value1","key2":"value2"}')
 */
function parseKeyValuePairs(inputs) {
    var options = {};
    for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
        var input = inputs_1[_i];
        try {
            // First attempt a JSON parse
            var record = JSON.parse(input);
            // Force all values to be strings (by definition, all keys already have to be strings so we don't need to check that)
            for (var _a = 0, _b = Object.entries(record); _a < _b.length; _a++) {
                var _c = _b[_a], key = _c[0], value = _c[1];
                if (typeof value !== 'string') {
                    options[key] = String(value);
                }
                else {
                    options[key] = value;
                }
            }
        }
        catch (e) {
            // Otherwise parse as comma-separated key=value pairs
            var pairs = input.split(',');
            var record = pairs.reduce(function (acc, pair) {
                var _a = pair.split('='), key = _a[0], value = _a[1];
                if (key && value) {
                    acc[key] = value;
                }
                return acc;
            }, {});
            for (var _d = 0, _e = Object.entries(record); _d < _e.length; _d++) {
                var _f = _e[_d], key = _f[0], value = _f[1];
                options[key] = value;
            }
        }
    }
    return options;
}
exports.parseKeyValuePairs = parseKeyValuePairs;
//# sourceMappingURL=parseKeyValuePairs.js.map