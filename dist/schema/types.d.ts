declare type Int = UInt8 | UInt16 | UInt32 | UInt64 | UInt128 | UInt256;
declare type UInt = Int8 | Int16 | Int32 | Int64 | Int128 | Int256;
declare type Float = Float32 | Float64;
export declare type Type = Int | UInt | Float | Bool | String | FixedString | Array<any> | Nullable<any> | Map<any, any> | UUID | Enum<any> | LowCardinality<any> | Date | Date32 | DateTime | DateTime64 | IPv4 | IPv6;
export interface UInt8 {
    underlying: number;
    type: 'UInt8';
}
export declare const UInt8: UInt8;
export interface UInt16 {
    type: 'UInt16';
    underlying: number;
}
export declare const UInt16: UInt16;
export interface UInt32 {
    type: 'UInt32';
    underlying: number;
}
export declare const UInt32: UInt32;
export interface UInt64 {
    underlying: string;
    type: 'UInt64';
}
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
export declare const UInt64: UInt64;
export interface UInt128 {
    type: 'UInt128';
    underlying: string;
}
/**
 * Uses string as the inferred type, since its max value
 * is greater than Number.MAX_SAFE_INTEGER
 */
export declare const UInt128: UInt128;
export interface UInt256 {
    type: 'UInt256';
    underlying: string;
}
/**
 * Uses string as the inferred type, since its max value
 * is greater than Number.MAX_SAFE_INTEGER
 */
export declare const UInt256: UInt256;
export interface Int8 {
    underlying: number;
    type: 'Int8';
}
export declare const Int8: Int8;
export interface Int16 {
    type: 'Int16';
    underlying: number;
}
export declare const Int16: Int16;
export interface Int32 {
    type: 'Int32';
    underlying: number;
}
export declare const Int32: Int32;
export interface Int64 {
    underlying: string;
    type: 'Int64';
}
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
export declare const Int64: Int64;
export interface Int128 {
    type: 'Int128';
    underlying: string;
}
/**
 * Uses string as the inferred type, since its max value
 * is greater than Number.MAX_SAFE_INTEGER
 */
export declare const Int128: Int128;
export interface Int256 {
    type: 'Int256';
    underlying: string;
}
/**
 * Uses string as the inferred type, since its max value
 * is greater than Number.MAX_SAFE_INTEGER
 */
export declare const Int256: Int256;
export interface Float32 {
    type: 'Float32';
    underlying: number;
}
export declare const Float32: Float32;
export interface Float64 {
    type: 'Float64';
    underlying: number;
}
export declare const Float64: Float64;
export interface Decimal {
    type: 'Decimal';
    underlying: number;
}
export declare const Decimal: ({ precision, scale, }: {
    precision: number;
    scale: number;
}) => Decimal;
export interface Bool {
    type: 'Bool';
    underlying: boolean;
}
export declare const Bool: Bool;
export interface String {
    type: 'String';
    underlying: string;
}
export declare const String: String;
export interface FixedString {
    type: 'FixedString';
    underlying: string;
}
export declare const FixedString: (bytes: number) => FixedString;
export interface UUID {
    type: 'UUID';
    underlying: string;
}
export declare const UUID: UUID;
declare type StandardEnum<T> = {
    [id: string]: T | string;
    [n: number]: string;
};
export interface Enum<T extends StandardEnum<unknown>> {
    type: 'Enum';
    underlying: keyof T;
}
export declare function Enum<T extends StandardEnum<unknown>>(enumVariable: T): Enum<T>;
declare type LowCardinalityDataType = String | FixedString | UInt | Int | Float | Date | DateTime;
export interface LowCardinality<T extends LowCardinalityDataType> {
    type: 'LowCardinality';
    underlying: T['underlying'];
}
export declare const LowCardinality: <T extends LowCardinalityDataType>(type: T) => LowCardinality<T>;
export interface Array<T extends Type> {
    type: 'Array';
    underlying: globalThis.Array<T['underlying']>;
}
export declare const Array: <T extends Type>(inner: T) => Array<T>;
declare type NullableType = Int | UInt | Float | Bool | String | FixedString | UUID | Decimal | Enum<any> | Date | DateTime | Date32 | IPv4 | IPv6;
export interface Nullable<T extends NullableType> {
    type: 'Nullable';
    underlying: T['underlying'] | null;
}
export declare const Nullable: <T extends NullableType>(inner: T) => Nullable<T>;
declare type MapKey = String | Int | UInt | FixedString | UUID | Enum<any> | Date | DateTime | Date32;
export interface Map<K extends MapKey, V extends Type> {
    type: 'Map';
    underlying: Record<K['underlying'], V['underlying']>;
}
export declare const Map: <K extends MapKey, V extends Type>(k: K, v: V) => Map<K, V>;
export interface Date {
    type: 'Date';
    underlying: string;
}
export declare const Date: Date;
export interface Date32 {
    type: 'Date32';
    underlying: string;
}
export declare const Date32: Date32;
export interface DateTime {
    type: 'DateTime';
    underlying: string;
}
export declare const DateTime: (timezone?: string) => DateTime;
export interface DateTime64 {
    type: 'DateTime64';
    underlying: string;
}
export declare const DateTime64: (precision: number, timezone?: string) => DateTime64;
export interface IPv4 {
    type: 'IPv4';
    underlying: string;
}
export declare const IPv4: IPv4;
export interface IPv6 {
    type: 'IPv6';
    underlying: string;
}
export declare const IPv6: IPv6;
export {};
