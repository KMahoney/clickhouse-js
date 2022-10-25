"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Or = exports.And = exports.Eq = void 0;
function Eq(field, value) {
    return {
        toString() {
            return `(${String(field)} == ${formatValue(value)})`;
        },
        type: 'Eq',
    };
}
exports.Eq = Eq;
function And(...expr) {
    return {
        toString() {
            return `(${expr.join(' AND ')})`;
        },
        type: 'And',
    };
}
exports.And = And;
function Or(...expr) {
    return {
        toString() {
            return `(${expr.join(' OR ')})`;
        },
        type: 'Or',
    };
}
exports.Or = Or;
function formatValue(value) {
    if (value === null || value === undefined) {
        return 'NULL';
    }
    if (typeof value === 'string') {
        return `'${value}'`;
    }
    if (globalThis.Array.isArray(value)) {
        return `[${value.join(', ')}]`;
    }
    return value.toString();
}
//# sourceMappingURL=where.js.map