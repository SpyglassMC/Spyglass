import type { MetaRegistry, SyncChecker } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import * as binder from '../binder/index.js'
import type { TypeNode } from '../node'
import { ReferenceTypeNode, TypeArgBlockNode, TypeBaseNode } from '../node'

const reference: SyncChecker<ReferenceTypeNode> = (node, ctx) => {
	const { path } = ReferenceTypeNode.destruct(node)
	const { appendixes } = TypeBaseNode.destruct(node)
	const typeArgBlock = appendixes.find(TypeArgBlockNode.is)
	let typeArgs: TypeNode[] = []
	if (typeArgBlock !== undefined) {
		const { args } = TypeArgBlockNode.destruct(typeArgBlock)
		typeArgs = args
	}

	const moduleIdentifier = binder.uriToIdentifier(ctx.doc.uri, ctx)
	if (!moduleIdentifier) {
		return
	}

	const pathList = binder.resolvePath(path, { ...ctx, moduleIdentifier }) ?? []
	const absolutePath = '::' + pathList.join('::')

	const symbol = ctx.symbols.query({ doc: ctx.doc, node }, 'mcdoc', absolutePath)
		.getData(binder.TypeDefSymbolData.is)

	if (!symbol) {
		return
	}

	let typeParams = []
	if (symbol.typeDef.kind === 'template') {
		typeParams = symbol.typeDef.typeParams
	}

	if (typeParams.length !== typeArgs.length) {
		ctx.err.report(
			localize(
				'mcdoc.checker.reference.unexpected-number-of-type-arguments',
				absolutePath,
				typeParams.length,
				typeArgs.length,
			),
			node,
		)
	}
}

export function registerMcdocChecker(meta: MetaRegistry) {
	meta.registerChecker<ReferenceTypeNode>('mcdoc:type/reference', reference)
}
