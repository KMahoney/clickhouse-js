import type { Shape } from './common';
export declare class Schema<S extends Shape> {
    readonly shape: S;
    constructor(shape: S);
    toString(delimiter?: string): string;
}
