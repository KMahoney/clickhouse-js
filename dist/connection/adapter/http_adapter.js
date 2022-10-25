"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpAdapter = void 0;
const http_1 = __importDefault(require("http"));
const base_http_adapter_1 = require("./base_http_adapter");
class HttpAdapter extends base_http_adapter_1.BaseHttpAdapter {
    constructor(config, logger) {
        const agent = new http_1.default.Agent({
            keepAlive: true,
            timeout: config.request_timeout,
            maxSockets: config.max_open_connections,
        });
        super(config, logger, agent);
    }
    createClientRequest(url, params) {
        return http_1.default.request(params.url, {
            method: params.method,
            agent: this.agent,
            headers: this.getHeaders(params),
        });
    }
}
exports.HttpAdapter = HttpAdapter;
//# sourceMappingURL=http_adapter.js.map