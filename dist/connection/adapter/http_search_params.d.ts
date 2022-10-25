import type { ClickHouseSettings } from '../../settings';
declare type ToSearchParamsOptions = {
    database: string;
    clickhouse_settings?: ClickHouseSettings;
    query_params?: Record<string, unknown>;
    query?: string;
    session_id?: string;
};
export declare function toSearchParams({ database, query, query_params, clickhouse_settings, session_id, }: ToSearchParamsOptions): URLSearchParams | undefined;
export {};
