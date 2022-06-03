import type { AstNode, BinderContext, Location, MetaRegistry, RangeLike, Symbol } from '@spyglassmc/core'
import { AsyncBinder, ErrorSeverity, Range, SymbolUtil, SymbolVisibility } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { AdditionalContext } from '../common.js'
import type { IdentifierNode, ModuleNode } from '../node/index.js'
import { DocCommentsNode, EnumNode, PathNode, StructNode, TypeAliasNode, UseStatementNode } from '../node/index.js'

interface McdocBinderContext extends BinderContext, AdditionalContext { }

export const fileModule = AsyncBinder.create<ModuleNode>(async (node, ctx) => {
	const moduleIdentifier = Object
		.values(ctx.symbols.global.mcdoc ?? {})
		.find(symbol => {
			return symbol.subcategory === 'module' && symbol.definition?.some(loc => loc.uri === ctx.doc.uri)
		})
	if (!moduleIdentifier) {
		ctx.err.report(
			localize('mcdoc.binder.out-of-root', localeQuote(ctx.doc.uri)),
			Range.Beginning, ErrorSeverity.Hint
		)
		return
	}

	const mcdocCtx: McdocBinderContext = {
		...ctx,
		moduleIdentifier: moduleIdentifier.identifier,
	}
	return module_(node, mcdocCtx)
})

export async function module_(node: ModuleNode, ctx: McdocBinderContext): Promise<void> {
	hoist(node, ctx)
}

/**
 * Hoist enums, structs, type aliases, and use statements under the module scope.
 */
export function hoist(node: ModuleNode, ctx: McdocBinderContext): void {
	for (const child of node.children) {
		switch (child.type) {
			case 'mcdoc:enum': hoistEnum(child); break
			case 'mcdoc:struct': hoistStruct(child); break
			case 'mcdoc:type_alias': hoistTypeAlias(child); break
			case 'mcdoc:use_statement': hoistUseStatement(child); break
		}
	}

	function hoistEnum(node: EnumNode) {
		hoistFor('enum', node, EnumNode.destruct)
	}

	function hoistStruct(node: StructNode) {
		hoistFor('struct', node, StructNode.destruct)
	}

	function hoistTypeAlias(node: TypeAliasNode) {
		hoistFor('type_alias', node, TypeAliasNode.destruct)
	}

	function hoistUseStatement(node: UseStatementNode) {
		const { binding, path } = UseStatementNode.destruct(node)
		if (!path) {
			return
		}

		const { lastIdentifier } = PathNode.destruct(path)
		const identifier = binding ?? lastIdentifier
		if (!identifier) {
			return
		}

		ctx.symbols
			.query({ doc: ctx.doc, node }, 'mcdoc', `${ctx.moduleIdentifier}::${identifier.value}`)
			.ifDeclared(symbol => reportDuplicatedDeclaration(ctx, symbol, identifier))
			.elseEnter({
				data: { subcategory: 'use_statement_binding', visibility: SymbolVisibility.File },
				usage: { type: 'definition', node: identifier, fullRange: node },
			})
	}

	function hoistFor<N extends AstNode>(subcategory: 'enum' | 'struct' | 'type_alias', node: N, destructor: (node: N) => { docComments?: DocCommentsNode, identifier?: IdentifierNode }) {
		const { docComments, identifier } = destructor(node)
		if (!identifier?.value) {
			return
		}

		ctx.symbols
			.query({ doc: ctx.doc, node }, 'mcdoc', `${ctx.moduleIdentifier}::${identifier.value}`)
			.ifDeclared(symbol => reportDuplicatedDeclaration(ctx, symbol, identifier))
			.elseEnter({
				data: { desc: DocCommentsNode.asText(docComments), subcategory },
				usage: { type: 'definition', node: identifier, fullRange: node },
			})
	}
}

export function registerMcdocBinders(meta: MetaRegistry) {
	meta.registerBinder<ModuleNode>('mcdoc:module', fileModule)
}

function reportDuplicatedDeclaration(ctx: McdocBinderContext, symbol: Symbol, range: RangeLike) {
	const LocaleString = 'mcdoc.binder.duplicated-path'
	ctx.err.report(
		localize(LocaleString, localeQuote(symbol.identifier)),
		range, ErrorSeverity.Warning,
		{
			related: [{
				location: SymbolUtil.getDeclaredLocation(symbol) as Location,
				message: localize(`${LocaleString}.related`, localeQuote(symbol.identifier)),
			}],
		}
	)
}
