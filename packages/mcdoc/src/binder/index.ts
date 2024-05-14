import type {
	AstNode,
	BinderContext,
	CheckerContext,
	Location,
	MetaRegistry,
	RangeLike,
	StringNode,
	Symbol,
	SymbolQuery,
} from '@spyglassmc/core'
import {
	AsyncBinder,
	atArray,
	Dev,
	ErrorSeverity,
	Range,
	ResourceLocationNode,
	SymbolUtil,
	SymbolVisibility,
	traversePreOrder,
} from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { AdditionalContext } from '../common.js'
import type {
	AnyTypeNode,
	AttributeValueNode,
	BooleanTypeNode,
	EnumValueNode,
	IdentifierNode,
	IndexNode,
	LiteralTypeValueNode,
	ModuleNode,
	StructFieldNode,
	StructKeyNode,
	TypeNode,
} from '../node/index.js'
import {
	AttributeNode,
	AttributeTreeNamedValuesNode,
	AttributeTreeNode,
	AttributeTreePosValuesNode,
	DispatcherTypeNode,
	DispatchStatementNode,
	DocCommentsNode,
	DynamicIndexNode,
	EnumBlockNode,
	EnumFieldNode,
	EnumInjectionNode,
	EnumNode,
	FloatRangeNode,
	IndexBodyNode,
	InjectionNode,
	IntRangeNode,
	ListTypeNode,
	LiteralNode,
	LiteralTypeNode,
	NumericTypeNode,
	PathNode,
	PrimitiveArrayTypeNode,
	ReferenceTypeNode,
	StaticIndexNode,
	StringTypeNode,
	StructBlockNode,
	StructMapKeyNode,
	StructNode,
	StructPairFieldNode,
	StructSpreadFieldNode,
	TopLevelNode,
	TupleTypeNode,
	TypeAliasNode,
	TypeArgBlockNode,
	TypeBaseNode,
	TypedNumberNode,
	TypeParamBlockNode,
	TypeParamNode,
	UnionTypeNode,
	UseStatementNode,
} from '../node/index.js'
import type { LiteralNumberCaseInsensitiveSuffix } from '../parser/index.js'
import type {
	Attribute,
	AttributeTree,
	AttributeValue,
	DynamicIndex,
	EnumTypeField,
	Index,
	LiteralValue,
	McdocType,
	NumericRange,
	NumericTypeKind,
	NumericTypeKinds,
	ParallelIndices,
	PrimitiveArrayValueKind,
	StaticIndex,
	StructTypeField,
	StructTypePairField,
	StructTypeSpreadField,
} from '../type/index.js'

interface McdocBinderContext extends BinderContext, AdditionalContext {}

interface ModuleSymbolData {
	nextAnonymousIndex: number
}
namespace ModuleSymbolData {
	export function is(data: unknown): data is ModuleSymbolData {
		return (
			!!data &&
			typeof data === 'object' &&
			typeof (data as ModuleSymbolData).nextAnonymousIndex === 'number'
		)
	}
}

export interface TypeDefSymbolData {
	typeDef: McdocType
}
export namespace TypeDefSymbolData {
	export function is(data: unknown): data is TypeDefSymbolData {
		return (
			!!data &&
			typeof data === 'object' &&
			typeof (data as TypeDefSymbolData).typeDef === 'object'
		)
	}
}

export const fileModule = AsyncBinder.create<ModuleNode>(async (node, ctx) => {
	const moduleIdentifier = uriToIdentifier(ctx.doc.uri, ctx)
	if (!moduleIdentifier) {
		ctx.err.report(
			localize('mcdoc.binder.out-of-root', localeQuote(ctx.doc.uri)),
			Range.Beginning,
			ErrorSeverity.Hint,
		)
		return
	}

	const mcdocCtx: McdocBinderContext = {
		...ctx,
		moduleIdentifier,
	}
	return module_(node, mcdocCtx)
})

export async function module_(
	node: ModuleNode,
	ctx: McdocBinderContext,
): Promise<void> {
	const data: ModuleSymbolData = { nextAnonymousIndex: 0 }
	ctx.symbols
		.query({ doc: ctx.doc, node }, 'mcdoc', ctx.moduleIdentifier)
		.amend({ data: { data } })

	hoist(node, ctx)

	for (const child of node.children) {
		switch (child.type) {
			case 'mcdoc:dispatch_statement':
				await bindDispatchStatement(child, ctx)
				break
			case 'mcdoc:enum':
				bindEnum(child, ctx)
				break
			case 'mcdoc:injection':
				await bindInjection(child, ctx)
				break
			case 'mcdoc:struct':
				await bindStruct(child, ctx)
				break
			case 'mcdoc:type_alias':
				await bindTypeAlias(child, ctx)
				break
			case 'mcdoc:use_statement':
				await bindUseStatement(child, ctx)
				break
		}
	}
}

/**
 * Hoist enums, structs, type aliases, and use statements under the module scope.
 */
function hoist(node: ModuleNode, ctx: McdocBinderContext): void {
	traversePreOrder(
		node,
		() => true,
		TopLevelNode.is,
		(child) => {
			switch (child.type) {
				case 'mcdoc:enum':
					hoistEnum(child)
					break
				case 'mcdoc:struct':
					hoistStruct(child)
					break
				case 'mcdoc:type_alias':
					hoistTypeAlias(child)
					break
				case 'mcdoc:use_statement':
					hoistUseStatement(child)
					break
			}
		},
	)

	function hoistEnum(node: EnumNode) {
		hoistFor('enum', node, EnumNode.destruct, (n) => ({
			typeDef: convertEnum(n, ctx),
		}))
	}

	function hoistStruct(node: StructNode) {
		hoistFor('struct', node, StructNode.destruct, (n) => ({
			typeDef: convertStruct(n, ctx),
		}))
	}

	function hoistTypeAlias(node: TypeAliasNode) {
		hoistFor('type_alias', node, TypeAliasNode.destruct, (n) => {
			const { attributes, rhs, typeParams } = TypeAliasNode.destruct(n)
			if (!rhs) {
				return undefined
			}

			const ans: TypeDefSymbolData = { typeDef: convertType(rhs, ctx) }

			if (typeParams) {
				bindTypeParamBlock(node, typeParams, ans, ctx)
			}
			ans.typeDef = attributeType(ans.typeDef, attributes, ctx)

			return ans
		})
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

		// hoistUseStatement associates the AST node with the binding definition in the file symbol table,
		// which may get overridden by bindUseStatement in the later stage as an reference to the imported symbol in the global symbol table.
		// This way when the user tries to go to definition on the path in the use statement,
		// they will go to the definition in the imported file.

		ctx.symbols
			.query(
				{ doc: ctx.doc, node },
				'mcdoc',
				`${ctx.moduleIdentifier}::${identifier.value}`,
			)
			.ifDeclared((symbol) =>
				reportDuplicatedDeclaration(ctx, symbol, identifier)
			)
			.elseEnter({
				data: {
					subcategory: 'use_statement_binding',
					visibility: SymbolVisibility.File,
				},
				usage: { type: 'definition', node: identifier, fullRange: node },
			})
	}

	function hoistFor<N extends AstNode>(
		subcategory: 'enum' | 'struct' | 'type_alias',
		node: N,
		destructor: (node: N) => {
			docComments?: DocCommentsNode
			keyword: LiteralNode
			identifier?: IdentifierNode
		},
		getData: (node: N) => unknown,
	) {
		const { docComments, identifier, keyword } = destructor(node)
		const name = identifier?.value ?? nextAnonymousIdentifier(node, ctx)
		ctx.symbols
			.query(
				{ doc: ctx.doc, node },
				'mcdoc',
				`${ctx.moduleIdentifier}::${name}`,
			)
			.ifDeclared((symbol) =>
				reportDuplicatedDeclaration(ctx, symbol, identifier ?? node)
			)
			.elseEnter({
				data: {
					data: getData(node),
					desc: DocCommentsNode.asText(docComments),
					subcategory,
				},
				// If the current syntax structure is named, then the identifier node is entered as a definition;
				// otherwise, an anonymous identifier is generated for the symbol and the keyword node is entered as a definition.
				usage: {
					type: 'definition',
					node: identifier ?? keyword,
					fullRange: identifier && node,
				},
			})
	}

	function nextAnonymousIndex(node: AstNode, ctx: McdocBinderContext): number {
		const data = ctx.symbols
			.query({ doc: ctx.doc, node }, 'mcdoc', ctx.moduleIdentifier)
			.getData(ModuleSymbolData.is)
		if (!data) {
			throw new Error(`No symbol data for module '${ctx.moduleIdentifier}'`)
		}

		return data.nextAnonymousIndex++
	}

	function nextAnonymousIdentifier(
		node: AstNode,
		ctx: McdocBinderContext,
	): string {
		return `<anonymous ${nextAnonymousIndex(node, ctx)}>`
	}
}

/**
 * Bind the type param block of a parent node, and modifies the `data` argument in-place to change its `typeDef` to be of template kind.
 */
function bindTypeParamBlock(
	node: DispatchStatementNode | TypeAliasNode,
	typeParams: TypeParamBlockNode,
	data: TypeDefSymbolData,
	ctx: McdocBinderContext,
): void {
	// Type parameters are added as local symbols on the type alias AST node.
	// Thus we create a new local scope on the type alias statement node first.
	node.locals = Object.create(null)

	// They are also added to the type definition.
	data.typeDef = {
		kind: 'template',
		child: data.typeDef,
		typeParams: [],
	}

	const { params } = TypeParamBlockNode.destruct(typeParams)
	for (const param of params) {
		const { identifier: paramIdentifier } = TypeParamNode.destruct(param)
		if (paramIdentifier.value) {
			// Add the type parameter as a local symbol.
			const paramPath = `${ctx.moduleIdentifier}::${paramIdentifier.value}`
			ctx.symbols
				.query({ doc: ctx.doc, node }, 'mcdoc', paramPath)
				.ifDeclared((symbol) =>
					reportDuplicatedDeclaration(ctx, symbol, paramIdentifier)
				)
				.elseEnter({
					data: { visibility: SymbolVisibility.Block },
					usage: {
						type: 'declaration',
						node: paramIdentifier,
						fullRange: param,
					},
				})

			// Also add it to the type definition.
			data.typeDef.typeParams.push({ path: paramPath })
		}
		// if (constraint) {
		// 	await bindPath(constraint, ctx)
		// }
	}
}

async function bindDispatchStatement(
	node: DispatchStatementNode,
	ctx: McdocBinderContext,
): Promise<void> {
	const { attributes, location, index, target, typeParams } =
		DispatchStatementNode.destruct(node)
	if (!(location && index && target)) {
		return
	}

	const locationStr = ResourceLocationNode.toString(location, 'full')
	ctx.symbols.query(ctx.doc, 'mcdoc/dispatcher', locationStr).enter({
		usage: { type: 'reference', node: location, fullRange: node },
	})

	const { parallelIndices } = IndexBodyNode.destruct(index)
	if (parallelIndices.length) {
		const data: TypeDefSymbolData = {
			typeDef: convertType(target, ctx),
		}
		if (typeParams) {
			bindTypeParamBlock(node, typeParams, data, ctx)
		}
		data.typeDef = attributeType(data.typeDef, attributes, ctx)

		for (const key of parallelIndices) {
			if (DynamicIndexNode.is(key)) {
				// Ignore dynamic indices in dispatch statements.
				continue
			}

			ctx.symbols
				.query(ctx.doc, 'mcdoc/dispatcher', locationStr, asString(key))
				.ifDeclared((symbol) =>
					reportDuplicatedDeclaration(ctx, symbol, key, {
						localeString:
							'mcdoc.binder.dispatcher-statement.duplicated-key',
					})
				)
				.elseEnter({
					data: { data },
					usage: { type: 'definition', node: key, fullRange: node },
				})
		}
	}

	await bindType(target, ctx)
}

async function bindType(
	node: TypeNode,
	ctx: McdocBinderContext,
): Promise<void> {
	if (DispatcherTypeNode.is(node)) {
		await bindDispatcherType(node, ctx)
	} else if (EnumNode.is(node)) {
		bindEnum(node, ctx)
	} else if (ListTypeNode.is(node)) {
		const { item } = ListTypeNode.destruct(node)
		await bindType(item, ctx)
	} else if (ReferenceTypeNode.is(node)) {
		const { path } = ReferenceTypeNode.destruct(node)
		await bindPath(path, ctx)
	} else if (StructNode.is(node)) {
		await bindStruct(node, ctx)
	} else if (TupleTypeNode.is(node)) {
		const { items } = TupleTypeNode.destruct(node)
		for (const item of items) {
			await bindType(item, ctx)
		}
	} else if (UnionTypeNode.is(node)) {
		const { members } = UnionTypeNode.destruct(node)
		for (const member of members) {
			await bindType(member, ctx)
		}
	}

	const { appendixes } = TypeBaseNode.destruct(node)
	for (const appendix of appendixes) {
		if (TypeArgBlockNode.is(appendix)) {
			const { args } = TypeArgBlockNode.destruct(appendix)
			for (const arg of args) {
				await bindType(arg, ctx)
			}
		}
	}
}

async function bindDispatcherType(
	node: DispatcherTypeNode,
	ctx: McdocBinderContext,
): Promise<void> {
	const { index, location } = DispatcherTypeNode.destruct(node)
	const locationStr = ResourceLocationNode.toString(location, 'full')
	ctx.symbols
		.query(ctx.doc, 'mcdoc/dispatcher', locationStr)
		.enter({ usage: { type: 'reference', node: location, fullRange: node } })

	const { parallelIndices } = IndexBodyNode.destruct(index)
	for (const key of parallelIndices) {
		if (DynamicIndexNode.is(key)) {
			// Although it is technically possible to bind some of the dynamic indices as references
			// of struct keys, it is rather complicated to do so. We will ignore them for now.
			continue
		}

		ctx.symbols
			.query(ctx.doc, 'mcdoc/dispatcher', locationStr, asString(key))
			.enter({ usage: { type: 'reference', node: key, fullRange: node } })
	}
}

async function bindPath(
	node: PathNode,
	ctx: McdocBinderContext,
): Promise<void> {
	for (
		const { identifiers, node: identNode, indexRight } of resolvePathByStep(
			node,
			ctx,
			{ reportErrors: true },
		)
	) {
		if (!identifiers?.length) {
			continue
		}

		if (indexRight === 1) {
			// The second last identifier in a path points to a file module.
			const referencedModuleFile = pathArrayToString(identifiers)
			const referencedModuleUri = identifierToUri(referencedModuleFile, ctx)
			if (!referencedModuleUri) {
				ctx.err.report(
					localize(
						'mcdoc.binder.path.unknown-module',
						localeQuote(referencedModuleFile),
					),
					node,
					ErrorSeverity.Warning,
				)
				return
			}

			await ctx.ensureBindingStarted(referencedModuleUri)
		}

		ctx.symbols
			.query(
				{ doc: ctx.doc, node: identNode },
				'mcdoc',
				pathArrayToString(identifiers),
			)
			.ifDeclared((_, query) =>
				query.enter({
					usage: {
						type: 'reference',
						node: identNode,
						fullRange: node,
						skipRenaming: LiteralNode.is(identNode),
					},
				})
			)
			.else(() => {
				if (indexRight === 0) {
					ctx.err.report(
						localize(
							'mcdoc.binder.path.unknown-identifier',
							localeQuote(atArray(identifiers, -1)!),
							localeQuote(pathArrayToString(identifiers.slice(0, -1))),
						),
						node,
						ErrorSeverity.Warning,
					)
				}
			})
	}
}

function bindEnum(node: EnumNode, ctx: McdocBinderContext): void {
	const { block, identifier, keyword } = EnumNode.destruct(node)
	const symbol = identifier?.symbol ?? keyword.symbol
	if (symbol?.subcategory !== 'enum') {
		return
	}

	const query = ctx.symbols.query(
		{ doc: ctx.doc, node },
		'mcdoc',
		...symbol.path,
	)
	Dev.assertDefined(query.symbol)
	bindEnumBlock(block, ctx, query)
}

function bindEnumBlock(
	node: EnumBlockNode,
	ctx: McdocBinderContext,
	query: SymbolQuery,
	options: { extendsTypeDefData?: boolean } = {},
): void {
	const { fields } = EnumBlockNode.destruct(node)
	for (const field of fields) {
		const { identifier } = EnumFieldNode.destruct(field)
		query.member(identifier.value, (fieldQuery) =>
			fieldQuery
				.ifDeclared((symbol) =>
					reportDuplicatedDeclaration(ctx, symbol, identifier)
				)
				.elseEnter({
					usage: {
						type: 'definition',
						node: identifier,
						fullRange: field,
					},
				}))
	}
}

async function bindInjection(
	node: InjectionNode,
	ctx: McdocBinderContext,
): Promise<void> {
	const { injection } = InjectionNode.destruct(node)
	if (EnumInjectionNode.is(injection)) {
		// TODO
		// const {  } = EnumInjectionNode.destruct(injection)
		// bindEnumBlock(block, ctx, query, { extendsTypeDefData: true })
	}
}

async function bindStruct(
	node: StructNode,
	ctx: McdocBinderContext,
): Promise<void> {
	const { block, identifier, keyword } = StructNode.destruct(node)
	const symbol = identifier?.symbol ?? keyword.symbol
	if (symbol?.subcategory !== 'struct') {
		return
	}

	const query = ctx.symbols.query(
		{ doc: ctx.doc, node },
		'mcdoc',
		...symbol.path,
	)
	Dev.assertDefined(query.symbol)
	await bindStructBlock(block, ctx, query)
}

async function bindStructBlock(
	node: StructBlockNode,
	ctx: McdocBinderContext,
	query: SymbolQuery,
	options: { extendsTypeDefData?: boolean } = {},
): Promise<void> {
	const { fields } = StructBlockNode.destruct(node)
	for (const field of fields) {
		if (StructPairFieldNode.is(field)) {
			const { key, type } = StructPairFieldNode.destruct(field)
			if (!StructMapKeyNode.is(key)) {
				query.member(key.value, (fieldQuery) =>
					fieldQuery
						.ifDeclared((symbol) =>
							reportDuplicatedDeclaration(ctx, symbol, key)
						)
						.elseEnter({
							usage: { type: 'definition', node: key, fullRange: field },
						}))
			}
			await bindType(type, ctx)
		} else {
			const { type } = StructSpreadFieldNode.destruct(field)
			await bindType(type, ctx)
		}
	}
}

async function bindTypeAlias(
	node: TypeAliasNode,
	ctx: McdocBinderContext,
): Promise<void> {
	const { identifier, rhs, typeParams } = TypeAliasNode.destruct(node)
	if (!identifier?.value) {
		return
	}

	if (rhs) {
		await bindType(rhs, ctx)
	}
}

async function bindUseStatement(
	node: UseStatementNode,
	ctx: McdocBinderContext,
): Promise<void> {
	const { path } = UseStatementNode.destruct(node)
	if (!path) {
		return
	}

	return bindPath(path, ctx)
}

export function registerMcdocBinders(meta: MetaRegistry) {
	meta.registerBinder<ModuleNode>('mcdoc:module', fileModule)
}

function reportDuplicatedDeclaration(
	ctx: McdocBinderContext,
	symbol: Symbol,
	range: RangeLike,
	options: {
		localeString:
			| 'mcdoc.binder.dispatcher-statement.duplicated-key'
			| 'mcdoc.binder.duplicated-declaration'
	} = { localeString: 'mcdoc.binder.duplicated-declaration' },
) {
	ctx.err.report(
		localize(options.localeString, localeQuote(symbol.identifier)),
		range,
		ErrorSeverity.Warning,
		{
			related: [
				{
					location: SymbolUtil.getDeclaredLocation(symbol) as Location,
					message: localize(
						`${options.localeString}.related`,
						localeQuote(symbol.identifier),
					),
				},
			],
		},
	)
}

function* resolvePathByStep(
	path: PathNode,
	ctx: McdocBinderContext,
	options: { reportErrors?: boolean } = {},
): Generator<{
	identifiers: readonly string[]
	node: IdentifierNode | LiteralNode
	index: number
	indexRight: number
}> {
	const { children, isAbsolute } = PathNode.destruct(path)
	const identifiers: string[] = isAbsolute
		? []
		: ctx.moduleIdentifier.slice(2).split('::')
	for (const [i, child] of children.entries()) {
		switch (child.type) {
			case 'mcdoc:identifier':
				identifiers.push(child.value)
				break
			case 'mcdoc:literal':
				// super
				if (identifiers.length === 0) {
					if (options.reportErrors) {
						ctx.err.report(
							localize('mcdoc.binder.path.super-from-root'),
							child,
						)
					}
					return
				}
				identifiers.pop()
				break
			default:
				Dev.assertNever(child)
		}
		yield {
			identifiers,
			node: child,
			index: i,
			indexRight: children.length - 1 - i,
		}
	}
}

function resolvePath(
	path: PathNode,
	ctx: McdocBinderContext,
	options: { reportErrors?: boolean } = {},
): readonly string[] | undefined {
	return atArray([...resolvePathByStep(path, ctx, options)], -1)?.identifiers
}

function identifierToUri(
	module: string,
	ctx: McdocBinderContext,
): string | undefined {
	return ctx.symbols.global.mcdoc?.[module]?.definition?.[0]?.uri
}

function uriToIdentifier(uri: string, ctx: CheckerContext): string | undefined {
	return Object.values(ctx.symbols.global.mcdoc ?? {}).find((symbol) => {
		return (
			symbol.subcategory === 'module' &&
			symbol.definition?.some((loc) => loc.uri === uri)
		)
	})?.identifier
}

function pathArrayToString(path: readonly string[]): string
function pathArrayToString(
	path: readonly string[] | undefined,
): string | undefined
function pathArrayToString(
	path: readonly string[] | undefined,
): string | undefined {
	return path ? `::${path.join('::')}` : undefined
}

function convertType(node: TypeNode, ctx: McdocBinderContext): McdocType {
	switch (node.type) {
		case 'mcdoc:enum':
			return convertEnum(node, ctx)
		case 'mcdoc:struct':
			return convertStruct(node, ctx)
		case 'mcdoc:type/any':
			return convertAny(node, ctx)
		case 'mcdoc:type/boolean':
			return convertBoolean(node, ctx)
		case 'mcdoc:type/dispatcher':
			return convertDispatcher(node, ctx)
		case 'mcdoc:type/list':
			return convertList(node, ctx)
		case 'mcdoc:type/literal':
			return convertLiteral(node, ctx)
		case 'mcdoc:type/numeric_type':
			return convertNumericType(node, ctx)
		case 'mcdoc:type/primitive_array':
			return convertPrimitiveArray(node, ctx)
		case 'mcdoc:type/string':
			return convertString(node, ctx)
		case 'mcdoc:type/reference':
			return convertReference(node, ctx)
		case 'mcdoc:type/tuple':
			return convertTuple(node, ctx)
		case 'mcdoc:type/union':
			return convertUnion(node, ctx)
		default:
			return Dev.assertNever(node)
	}
}

function wrapType(
	node: TypeBaseNode<any>,
	type: McdocType,
	ctx: McdocBinderContext,
	options: { skipFirstIndexBody?: boolean } = {},
): McdocType {
	const { attributes, appendixes } = TypeBaseNode.destruct(node)
	let ans = type
	for (const appendix of appendixes) {
		if (IndexBodyNode.is(appendix)) {
			if (options.skipFirstIndexBody) {
				options.skipFirstIndexBody = false
				continue
			}

			ans = {
				kind: 'indexed',
				child: ans,
				parallelIndices: convertIndexBody(appendix, ctx),
			}
		} else {
			ans = {
				kind: 'concrete',
				child: ans,
				typeArgs: convertTypeArgBlock(appendix, ctx),
			}
		}
	}
	ans = attributeType(ans, attributes, ctx)
	return ans
}

function attributeType(
	type: McdocType,
	attributes: AttributeNode[],
	ctx: McdocBinderContext,
): McdocType {
	for (const attribute of attributes) {
		type = {
			kind: 'attributed',
			attribute: convertAttribute(attribute, ctx),
			child: type,
		}
	}
	return type
}

function convertAttributes(
	nodes: AttributeNode[],
	ctx: McdocBinderContext,
): Attribute[] | undefined {
	return undefineEmptyArray(nodes.map((n) => convertAttribute(n, ctx)))
}

function undefineEmptyArray<T>(array: T[]): T[] | undefined {
	return array.length ? array : undefined
}

function convertAttribute(
	node: AttributeNode,
	ctx: McdocBinderContext,
): Attribute {
	const { name, value } = AttributeNode.destruct(node)
	return {
		name: name.value,
		value: value && convertAttributeValue(value, ctx),
	}
}

function convertAttributeValue(
	node: AttributeValueNode,
	ctx: McdocBinderContext,
): AttributeValue {
	if (node.type === 'mcdoc:attribute/tree') {
		return {
			kind: 'tree',
			values: convertAttributeTree(node, ctx),
		}
	} else {
		return convertType(node, ctx)
	}
}

function convertAttributeTree(
	node: AttributeTreeNode,
	ctx: McdocBinderContext,
): AttributeTree {
	const ans: AttributeTree = {}
	const { named, positional } = AttributeTreeNode.destruct(node)

	if (positional) {
		const { values } = AttributeTreePosValuesNode.destruct(positional)
		for (const [i, child] of values.entries()) {
			ans[i] = convertAttributeValue(child, ctx)
		}
	}

	if (named) {
		const { values } = AttributeTreeNamedValuesNode.destruct(named)
		for (const { key, value } of values) {
			ans[key.value] = convertAttributeValue(value, ctx)
		}
	}

	return ans
}

function convertIndexBodies(
	nodes: IndexBodyNode[],
	ctx: McdocBinderContext,
): ParallelIndices[] | undefined {
	return undefineEmptyArray(nodes.map((n) => convertIndexBody(n, ctx)))
}

function convertIndexBody(
	node: IndexBodyNode,
	ctx: McdocBinderContext,
): ParallelIndices {
	const { parallelIndices } = IndexBodyNode.destruct(node)
	return parallelIndices.map((n) => convertIndex(n, ctx))
}

function convertIndex(node: IndexNode, ctx: McdocBinderContext): Index {
	return StaticIndexNode.is(node)
		? convertStaticIndex(node, ctx)
		: convertDynamicIndex(node, ctx)
}

function convertStaticIndex(
	node: StaticIndexNode,
	ctx: McdocBinderContext,
): StaticIndex {
	return {
		kind: 'static',
		value: asString(node),
	}
}

function convertDynamicIndex(
	node: DynamicIndexNode,
	ctx: McdocBinderContext,
): DynamicIndex {
	const { keys } = DynamicIndexNode.destruct(node)
	return {
		kind: 'dynamic',
		accessor: keys.map(asString),
	}
}

function convertTypeArgBlock(
	node: TypeArgBlockNode,
	ctx: McdocBinderContext,
): McdocType[] {
	const { args } = TypeArgBlockNode.destruct(node)
	return args.map((a) => convertType(a, ctx))
}

function convertEnum(node: EnumNode, ctx: McdocBinderContext): McdocType {
	const { block, enumKind, identifier } = EnumNode.destruct(node)

	// Shortcut if the typeDef has been added to the enum symbol.
	const symbol = identifier?.symbol ?? node.symbol
	if (
		symbol &&
		TypeDefSymbolData.is(symbol.data) &&
		symbol.data.typeDef.kind === 'enum'
	) {
		return symbol.data.typeDef
	}

	return wrapType(
		node,
		{
			kind: 'enum',
			enumKind,
			values: convertEnumBlock(block, ctx),
		},
		ctx,
	)
}

function convertEnumBlock(
	node: EnumBlockNode,
	ctx: McdocBinderContext,
): EnumTypeField[] {
	const { fields } = EnumBlockNode.destruct(node)
	return fields.map((n) => convertEnumField(n, ctx))
}

function convertEnumField(
	node: EnumFieldNode,
	ctx: McdocBinderContext,
): EnumTypeField {
	const { attributes, identifier, value } = EnumFieldNode.destruct(node)
	return {
		attributes: convertAttributes(attributes, ctx),
		identifier: identifier.value,
		value: convertEnumValue(value, ctx),
	}
}

function convertEnumValue(
	node: EnumValueNode,
	ctx: McdocBinderContext,
): string | number | bigint {
	if (TypedNumberNode.is(node)) {
		const { value } = TypedNumberNode.destruct(node)
		return value.value
	}
	return node.value
}

function convertStruct(node: StructNode, ctx: McdocBinderContext): McdocType {
	const { block, identifier } = StructNode.destruct(node)

	// Shortcut if the typeDef has been added to the struct symbol.
	const symbol = identifier?.symbol ?? node.symbol
	if (
		symbol &&
		TypeDefSymbolData.is(symbol.data) &&
		symbol.data.typeDef.kind === 'struct'
	) {
		return symbol.data.typeDef
	}

	return wrapType(
		node,
		{
			kind: 'struct',
			fields: convertStructBlock(block, ctx),
		},
		ctx,
	)
}

function convertStructBlock(
	node: StructBlockNode,
	ctx: McdocBinderContext,
): StructTypeField[] {
	const { fields } = StructBlockNode.destruct(node)
	return fields.map((n) => convertStructField(n, ctx))
}

function convertStructField(
	node: StructFieldNode,
	ctx: McdocBinderContext,
): StructTypeField {
	return StructPairFieldNode.is(node)
		? convertStructPairField(node, ctx)
		: convertStructSpreadField(node, ctx)
}

function convertStructPairField(
	node: StructPairFieldNode,
	ctx: McdocBinderContext,
): StructTypePairField {
	const { attributes, key, type, isOptional } = StructPairFieldNode.destruct(
		node,
	)
	return {
		kind: 'pair',
		attributes: convertAttributes(attributes, ctx),
		key: convertStructKey(key, ctx),
		type: convertType(type, ctx),
		optional: isOptional,
	}
}

function convertStructKey(
	node: StructKeyNode,
	ctx: McdocBinderContext,
): string | McdocType {
	if (StructMapKeyNode.is(node)) {
		const { type } = StructMapKeyNode.destruct(node)
		return convertType(type, ctx)
	} else {
		return asString(node)
	}
}

function convertStructSpreadField(
	node: StructSpreadFieldNode,
	ctx: McdocBinderContext,
): StructTypeSpreadField {
	const { attributes, type } = StructSpreadFieldNode.destruct(node)
	return {
		kind: 'spread',
		attributes: convertAttributes(attributes, ctx),
		type: convertType(type, ctx),
	}
}

function convertAny(node: AnyTypeNode, ctx: McdocBinderContext): McdocType {
	return wrapType(
		node,
		{
			kind: 'any',
		},
		ctx,
	)
}

function convertBoolean(
	node: BooleanTypeNode,
	ctx: McdocBinderContext,
): McdocType {
	return wrapType(
		node,
		{
			kind: 'boolean',
		},
		ctx,
	)
}

function convertDispatcher(
	node: DispatcherTypeNode,
	ctx: McdocBinderContext,
): McdocType {
	const { index, location } = DispatcherTypeNode.destruct(node)
	return wrapType(
		node,
		{
			kind: 'dispatcher',
			parallelIndices: convertIndexBody(index, ctx),
			registry: ResourceLocationNode.toString(location, 'full'),
		},
		ctx,
		{ skipFirstIndexBody: true },
	)
}

function convertList(node: ListTypeNode, ctx: McdocBinderContext): McdocType {
	const { item, lengthRange } = ListTypeNode.destruct(node)
	return wrapType(
		node,
		{
			kind: 'list',
			item: convertType(item, ctx),
			lengthRange: convertRange(lengthRange, ctx),
		},
		ctx,
	)
}

function convertRange(
	node: FloatRangeNode | IntRangeNode,
	ctx: McdocBinderContext,
): NumericRange
function convertRange(
	node: FloatRangeNode | IntRangeNode | undefined,
	ctx: McdocBinderContext,
): NumericRange | undefined
function convertRange(
	node: FloatRangeNode | IntRangeNode | undefined,
	ctx: McdocBinderContext,
): NumericRange | undefined {
	if (!node) {
		return undefined
	}

	const { kind, min, max } = FloatRangeNode.is(node)
		? FloatRangeNode.destruct(node)
		: IntRangeNode.destruct(node)
	return { kind, min: min?.value, max: max?.value }
}

function convertLiteral(
	node: LiteralTypeNode,
	ctx: McdocBinderContext,
): McdocType {
	const { value } = LiteralTypeNode.destruct(node)
	return wrapType(
		node,
		{
			kind: 'literal',
			value: convertLiteralValue(value, ctx),
		},
		ctx,
	)
}

function convertLiteralValue(
	node: LiteralTypeValueNode,
	ctx: McdocBinderContext,
): LiteralValue {
	if (LiteralNode.is(node)) {
		return {
			kind: 'boolean',
			value: node.value === 'true',
		}
	} else if (TypedNumberNode.is(node)) {
		const { suffix, value } = TypedNumberNode.destruct(node)
		return {
			kind: convertLiteralNumberSuffix(suffix, ctx) ??
				(Number.isInteger(value.value) ? 'int' : 'double'),
			value: value.value,
		}
	} else {
		return {
			kind: 'string',
			value: node.value,
		}
	}
}

function convertLiteralNumberSuffix(
	node: LiteralNode | undefined,
	ctx: McdocBinderContext,
): NumericTypeKind | undefined {
	const suffix = node?.value as LiteralNumberCaseInsensitiveSuffix | undefined
	switch (suffix?.toLowerCase()) {
		case 'b':
			return 'byte'
		case 's':
			return 'short'
		case 'l':
			return 'long'
		case 'f':
			return 'float'
		case 'd':
			return 'double'
		default:
			return undefined
	}
}

function convertNumericType(
	node: NumericTypeNode,
	ctx: McdocBinderContext,
): McdocType {
	const { numericKind, valueRange } = NumericTypeNode.destruct(node)
	return wrapType(
		node,
		{
			kind: numericKind.value as NumericTypeKind,
			valueRange: convertRange(valueRange, ctx),
		},
		ctx,
	)
}

function convertPrimitiveArray(
	node: PrimitiveArrayTypeNode,
	ctx: McdocBinderContext,
): McdocType {
	const { arrayKind, lengthRange, valueRange } = PrimitiveArrayTypeNode
		.destruct(node)
	return wrapType(
		node,
		{
			kind: `${arrayKind.value as PrimitiveArrayValueKind}_array`,
			lengthRange: convertRange(lengthRange, ctx),
			valueRange: convertRange(valueRange, ctx),
		},
		ctx,
	)
}

function convertString(
	node: StringTypeNode,
	ctx: McdocBinderContext,
): McdocType {
	const { lengthRange } = StringTypeNode.destruct(node)
	return wrapType(
		node,
		{
			kind: 'string',
			lengthRange: convertRange(lengthRange, ctx),
		},
		ctx,
	)
}

function convertReference(
	node: ReferenceTypeNode,
	ctx: McdocBinderContext,
): McdocType {
	const { path } = ReferenceTypeNode.destruct(node)
	return wrapType(
		node,
		{
			kind: 'reference',
			path: pathArrayToString(resolvePath(path, ctx)),
		},
		ctx,
	)
}

function convertTuple(node: TupleTypeNode, ctx: McdocBinderContext): McdocType {
	const { items } = TupleTypeNode.destruct(node)
	return wrapType(
		node,
		{
			kind: 'tuple',
			items: items.map((n) => convertType(n, ctx)),
		},
		ctx,
	)
}

function convertUnion(node: UnionTypeNode, ctx: McdocBinderContext): McdocType {
	const { members } = UnionTypeNode.destruct(node)
	return wrapType(
		node,
		{
			kind: 'union',
			members: members.map((n) => convertType(n, ctx)),
		},
		ctx,
	)
}

function asString(
	node: IdentifierNode | LiteralNode | StringNode | ResourceLocationNode,
): string {
	if (ResourceLocationNode.is(node)) {
		return ResourceLocationNode.toString(node, 'short')
	}
	return node.value
}
