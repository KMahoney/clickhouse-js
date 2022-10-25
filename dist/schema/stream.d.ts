/// <reference types="node" />
import Stream from 'stream';
export interface SelectResult<T> {
    asyncGenerator(): AsyncGenerator<T, void>;
    json(): Promise<T[]>;
}
export declare class InsertStream<T> extends Stream.Readable {
    constructor();
    add(data: T): void;
    complete(): void;
}
