import type * as core from '@spyglassmc/core'

interface ArgumentBaseNode extends core.AstNode {

}

export interface LiteralArgumentNode extends ArgumentBaseNode, core.LiteralBaseNode {
	type: 'mcfunction:argument/literal',
}

export interface BrigadierIntArgumentNode extends ArgumentBaseNode, core.IntegerBaseNode {
	type: 'mcfunction:argument/brigadier:int',
}

export type ArgumentNode =
	| LiteralArgumentNode
	| BrigadierIntArgumentNode
