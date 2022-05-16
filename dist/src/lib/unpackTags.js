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
    var record = parseShorthand(inputs);
    if (typeof record == 'undefined') {
        var obj = JSON.parse(inputs[0], function (_, value) {
            return typeof value !== 'object' ? String(value) : value;
        });
        record = {};
        if (!obj.length) {
            obj = [obj];
        }
        for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
            var entry = obj_1[_i];
            record[entry.Key] = entry.Value;
        }
    }
    var tags = [];
    for (var _a = 0, _b = Object.entries(record); _a < _b.length; _a++) {
        var _c = _b[_a], key = _c[0], value = _c[1];
        var t = {
            key: key,
            value: value,
        };
        tags.push(t);
    }
    return tags;
}
exports.unpackTags = unpackTags;
function parseShorthand(inputs) {
    var record = {};
    try {
        JSON.parse(inputs[0]);
        if (inputs.length > 1) {
            throw SyntaxError('JSON option syntax should be a single string');
        }
        return;
    }
    catch (e) {
        var errorMsg = 'Improper syntax. Should look like either \'{"Key":"key1", "Value":"val1"}\' or "Key=key1,Value=val1"';
        for (var _i = 0, inputs_1 = inputs; _i < inputs_1.length; _i++) {
            var input = inputs_1[_i];
            try {
                var pair = input.split(',');
                var key = pair[0].split('=')[1];
                var value = pair[1].split('=')[1];
                if (!key || !value) {
                    throw SyntaxError(errorMsg);
                }
                record[key] = value;
            }
            catch (e) {
                throw SyntaxError(errorMsg);
            }
        }
    }
    return record;
}
//# sourceMappingURL=unpackTags.js.map