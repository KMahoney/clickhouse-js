"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsMap = exports.ResultSet = exports.createClient = void 0;
const client_1 = require("./client");
Object.defineProperty(exports, "createClient", { enumerable: true, get: function () { return client_1.createClient; } });
exports.default = {
    createClient: client_1.createClient,
};
var result_1 = require("./result");
Object.defineProperty(exports, "ResultSet", { enumerable: true, get: function () { return result_1.ResultSet; } });
var settings_1 = require("./settings");
Object.defineProperty(exports, "SettingsMap", { enumerable: true, get: function () { return settings_1.SettingsMap; } });
//# sourceMappingURL=index.js.map