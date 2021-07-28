"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKeyValuePairs = void 0;
/**
 * Parses key-value pairs into an object whose keys are the keys and whose values are the values
 *
 * @param str - a string containing key-value pairs in one of two forms consistent with the AWS CLI
 * @see https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-shorthand.html
 *
 * @example
 * parseKeyValuePairs('key1=value1,key2=value2')
 *
 * @example
 * parseKeyValuePairs('{"key1":"value1","key2":"value2"}')
 */
function parseKeyValuePairs(str) {
    try {
        // First attempt a JSON parse
        var record = JSON.parse(str);
        // Force all values to be strings (by definition, all keys already have to be strings so we don't need to check that)
        for (var _i = 0, _a = Object.entries(record); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (typeof value !== 'string') {
                record[key] = String(value);
            }
        }
        return record;
    }
    catch (e) {
        // Otherwise parse as comma-separated key=value pairs
        var pairs = str.split(',');
        var record = pairs.reduce(function (acc, pair) {
            var _a = pair.split('='), key = _a[0], value = _a[1];
            if (key && value) {
                acc[key] = value;
            }
            return acc;
        }, {});
        return record;
    }
}
exports.parseKeyValuePairs = parseKeyValuePairs;
//# sourceMappingURL=parseKeyValuePairs.js.map