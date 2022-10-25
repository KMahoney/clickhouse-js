"use strict";
/**
 * @see {@link https://github.com/ClickHouse/ClickHouse/blob/46ed4f6cdf68fbbdc59fbe0f0bfa9a361cc0dec1/src/Core/Settings.h}
 * @see {@link https://github.com/ClickHouse/ClickHouse/blob/5f84f06d6d26672da3d97d0b236ebb46b5080989/src/Core/Defines.h}
 * @see {@link https://github.com/ClickHouse/ClickHouse/blob/eae2667a1c29565c801be0ffd465f8bfcffe77ef/src/Storages/MergeTree/MergeTreeSettings.h}
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsMap = void 0;
class SettingsMap {
    constructor(record) {
        Object.defineProperty(this, "record", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: record
        });
    }
    toString() {
        return `{${Object.entries(this.record)
            .map(([k, v]) => `'${k}':'${v}'`)
            .join(',')}}`;
    }
    static from(record) {
        return new this(record);
    }
}
exports.SettingsMap = SettingsMap;
//# sourceMappingURL=settings.js.map