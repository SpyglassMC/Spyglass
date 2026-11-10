import {
	type ArgumentTreeNode,
	type CommandTreeNode,
	type McmetaCommands,
	ReleaseVersion,
} from '../../dependency/index.js'

/**
 * Transforms 26.4+ command tree to old format.
 *
 * The transformation happens in-place.
 */
export function transformTree(
	commands: McmetaCommands,
	releaseVersion: ReleaseVersion,
) {
	if (ReleaseVersion.cmp(releaseVersion, '26.4') >= 0) {
		transformNode(commands)
	}
}

interface ModernArgumentTreeNode extends ArgumentTreeNode {
	argument?: {
		type: string
		[name: string]: any
	}
}

function transformNode(node: CommandTreeNode) {
	// Transform this node
	if (node.type === 'argument') {
		const argument = (node as ModernArgumentTreeNode).argument
		if (argument !== undefined) {
			// General data structure change
			node.parser = argument.type
			node.properties = argument
			delete node.properties['type']
			delete (node as ModernArgumentTreeNode).argument

			// `minecraft:entity` parser field change
			if (node.parser === 'minecraft:entity') {
				node.properties['amount'] = node.properties['single_result'] ? 'single' : 'multiple'
				node.properties['type'] = node.properties['players_only'] ? 'players' : 'entities'
			}
		}
	}
	// Transform children
	if (node.children !== undefined) {
		for (const child of Object.values(node.children)) {
			transformNode(child)
		}
	}
}
