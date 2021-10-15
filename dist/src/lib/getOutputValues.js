"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutputValues = void 0;
function getOutputValues() {
    // if adding new output types be sure to update keys.js:getKeyOutput
    return [
        'env',
        'json',
        'docker',
        'creds',
        'idea',
        'export',
        'set',
        'powershell',
        'fishshell',
        'terraformenv',
        'terraformarg',
        'aws',
    ];
}
exports.getOutputValues = getOutputValues;
//# sourceMappingURL=getOutputValues.js.map