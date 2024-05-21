import type { CheckerContext, FullResourceLocation } from "@spyglassmc/core";
import { Range } from "@spyglassmc/core"
import type { Attribute, StructTypePairField , LiteralType, McdocType, Index, ParallelIndices, KeywordType, UnionType, ListType, EnumType, NumericType, PrimitiveArrayType, StringType, StructType, TupleType } from "../type/index.js";
import { NumericRange } from "../type/index.js"
import { TypeDefSymbolData } from "../binder/index.js"
import { arrayToMessage, localeQuote, localize } from "@spyglassmc/locales";
import type { EnumKind } from "../node/index.js";

export type McdocTypeInferrer<T> = (node: T) => McdocType

export type NodeEquivalenceChecker = (inferredNode: McdocType, definition: SimplifiedMcdocType) => boolean

export type TypeInfoAttacher<T> = (node: T, definition: SimplifiedMcdocType) => void

export type ChildrenGetter<T> = (node: T) => T[]

export type RangeGetter<T> = (node: T, error: ValidationError<T>['kind']) => Range

export interface ValidatorOptions<T> {
	context: CheckerContext;
	inferType: McdocTypeInferrer<T>;
	isEquivalent: NodeEquivalenceChecker;
	getChildren: ChildrenGetter<T>;
	getRange: RangeGetter<T>;
	attachTypeInfo: TypeInfoAttacher<T>;
}

export type ValidationError<T> =
	  SimpleError<T>
	| RangeError<T>
	| TypeMismatchError<T>
	| StructKeyError<T>
export interface ErrorBase<T> {
	node: T
}
export interface SimpleError<T> extends ErrorBase<T> {
	kind: 'expected_key_value_pair' | 'expected_noting';
}
export interface RangeError<T> extends ErrorBase<T> {
	kind: 'invalid_collection_length' | 'number_out_of_range';
	range: NumericRange;
}
export interface StructKeyError<T> extends ErrorBase<T> {
	kind: 'unknown_key' | 'missing_key' | 'duplicate_key';
	key: McdocType;
}
export interface TypeMismatchError<T> extends ErrorBase<T> {
	kind: 'type_mismatch';
	received: McdocType;
	expected: SimplifiedMcdocType;
}

export type SimplifiedMcdocType =
	  SimplifiedMcdocTypeNoUnion
	| UnionType<SimplifiedMcdocTypeNoUnion>

type SimplifiedMcdocTypeNoUnion =
	  SimplifiedEnum
	| KeywordType
	| ListType<SimplifiedMcdocType>
	| LiteralType
	| NumericType
	| PrimitiveArrayType
	| StringType
	| SimplifiedStructType
	| TupleType<SimplifiedMcdocType>

export interface SimplifiedEnum extends EnumType {
	enumKind: EnumKind
}
export interface SimplifiedStructType extends StructType {
	fields: SimplifiedStructTypePairField[]
}
export interface SimplifiedStructTypePairField extends StructTypePairField {
	key: SimplifiedMcdocTypeNoUnion
}
  
const attributeHandlers: {
	[key: string]: (<N>(
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

export function reference<T>(node: T, path: string, options: ValidatorOptions<T>) {
	typeDefinition(node, { kind: 'reference', path: path }, options);
}

export function dispatcher<T>(node: T, registry: FullResourceLocation, index: string | Index | ParallelIndices, options: ValidatorOptions<T>) {
	const parallelIndices: ParallelIndices = typeof index === 'string'
		? [{ kind: 'static', value: index }]
		: Array.isArray(index)
			? index
			: [index]
	typeDefinition(node, { kind: 'dispatcher', registry: registry, parallelIndices: parallelIndices }, options);
}

export function typeDefinition<T>(node: T, typeDef: McdocType, options: ValidatorOptions<T>) {
	const inferredType = options.inferType(node);
	const errors = validate(node, typeDef, inferredType, options, []);

	reportErrors(errors, options);
}

export function isAssignable(typeDef: McdocType, other: McdocType, ctx: CheckerContext, isEquivalent?: NodeEquivalenceChecker): boolean {
	const options: ValidatorOptions<McdocType | SimplifiedStructTypePairField> = {
		context: ctx,
		inferType: d => d.kind === 'pair' ? { kind: 'tuple', items: [ d.key, d.type ] } : d,
		isEquivalent: isEquivalent ? isEquivalent : () => false,
		getChildren: d => {
			if (d.kind === 'pair') {
				return [ d.key, d.type ]
			}
			const simplified = simplify(d, d, d, options, []);
			switch (simplified.kind) {
				case 'list': return [simplified.item]
				case 'byte_array': return [{kind: 'byte'}]
				case 'int_array': return [{kind: 'int'}]
				case 'long_array': return [{kind: 'long'}]
				case 'struct': return simplified.fields
				case 'tuple': return simplified.items
				default: return []
			}
		},
		getRange: () => Range.Full,
		attachTypeInfo: () => {}
	}

	return validate(typeDef, other, typeDef, options, []).length === 0;
}

function validate<T>(node: T, typeDef: McdocType, inferredType: McdocType, options: ValidatorOptions<T>, parents: T[]): ValidationError<T>[] {
	const errors: ValidationError<T>[] = [];
	const simplified = simplify(node, typeDef, inferredType, options, parents);

	if (inferredType.kind === 'any' || inferredType.kind === 'unsafe') {
		options.attachTypeInfo(node, simplified);
		return [];
	}

	const simplifiedInferred = simplify(node, inferredType, inferredType, options, parents);
	const inferredValueTypes = getValueType(simplifiedInferred);
	const expectedValueTypes = getValueType(simplified);
	
	options.attachTypeInfo(node, simplified);

	if (inferredValueTypes.length === 0 && expectedValueTypes.length > 0) {
		return [{
			kind: "type_mismatch",
			node: node,
			received: inferredType,
			expected: simplified
		}];
	}
	for (const inferredVal of inferredValueTypes) {

		let foundMatch = false
		for (const expectedVal of expectedValueTypes) {
			if (inferredVal.kind === expectedVal.kind || options.isEquivalent(inferredVal, expectedVal)) {
				foundMatch = true;
			}
		}
		if (!foundMatch) {
			return [{
				kind: "type_mismatch",
				node: node,
				received: inferredType,
				expected: simplified
			}];
		}
	}

	if (simplified.attributes) {
		for (const attribute of simplified.attributes) {
			
			const handler = attributeHandlers[attribute.name];
			if (handler) {
				errors.push(...handler(node, attribute, inferredType, simplified, options));
			}
		}
	}

	switch (simplified.kind) {
		case 'any':
		case 'unsafe':
			break;
		case 'union':
			if (simplified.members.length === 0) {
				errors.push({
					kind: 'expected_noting',
					node: node,
				})
				break;
			}

			let parsingResults: { typeDef: McdocType, errors: ValidationError<T>[] }[] = [];
			for (const def of simplified.members) {
				// TODO mock attachTypeInfo method
				const innerErrors = validate(node, def, inferredType, options, parents);
				if (innerErrors.length === 0) {
					return [];
				}
				parsingResults.push({ typeDef: def, errors: innerErrors });
			}
			if (!parsingResults.some(r => r.errors.some(e => e.kind !== 'type_mismatch' || e.node !== node))) {
				errors.push({
					kind: 'type_mismatch',
					node: node,
					expected: simplified,
					received: inferredType
				});
			}
			else {
				parsingResults = parsingResults.filter(r => !r.errors.some(e => e.kind === 'type_mismatch' && e.node === node));
				if (parsingResults.some(r => !r.errors.some(e => e.kind === 'unknown_key'))) {
					parsingResults = parsingResults.filter(r => !r.errors.some(e => e.kind === 'unknown_key'));
				}
				if (parsingResults.some(r => !r.errors.some(e => e.kind === 'missing_key'))) {
					parsingResults = parsingResults.filter(r => !r.errors.some(e => e.kind === 'missing_key'));
				}
				errors.push(...parsingResults.sort((a, b) => a.errors.length - b.errors.length)[0].errors);
			}
			break;
		case 'struct': {
			const unmatchedKvps = options
				.getChildren(node)
				.map(c => ({ original: c, kvp: options.getChildren(c)}))
				.filter(v => {
					if (v.kvp.length !== 2) {
						errors.push({
							kind: 'expected_key_value_pair',
							node: v.original
						})
						return false;
					}
					return true;
				})
				.map(v => ({ key: v.kvp[0], value: v.kvp[1] }));
			
			for (const pair of simplified.fields) {
				const matches: { key: T, value: T }[] = [];
				for (let i = 0; i < unmatchedKvps.length; i++) {
					const kvp = unmatchedKvps[i];
					const inferredKey = options.inferType(kvp.key);
					if (isAssignable(inferredKey, pair.key, options.context, options.isEquivalent)) {
						unmatchedKvps.splice(i, 1);
						matches.push(kvp)
						i--;
					}
				}
				if (matches.length > 1) {
					if (pair.key.kind === 'literal') {
						errors.push(...matches.map(m => ({
							kind: 'duplicate_key',
							node: m.key,
							key: pair.key,
						} as StructKeyError<T>)))
					} else {
						// TODO
					}
				}
				for (const match of matches) {
					errors.push(...validate(match.value, pair.type, options.inferType(match.value), options, [ ...parents, node ]));
				}
				if (matches.length === 0 && pair.optional !== true) {
					errors.push({
						kind: 'missing_key',
						node: node,
						key: pair.key,
					})
				}
			}
			errors.push(...unmatchedKvps.map(kvp => ({
				kind: 'unknown_key',
				node: kvp.key,
				key: options.inferType(kvp.key),
			} as StructKeyError<T>)))
			break;
		}
		case 'list':
		case 'byte_array':
		case 'int_array':
		case 'long_array': {
			let itemType: McdocType;
			switch (simplified.kind) {
				case 'list':
					itemType = simplified.item;
					break;
				case 'byte_array':
					itemType = { kind: 'byte', valueRange: simplified.valueRange };
					break;
				case 'int_array':
					itemType = { kind: 'int', valueRange: simplified.valueRange };
					break;
				case 'long_array': 
					itemType = { kind: 'long', valueRange: simplified.valueRange };
					break;
			}
			const children = options.getChildren(node);
			for (const child of children) {
				const inferredChild = options.inferType(child);
				errors.push(...validate(child, itemType, inferredChild, options, [ ...parents, node ]));
			}
			if (simplified.lengthRange && !NumericRange.isInRange(simplified.lengthRange, children.length)) {
				errors.push({
					kind: 'invalid_collection_length',
					node: node,
					range: simplified.lengthRange,
				})
			}
			break;
		}
		case 'tuple': {
			const children = options.getChildren(node);
			if (simplified.items.length === children.length) {
				for (let i = 0; i < simplified.items.length; i++) {
					const def = simplified.items[i];
					const child = children[i];
					const inferredChild = options.inferType(child);
					errors.push(...validate(child, def, inferredChild, options, [ ...parents, node ]));
				}
			} else {
				errors.push({
					kind: 'invalid_collection_length',
					node: node,
					range: { kind: 0b00, max: simplified.items.length, min: simplified.items.length },
				})
			}
			break;
		}
		case 'literal': {
			if (inferredType.kind !== 'literal' || simplified.value.value !== inferredType.value.value) {
				return [{
					kind: "type_mismatch",
					node: node,
					received: inferredType,
					expected: simplified,
				}];
			}
			break;
		}
		case 'enum': {
			if (inferredType.kind === 'literal' && !simplified.values.some(v => {
				if (v.attributes) {
					const enumChildType = {
						kind: 'literal',
						value: { kind: simplified.enumKind ?? 'int', value: v.value}
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
				errors.push({
					kind: "type_mismatch",
					node: node,
					received: inferredType,
					expected: simplified,
				});
			}
			break;
		}
	}
	return errors;
}

function simplify<T>(node: T, typeDef: McdocType, inferredType: McdocType, options: ValidatorOptions<T>, parents:T[]): SimplifiedMcdocType {
	if (typeDef.attributes) {
		//TODO
	}

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

			if (child.kind !== 'struct') {
				options.context.logger.warn(`Tried to index unindexable type ${child.kind}`);
				return { kind: 'union', members: [] };
			}
			let values: McdocType[] = [];

			for (const index of typeDef.parallelIndices) {
				let lookup: string | undefined = undefined;
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
							if (isAssignable(currentType, { kind: 'struct', fields: [{ kind: 'pair', key: { kind: 'any' }, type: { kind: 'any' } }] }, options.context, options.isEquivalent)) {
								break;
							}
							const child = options.getChildren(current).find(child => {
								const kvp = options.getChildren(child);
								if (kvp.length === 2) {
									const childKey = options.inferType(kvp[0]);
									return isAssignable({ kind: 'literal', value: { kind: 'string', value: entry } }, childKey, options.context, options.isEquivalent) ;
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
				const value = child.fields.find(f => f.kind === 'pair' && f.key.kind === 'literal' && f.key.value.value === lookup)
				if (value) {
					values.push(value.type)
				} else {
					// fallback case
					values = child.fields.filter(f => f.kind === 'pair').map(f => f.type);
					break;
				}
			}
			return simplify(node, { kind: 'union', members: values }, inferredType, options, parents);
		case 'union':
			const members: SimplifiedMcdocTypeNoUnion[] = [];
			for (const member of typeDef.members) {
				const simplified = simplify(node, member, inferredType, options, parents);

				if (simplified.kind === 'union') {
					members.push(...simplified.members)
				} else {
					members.push(simplified);
				}
			}
			if (members.length === 1) {
				return members[0];
			}
			return { kind: 'union', members: members };
		case 'struct':
			const fields: SimplifiedStructTypePairField[] = [];
			for (const field of typeDef.fields) {
				if (field.kind === 'pair') {
					// Don't simplify the value here. We need to have the correct `node` and `parents`, which we
					// cannot deterministically find for non-string keys.
					// Instead, this method will be called by every struct child by the outer checking method.
					const key =  typeof field.key === 'string' ? field.key : simplify(node, field.key, inferredType, options, parents);
					if (typeof key !== 'string' && key.kind === 'union') {
						for (const subKey of key.members) {
							fields.push({
								...field,
								key: simplifyKey(subKey),
							});
						}
					} else {
						fields.push({
							...field,
							key: simplifyKey(key),
						});
					}
				} else {
					const simplified = simplify(node, field.type, inferredType, options, parents);

					if (simplified.kind === 'struct') {
						fields.push(...simplified.fields);
					}
				}
			}
			return {
				kind: 'struct',
				fields: fields.filter((f, i) =>
					i <= fields.findLastIndex(of => isAssignable(f.key, of.key, options.context, options.isEquivalent))
				)
			};
		case 'list':
			return { ...typeDef, item: simplify(node, typeDef.item, inferredType, options, parents) };
		case 'tuple':
			return { ...typeDef, items: typeDef.items.map(i => simplify(node, i, inferredType, options, parents)) };
		case 'enum':
			return { ...typeDef, enumKind: typeDef.enumKind ?? 'int' }
		case 'concrete': // TODO
		case 'template': // TODO
			return { kind: 'union', members: [] };
		default: return typeDef
	}
}
function simplifyKey(keyDef: SimplifiedMcdocTypeNoUnion | string): SimplifiedMcdocTypeNoUnion {
	if (typeof keyDef == 'string') {
		return { kind: 'literal', value: { kind: 'string', value: keyDef } };
	}
	return keyDef
}

function getValueType(type: SimplifiedMcdocType): SimplifiedMcdocType[] {
	switch (type.kind) {
		case 'literal':
			return [{ kind: type.value.kind }];
		case 'enum':
			return [{ kind: type.enumKind }];
		case 'union':
			return type.members.flatMap(m => getValueType(m));
		default:
			return [type];
	}
}

function reportErrors<T>(errors: ValidationError<T>[], options: ValidatorOptions<T>) {
	for (const err of errors) {
		const defaultTranslationKey = err.kind.replace('_', '-');
		const range = options.getRange(err.node, err.kind);
		switch (err.kind) {
			case 'unknown_key':
			case 'missing_key':
				options.context.err.report(localize(defaultTranslationKey, err.key?.kind ==='literal' ? err.key.value.value : `<${localize(`mcdoc.type.${err.key.kind}`)}>`), range);
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
					range,
				);
				break;
			case 'type_mismatch':
				const types = (err.expected.kind === 'union' ? err.expected.members : [err.expected]);
				options.context.err.report(
					localize('expected', arrayToMessage(
						types.map(e => e.kind === 'enum'
							? arrayToMessage(e.values.map(v => v.value.toString()))
							: e.kind === 'literal'
								? localeQuote(e.value.value.toString())
								: localize(`mcdoc.type.${e.kind}`)
						),
						false,
					)),
					range,
				);
				break;
			case 'expected_key_value_pair':
				options.context.err.report(localize(`mcdoc.validator.${defaultTranslationKey}`), range);
				break;
			case 'expected_noting':
				options.context.err.report(localize('expected', localize('nothing')), range);
				break;
			default: options.context.err.report(localize(defaultTranslationKey), range);
		}
	}
}
