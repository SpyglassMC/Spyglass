import type { MetaRegistry, SyncChecker } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { TypeDefSymbolData } from '../binder/index.js'
import type { TypeNode } from '../node/index.js'
import { ReferenceTypeNode, TypeArgBlockNode, TypeBaseNode } from '../node/index.js'

const reference: SyncChecker<ReferenceTypeNode> = (node, ctx) => {
	const { path } = ReferenceTypeNode.destruct(node)
	if (!path.canonical) {
		return
	}

	const { appendixes } = TypeBaseNode.destruct(node)
	let typeArgs: TypeNode[] = []
	if (TypeArgBlockNode.is(appendixes[0])) {
		const { args } = TypeArgBlockNode.destruct(appendixes[0])
		typeArgs = args
	}

	const symbol = ctx.symbols.query({ doc: ctx.doc, node }, 'mcdoc', path.canonical)
		.getData(TypeDefSymbolData.is)

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
				path.canonical,
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
