export declare type TableEngine = MergeTreeFamily;
declare type MergeTreeFamily = ReturnType<typeof MergeTree> | ReturnType<typeof ReplicatedMergeTree> | ReturnType<typeof ReplacingMergeTree> | ReturnType<typeof SummingMergeTree> | ReturnType<typeof AggregatingMergeTree> | ReturnType<typeof CollapsingMergeTree> | ReturnType<typeof VersionedCollapsingMergeTree> | ReturnType<typeof GraphiteMergeTree>;
export declare const MergeTree: () => {
    toString: () => string;
    type: string;
};
export interface ReplicatedMergeTreeParameters {
    zoo_path: string;
    replica_name: string;
    ver?: string;
}
export declare const ReplicatedMergeTree: ({ zoo_path, replica_name, ver, }: ReplicatedMergeTreeParameters) => {
    toString: () => string;
    type: string;
};
export declare const ReplacingMergeTree: (ver?: string) => {
    toString: () => string;
    type: string;
};
export declare const SummingMergeTree: (columns?: string[]) => {
    toString: () => string;
    type: string;
};
export declare const AggregatingMergeTree: () => {
    toString: () => string;
    type: string;
};
export declare const CollapsingMergeTree: (sign: string) => {
    toString: () => string;
    type: string;
};
export declare const VersionedCollapsingMergeTree: (sign: string, version: string) => {
    toString: () => string;
    type: string;
};
export declare const GraphiteMergeTree: (config_section: string) => {
    toString: () => string;
    type: string;
};
export {};
