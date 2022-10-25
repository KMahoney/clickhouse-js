"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHttpAdapter = void 0;
const stream_1 = __importDefault(require("stream"));
const zlib_1 = __importDefault(require("zlib"));
const error_1 = require("../../error");
const http_search_params_1 = require("./http_search_params");
const transform_url_1 = require("./transform_url");
const utils_1 = require("../../utils");
function isSuccessfulResponse(statusCode) {
    return Boolean(statusCode && 200 <= statusCode && statusCode < 300);
}
function isEventTarget(signal) {
    return 'removeEventListener' in signal;
}
function withHttpSettings(clickhouse_settings, compression) {
    return {
        ...(compression
            ? {
                enable_http_compression: 1,
            }
            : {}),
        ...clickhouse_settings,
    };
}
function decompressResponse(response) {
    const encoding = response.headers['content-encoding'];
    if (encoding === 'gzip') {
        return {
            response: stream_1.default.pipeline(response, zlib_1.default.createGunzip(), function pipelineCb(err) {
                if (err) {
                    console.error(err);
                }
            }),
        };
    }
    else if (encoding !== undefined) {
        return {
            error: new Error(`Unexpected encoding: ${encoding}`),
        };
    }
    return { response };
}
function isDecompressionError(result) {
    return result.error !== undefined;
}
class BaseHttpAdapter {
    constructor(config, logger, agent) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: config
        });
        Object.defineProperty(this, "logger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: logger
        });
        Object.defineProperty(this, "agent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: agent
        });
        Object.defineProperty(this, "headers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.headers = this.buildDefaultHeaders(config.username, config.password);
    }
    buildDefaultHeaders(username, password) {
        return {
            Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        };
    }
    async request(params) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const request = this.createClientRequest(params.url, params);
            function onError(err) {
                removeRequestListeners();
                reject(err);
            }
            const onResponse = async (_response) => {
                this.logResponse(params, _response, start);
                const decompressionResult = decompressResponse(_response);
                if (isDecompressionError(decompressionResult)) {
                    return reject(decompressionResult.error);
                }
                if (isSuccessfulResponse(_response.statusCode)) {
                    return resolve(decompressionResult.response);
                }
                else {
                    reject((0, error_1.parseError)(await (0, utils_1.getAsText)(decompressionResult.response)));
                }
            };
            function onTimeout() {
                removeRequestListeners();
                request.once('error', function () {
                    /**
                     * catch "Error: ECONNRESET" error which shouldn't be reported to users.
                     * see the full sequence of events https://nodejs.org/api/http.html#httprequesturl-options-callback
                     * */
                });
                request.destroy();
                reject(new Error('Timeout error'));
            }
            function onAbortSignal() {
                // instead of deprecated request.abort()
                request.destroy(new Error('The request was aborted.'));
            }
            function onAbort() {
                // Prefer 'abort' event since it always triggered unlike 'error' and 'close'
                // * see the full sequence of events https://nodejs.org/api/http.html#httprequesturl-options-callback
                removeRequestListeners();
                request.once('error', function () {
                    /**
                     * catch "Error: ECONNRESET" error which shouldn't be reported to users.
                     * see the full sequence of events https://nodejs.org/api/http.html#httprequesturl-options-callback
                     * */
                });
                reject(new Error('The request was aborted.'));
            }
            function onClose() {
                // Adapter uses 'close' event to clean up listeners after the successful response.
                // It's necessary in order to handle 'abort' and 'timeout' events while response is streamed.
                // setImmediate is a workaround. If a request cancelled before sent, the 'abort' happens after 'close'.
                // Which contradicts the docs https://nodejs.org/docs/latest-v14.x/api/http.html#http_http_request_url_options_callback
                setImmediate(removeRequestListeners);
            }
            function removeRequestListeners() {
                request.removeListener('response', onResponse);
                request.removeListener('error', onError);
                request.removeListener('timeout', onTimeout);
                request.removeListener('abort', onAbort);
                request.removeListener('close', onClose);
                if (params.abort_signal !== undefined) {
                    if (isEventTarget(params.abort_signal)) {
                        params.abort_signal.removeEventListener('abort', onAbortSignal);
                    }
                    else {
                        // @ts-expect-error if it's EventEmitter
                        params.abort_signal.removeListener('abort', onAbortSignal);
                    }
                }
            }
            if (params.abort_signal) {
                // We should use signal API when nodejs v14 is not supported anymore.
                // However, it seems that Http.request doesn't abort after 'response' event.
                // Requires an additional investigation
                // https://nodejs.org/api/globals.html#class-abortsignal
                params.abort_signal.addEventListener('abort', onAbortSignal, {
                    once: true,
                });
            }
            request.on('response', onResponse);
            request.on('timeout', onTimeout);
            request.on('error', onError);
            request.on('abort', onAbort);
            request.on('close', onClose);
            if (!params.body)
                return request.end();
            const bodyStream = (0, utils_1.isStream)(params.body)
                ? params.body
                : stream_1.default.Readable.from([params.body]);
            const callback = (err) => {
                if (err) {
                    removeRequestListeners();
                    reject(err);
                }
            };
            if (params.compress_request) {
                stream_1.default.pipeline(bodyStream, zlib_1.default.createGzip(), request, callback);
            }
            else {
                stream_1.default.pipeline(bodyStream, request, callback);
            }
        });
    }
    async ping() {
        // TODO add status code check
        const response = await this.request({
            method: 'GET',
            url: (0, transform_url_1.transformUrl)({ url: this.config.url, pathname: '/ping' }),
        });
        response.destroy();
        return true;
    }
    async query(params) {
        const clickhouse_settings = withHttpSettings(params.clickhouse_settings, this.config.compression.decompress_response);
        const searchParams = (0, http_search_params_1.toSearchParams)({
            database: this.config.database,
            clickhouse_settings,
            query_params: params.query_params,
            session_id: params.session_id,
        });
        return await this.request({
            method: 'POST',
            url: (0, transform_url_1.transformUrl)({ url: this.config.url, pathname: '/', searchParams }),
            body: params.query,
            abort_signal: params.abort_signal,
            decompress_response: clickhouse_settings.enable_http_compression === 1,
        });
    }
    async exec(params) {
        const searchParams = (0, http_search_params_1.toSearchParams)({
            database: this.config.database,
            clickhouse_settings: params.clickhouse_settings,
            query_params: params.query_params,
            session_id: params.session_id,
        });
        return await this.request({
            method: 'POST',
            url: (0, transform_url_1.transformUrl)({ url: this.config.url, pathname: '/', searchParams }),
            body: params.query,
            abort_signal: params.abort_signal,
        });
    }
    async insert(params) {
        const searchParams = (0, http_search_params_1.toSearchParams)({
            database: this.config.database,
            clickhouse_settings: params.clickhouse_settings,
            query_params: params.query_params,
            query: params.query,
            session_id: params.session_id,
        });
        await this.request({
            method: 'POST',
            url: (0, transform_url_1.transformUrl)({ url: this.config.url, pathname: '/', searchParams }),
            body: params.values,
            abort_signal: params.abort_signal,
            compress_request: this.config.compression.compress_request,
        });
    }
    async close() {
        if (this.agent !== undefined && this.agent.destroy !== undefined) {
            this.agent.destroy();
        }
    }
    logResponse(params, response, startTimestamp) {
        const duration = Date.now() - startTimestamp;
        this.logger.debug(`[http adapter] response: ${params.method} ${params.url.pathname}${params.url.search ? ` ${params.url.search}` : ''} ${response.statusCode} ${duration}ms`);
    }
    getHeaders(params) {
        return {
            ...this.headers,
            ...(params.decompress_response ? { 'Accept-Encoding': 'gzip' } : {}),
            ...(params.compress_request ? { 'Content-Encoding': 'gzip' } : {}),
        };
    }
}
exports.BaseHttpAdapter = BaseHttpAdapter;
//# sourceMappingURL=base_http_adapter.js.map