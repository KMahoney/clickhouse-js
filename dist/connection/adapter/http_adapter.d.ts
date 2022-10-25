/// <reference types="node" />
import Http from 'http';
import type { Logger } from '../../logger';
import type { Connection, ConnectionParams } from '../connection';
import type { RequestParams } from './base_http_adapter';
import { BaseHttpAdapter } from './base_http_adapter';
export declare class HttpAdapter extends BaseHttpAdapter implements Connection {
    constructor(config: ConnectionParams, logger: Logger);
    protected createClientRequest(url: URL, params: RequestParams): Http.ClientRequest;
}
