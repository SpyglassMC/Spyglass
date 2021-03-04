import { ErrorReporter } from '@spyglassmc/core'
import { JsonAstNode } from '../../node'
import { Schema } from '../Schema'
import { SchemaContext } from '../SchemaContext'

export function as(context: string, schema: Schema<JsonAstNode>): Schema<JsonAstNode> {
	return (node: JsonAstNode, ctx: SchemaContext) => {
		schema(node, ctx)
		node.context = context
	}
}

export type AttemptResult = {
	updateCtx: () => void,
	totalErrorRange: number,
}

export function attempt(schema: Schema<JsonAstNode>, node: JsonAstNode, ctx: SchemaContext): AttemptResult {
	// TODO: determine whether cloning of AST is necessary
	// Currently nodes are not cloned
	const tempCtx = SchemaContext.create({
		...ctx,
		err: new ErrorReporter(),
	})

	schema(node, tempCtx)

	const totalErrorRange = tempCtx.err.errors
		.map(e => e.range.end - e.range.start)
		.reduce((a, b) => a + b, 0)

	return {
		totalErrorRange,
		updateCtx: () => {
			ctx.err.absorb(tempCtx.err)
		},
	}
}

export function any(schemas: Schema<JsonAstNode>[]): Schema<JsonAstNode> {
	if (schemas.length === 0) {
		throw new Error('Expected at least one schema')
	}
	return (node: JsonAstNode, ctx: SchemaContext) => {
		const attempts = schemas
			.map(schema => attempt(schema, node, ctx))
			.sort((a, b) => a.totalErrorRange - b.totalErrorRange)
		attempts[0].updateCtx()
	}
}
