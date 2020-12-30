import { Hover } from 'vscode-languageserver'
import { ArgumentNode, GetHover, NodeRange } from '../nodes/ArgumentNode'
import { DocCommentComponent } from '../plugins/builtin/DocCommentPlugin'
import { CommandComponent, isInRange, ParsingContext, SyntaxComponent } from '../types'

export function onHover({ com, ctx }: { com: SyntaxComponent, ctx: ParsingContext }): Hover | null {
	if (com.type === 'spgoding:doc_comment/doc_comment') {
		const docCom = com as DocCommentComponent
		if (isInRange(ctx.cursor, docCom.range)) {
			return docCom.data.doc[GetHover](ctx)
		}
	}
	const cmdCom = com as CommandComponent
	for (const { data } of cmdCom.data) {
		if (data instanceof ArgumentNode) {
			const range = data[NodeRange]
			if (isInRange(ctx.cursor, range)) {
				return data[GetHover](ctx)
			}
		}
	}

	return null
}
