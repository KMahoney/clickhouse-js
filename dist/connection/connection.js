"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnection = void 0;
const adapter_1 = require("./adapter");
function createConnection(params, logger) {
    // TODO throw ClickHouseClient error
    switch (params.url.protocol) {
        case 'http:':
            return new adapter_1.HttpAdapter(params, logger);
        case 'https:':
            return new adapter_1.HttpsAdapter(params, logger);
        default:
            throw new Error('Only HTTP(s) adapters are supported');
    }
}
exports.createConnection = createConnection;
//# sourceMappingURL=connection.js.map