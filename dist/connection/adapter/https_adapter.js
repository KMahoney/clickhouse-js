"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpsAdapter = void 0;
const base_http_adapter_1 = require("./base_http_adapter");
const https_1 = __importDefault(require("https"));
class HttpsAdapter extends base_http_adapter_1.BaseHttpAdapter {
    constructor(config, logger) {
        var _a, _b, _c;
        const agent = new https_1.default.Agent({
            keepAlive: true,
            timeout: config.request_timeout,
            maxSockets: config.max_open_connections,
            ca: (_a = config.tls) === null || _a === void 0 ? void 0 : _a.ca_cert,
            key: ((_b = config.tls) === null || _b === void 0 ? void 0 : _b.type) === 'Mutual' ? config.tls.key : undefined,
            cert: ((_c = config.tls) === null || _c === void 0 ? void 0 : _c.type) === 'Mutual' ? config.tls.cert : undefined,
        });
        super(config, logger, agent);
    }
    buildDefaultHeaders(username, password) {
        var _a, _b;
        if (((_a = this.config.tls) === null || _a === void 0 ? void 0 : _a.type) === 'Mutual') {
            return {
                'X-ClickHouse-User': username,
                'X-ClickHouse-Key': password,
                'X-ClickHouse-SSL-Certificate-Auth': 'on',
            };
        }
        if (((_b = this.config.tls) === null || _b === void 0 ? void 0 : _b.type) === 'Basic') {
            return {
                'X-ClickHouse-User': username,
                'X-ClickHouse-Key': password,
            };
        }
        return super.buildDefaultHeaders(username, password);
    }
    createClientRequest(url, params) {
        return https_1.default.request(params.url, {
            method: params.method,
            agent: this.agent,
            headers: this.getHeaders(params),
        });
    }
}
exports.HttpsAdapter = HttpsAdapter;
//# sourceMappingURL=https_adapter.js.map