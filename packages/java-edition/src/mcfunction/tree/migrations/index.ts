import type { CommandTreeNode, ReleaseVersion } from '../../../dependency/index.js'

import { ALL_NODE_PERMISSION } from './all_node_permission.js'
import { ARGUMENT_26_4 } from './argument_26_4.js'

/**
 * `apply` is an in-place migration applied to a single node.
 */
export type NodeMigrationRule =
	| {
		since: ReleaseVersion
		until?: ReleaseVersion
		apply: (tree: CommandTreeNode) => void
	}
	| {
		since?: ReleaseVersion
		until: ReleaseVersion
		apply: (tree: CommandTreeNode) => void
	}

export const Migrations: NodeMigrationRule[] = [
	ARGUMENT_26_4,
	ALL_NODE_PERMISSION,
]
