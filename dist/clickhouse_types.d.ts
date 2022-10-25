export interface ResponseJSON<T = unknown> {
    data: Array<T>;
    query_id?: string;
    totals?: Record<string, number>;
    extremes?: Record<string, any>;
    meta?: Array<{
        name: string;
        type: string;
    }>;
    statistics?: {
        elapsed: number;
        rows_read: number;
        bytes_read: number;
    };
    rows?: number;
}
export interface InputJSON<T = unknown> {
    meta: {
        name: string;
        type: string;
    }[];
    data: T[];
}
export declare type InputJSONObjectEachRow<T = unknown> = Record<string, T>;
