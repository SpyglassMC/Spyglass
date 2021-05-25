import * as core from '@spyglassmc/core'
import * as nbt from '@spyglassmc/nbt'
import type { CommandNode } from '../node'

export const command: core.Checker<CommandNode> = (node, ctx) => {
	if (node.children[0]?.name === 'data') {
		if (node.children[1]?.name === 'merge') {
			const registry = node.children[2]?.name
			switch (registry) {
				case 'block':

					break
				case 'entity':
					break
				case 'storage':
					const idNode = node.children[3]
					const nbtNode = node.children[4]
					if (idNode?.type === 'mcfunction:argument/minecraft:resource_location' && nbtNode?.type === 'nbt:compound') {
						nbt.checker.index(registry, core.ResourceLocationNode.toString(idNode, 'full'))(nbtNode, ctx)
					}
					break
			}
		}
	}
}

export function register(meta: core.MetaRegistry) { 
	meta.registerChecker<CommandNode>('mcfunction:command', command)
}
