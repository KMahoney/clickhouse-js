"use strict";
// See https://clickhouse.com/docs/en/engines/table-engines/
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphiteMergeTree = exports.VersionedCollapsingMergeTree = exports.CollapsingMergeTree = exports.AggregatingMergeTree = exports.SummingMergeTree = exports.ReplacingMergeTree = exports.ReplicatedMergeTree = exports.MergeTree = void 0;
const MergeTree = () => ({
    toString: () => `MergeTree()`,
    type: 'MergeTree',
});
exports.MergeTree = MergeTree;
const ReplicatedMergeTree = ({ zoo_path, replica_name, ver, }) => ({
    toString: () => {
        const _ver = ver ? `, ${ver}` : '';
        return `ReplicatedMergeTree('${zoo_path}', '${replica_name}'${_ver})`;
    },
    type: 'ReplicatedMergeTree',
});
exports.ReplicatedMergeTree = ReplicatedMergeTree;
const ReplacingMergeTree = (ver) => ({
    toString: () => {
        const _ver = ver ? `, ${ver}` : '';
        return `ReplacingMergeTree(${_ver})`;
    },
    type: 'ReplacingMergeTree',
});
exports.ReplacingMergeTree = ReplacingMergeTree;
const SummingMergeTree = (columns) => ({
    toString: () => {
        return `SummingMergeTree(${(columns || []).join(', ')})`;
    },
    type: 'SummingMergeTree',
});
exports.SummingMergeTree = SummingMergeTree;
const AggregatingMergeTree = () => ({
    toString: () => {
        return `AggregatingMergeTree()`;
    },
    type: 'AggregatingMergeTree',
});
exports.AggregatingMergeTree = AggregatingMergeTree;
const CollapsingMergeTree = (sign) => ({
    toString: () => {
        return `CollapsingMergeTree(${sign})`;
    },
    type: 'CollapsingMergeTree',
});
exports.CollapsingMergeTree = CollapsingMergeTree;
const VersionedCollapsingMergeTree = (sign, version) => ({
    toString: () => {
        return `VersionedCollapsingMergeTree(${sign}, ${version})`;
    },
    type: 'VersionedCollapsingMergeTree',
});
exports.VersionedCollapsingMergeTree = VersionedCollapsingMergeTree;
const GraphiteMergeTree = (config_section) => ({
    toString: () => {
        return `CollapsingMergeTree(${config_section})`;
    },
    type: 'GraphiteMergeTree',
});
exports.GraphiteMergeTree = GraphiteMergeTree;
//# sourceMappingURL=engines.js.map