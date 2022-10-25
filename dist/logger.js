"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(enabled = false) {
        Object.defineProperty(this, "enabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: enabled
        });
    }
    debug(message) {
        if (!this.enabled)
            return;
        console.log(message);
    }
    info(message) {
        if (!this.enabled)
            return;
        console.log(message);
    }
    warning(message) {
        if (!this.enabled)
            return;
        console.warn(message);
    }
    error(message) {
        if (!this.enabled)
            return;
        console.error(message);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map