import { AlwaysPass } from '@spyglassmc/mcfunction'
import type { NodeMigrationRule } from './index.js'

export const ALL_NODE_PERMISSION: NodeMigrationRule = {
	since: '1.21.11',
	until: '26.4',
	apply: (node) => {
		if (node.type !== 'root' && node.permissions === undefined) {
			node.permissions = AlwaysPass
		}
	},
}
