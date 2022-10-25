"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatQueryParams = void 0;
const utils_1 = require("../utils");
function withPadding(value) {
    if (value > 9)
        return String(value);
    return `0${value}`;
}
function formatMillis(value) {
    const ms = value.getMilliseconds();
    if (ms === 0) {
        return '';
    }
    if (ms > 99) {
        return `.${ms}`;
    }
    if (ms > 9) {
        return `.0${ms}`;
    }
    return `.00${ms}`;
}
function formatQueryParams(value, wrapStringInQuotes = false) {
    if (value === null)
        return 'NULL';
    if (Number.isNaN(value))
        return 'nan';
    if (value === Number.POSITIVE_INFINITY)
        return '+inf';
    if (value === Number.NEGATIVE_INFINITY)
        return '-inf';
    if (typeof value === 'number')
        return String(value);
    if (typeof value === 'boolean')
        return value ? '1' : '0';
    if (typeof value === 'string') {
        const escapedValue = (0, utils_1.replaceAll)((0, utils_1.replaceAll)(value, `\\`, `\\\\`), `'`, `\\'`);
        return wrapStringInQuotes ? `'${escapedValue}'` : escapedValue;
    }
    if (Array.isArray(value)) {
        const formatted = value.map((v) => formatQueryParams(v, true));
        return `[${formatted.join(',')}]`;
    }
    if (value instanceof Date) {
        // TODO add timezone support
        const date = `${value.getFullYear()}-${withPadding(value.getMonth() + 1)}-${withPadding(value.getDate())}`;
        const time = `${withPadding(value.getHours())}:${withPadding(value.getMinutes())}:${withPadding(value.getSeconds())}`;
        const ms = formatMillis(value);
        return `${date} ${time}${ms}`;
    }
    if (typeof value === 'object') {
        const formatted = [];
        for (const [key, val] of Object.entries(value)) {
            formatted.push(`${formatQueryParams(key, true)}:${formatQueryParams(val, true)}`);
        }
        return `{${formatted.join(',')}}`;
    }
    throw new Error(`Unsupported value in query parameters: [${value}].`);
}
exports.formatQueryParams = formatQueryParams;
//# sourceMappingURL=format_query_params.js.map