"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trim_1 = require("./trim");
describe('trim', function () {
    it('should trim strings', function () {
        var result = trim_1.trim('   thing ');
        expect(result).toEqual('thing');
    });
});
//# sourceMappingURL=trim.test.js.map