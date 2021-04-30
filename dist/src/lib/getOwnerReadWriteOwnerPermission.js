"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOwnerReadWriteOnlyPermission = void 0;
function getOwnerReadWriteOnlyPermission() {
    return {
        owner: { read: true, write: true, execute: false },
        group: { read: false, write: false, execute: false },
        others: { read: false, write: false, execute: false },
    };
}
exports.getOwnerReadWriteOnlyPermission = getOwnerReadWriteOnlyPermission;
//# sourceMappingURL=getOwnerReadWriteOwnerPermission.js.map