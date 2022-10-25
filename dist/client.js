"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = exports.encodeValues = exports.validateInsertValues = exports.ClickHouseClient = void 0;
const stream_1 = __importDefault(require("stream"));
const connection_1 = require("./connection");
const logger_1 = require("./logger");
const utils_1 = require("./utils");
const data_formatter_1 = require("./data_formatter");
const result_1 = require("./result");
function validateConfig({ url }) {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error(`Only http(s) protocol is supported, but given: [${url.protocol}]`);
    }
    // TODO add SSL validation
}
function createUrl(host) {
    try {
        return new URL(host);
    }
    catch (err) {
        throw new Error('Configuration parameter "host" contains malformed url.');
    }
}
function normalizeConfig(config, loggingEnabled) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    let tls = undefined;
    if (config.tls) {
        if ('cert' in config.tls && 'key' in config.tls) {
            tls = {
                type: 'Mutual',
                ...config.tls,
            };
        }
        else {
            tls = {
                type: 'Basic',
                ...config.tls,
            };
        }
    }
    return {
        url: createUrl((_a = config.host) !== null && _a !== void 0 ? _a : 'http://localhost:8123'),
        connect_timeout: (_b = config.connect_timeout) !== null && _b !== void 0 ? _b : 10000,
        request_timeout: (_c = config.request_timeout) !== null && _c !== void 0 ? _c : 300000,
        max_open_connections: (_d = config.max_open_connections) !== null && _d !== void 0 ? _d : Infinity,
        tls,
        compression: {
            decompress_response: (_f = (_e = config.compression) === null || _e === void 0 ? void 0 : _e.response) !== null && _f !== void 0 ? _f : true,
            compress_request: (_h = (_g = config.compression) === null || _g === void 0 ? void 0 : _g.request) !== null && _h !== void 0 ? _h : false,
        },
        username: (_j = config.username) !== null && _j !== void 0 ? _j : 'default',
        password: (_k = config.password) !== null && _k !== void 0 ? _k : '',
        application: (_l = config.application) !== null && _l !== void 0 ? _l : 'clickhouse-js',
        database: (_m = config.database) !== null && _m !== void 0 ? _m : 'default',
        clickhouse_settings: (_o = config.clickhouse_settings) !== null && _o !== void 0 ? _o : {},
        log: {
            enable: loggingEnabled,
            LoggerClass: (_q = (_p = config.log) === null || _p === void 0 ? void 0 : _p.LoggerClass) !== null && _q !== void 0 ? _q : logger_1.Logger,
        },
        session_id: config.session_id,
    };
}
class ClickHouseClient {
    constructor(config = {}) {
        var _a;
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "connection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "logger", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const loggingEnabled = Boolean(((_a = config.log) === null || _a === void 0 ? void 0 : _a.enable) || process.env.CLICKHOUSE_LOG_ENABLE);
        this.config = normalizeConfig(config, loggingEnabled);
        validateConfig(this.config);
        this.logger = new this.config.log.LoggerClass(this.config.log.enable);
        this.connection = (0, connection_1.createConnection)(this.config, this.logger);
    }
    getBaseParams(params) {
        return {
            clickhouse_settings: {
                ...this.config.clickhouse_settings,
                ...params.clickhouse_settings,
            },
            query_params: params.query_params,
            abort_signal: params.abort_signal,
            session_id: this.config.session_id,
        };
    }
    async query(params) {
        var _a;
        const format = (_a = params.format) !== null && _a !== void 0 ? _a : 'JSON';
        const query = formatQuery(params.query, format);
        const stream = await this.connection.query({
            query,
            ...this.getBaseParams(params),
        });
        return new result_1.ResultSet(stream, format);
    }
    exec(params) {
        const query = removeTrailingSemi(params.query.trim());
        return this.connection.exec({
            query,
            ...this.getBaseParams(params),
        });
    }
    async insert(params) {
        const format = params.format || 'JSONCompactEachRow';
        validateInsertValues(params.values, format);
        const query = `INSERT into ${params.table.trim()} FORMAT ${format}`;
        await this.connection.insert({
            query,
            values: encodeValues(params.values, format),
            ...this.getBaseParams(params),
        });
    }
    async ping() {
        return await this.connection.ping();
    }
    async close() {
        return await this.connection.close();
    }
}
exports.ClickHouseClient = ClickHouseClient;
function formatQuery(query, format) {
    query = query.trim();
    query = removeTrailingSemi(query);
    return query + ' \nFORMAT ' + format;
}
function removeTrailingSemi(query) {
    let lastNonSemiIdx = query.length;
    for (let i = lastNonSemiIdx; i > 0; i--) {
        if (query[i - 1] !== ';') {
            lastNonSemiIdx = i;
            break;
        }
    }
    if (lastNonSemiIdx !== query.length) {
        return query.slice(0, lastNonSemiIdx);
    }
    return query;
}
function validateInsertValues(values, format) {
    if (!Array.isArray(values) &&
        !(0, utils_1.isStream)(values) &&
        typeof values !== 'object') {
        throw new Error('Insert expected "values" to be an array, a stream of values or a JSON object, ' +
            `got: ${typeof values}`);
    }
    if ((0, utils_1.isStream)(values)) {
        if ((0, data_formatter_1.isSupportedRawFormat)(format)) {
            if (values.readableObjectMode) {
                throw new Error(`Insert for ${format} expected Readable Stream with disabled object mode.`);
            }
        }
        else if (!values.readableObjectMode) {
            throw new Error(`Insert for ${format} expected Readable Stream with enabled object mode.`);
        }
    }
}
exports.validateInsertValues = validateInsertValues;
/**
 * A function encodes an array or a stream of JSON objects to a format compatible with ClickHouse.
 * If values are provided as an array of JSON objects, the function encodes it in place.
 * If values are provided as a stream of JSON objects, the function sets up the encoding of each chunk.
 * If values are provided as a raw non-object stream, the function does nothing.
 *
 * @param values a set of values to send to ClickHouse.
 * @param format a format to encode value to.
 */
function encodeValues(values, format) {
    if ((0, utils_1.isStream)(values)) {
        // TSV/CSV/CustomSeparated formats don't require additional serialization
        if (!values.readableObjectMode) {
            return values;
        }
        // JSON* formats streams
        return stream_1.default.pipeline(values, (0, utils_1.mapStream)((value) => (0, data_formatter_1.encodeJSON)(value, format)), pipelineCb);
    }
    // JSON* arrays
    if (Array.isArray(values)) {
        return values.map((value) => (0, data_formatter_1.encodeJSON)(value, format)).join('');
    }
    // JSON & JSONObjectEachRow format input
    if (typeof values === 'object') {
        return (0, data_formatter_1.encodeJSON)(values, format);
    }
    throw new Error(`Cannot encode values of type ${typeof values} with ${format} format`);
}
exports.encodeValues = encodeValues;
function createClient(config) {
    return new ClickHouseClient(config);
}
exports.createClient = createClient;
function pipelineCb(err) {
    if (err) {
        console.error(err);
    }
}
//# sourceMappingURL=client.js.map