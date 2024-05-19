import type { AstNode, CheckerContext, Range } from "@spyglassmc/core"
import type { Attribute, StructTypePairField , LiteralType, McdocType, StructTypeField } from "../type/index.js";
import { NumericRange } from "../type/index.js"
import { TypeDefSymbolData } from "../binder/index.js"
import { arrayToMessage, localize } from "@spyglassmc/locales";

export type McdocTypeInferrer<T extends AstNode> = (node: T) => McdocType

export type NodeEquivalenceChecker = (inferredNode: McdocType, definition: McdocType) => boolean

export type TypeInfoAttacher<T extends AstNode> = (node: T, definition: McdocType) => void

export type ChildrenGetter<T extends AstNode> = (node: T) => T[]

export interface ValidatorOptions<T extends AstNode> {
	context: CheckerContext;
	inferType: McdocTypeInferrer<T>;
	isEquivalent: NodeEquivalenceChecker;
	getChildren: ChildrenGetter<T>;
	attachTypeInfo: TypeInfoAttacher<T>;
}

export type ValidationError<T extends AstNode> =
	  SimpleError<T>
	| RangeError<T>
	| TypeMismatchError<T>
	| ValueMismatchError<T>
	| UnknownKeyError<T>
	| UnknownTypedefError<T>
export interface ErrorBase<T extends AstNode> {
	kind: string;
	node: T
}
export interface SimpleError<T extends AstNode> extends ErrorBase<T> {
	kind: 'expected_key_value_pair' | 'expected_noting';
}
export interface RangeError<T extends AstNode> extends ErrorBase<T> {
	kind: 'invalid_collection_length' | 'number_out_of_range';
	range: NumericRange;
}
export interface UnknownKeyError<T extends AstNode> extends ErrorBase<T> {
	kind: 'unknown_key';
	key?: string;
}
export interface TypeMismatchError<T extends AstNode> extends ErrorBase<T> {
	kind: 'type_mismatch';
	received: McdocType;
	expected: McdocType[];
}
export interface ValueMismatchError<T extends AstNode> extends ErrorBase<T> {
	kind: 'value_mismatch';
	expected: (string | boolean | number | bigint)[];
}
export interface UnknownTypedefError<T extends AstNode> extends ErrorBase<T> {
	kind: 'unknown_typedef';
	defName: string;
}
  
const attributeHandlers: {
	[key: string]: (<N extends AstNode>(
		node: N,
		attribute: Attribute,
		inferred: McdocType,
		expected: McdocType,
		options: ValidatorOptions<N>,
	) => ValidationError<N>[])
	| undefined
 } = {
	// TODO other attributes
	id: (_n, attribute, inferred, _e, options) => {
		if (inferred.kind === 'literal' && inferred.value.kind ==='string') {
			// TODO check registry
			if (!inferred.value.value.includes(':')) {
				inferred.value.value = 'minecraft:' + inferred.value.value;
			}
		}
		return [];
	}
};

export function reference<T extends AstNode>(node: T, path: string, options: ValidatorOptions<T>) {
	const errors = internalReference(node, path, options, []);
	reportErrors(errors, options);
}
function internalReference<T extends AstNode>(node: T, path: string, options: ValidatorOptions<T>, parents: T[]): ValidationError<T>[] {
	const symbol = options.context.symbols.query(options.context.doc, 'mcdoc', path);
	const typeDef = symbol.getData(TypeDefSymbolData.is)?.typeDef;

	let errors: ValidationError<T>[];
	if (!typeDef) {
		errors = [{ kind: 'unknown_typedef', node: node, defName: path }];

		return errors;
	}

	const inferredType = options.inferType(node);
	errors = internalTypeDefinition(node, typeDef, inferredType, options, parents);
	return errors;
}

export function typeDefinition<T extends AstNode>(node: T, typeDef: McdocType, options: ValidatorOptions<T>) {
	const inferredType = options.inferType(node);
	const errors = internalTypeDefinition(node, typeDef, inferredType, options, []);

	reportErrors(errors, options);
}
function internalTypeDefinition<T extends AstNode>(node: T, typeDef: McdocType, inferredType: McdocType, options: ValidatorOptions<T>, parents: T[]): ValidationError<T>[] {
	const errors: ValidationError<T>[] = [];

	if (inferredType.kind === 'any' || inferredType.kind === 'unsafe') {
		options.attachTypeInfo(node, typeDef);
		return [];
	}

	typeDef = simplify(node, typeDef, inferredType, options, parents);

	const inferredValueType = getValueType(inferredType);
	const expectedValueType = getValueType(typeDef);

	if (inferredValueType.kind !== expectedValueType.kind && !options.isEquivalent(inferredValueType, expectedValueType)) {
		return [{
			kind: "type_mismatch",
			node: node,
			received: inferredType,
			expected: [typeDef]
		}];
	}
	
	options.attachTypeInfo(node, typeDef);

	switch (typeDef.kind) {
		case 'any':
		case 'unsafe':
			options.attachTypeInfo(node, typeDef);
			return [];
		case 'attributed':
			const attribute = attributeHandlers[typeDef.attribute.name];
			let attributeErrors: ValidationError<T>[] = []
			if (attribute) {
				attributeErrors = attribute(node, typeDef.attribute, inferredType, typeDef, options);
			}
			// TODO pass attribute to given node? The node needs to be aware of some attributes for colorizers and completers.
			attributeErrors.push(...internalTypeDefinition(node, typeDef.child, inferredType, options, parents));
			return attributeErrors;
		case 'union':
			if (typeDef.members.length === 0) {
				return [{
					kind: 'expected_noting',
					node: node,
				}];
			}

			let parsingResults: { typeDef: McdocType, errors: ValidationError<T>[] }[] = [];
			for (const def of typeDef.members) {
				// TODO mock attachTypeInfo method
				const innerErrors = internalTypeDefinition(node, def, inferredType, options, parents);
				if (innerErrors.length === 0) {
					return [];
				}
				parsingResults.push({ typeDef: def, errors: innerErrors });
			}
			if (!parsingResults.some(r => r.errors.some(e => e.kind !== 'type_mismatch' || e.node !== node))) {
				return [{
					kind: 'type_mismatch',
					node: node,
					expected: typeDef.members,
					received: inferredType
				}];
			}
			if (!parsingResults.some(r => r.errors.some(e => e.kind !== 'value_mismatch' || e.node !== node))) {
				return [{
					kind: 'value_mismatch',
					node: node,
					expected: parsingResults.flatMap(p => p.errors).filter(e => e.kind === 'value_mismatch').flatMap(e => (e as ValueMismatchError<T>).expected),
				}];
			}
			parsingResults = parsingResults.filter(r => !r.errors.some(e => e.kind === 'type_mismatch' && e.node === node));
			if (!parsingResults.some(r => r.errors.some(e => e.kind === 'unknown_key'))) {
				parsingResults = parsingResults.filter(r => !r.errors.some(e => e.kind === 'unknown_key'));
			}
			return parsingResults.sort((a, b) => a.errors.length - b.errors.length)[0].errors;
		case 'struct': {
			const children = options.getChildren(node);
			const matchedToNonLiteral = [];

			// TODO
			for (const pair of typeDef.fields.reverse()) {
				if (pair.kind === 'pair') {
					
				}
			}
			break;
		}
		case 'list':
		case 'byte_array':
		case 'int_array':
		case 'long_array': {
			let itemType: McdocType;
			switch (typeDef.kind) {
				case 'list':
					itemType = typeDef.item;
					break;
				case 'byte_array':
					itemType = { kind: 'byte', valueRange: typeDef.valueRange };
					break;
				case 'int_array':
					itemType = { kind: 'int', valueRange: typeDef.valueRange };
					break;
				case 'long_array': 
					itemType = { kind: 'long', valueRange: typeDef.valueRange };
					break;
			}
			const children = options.getChildren(node);
			for (const child of children) {
				const inferredChild = options.inferType(child);
				errors.push(...internalTypeDefinition(child, itemType, inferredChild, options, [ ...parents, node ]));
			}
			if (typeDef.lengthRange && !NumericRange.isInRange(typeDef.lengthRange, children.length)) {
				errors.push({
					kind: 'invalid_collection_length',
					node: node,
					range: typeDef.lengthRange,
				})
			}
			break;
		}
		case 'tuple': {
			const children = options.getChildren(node);
			if (typeDef.items.length === children.length) {
				for (let i = 0; i < typeDef.items.length; i++) {
					const def = typeDef.items[i];
					const child = children[i];
					const inferredChild = options.inferType(child);
					errors.push(...internalTypeDefinition(child, def, inferredChild, options, [ ...parents, node ]));
				}
			} else {
				errors.push({
					kind: 'invalid_collection_length',
					node: node,
					range: { kind: 0b00, max: typeDef.items.length, min: typeDef.items.length },
				})
			}
			break;
		}
		case 'literal': {
			if (inferredType.kind !== 'literal' || typeDef.value.value !== inferredType.value.value) {
				return [{
					kind: "value_mismatch",
					node: node,
					expected: [typeDef.value.value]
				}];
			}
			break;
		}
		case 'enum': {
			if (inferredType.kind === 'literal' && !typeDef.values.some(v => {
				if (v.attributes) {
					const enumChildType = {
						kind: 'literal',
						value: { kind: typeDef.enumKind ?? 'int', value: v.value}
					} as LiteralType
					const attributeErrors = v.attributes.flatMap(a => {
						const h = attributeHandlers[a.name]
						return h ? h(node, a, inferredType, enumChildType, options) : []
					})
					if (attributeErrors.length > 0) {
						return false;
					}
				}
				return v.value === inferredType.value.value;
			})) {
				return [{
					kind: "value_mismatch",
					node: node,
					expected: typeDef.values.map(v => v.value)
				}];
			}
		}
	}
	return errors;
}

function simplify<T extends AstNode>(node: T, typeDef: McdocType, inferredType: McdocType, options: ValidatorOptions<T>, parents:T[]): McdocType {
	switch (typeDef.kind) {
		case 'reference':
			if (!typeDef.path) {
				// TODO when does this happen?
				options.context.logger.warn(`Tried to access empty reference`);
				return { kind: 'union', members: [] };
			}
			const def = options.context.symbols.query(options.context.doc, 'mcdoc', typeDef.path).getData(TypeDefSymbolData.is)?.typeDef;
			if (!def) {
				options.context.logger.warn(`Tried to access unknown reference ${typeDef.path}`);
				return { kind: 'union', members: [] };
			}

			return simplify(node, def, inferredType, options, parents);
		case 'attributed':
			// TODO Basic attribute checks (mostly until/since).
			return { ...typeDef, child: simplify(node, typeDef.child, inferredType, options, parents) };
		case 'dispatcher':
			const dispatcher = options.context.symbols.query(options.context.doc, 'mcdoc/dispatcher', typeDef.registry).symbol?.members;
			if (!dispatcher) {
				options.context.logger.warn(`Tried to access unknown dispatcher ${typeDef.registry}`);
				return { kind: 'union', members: [] };
			}
			const structFields: StructTypePairField[] = [];
			for (const key in dispatcher) {

				// TODO Better way to access typedef?
				const data = dispatcher[key].data as any;
				if (data && data.typeDef) {
					structFields.push({ kind: 'pair', key: key, type: data.typeDef });
				}
			}
			return simplify(node, { kind: 'indexed', parallelIndices: typeDef.parallelIndices, child: { kind: 'struct', fields: structFields } }, inferredType, options, parents);
		case 'indexed':
			const child = simplify(node, typeDef.child, inferredType, options, parents);
			if (child.kind ==='attributed') {
				const ans = simplify(node, { ...typeDef, child: child.child }, inferredType, options, parents);
				return { ...child, child: ans };
			}

			if (child.kind !== 'struct') {
				options.context.logger.warn(`Tried to index unindexable type ${child.kind}`);
				return { kind: 'union', members: [] };
			}
			let values: McdocType[] = [];

			for (const index of typeDef.parallelIndices) {
				let lookup: string | undefined;
				if (index.kind === 'static') {
					if (index.value === '%fallback') {
						values = child.fields.filter(f => f.kind === 'pair').map(f => f.type);
						break;
					}
					lookup = index.value;
				} else {
					const currentParents = [ ...parents ];
					let current = currentParents.pop();
					for (const entry of index.accessor) {
						if (!current) {
							break;
						}
						const currentType =options.inferType(current);
						// TODO initial check against %parent and %key is to work around an mcdoc parser bug 
						if (entry === '%parent' || (typeof entry != 'string' && entry.keyword === 'parent')) {
							current = currentParents.pop();
						} else if (entry === '%key' || (typeof entry != 'string' && entry.keyword === 'key')) {
							// TODO
							current = undefined;
						}
						else if (typeof entry === 'string') {
							if (internalTypeDefinition(current, { kind: 'struct', fields: [] }, currentType, options, currentParents).some(e => e.kind !== 'unknown_key')) {
								break;
							}
							const child = options.getChildren(current).find(child => {
								const kvp = options.getChildren(child);
								if (kvp.length === 2) {
									const childKey = options.inferType(kvp[0]);
									return childKey.kind === 'literal' && childKey.value.kind === 'string' && childKey.value.value === entry;
								}
								return false;
							});
							currentParents.push(current);
							current = child ? options.getChildren(child)[1] : undefined;
						} else {
							current = undefined;
						}
					}
					if (current) {
						const typeOfFoundValue = options.inferType(current);
						if (typeOfFoundValue.kind === 'literal' && typeOfFoundValue.value.kind === 'string') {
							lookup = typeOfFoundValue.value.value;
							if (lookup.startsWith('minecraft:')) {
								lookup = lookup.substring(10);
							}
						}
					}
				}

				lookup ??= '%none'
				const value = child.fields.find(f => f.kind === 'pair' && f.key === lookup)
				if (value) {
					values.push(value.type)
				} else {
					values = child.fields.filter(f => f.kind === 'pair').map(f => f.type);
					break;
				}
			}
			return simplify(node, { kind: 'union', members: values }, inferredType, options, parents);
		case 'union':
			const members: McdocType[] = [];
			for (const member of typeDef.members) {
				const simplified = simplify(node, member, inferredType, options, parents);
				const attributes: Attribute[] = [];
				let inner = simplified;
				// TODO figure out if we can maybe handle attributes in simplify already, so after simplify there is no attributed types
				// Maybe it would also be worth just attaching an attributes array to type nodes and getting rid of the attributed type alltogether
				while (inner.kind === 'attributed') {
					attributes.push(inner.attribute);
					inner = inner.child;
				}
				if (inner.kind === 'union') {
					for (let innerMember of inner.members) {
						for (const attribute of attributes.reverse()) {
							innerMember = { kind: 'attributed', attribute: attribute, child: innerMember };
						}
						members.push(innerMember);
					}
				} else {
					members.push(simplified);
				}
			}
			if (members.length === 1) {
				return members[0];
			}
			return { kind: 'union', members: members };
		case 'struct':
			const fields: StructTypeField[] = [];
			for (const field of typeDef.fields) {
				if (field.kind === 'pair') {
					// Don't simplify the value here. We need to have the correct `node` and `parents`, which we
					// cannot deterministically find for non-string keys.
					// Instead, this method will be called by every struct child by the outer checking method.
					fields.push({
						...field,
						key: typeof field.key === 'string' ? field.key : simplify(node, field.key, inferredType, options, parents),
					})
				} else {
					const simplified = simplify(node, field.type, inferredType, options, parents);
					
					let inner = simplified;
					// TODO figure out if we can maybe handle attributes in simplify already, so after simplify there is no attributed types
					// Maybe it would also be worth just attaching an attributes array to type nodes and getting rid of the attributed type alltogether
					while (inner.kind === 'attributed') {
						inner = inner.child;
					}

					if (inner.kind === 'struct') {
						fields.push(...inner.fields);
					}
				}
			}
			return { kind: 'struct', fields: fields };
		case 'list': 
			return { ...typeDef, item: simplify(node, typeDef.item, inferredType, options, parents) }
		case 'concrete': // TODO
		case 'template': // TODO
		default: return typeDef
	}
}

function findStructKey<T extends AstNode>(node: T, typeDefs: (McdocType | string)[], inferredType: McdocType, options: ValidatorOptions<T>, parents: T[]): McdocType | string | undefined {

	for (const def of (typeDefs.filter(d => typeof d ==='string')) as string[]) {
		if (internalTypeDefinition(node, { kind: 'literal', value: { kind: 'string', value: def } }, inferredType, options, parents).length === 0) {
			return def;
		}
	}
	
	const complexTypeDefs = typeDefs.filter(d => typeof d !=='string') as McdocType[];
	for (const def of complexTypeDefs) {
		if (internalTypeDefinition(node, def, inferredType, options, parents).length === 0) {
			return def;
		}
	}

	return undefined;
}

function getValueType(type: McdocType): McdocType {
	switch (type.kind) {
		case 'literal':
			return { kind: type.value.kind };
		case 'enum':
			return type.enumKind ? { kind: type.enumKind } : type;
		default:
			return type;
	}
}

function reportErrors<T extends AstNode>(errors: ValidationError<T>[], options: ValidatorOptions<T>) {
	for (const err of errors) {
		switch (err.kind) {
			case 'unknown_typedef':
				options.context.err.report(localize('mcdoc.validator.unknown-typedef', err.defName), err.node.range);
				break;
			case 'unknown_key':
				options.context.err.report(localize('mcdoc.validator.unknown-key', err.key ?? ''), err.node.range);
				break;
			case 'invalid_collection_length':
			case 'number_out_of_range':
				const suffix = err.range.min ? err.range.max ? 'min_max' : 'min' : 'max'; 
				options.context.err.report(
					localize(
						`mcdoc.validator.${err.kind.replace('_', '-')}.${suffix}`,
						(err.range.min ?? err.range.max)!.toString(),
						(err.range.max ?? '').toString()
					),
						err.node.range);
				break;
			case 'type_mismatch':
				options.context.err.report(
					localize('expected', arrayToMessage(err.expected.map(e => localize(`mcdoc.type.${e.kind}`)), false)),
					err.node.range
				);
				break;
			case 'value_mismatch':
				options.context.err.report(
					localize('expected', arrayToMessage(err.expected.map(v => v.toString()))),
					err.node.range
				);
				break;
			default: options.context.err.report(localize(`mcdoc.validator.${err.kind.replace('_', '-')}`), err.node.range);
		}
	}
}