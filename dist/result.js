"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultSet = void 0;
const stream_1 = __importStar(require("stream"));
const utils_1 = require("./utils");
const data_formatter_1 = require("./data_formatter");
class ResultSet {
    constructor(_stream, format) {
        Object.defineProperty(this, "_stream", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: _stream
        });
        Object.defineProperty(this, "format", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: format
        });
    }
    /**
     * The method waits for all the rows to be fully loaded
     * and returns the result as a string.
     *
     * The method will throw if the underlying stream was already consumed
     * by calling the other methods.
     */
    async text() {
        if (this._stream.readableEnded) {
            throw Error(streamAlreadyConsumedMessage);
        }
        return (await (0, utils_1.getAsText)(this._stream)).toString();
    }
    /**
     * The method waits for the all the rows to be fully loaded.
     * When the response is received in full, it will be decoded to return JSON.
     *
     * The method will throw if the underlying stream was already consumed
     * by calling the other methods.
     */
    async json() {
        if (this._stream.readableEnded) {
            throw Error(streamAlreadyConsumedMessage);
        }
        return (0, data_formatter_1.decode)(await this.text(), this.format);
    }
    /**
     * Returns a readable stream for responses that can be streamed
     * (i.e. all except JSON).
     *
     * Every iteration provides an array of {@link Row} instances
     * for {@link StreamableDataFormat} format.
     *
     * Should be called only once.
     *
     * The method will throw if called on a response in non-streamable format,
     * and if the underlying stream was already consumed
     * by calling the other methods.
     */
    stream() {
        // If the underlying stream has already ended by calling `text` or `json`,
        // Stream.pipeline will create a new empty stream
        // but without "readableEnded" flag set to true
        if (this._stream.readableEnded) {
            throw Error(streamAlreadyConsumedMessage);
        }
        (0, data_formatter_1.validateStreamFormat)(this.format);
        let decodedChunk = '';
        const toRows = new stream_1.Transform({
            transform(chunk, encoding, callback) {
                decodedChunk += chunk.toString();
                const rows = [];
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const idx = decodedChunk.indexOf('\n');
                    if (idx !== -1) {
                        const text = decodedChunk.slice(0, idx);
                        decodedChunk = decodedChunk.slice(idx + 1);
                        rows.push({
                            text,
                            json() {
                                return (0, data_formatter_1.decode)(text, 'JSON');
                            },
                        });
                    }
                    else {
                        if (rows.length) {
                            this.push(rows);
                        }
                        break;
                    }
                }
                callback();
            },
            autoDestroy: true,
            objectMode: true,
        });
        return stream_1.default.pipeline(this._stream, toRows, function pipelineCb(err) {
            if (err) {
                console.error(err);
            }
        });
    }
    close() {
        this._stream.destroy();
    }
}
exports.ResultSet = ResultSet;
const streamAlreadyConsumedMessage = 'Stream has been already consumed';
//# sourceMappingURL=result.js.map