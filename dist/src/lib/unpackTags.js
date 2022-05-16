"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackTags = void 0;
/**
 * Parse tags as key-value pairs. Similar to parseKeyValuePairs but with a different interface
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
function unpackTags(inputs) {
    var tags = [];
    for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
        var input = inputs_1[_i];
        var record = parseShorthand(input);
        if (typeof record == 'undefined') {
            var obj = JSON.parse(input, function (_, value) {
                return typeof value !== 'object' ? String(value) : value;
            });
            // iterable object must be a list
            if (!obj.length) {
                obj = [obj];
            }
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