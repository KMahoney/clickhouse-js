"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertStream = void 0;
const stream_1 = __importDefault(require("stream"));
class InsertStream extends stream_1.default.Readable {
    constructor() {
        super({
            objectMode: true,
            read() {
                // Avoid [ERR_METHOD_NOT_IMPLEMENTED]: The _read() method is not implemented
            },
        });
    }
    add(data) {
        this.push(data);
    }
    complete() {
        this.push(null);
    }
}
exports.InsertStream = InsertStream;
//# sourceMappingURL=stream.js.map