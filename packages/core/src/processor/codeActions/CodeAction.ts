import type { AstNode } from '../../node/index.js'
import type { CodeActionProviderContext } from '../../service/index.js'
import type { LanguageError } from '../../source/index.js'

export interface CodeAction {
	title: string
	isPreferred?: boolean
	errors?: LanguageError[]
}

export type CodeActionProvider<N extends AstNode = AstNode> = (
	node: N,
	ctx: CodeActionProviderContext,
) => readonly CodeAction[]
