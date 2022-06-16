import type { AstNode, BinderContext, CheckerContext, Location, MetaRegistry, RangeLike, StringNode, Symbol } from '@spyglassmc/core'
import { AsyncBinder, Dev, ErrorSeverity, Range, ResourceLocationNode, SymbolUtil, SymbolVisibility } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { AdditionalContext } from '../common.js'
import type { AnyTypeNode, AttributeValueNode, BooleanTypeNode, EnumValueNode, IdentifierNode, IndexNode, InjectionNode, LiteralTypeValueNode, ModuleNode, StructFieldNode, StructKeyNode, TypeNode } from '../node/index.js'
import { AttributeNode, AttributeTreeNamedValuesNode, AttributeTreeNode, AttributeTreePosValuesNode, DispatcherTypeNode, DispatchStatementNode, DocCommentsNode, DynamicIndexNode, EnumBlockNode, EnumFieldNode, EnumNode, FloatRangeNode, IndexBodyNode, IntRangeNode, ListTypeNode, LiteralNode, LiteralTypeNode, NumericTypeNode, PathNode, PrimitiveArrayTypeNode, ReferenceTypeNode, StaticIndexNode, StringTypeNode, StructBlockNode, StructMapKeyNode, StructNode, StructPairFieldNode, StructSpreadFieldNode, TupleTypeNode, TypeAliasNode, TypeBaseNode, TypedNumberNode, UnionTypeNode, UseStatementNode } from '../node/index.js'
import type { Attribute, AttributeTree, AttributeValue, DispatcherType, DynamicIndex, EnumType, EnumTypeField, Index, KeywordType, ListType, LiteralNumberCaseInsensitiveSuffix, LiteralNumberSuffix, LiteralType, LiteralValue, McdocType, NumericRange, NumericType, NumericTypeKind, ParallelIndices, PrimitiveArrayType, PrimitiveArrayValueKind, ReferenceType, StaticIndex, StringType, StructType, StructTypeField, StructTypePairField, StructTypeSpreadField, TupleType, TypeBase, UnionType } from '../type/index.js'

interface McdocBinderContext extends BinderContext, AdditionalContext { }

export const fileModule = AsyncBinder.create<ModuleNode>(async (node, ctx) => {
	const moduleIdentifier = uriToIdentifier(ctx.doc.uri, ctx)
	if (!moduleIdentifier) {
		ctx.err.report(
			localize('mcdoc.binder.out-of-root', localeQuote(ctx.doc.uri)),
			Range.Beginning, ErrorSeverity.Hint
		)
		return
	}

	const mcdocCtx: McdocBinderContext = {
		...ctx,
		moduleIdentifier,
	}
	return module_(node, mcdocCtx)
})

export async function module_(node: ModuleNode, ctx: McdocBinderContext): Promise<void> {
	hoist(node, ctx)

	for (const child of node.children) {
		switch (child.type) {
			case 'mcdoc:dispatch_statement': await bindDispatchStatement(child, ctx); break
			case 'mcdoc:enum': bindEnum(child, ctx); break
			case 'mcdoc:injection': await bindInjection(child, ctx); break
			case 'mcdoc:struct': await bindStruct(child, ctx); break
			case 'mcdoc:type_alias': await bindTypeAlias(child, ctx); break
			case 'mcdoc:use_statement': await bindUseStatement(child, ctx); break
		}
	}
}

/**
 * Hoist enums, structs, type aliases, and use statements under the module scope.
 */
function hoist(node: ModuleNode, ctx: McdocBinderContext): void {
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

async function bindDispatchStatement(node: DispatchStatementNode, ctx: McdocBinderContext): Promise<void> {
	const { attributes, dispatcher, index, target } = DispatchStatementNode.destruct(node)
	if (!(dispatcher && index && target)) {
		return
	}

	const dispatcherId = ResourceLocationNode.toString(dispatcher, 'full')
}

function bindEnum(node: EnumNode, ctx: McdocBinderContext): void {
}

async function bindInjection(node: InjectionNode, ctx: McdocBinderContext): Promise<void> {
}

async function bindStruct(node: StructNode, ctx: McdocBinderContext): Promise<void> {
}

async function bindTypeAlias(node: TypeAliasNode, ctx: McdocBinderContext): Promise<void> {
}

async function bindUseStatement(node: UseStatementNode, ctx: McdocBinderContext): Promise<void> {
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

function resolvePath(ctx: McdocBinderContext, path: PathNode, options: { reportErrors?: boolean } = {}): string[] | undefined {
	const { children, isAbsolute } = PathNode.destruct(path)
	const identifiers: string[] = isAbsolute
		? []
		: ctx.moduleIdentifier.slice(2).split('::')
	for (const child of children) {
		switch (child.type) {
			case 'mcdoc:identifier':
				identifiers.push(child.value)
				break
			case 'mcdoc:literal':
				// super
				if (identifiers.length === 0) {
					if (options.reportErrors) {
						ctx.err.report(localize('mcdoc.binder.path.super-from-root'), child)
					}
					return undefined
				}
				identifiers.pop()
				break
			default:
				Dev.assertNever(child)
		}
	}
	return identifiers
}

async function ensurePathBound(ctx: McdocBinderContext, path: PathNode): Promise<string | undefined> {
	const identifiers = resolvePath(ctx, path, { reportErrors: true })
	if (!identifiers) {
		return undefined
	}

	const referencedModuleFile = `::${identifiers.slice(0, -1).join('::')}`
	const referencedModuleUri = identifierToUri(referencedModuleFile, ctx)
	const referencedPath = `::${identifiers.join('::')}`
	if (!referencedModuleUri) {
		ctx.err.report(localize('mcdoc.binder.path.unknown-module'), path)
		return undefined
	}

	await ctx.ensureBound(referencedModuleUri)

	if (!ctx.symbols.global.mcdoc?.[referencedPath]?.definition?.length) {
		return undefined
	}

	return referencedPath
}

function identifierToUri(module: string, ctx: McdocBinderContext): string | undefined {
	return ctx.symbols.global.mcdoc?.[module]?.definition?.[0]?.uri
}

function uriToIdentifier(uri: string, ctx: CheckerContext): string | undefined {
	return Object
		.values(ctx.symbols.global.mcdoc ?? {})
		.find(symbol => {
			return symbol.subcategory === 'module' && symbol.definition?.some(loc => loc.uri === uri)
		})
		?.identifier
}

function pathArrayToString(path: string[]): string
function pathArrayToString(path: string[] | undefined): string | undefined
function pathArrayToString(path: string[] | undefined): string | undefined {
	return path ? `::${path.join('::')}` : undefined
}

function nodeToType(node: TypeNode, ctx: McdocBinderContext): McdocType {
	switch (node.type) {
		case 'mcdoc:enum': return convertEnum(node)
		case 'mcdoc:struct': return convertStruct(node)
		case 'mcdoc:type/any': return convertAny(node)
		case 'mcdoc:type/boolean': return convertBoolean(node)
		case 'mcdoc:type/dispatcher': return convertDispatcher(node)
		case 'mcdoc:type/list': return convertList(node)
		case 'mcdoc:type/literal': return convertLiteral(node)
		case 'mcdoc:type/numeric_type': return convertNumericType(node)
		case 'mcdoc:type/primitive_array': return convertPrimitiveArray(node)
		case 'mcdoc:type/string': return convertString(node)
		case 'mcdoc:type/reference': return convertReference(node)
		case 'mcdoc:type/tuple': return convertTuple(node)
		case 'mcdoc:type/union': return convertUnion(node)
		default: return Dev.assertNever(node)
	}

	function convertType(node: TypeNode): McdocType {
		return nodeToType(node, ctx)
	}

	function convertBase(node: TypeBaseNode<any>, options: { skipFirstIndexBody?: boolean } = {}): Omit<TypeBase, 'kind'> {
		const { attributes, indices } = TypeBaseNode.destruct(node)
		return {
			attributes: convertAttributes(attributes),
			indices: convertIndexBodies(options.skipFirstIndexBody ? indices.slice(1) : indices),
		}
	}

	function convertAttributes(nodes: AttributeNode[]): Attribute[] | undefined {
		return undefineEmptyArray(nodes.map(convertAttribute))
	}

	function undefineEmptyArray<T>(array: T[]): T[] | undefined {
		return array.length ? array : undefined
	}

	function convertAttribute(node: AttributeNode): Attribute {
		const { name, value } = AttributeNode.destruct(node)
		return {
			name: name.value,
			value: convertAttributeValue(value),
		}
	}

	function convertAttributeValue(node: AttributeValueNode): AttributeValue {
		if (node.type === 'mcdoc:attribute/tree') {
			return convertAttributeTree(node)
		} else {
			return convertType(node)
		}
	}

	function convertAttributeTree(node: AttributeTreeNode): AttributeTree {
		const ans: AttributeTree = {}
		const { named, positional } = AttributeTreeNode.destruct(node)

		if (positional) {
			const { values } = AttributeTreePosValuesNode.destruct(positional)
			for (const [i, child] of values.entries()) {
				ans[i] = convertAttributeValue(child)
			}
		}

		if (named) {
			const { values } = AttributeTreeNamedValuesNode.destruct(named)
			for (const { key, value } of values) {
				ans[key.value] = convertAttributeValue(value)
			}
		}

		return ans
	}

	function convertIndexBodies(nodes: IndexBodyNode[]): ParallelIndices[] | undefined {
		return undefineEmptyArray(nodes.map(convertIndexBody))
	}

	function convertIndexBody(node: IndexBodyNode): ParallelIndices {
		const { parallelIndices } = IndexBodyNode.destruct(node)
		return parallelIndices.map(convertIndex)
	}

	function convertIndex(node: IndexNode): Index {
		return StaticIndexNode.is(node)
			? convertStaticIndex(node)
			: convertDynamicIndex(node)
	}

	function convertStaticIndex(node: StaticIndexNode): StaticIndex {
		return {
			kind: 'static',
			value: asString(node),
		}
	}

	function convertDynamicIndex(node: DynamicIndexNode): DynamicIndex {
		const { keys } = DynamicIndexNode.destruct(node)
		return {
			kind: 'dynamic',
			accessor: keys.map(asString),
		}
	}

	function convertEnum(node: EnumNode): EnumType {
		const { block, enumKind } = EnumNode.destruct(node)
		return {
			...convertBase(node),
			kind: 'enum',
			enumKind,
			values: convertEnumBlock(block),
		}
	}

	function convertEnumBlock(node: EnumBlockNode): EnumTypeField[] {
		const { fields } = EnumBlockNode.destruct(node)
		return fields.map(convertEnumField)
	}

	function convertEnumField(node: EnumFieldNode): EnumTypeField {
		const { attributes, identifier, value } = EnumFieldNode.destruct(node)
		return {
			attributes: convertAttributes(attributes),
			identifier: identifier.value,
			value: convertEnumValue(value),
		}
	}

	function convertEnumValue(node: EnumValueNode): string | number | bigint {
		if (TypedNumberNode.is(node)) {
			const { value } = TypedNumberNode.destruct(node)
			return value.value
		}
		return node.value
	}

	function convertStruct(node: StructNode): StructType {
		const { block } = StructNode.destruct(node)
		return {
			...convertBase(node),
			kind: 'struct',
			fields: convertStructBlock(block),
		}
	}

	function convertStructBlock(node: StructBlockNode): StructTypeField[] {
		const { fields } = StructBlockNode.destruct(node)
		return fields.map(convertStructField)
	}

	function convertStructField(node: StructFieldNode): StructTypeField {
		return StructPairFieldNode.is(node)
			? convertStructPairField(node)
			: convertStructSpreadField(node)
	}

	function convertStructPairField(node: StructPairFieldNode): StructTypePairField {
		const { key, type } = StructPairFieldNode.destruct(node)
		return {
			kind: 'pair',
			key: convertStructKey(key),
			type: convertType(type),
		}
	}

	function convertStructKey(node: StructKeyNode): string | McdocType {
		if (StructMapKeyNode.is(node)) {
			const { type } = StructMapKeyNode.destruct(node)
			return convertType(type)
		} else {
			return asString(node)
		}
	}

	function convertStructSpreadField(node: StructSpreadFieldNode): StructTypeSpreadField {
		const { attributes, type } = StructSpreadFieldNode.destruct(node)
		return {
			kind: 'spread',
			attributes: convertAttributes(attributes),
			type: convertType(type),
		}
	}

	function convertAny(_node: AnyTypeNode): KeywordType {
		return {
			...convertBase(node),
			kind: 'any',
		}
	}

	function convertBoolean(_node: BooleanTypeNode): KeywordType {
		return {
			...convertBase(node),
			kind: 'boolean',
		}
	}

	function convertDispatcher(node: DispatcherTypeNode): DispatcherType {
		const { index, location } = DispatcherTypeNode.destruct(node)
		return {
			...convertBase(node, {
				skipFirstIndexBody: true,
			}),
			kind: 'dispatcher',
			index: convertIndexBody(index),
			registry: ResourceLocationNode.toString(location, 'full'),
		}
	}

	function convertList(node: ListTypeNode): ListType {
		const { item, lengthRange } = ListTypeNode.destruct(node)
		return {
			...convertBase(node),
			kind: 'list',
			item: convertType(item),
			lengthRange: convertRange(lengthRange),
		}
	}

	function convertRange(node: FloatRangeNode | IntRangeNode): NumericRange
	function convertRange(node: FloatRangeNode | IntRangeNode | undefined): NumericRange | undefined
	function convertRange(node: FloatRangeNode | IntRangeNode | undefined): NumericRange | undefined {
		if (!node) {
			return undefined
		}

		const { min, max } = FloatRangeNode.is(node) ? FloatRangeNode.destruct(node) : IntRangeNode.destruct(node)
		return [min?.value, max?.value]
	}

	function convertLiteral(node: LiteralTypeNode): LiteralType {
		const { value } = LiteralTypeNode.destruct(node)
		return {
			...convertBase(node),
			kind: 'literal',
			value: convertLiteralValue(value),
		}
	}

	function convertLiteralValue(node: LiteralTypeValueNode): LiteralValue {
		if (LiteralNode.is(node)) {
			return {
				kind: 'boolean',
				value: node.value === 'true',
			}
		} else if (TypedNumberNode.is(node)) {
			const { suffix, value } = TypedNumberNode.destruct(node)
			return {
				kind: 'number',
				value: value.value,
				suffix: convertLiteralNumberSuffix(suffix),
			}
		} else {
			return {
				kind: 'string',
				value: node.value,
			}
		}
	}

	function convertLiteralNumberSuffix(node: LiteralNode | undefined): LiteralNumberSuffix | undefined {
		const suffix = node?.value as LiteralNumberCaseInsensitiveSuffix | undefined
		return suffix?.toLowerCase() as Lowercase<Exclude<typeof suffix, undefined>> | undefined
	}

	function convertNumericType(node: NumericTypeNode): NumericType {
		const { numericKind, valueRange } = NumericTypeNode.destruct(node)
		return {
			...convertBase(node),
			kind: numericKind.value as NumericTypeKind,
			valueRange: convertRange(valueRange),
		}
	}

	function convertPrimitiveArray(node: PrimitiveArrayTypeNode): PrimitiveArrayType {
		const { arrayKind, lengthRange, valueRange } = PrimitiveArrayTypeNode.destruct(node)
		return {
			...convertBase(node),
			kind: `${arrayKind.value as PrimitiveArrayValueKind}_array`,
			lengthRange: convertRange(lengthRange),
			valueRange: convertRange(valueRange),
		}
	}

	function convertString(node: StringTypeNode): StringType {
		const { lengthRange } = StringTypeNode.destruct(node)
		return {
			...convertBase(node),
			kind: 'string',
			lengthRange: convertRange(lengthRange),
		}
	}

	function convertReference(node: ReferenceTypeNode): ReferenceType {
		const { path, typeParameters } = ReferenceTypeNode.destruct(node)
		return {
			...convertBase(node),
			kind: 'reference',
			path: pathArrayToString(resolvePath(ctx, path)),
			typeParameters: undefineEmptyArray(typeParameters.map(convertType)),
		}
	}

	function convertTuple(node: TupleTypeNode): TupleType {
		const { items } = TupleTypeNode.destruct(node)
		return {
			...convertBase(node),
			kind: 'tuple',
			items: items.map(convertType),
		}
	}

	function convertUnion(node: UnionTypeNode): UnionType {
		const { members } = UnionTypeNode.destruct(node)
		return {
			...convertBase(node),
			kind: 'union',
			members: members.map(convertType),
		}
	}


	function asString(node: IdentifierNode | LiteralNode | StringNode | ResourceLocationNode): string {
		if (ResourceLocationNode.is(node)) {
			return ResourceLocationNode.toString(node, 'short')
		}
		return node.value
	}
}
