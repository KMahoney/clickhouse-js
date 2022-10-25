/// <reference types="node" />
/// <reference types="node" />
import Stream from 'stream';
import { Logger } from './logger';
import type { DataFormat } from './data_formatter';
import { ResultSet } from './result';
import type { ClickHouseSettings } from './settings';
import type { InputJSON, InputJSONObjectEachRow } from './clickhouse_types';
export interface ClickHouseClientConfigOptions {
    /** A ClickHouse instance URL. Default value: `http://localhost:8123`. */
    host?: string;
    /** The timeout to set up a connection in milliseconds. Default value: `10_000`. */
    connect_timeout?: number;
    /** The request timeout in milliseconds. Default value: `30_000`. */
    request_timeout?: number;
    /** Maximum number of sockets to allow per host. Default value: `Infinity`. */
    max_open_connections?: number;
    compression?: {
        /** `response: true` instructs ClickHouse server to respond with compressed response body. Default: true. */
        response?: boolean;
        /** `request: true` enabled compression on the client request body. Default: false. */
        request?: boolean;
    };
    /** The name of the user on whose behalf requests are made. Default: 'default'. */
    username?: string;
    /** The user password. Default: ''. */
    password?: string;
    /** The name of the application using the nodejs client. Default: 'clickhouse-js'. */
    application?: string;
    /** Database name to use. Default value: `default`. */
    database?: string;
    /** ClickHouse settings to apply to all requests. Default value: {} */
    clickhouse_settings?: ClickHouseSettings;
    log?: {
        /** Enable logging. Default value: false. */
        enable?: boolean;
        /** A class to instantiate a custom logger implementation. */
        LoggerClass?: new (enabled: boolean) => Logger;
    };
    tls?: BasicTLSOptions | MutualTLSOptions;
    session_id?: string;
}
interface BasicTLSOptions {
    ca_cert: Buffer;
}
interface MutualTLSOptions {
    ca_cert: Buffer;
    cert: Buffer;
    key: Buffer;
}
export interface BaseParams {
    /** ClickHouse settings that can be applied on query level. */
    clickhouse_settings?: ClickHouseSettings;
    /** Parameters for query binding. https://clickhouse.com/docs/en/interfaces/http/#cli-queries-with-parameters */
    query_params?: Record<string, unknown>;
    /** AbortSignal instance (using `node-abort-controller` package) to cancel a request in progress. */
    abort_signal?: AbortSignal;
}
export interface QueryParams extends BaseParams {
    /** Statement to execute. */
    query: string;
    /** Format of the resulting dataset. */
    format?: DataFormat;
}
export interface ExecParams extends BaseParams {
    /** Statement to execute. */
    query: string;
}
declare type InsertValues<T> = ReadonlyArray<T> | Stream.Readable | InputJSON<T> | InputJSONObjectEachRow<T>;
export interface InsertParams<T = unknown> extends BaseParams {
    /** Name of a table to insert into. */
    table: string;
    /** A dataset to insert. */
    values: InsertValues<T>;
    /** Format of the dataset to insert. */
    format?: DataFormat;
}
export declare class ClickHouseClient {
    private readonly config;
    private readonly connection;
    readonly logger: Logger;
    constructor(config?: ClickHouseClientConfigOptions);
    private getBaseParams;
    query(params: QueryParams): Promise<ResultSet>;
    exec(params: ExecParams): Promise<Stream.Readable>;
    insert<T>(params: InsertParams<T>): Promise<void>;
    ping(): Promise<boolean>;
    close(): Promise<void>;
}
export declare function validateInsertValues<T>(values: InsertValues<T>, format: DataFormat): void;
/**
 * A function encodes an array or a stream of JSON objects to a format compatible with ClickHouse.
 * If values are provided as an array of JSON objects, the function encodes it in place.
 * If values are provided as a stream of JSON objects, the function sets up the encoding of each chunk.
 * If values are provided as a raw non-object stream, the function does nothing.
 *
 * @param values a set of values to send to ClickHouse.
 * @param format a format to encode value to.
 */
export declare function encodeValues<T>(values: InsertValues<T>, format: DataFormat): string | Stream.Readable;
export declare function createClient(config?: ClickHouseClientConfigOptions): ClickHouseClient;
export {};
