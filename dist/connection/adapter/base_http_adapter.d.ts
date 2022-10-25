/// <reference types="node" />
/// <reference types="node" />
import Stream from 'stream';
import type Http from 'http';
import type { Logger } from '../../logger';
import type { BaseParams, Connection, ConnectionParams, InsertParams } from '../connection';
export interface RequestParams {
    method: 'GET' | 'POST';
    url: URL;
    body?: string | Stream.Readable;
    abort_signal?: AbortSignal;
    decompress_response?: boolean;
    compress_request?: boolean;
}
export declare abstract class BaseHttpAdapter implements Connection {
    protected readonly config: ConnectionParams;
    private readonly logger;
    protected readonly agent: Http.Agent;
    protected readonly headers: Http.OutgoingHttpHeaders;
    protected constructor(config: ConnectionParams, logger: Logger, agent: Http.Agent);
    protected buildDefaultHeaders(username: string, password: string): Http.OutgoingHttpHeaders;
    protected abstract createClientRequest(url: URL, params: RequestParams): Http.ClientRequest;
    protected request(params: RequestParams): Promise<Stream.Readable>;
    ping(): Promise<boolean>;
    query(params: BaseParams): Promise<Stream.Readable>;
    exec(params: BaseParams): Promise<Stream.Readable>;
    insert(params: InsertParams): Promise<void>;
    close(): Promise<void>;
    private logResponse;
    protected getHeaders(params: RequestParams): {
        'Content-Encoding'?: string | undefined;
        'Accept-Encoding'?: string | undefined;
    };
}
