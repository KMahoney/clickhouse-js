import type { Type } from './types';
export declare type Shape = {
    [key: string]: Type;
};
export declare type Infer<S extends Shape> = {
    [Field in keyof S]: S[Field]['underlying'];
};
export declare type NonEmptyArray<T> = [T, ...T[]];
