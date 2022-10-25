/// <reference types="node" />
import type { TableEngine } from './engines';
import type { Schema } from './schema';
import type { Infer, NonEmptyArray, Shape } from './common';
import type { ClickHouseClient } from '../client';
import type { WhereExpr } from './where';
import type { InsertStream, SelectResult } from './stream';
import type { ClickHouseSettings, MergeTreeSettings } from '../settings';
import type Stream from 'stream';
export interface TableOptions<S extends Shape> {
    name: string;
    schema: Schema<S>;
    database?: string;
}
export interface CreateTableOptions<S extends Shape> {
    engine: TableEngine;
    order_by: NonEmptyArray<keyof S>;
    if_not_exists?: boolean;
    on_cluster?: string;
    partition_by?: NonEmptyArray<keyof S>;
    primary_key?: NonEmptyArray<keyof S>;
    settings?: MergeTreeSettings;
    clickhouse_settings?: ClickHouseSettings;
}
export interface SelectOptions<S extends Shape> {
    columns?: NonEmptyArray<keyof S>;
    where?: WhereExpr<S>;
    order_by?: NonEmptyArray<[keyof S, 'ASC' | 'DESC']>;
    clickhouse_settings?: ClickHouseSettings;
    abort_signal?: AbortSignal;
}
export interface InsertOptions<S extends Shape> {
    values: Infer<S>[] | InsertStream<Infer<S>>;
    clickhouse_settings?: ClickHouseSettings;
    abort_signal?: AbortSignal;
}
export declare class Table<S extends Shape> {
    private readonly client;
    private readonly options;
    constructor(client: ClickHouseClient, options: TableOptions<S>);
    create(options: CreateTableOptions<S>): Promise<Stream.Readable>;
    insert({ abort_signal, clickhouse_settings, values, }: InsertOptions<S>): Promise<void>;
    select({ abort_signal, clickhouse_settings, columns, order_by, where, }?: SelectOptions<S>): Promise<SelectResult<Infer<S>>>;
}
