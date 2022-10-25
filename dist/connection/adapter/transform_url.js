"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformUrl = void 0;
function transformUrl({ url, pathname, searchParams, }) {
    const newUrl = new URL(url);
    if (pathname) {
        newUrl.pathname = pathname;
    }
    if (searchParams) {
        newUrl.search = searchParams === null || searchParams === void 0 ? void 0 : searchParams.toString();
    }
    return newUrl;
}
exports.transformUrl = transformUrl;
//# sourceMappingURL=transform_url.js.map