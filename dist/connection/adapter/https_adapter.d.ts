/// <reference types="node" />
import type { RequestParams } from './base_http_adapter';
import { BaseHttpAdapter } from './base_http_adapter';
import type { Connection, ConnectionParams } from '../connection';
import type { Logger } from '../../logger';
import type Http from 'http';
export declare class HttpsAdapter extends BaseHttpAdapter implements Connection {
    constructor(config: ConnectionParams, logger: Logger);
    protected buildDefaultHeaders(username: string, password: string): Http.OutgoingHttpHeaders;
    protected createClientRequest(url: URL, params: RequestParams): Http.ClientRequest;
}
