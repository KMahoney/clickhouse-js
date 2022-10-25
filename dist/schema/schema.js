"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
class Schema {
    constructor(shape) {
        Object.defineProperty(this, "shape", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: shape
        });
    }
    toString(delimiter) {
        return Object.entries(this.shape)
            .map(([column, type]) => `${column} ${type.toString()}`)
            .join(delimiter !== null && delimiter !== void 0 ? delimiter : ', ');
    }
}
exports.Schema = Schema;
//# sourceMappingURL=schema.js.map