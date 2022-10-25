export declare class Logger {
    readonly enabled: boolean;
    constructor(enabled?: boolean);
    debug(message: string): void;
    info(message: string): void;
    warning(message: string): void;
    error(message: string): void;
}
