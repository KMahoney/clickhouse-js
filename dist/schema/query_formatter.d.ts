import type { Shape } from './common';
import type { CreateTableOptions, TableOptions } from './index';
import type { WhereExpr } from './where';
import type { NonEmptyArray } from './common';
export declare const QueryFormatter: {
    createTable: <S extends Shape>(tableOptions: TableOptions<S>, { engine: _engine, if_not_exists, on_cluster, order_by, partition_by, primary_key, settings: _settings, }: CreateTableOptions<S>) => string;
    select: <S_1 extends Shape>(tableOptions: TableOptions<S_1>, whereExpr?: WhereExpr<S_1> | undefined, columns?: NonEmptyArray<keyof S_1> | undefined, orderBy?: NonEmptyArray<[keyof S_1, "ASC" | "DESC"]> | undefined) => string;
};
export declare function getTableName<S extends Shape>({ database, name, }: TableOptions<S>): string;
