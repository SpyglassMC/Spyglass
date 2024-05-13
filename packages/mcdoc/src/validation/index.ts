import type { AstNode, CheckerContext } from "@spyglassmc/core"
import type { LiteralNumericValue} from "../type";
import { NumericRange, type LiteralType, type McdocType, type StructTypePairField } from "../type"
import { TypeDefSymbolData } from "../binder"

export type McdocTypeInferrer<T extends AstNode> = (node: T) => McdocType

export type NodeEquivalenceChecker = (inferredNode: McdocType, definition: McdocType) => boolean

export type TypeInfoAttacher<T extends AstNode> = (node: T, definition: McdocType) => void

export type ChildrenGetter<T extends AstNode> = (node: T) => T[]

export type ErrorReporter<T extends AstNode> = (node: T, errorKind: ErrorKind, ...params: any) => void

export type ErrorKind = 'typeMismatch'
	| 'expectedKeyValuePair'
	| 'invalidRecordKey'
	| 'invalidCollectionLength'

export interface ValidatorOptions<T extends AstNode> {
	context: CheckerContext,
	inferType: McdocTypeInferrer<T>,
	isEquivalent: NodeEquivalenceChecker,
	getChildren: ChildrenGetter<T>,
	reportError: ErrorReporter<T>,
	attachTypeInfo: TypeInfoAttacher<T>
}

export function validateByTypeName<T extends AstNode>(node: T, typeName: string, options: ValidatorOptions<T>) {
	const symbol = options.context.symbols.query(options.context.doc, 'mcdoc', typeName);
	const typeDefinition = symbol.getData(TypeDefSymbolData.is)?.typeDef;

	if (!typeDefinition) {
		options.context.logger.error(`[mcdoc.validation] Unknown typedef ${typeName}`);

		return;
	}

	validateTypeDef(node, typeDefinition, options);
}



export function validateTypeDef<T extends AstNode>(node: T, def: McdocType, options: ValidatorOptions<T>) {
	const inferredType = options.inferType(node);

	// TODO handle special typedefs like union, dispatcher, reference, etc

	if (!isEquivalent(inferredType, def) && !options.isEquivalent(inferredType, def)) {
		options.reportError(node, 'typeMismatch', [[def], inferredType]);
		return;
	}

	options.attachTypeInfo(node, def);

	switch (def.kind) {
		case 'struct':
			// TODO handle spread types
			// TODO check duplicate fields
			// TODO check missing fields
			const defChildren = def.fields.filter(f => f.kind === 'pair') as StructTypePairField[];

			for (const child of options.getChildren(node)) {
				const kvp = options.getChildren(child);

				if (kvp.length !== 2) {
					options.reportError(child, 'expectedKeyValuePair');
					continue;
				}

				const inferredKey = options.inferType(kvp[0]);
				const childDefKey = findBestMatch(inferredKey, defChildren.map(c => c.key), options);

				if (childDefKey === undefined) {
					options.reportError(kvp[0], 'invalidRecordKey');
					continue;
				}

				const childDef = defChildren.find(d => d.key === childDefKey);
				validateTypeDef(kvp[1], childDef!.type, options);
			}
			break;
		case 'list':
		case 'byte_array':
		case 'int_array':
		case 'long_array': 
			let itemType: McdocType;
			switch (def.kind) {
				case 'list':
					itemType = def.item;
					break;
				case 'byte_array':
					itemType = { kind: 'byte', valueRange: def.valueRange };
					break;
				case 'int_array':
					itemType = { kind: 'int', valueRange: def.valueRange };
					break;
				case 'long_array': 
					itemType = { kind: 'long', valueRange: def.valueRange };
					break;
			}
			const children = options.getChildren(node);
			for (const child of children) {
				validateTypeDef(child, itemType, options);
			}
			if (def.lengthRange && !NumericRange.isInRange(def.lengthRange, children.length)) {
				options.reportError(node, 'invalidCollectionLength', def.lengthRange.min ?? 0, def.lengthRange.max)
			}
			break;
		//TODO: handle all types
	}
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