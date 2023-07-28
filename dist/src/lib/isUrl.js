"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isURL = void 0;
const pattern = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
function isURL(url) {
    return pattern.test(url) || 'Please enter a valid URL.';
}
exports.isURL = isURL;
//# sourceMappingURL=isUrl.js.map