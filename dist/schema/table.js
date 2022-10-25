"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const query_formatter_1 = require("./query_formatter");
class Table {
    constructor(client, options) {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: client
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
    }
    // TODO: better types
    async create(options) {
        const query = query_formatter_1.QueryFormatter.createTable(this.options, options);
        return this.client.exec({
            query,
            clickhouse_settings: options.clickhouse_settings,
        });
    }
    insert({ abort_signal, clickhouse_settings, values, }) {
        return this.client.insert({
            clickhouse_settings,
            abort_signal,
            table: (0, query_formatter_1.getTableName)(this.options),
            format: 'JSONEachRow',
            values,
        });
    }
    async select({ abort_signal, clickhouse_settings, columns, order_by, where, } = {}) {
        const query = query_formatter_1.QueryFormatter.select(this.options, where, columns, order_by);
        const rs = await this.client.query({
            query,
            clickhouse_settings,
            abort_signal,
            format: 'JSONEachRow',
        });
        const stream = rs.stream();
        async function* asyncGenerator() {
            for await (const rows of stream) {
                for (const row of rows) {
                    const value = row.json();
                    yield value;
                }
            }
        }
        return {
            asyncGenerator,
            json: async () => {
                const result = [];
                for await (const value of asyncGenerator()) {
                    if (Array.isArray(value)) {
                        result.push(...value);
                    }
                    else {
                        result.push(value);
                    }
                }
                return result;
            },
        };
    }
}
exports.Table = Table;
//# sourceMappingURL=table.js.map