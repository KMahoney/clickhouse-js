import type { NonEmptyArray, Shape } from './common';
export interface WhereExpr<S extends Shape> {
    toString(): string;
    type: 'And' | 'Or' | 'Eq' | 'Le' | 'Lte' | 'Gt' | 'Gte';
}
export declare function Eq<S extends Shape, F extends keyof S>(field: F, value: S[F]['underlying']): WhereExpr<S>;
export declare function And<S extends Shape>(...expr: NonEmptyArray<WhereExpr<S>>): WhereExpr<S>;
export declare function Or<S extends Shape>(...expr: NonEmptyArray<WhereExpr<S>>): WhereExpr<S>;
