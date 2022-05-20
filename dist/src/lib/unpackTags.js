"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackTags = void 0;
/**
 * Parse tags into a Tags object from either JSON or the AWS defined shorthand for tag options
 *
 * @param inputs - a list of strings containing key-value pairs in one of two forms consistent with the AWS CLI
 * @see https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-shorthand.html
 *
 * @example
 * parseKeyValuePairs(['Key=key1,Value=val1'])
 *
 * @example
 * parseKeyValuePairs(['{"Key":"key1","Value":"value1"}'])
 */
function unpackTags(inputs) {
    var tags = [];
    for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
        var input = inputs_1[_i];
        var record = parseShorthand(input);
        if (typeof record == 'undefined') {
            var obj = JSON.parse(input, function (_, value) {
                return typeof value !== 'object' ? String(value) : value;
            });
            // iterable object must be a list otherwise the length returns undefined
            obj = obj.length ? obj : [obj];
            record = {};
            for (var _a = 0, obj_1 = obj; _a < obj_1.length; _a++) {
                var entry = obj_1[_a];
                record[entry.Key] = entry.Value;
            }
        }
        for (var _b = 0, _c = Object.entries(record); _b < _c.length; _b++) {
            var _d = _c[_b], key = _d[0], value = _d[1];
            var t = {
                key: key,
                value: value,
            };
            tags.push(t);
        }
    }
    return tags;
}
exports.unpackTags = unpackTags;
function parseShorthand(input) {
    var record = {};
    try {
        JSON.parse(input);
        return;
    }
    catch (e) {
        var errorMsg = 'Improper tag syntax. Should look like either \'{"Key":"key1", "Value":"val1"}\' or "Key=key1,Value=val1"';
        try {
            var pair = input.split(',');
            var key = pair[0].split('=');
            var value = pair[1].split('=');
            if (!(key[0] === 'Key' && value[0] === 'Value')) {
                throw SyntaxError(errorMsg);
            }
            record[key[1]] = value[1];
        }
        catch (e) {
            throw SyntaxError(errorMsg);
        }
    }
    return record;
}
//# sourceMappingURL=unpackTags.js.map