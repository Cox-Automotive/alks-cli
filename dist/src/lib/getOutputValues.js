"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOutputValuesAccounts = exports.getOutputValuesRoleTypes = exports.getOutputValues = void 0;
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
        'linux',
        'fishshell',
        'terraformenv',
        'terraformarg',
        'aws',
    ];
}
exports.getOutputValues = getOutputValues;
function getOutputValuesRoleTypes() {
    return ['list', 'json'];
}
exports.getOutputValuesRoleTypes = getOutputValuesRoleTypes;
function getOutputValuesAccounts() {
    return ['table', 'json'];
}
exports.getOutputValuesAccounts = getOutputValuesAccounts;
//# sourceMappingURL=getOutputValues.js.map