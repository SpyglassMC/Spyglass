import type * as core from '@spyglassmc/core'
import type { RootTreeNode, TreeNode } from '@spyglassmc/mcfunction'

/**
 * A set of parsers that must be patched with a `properties` field.
 */
const PatchRequiredParsers = new Set([
	'minecraft:nbt_compound_tag',
	'minecraft:nbt_path',
	'minecraft:nbt_tag',
	'minecraft:resource_location',
	'minecraft:uuid',
])

/**
 * Validate that parsers requiring patches have been patched in the tree.
 */
export function validatePatchedTree(tree: RootTreeNode, logger: core.Logger) {
	walk(tree, [])

	function walk(node: TreeNode, path: readonly string[]) {
		if (
			node.type === 'argument' && PatchRequiredParsers.has(node.parser)
			&& !node.properties
		) {
			logger.warn(
				`[validatePatchedTree] Patch required: ${node.parser} at ${path.join('.')}`,
			)
		}

		for (const [key, value] of Object.entries(node.children ?? {})) {
			walk(value, [...path, key])
		}
	}
}
