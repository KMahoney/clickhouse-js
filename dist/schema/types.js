"use strict";
/* eslint-disable @typescript-eslint/ban-types */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPv6 = exports.IPv4 = exports.DateTime64 = exports.DateTime = exports.Date32 = exports.Date = exports.Map = exports.Nullable = exports.Array = exports.LowCardinality = exports.Enum = exports.UUID = exports.FixedString = exports.String = exports.Bool = exports.Decimal = exports.Float64 = exports.Float32 = exports.Int256 = exports.Int128 = exports.Int64 = exports.Int32 = exports.Int16 = exports.Int8 = exports.UInt256 = exports.UInt128 = exports.UInt64 = exports.UInt32 = exports.UInt16 = exports.UInt8 = void 0;
exports.UInt8 = {
    type: 'UInt8',
    toString() {
        return 'UInt8';
    },
};
exports.UInt16 = {
    type: 'UInt16',
    toString() {
        return 'UInt16';
    },
};
exports.UInt32 = {
    type: 'UInt32',
    toString() {
        return 'UInt32';
    },
};
/**
 * Uses string as the inferred type, since its max value
 * is greater than Number.MAX_SAFE_INTEGER
 *
 * Max UInt64:               18446744073709551615
 * Number.MAX_SAFE_INTEGER:  9007199254740991
 *
 * It can be cast to number
 * by disabling `output_format_json_quote_64bit_integers` CH setting
 */
exports.UInt64 = {
    type: 'UInt64',
    toString() {
        return 'UInt64';
    },
};
/**
 * Uses string as the inferred type, since its max value
 * is greater than Number.MAX_SAFE_INTEGER
 */
exports.UInt128 = {
    type: 'UInt128',
    toString() {
        return 'UInt128';
    },
};
/**
 * Uses string as the inferred type, since its max value
 * is greater than Number.MAX_SAFE_INTEGER
 */
exports.UInt256 = {
    type: 'UInt256',
    toString() {
        return 'UInt256';
    },
};
exports.Int8 = {
    type: 'Int8',
    toString() {
        return 'Int8';
    },
};
exports.Int16 = {
    type: 'Int16',
    toString() {
        return 'Int16';
    },
};
exports.Int32 = {
    type: 'Int32',
    toString() {
        return 'Int32';
    },
};
/**
 * Uses string as the inferred type, since its max value
 * is greater than Number.MAX_SAFE_INTEGER
 *
 * Max Int64:                9223372036854775807
 * Number.MAX_SAFE_INTEGER:  9007199254740991
 *
 * It could be cast to number
 * by disabling `output_format_json_quote_64bit_integers` CH setting
 */
exports.Int64 = {
    type: 'Int64',
    toString() {
        return 'Int64';
    },
};
/**
 * Uses string as the inferred type, since its max value
 * is greater than Number.MAX_SAFE_INTEGER
 */
exports.Int128 = {
    type: 'Int128',
    toString() {
        return 'Int128';
    },
};
/**
 * Uses string as the inferred type, since its max value
 * is greater than Number.MAX_SAFE_INTEGER
 */
exports.Int256 = {
    type: 'Int256',
    toString() {
        return 'Int256';
    },
};
exports.Float32 = {
    type: 'Float32',
    toString() {
        return 'Float32';
    },
};
exports.Float64 = {
    type: 'Float64',
    toString() {
        return 'Float64';
    },
};
const Decimal = ({ precision, scale, }) => ({
    type: 'Decimal',
    toString() {
        if (scale < 0) {
            throw new Error(`Invalid Decimal scale. Valid range: [ 0 : P ], got ${scale}`);
        }
        if (precision > 0 && precision < 10) {
            return `Decimal32(${scale})`;
        }
        if (precision > 10 && precision < 19) {
            return `Decimal64(${scale})`;
        }
        if (precision > 19 && precision < 39) {
            return `Decimal128(${scale})`;
        }
        if (precision > 19 && precision < 39) {
            return `Decimal128(${scale})`;
        }
        if (precision > 39 && precision < 77) {
            return `Decimal256(${scale})`;
        }
        throw Error(`Unsupported Decimal precision. Valid range: [ 1 : 18 ], got ${precision}`);
    },
});
exports.Decimal = Decimal;
exports.Bool = {
    type: 'Bool',
    toString() {
        return 'Bool';
    },
};
exports.String = {
    type: 'String',
    toString() {
        return 'String';
    },
};
const FixedString = (bytes) => ({
    type: 'FixedString',
    toString() {
        return `FixedString(${bytes})`;
    },
});
exports.FixedString = FixedString;
exports.UUID = {
    type: 'UUID',
    toString() {
        return 'UUID';
    },
};
// https://github.com/microsoft/TypeScript/issues/30611#issuecomment-479087883
// Currently limited to only string enums
function Enum(enumVariable) {
    return {
        type: 'Enum',
        toString() {
            return `Enum(${Object.keys(enumVariable)
                .map((k) => `'${k}'`)
                .join(', ')})`;
        },
    };
}
exports.Enum = Enum;
const LowCardinality = (type) => ({
    type: 'LowCardinality',
    toString() {
        return `LowCardinality(${type})`;
    },
});
exports.LowCardinality = LowCardinality;
const Array = (inner) => ({
    type: 'Array',
    toString() {
        return `Array(${inner.toString()})`;
    },
});
exports.Array = Array;
const Nullable = (inner) => ({
    type: 'Nullable',
    toString() {
        return `Nullable(${inner.toString()})`;
    },
});
exports.Nullable = Nullable;
const Map = (k, v) => ({
    type: 'Map',
    toString() {
        return `Map(${k.toString()}, ${v.toString()})`;
    },
});
exports.Map = Map;
exports.Date = {
    type: 'Date',
    toString() {
        return 'Date';
    },
};
exports.Date32 = {
    type: 'Date32',
    toString() {
        return 'Date32';
    },
};
const DateTime = (timezone) => ({
    type: 'DateTime',
    toString() {
        const tz = timezone ? ` (${timezone})` : '';
        return `DateTime${tz}`;
    },
});
exports.DateTime = DateTime;
const DateTime64 = (precision, timezone) => ({
    type: 'DateTime64',
    toString() {
        const tz = timezone ? `, ${timezone}` : '';
        return `DateTime64(${precision}${tz})`;
    },
});
exports.DateTime64 = DateTime64;
exports.IPv4 = {
    type: 'IPv4',
    toString() {
        return 'IPv4';
    },
};
exports.IPv6 = {
    type: 'IPv6',
    toString() {
        return 'IPv6';
    },
};
// TODO: Tuple is disabled for now. Figure out type derivation in this case
// export interface Tuple<T extends Type> = {
//   type: 'Tuple'
//   // underlying: globalThis.Array<T['underlying']>
// }
// export const Tuple = <T extends Type>(...inner: T[]) =>
//   ({
//     type: 'Tuple',
//     toString(): string {
//       return `Tuple(${inner.join(', ')})`
//     },
//   } as Tuple<T>)
//# sourceMappingURL=types.js.map