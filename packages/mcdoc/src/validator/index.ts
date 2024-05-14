import type { AstNode, CheckerContext, Range } from "@spyglassmc/core"
import type { LiteralNumericValue} from "../type";
import { NumericRange, type LiteralType, type McdocType, type StructTypePairField } from "../type"
import { TypeDefSymbolData } from "../binder"
import { arrayToMessage, localize } from "@spyglassmc/locales";

export type McdocTypeInferrer<T extends AstNode> = (node: T) => McdocType

export type NodeEquivalenceChecker = (inferredNode: McdocType, definition: McdocType) => boolean

export type TypeInfoAttacher<T extends AstNode> = (node: T, definition: McdocType) => void

export type ChildrenGetter<T extends AstNode> = (node: T) => T[]

export type ValidationError<T extends AstNode> =
	  SimpleError<T>
	| RangeError<T>
	| TypeMismatchError<T>
	| UnknownKeyError<T>
	| UnknownTypedefError<T>
export interface ErrorBase<T extends AstNode> {
	kind: string;
	node: T
}
export interface SimpleError<T extends AstNode> extends ErrorBase<T> {
	kind: 'expected_key_value_pair';
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
export interface UnknownTypedefError<T extends AstNode> extends ErrorBase<T> {
	kind: 'unknown_typedef';
	defName: string;
}

export interface ValidatorOptions<T extends AstNode> {
	context: CheckerContext;
	inferType: McdocTypeInferrer<T>;
	isEquivalent: NodeEquivalenceChecker;
	getChildren: ChildrenGetter<T>;
	attachTypeInfo: TypeInfoAttacher<T>;
	disableErrorReporting?: boolean;
}

export function validateByTypeName<T extends AstNode>(node: T, typeName: string, options: ValidatorOptions<T>): ValidationError<T>[] {
	const symbol = options.context.symbols.query(options.context.doc, 'mcdoc', typeName);
	const typeDefinition = symbol.getData(TypeDefSymbolData.is)?.typeDef;

	let errors: ValidationError<T>[];
	if (!typeDefinition) {
		errors = [{ kind: 'unknown_typedef', node: node, defName: typeName }];
		dumpErrors(errors, options);

		return errors;
	}

	errors = validateTypeDef(node, typeDefinition, { ...options, disableErrorReporting: true });
	dumpErrors(errors, options);
	return errors;
}

export function validateTypeDef<T extends AstNode>(node: T, typeDef: McdocType, options: ValidatorOptions<T>): ValidationError<T>[] {
	const errors: ValidationError<T>[] = [];
	const inferredType = options.inferType(node);

	// TODO handle special typedefs like union, dispatcher, reference, etc

	if (!isEquivalent(inferredType, typeDef) && !options.isEquivalent(inferredType, typeDef)) {
		errors.push({
			kind: 'type_mismatch',
			node: node,
			expected: [typeDef],
			received: inferredType
		});
		dumpErrors(errors, options);
		return errors;
	}
	
	options.attachTypeInfo(node, typeDef);

	switch (typeDef.kind) {
		case 'struct':
			// TODO handle spread types
			// TODO check duplicate fields
			// TODO check missing fields
			const defChildren = typeDef.fields.filter(f => f.kind === 'pair') as StructTypePairField[];

			for (const child of options.getChildren(node)) {
				const kvp = options.getChildren(child);
				
				if (kvp.length !== 2) {
					errors.push({ kind: 'expected_key_value_pair', node: child });
					continue;
				}

				const inferredKey = options.inferType(kvp[0]);
				const childDefKey = findBestMatch(inferredKey, defChildren.map(c => c.key), options);

				if (childDefKey === undefined) {
					errors.push({
						kind: 'unknown_key', node: kvp[0],
						key: inferredKey.kind === 'literal' ? inferredKey.value.value.toString() : undefined,
					});
					continue;
				}

				const childDef = defChildren.find(d => d.key === childDefKey);
				Array.prototype.push.apply(errors, validateTypeDef(kvp[1], childDef!.type, { ...options, disableErrorReporting: true }));
			}
			break;
		case 'list':
		case 'byte_array':
		case 'int_array':
		case 'long_array': 
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
				Array.prototype.push.apply(errors, validateTypeDef(child, itemType, { ...options, disableErrorReporting: true }));
			}
			if (typeDef.lengthRange && !NumericRange.isInRange(typeDef.lengthRange, children.length)) {
				errors.push({
					kind: 'invalid_collection_length',
					node: node,
					range: typeDef.lengthRange,
				})
			}
			break;
		//TODO: handle all types
	}

	dumpErrors(errors, options);
	return errors;
}

export function findBestMatch<T extends AstNode>(searchedType: McdocType, typeDefs: (McdocType | string)[], options: ValidatorOptions<T>): McdocType | string | undefined {
	if (searchedType.kind === 'literal' && searchedType.value.kind === 'string') {
		for (const def of (typeDefs.filter(d => typeof d ==='string')) as string[]) {
			if (searchedType.value.value === def) {
				return def;
			}
		}
	}
	
	const complexTypeDefs = typeDefs.filter(d => typeof d !=='string') as McdocType[];
	for (const def of complexTypeDefs) {
		if (isEquivalent(searchedType, def)) {
			return def;
		}
	}
	
	for (const def of complexTypeDefs) {
		if (options.isEquivalent(searchedType, def)) {
			return def;
		}
	}

	return undefined;
}

export function isEquivalent(first: McdocType, second: McdocType): boolean {
	if (first.kind === 'any' || second.kind === 'any') {
		return true;
	}

	if (first.kind === 'literal' || second.kind === 'literal') {
		if (first.kind !== 'literal') {
			const tmp = first;
			first = second;
			second = tmp;
		}

		first = first as LiteralType;
		// TODO: Handle id attribute
		if (second.kind === 'literal') {
			if (first.value.kind !== second.value.kind) {
				return false
			}
			if (first.value.value !== second.value.value) {
				return false
			}
			if (first.value.kind === 'number' && first.value.suffix !== (second.value as LiteralNumericValue).suffix) {
				return false
			}
		} else {
			switch (first.value.kind) {
				case 'boolean': return second.kind === 'boolean';
				case 'string': return second.kind === 'string';
				case 'number': {
					switch (first.value.suffix) {
						case 'b': return second.kind === 'byte';
						case 's': return second.kind === 'short';
						case undefined: return second.kind === 'int';
						case 'l': return second.kind === 'long';
						case 'f': return second.kind === 'float';
						case 'd': return second.kind === 'double';
					}
				}
			}
		}
	}

	if (first.kind !== second.kind) {
		return false;
	}

	// TODO: Handle id attribute
	if (first.kind === 'literal') {
		second = second as LiteralType;
		if (first.value.kind !== second.value.kind) {
			return false
		}
		if (first.value.value !== second.value.value) {
			return false
		}
		if (first.value.kind === 'number' && first.value.suffix !== (second.value as LiteralNumericValue).suffix) {
			return false
		}
	}

	return true;
}

function dumpErrors<T extends AstNode>(errors: ValidationError<T>[], options: ValidatorOptions<T>) {
	if (!options.disableErrorReporting) {
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
				default: options.context.err.report(localize(`mcdoc.validator.${err.kind.replace('_', '-')}`), err.node.range);
			}
		}
	}
}