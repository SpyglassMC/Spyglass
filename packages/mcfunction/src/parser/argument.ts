import type * as core from '@spyglassmc/core'
import type { ArgumentTreeNode } from '../tree/index.js'

/**
 * A function that returns a parser for the provided tree node.
 *
 * @param treeNode The argument tree node.
 *
 * @returns The parser corresponding to that tree node, or `undefined` if such parser doesn't exist.
 */
export type ArgumentParserGetter = (treeNode: ArgumentTreeNode) => core.Parser | undefined

export function argumentTreeNodeToString(name: string, treeNode: ArgumentTreeNode): string {
	const parserName = treeNode.parser.slice(treeNode.parser.indexOf(':') + 1)
	return `<${name}: ${parserName}>`
}
