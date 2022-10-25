"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSearchParams = void 0;
const data_formatter_1 = require("../../data_formatter/");
// TODO validate max length of the resulting query
// https://stackoverflow.com/questions/812925/what-is-the-maximum-possible-length-of-a-query-string
function toSearchParams({ database, query, query_params, clickhouse_settings, session_id, }) {
    if (clickhouse_settings === undefined &&
        query_params === undefined &&
        query === undefined &&
        database === 'default') {
        return;
    }
    const params = new URLSearchParams();
    if (query_params !== undefined) {
        for (const [key, value] of Object.entries(query_params)) {
            params.set(`param_${key}`, (0, data_formatter_1.formatQueryParams)(value));
        }
    }
    if (clickhouse_settings !== undefined) {
        for (const [key, value] of Object.entries(clickhouse_settings)) {
            if (value !== undefined) {
                params.set(key, (0, data_formatter_1.formatQuerySettings)(value));
            }
        }
    }
    if (database !== 'default') {
        params.set('database', database);
    }
    if (query) {
        params.set('query', query);
    }
    if (session_id) {
        params.set('session_id', session_id);
    }
    return params;
}
exports.toSearchParams = toSearchParams;
//# sourceMappingURL=http_search_params.js.map