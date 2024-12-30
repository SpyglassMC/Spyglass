import type { AstNode } from '../../node/index.js'
import type { CodeActionProviderContext } from '../../service/index.js'
import type { LanguageError, LanguageErrorAction } from '../../source/index.js'

export interface CodeAction extends LanguageErrorAction {
	errors?: LanguageError[]
}

export type CodeActionProvider<N extends AstNode = AstNode> = (
	node: N,
	ctx: CodeActionProviderContext,
) => readonly CodeAction[]
