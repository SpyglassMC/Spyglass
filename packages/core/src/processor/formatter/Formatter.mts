import type { AstNode } from '../../node/index.mjs'
import type { FormatterContext } from '../../service/index.mjs'

export type Formatter<N = AstNode> = (node: N, ctx: FormatterContext) => string

export function formatterContextIndentation(ctx: FormatterContext, additionalLevels = 0): string {
	const total = ctx.indentLevel + additionalLevels
	return ctx.insertSpaces ? ' '.repeat(total * ctx.tabSize) : '\t'.repeat(total)
}

export function indentFormatter(ctx: FormatterContext, additionalLevels = 1): FormatterContext {
	return {
		...ctx,
		indentLevel: ctx.indentLevel + additionalLevels,
		indent(additionalLevels) {
			return formatterContextIndentation(this, additionalLevels)
		},
	}
}
