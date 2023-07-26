"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showBorderedMessage = void 0;
const tslib_1 = require("tslib");
const cli_table3_1 = tslib_1.__importDefault(require("cli-table3"));
function showBorderedMessage(cols, msg) {
    const table = new cli_table3_1.default({
        colWidths: [cols],
    });
    table.push([msg]);
    console.error(table.toString());
}
exports.showBorderedMessage = showBorderedMessage;
//# sourceMappingURL=showBorderedMessage.js.map