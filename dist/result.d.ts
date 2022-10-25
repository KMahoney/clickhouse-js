/// <reference types="node" />
import Stream from 'stream';
import type { DataFormat } from './data_formatter';
export declare class ResultSet {
    private _stream;
    private readonly format;
    constructor(_stream: Stream.Readable, format: DataFormat);
    /**
     * The method waits for all the rows to be fully loaded
     * and returns the result as a string.
     *
     * The method will throw if the underlying stream was already consumed
     * by calling the other methods.
     */
    text(): Promise<string>;
    /**
     * The method waits for the all the rows to be fully loaded.
     * When the response is received in full, it will be decoded to return JSON.
     *
     * The method will throw if the underlying stream was already consumed
     * by calling the other methods.
     */
    json<T>(): Promise<T>;
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
    stream(): Stream.Readable;
    close(): void;
}
export interface Row {
    /**
     * A string representation of a row.
     */
    text: string;
    /**
     * Returns a JSON representation of a row.
     * The method will throw if called on a response in JSON incompatible format.
     * It is safe to call this method multiple times.
     */
    json<T>(): T;
}
