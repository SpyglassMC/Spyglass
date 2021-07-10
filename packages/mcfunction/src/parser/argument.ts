import type * as core from '@spyglassmc/core'
import type { ChildBaseNode, SpecialArgumentNode } from '../node'
import type { ArgumentTreeNode } from '../tree'

/**
 * A function that returns a parser for the provided tree node.
 * 
 * @param name The name of the argument tree node.
 * @param treeNode The argument tree node.
 * 
 * @returns The parser corresponding to that tree node, or `null` / `undefined` if such parsers don't exist.
 */
export type ArgumentParserGetter<A extends ChildBaseNode> = (name: string, treeNode: ArgumentTreeNode) => core.Parser<A | SpecialArgumentNode> | undefined | null

export function argumentTreeNodeToString(name: string, treeNode: ArgumentTreeNode): string {
	const parserName = treeNode.parser.slice(treeNode.parser.indexOf(':') + 1)
	return `<${name}: ${parserName}>`
}
