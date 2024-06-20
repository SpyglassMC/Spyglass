import type * as core from '@spyglassmc/core'
import type { Attribute, EnumType, LiteralType, McdocType, UnionType } from '../../type/index.js'
import type { McdocRuntimeError } from './error.js'
import type { SimplifiedMcdocType, SimplifiedMcdocTypeNoUnion } from './index.js'

export type RuntimeUnion<T> = RuntimeNode<T>[] | RuntimePair<T>

export interface RuntimeNode<T> {
	originalNode: T
	inferredType: Exclude<McdocType, UnionType>
}
export interface RuntimePair<T> {
	attributes?: Attribute[]
	key: RuntimeNode<T>
	possibleValues: RuntimeNode<T>[]
}

export type NodeEquivalenceChecker = (
	inferredNode: Exclude<SimplifiedMcdocTypeNoUnion, LiteralType | EnumType>,
	definition: Exclude<SimplifiedMcdocTypeNoUnion, LiteralType | EnumType>,
) => boolean

export type TypeInfoAttacher<T> = (
	node: T,
	definition: SimplifiedMcdocType,
	description?: string,
) => void

export type StringAttacher<T> = (node: T, attacher: (node: core.StringBaseNode) => void) => void

export type ChildrenGetter<T> = (
	node: T,
	simplified: SimplifiedMcdocTypeNoUnion,
) => RuntimeUnion<T>[]

export type ErrorReporter<T> = (error: McdocRuntimeError<T>) => void

export interface McdocCheckerContext<T> extends core.CheckerContext {
	allowMissingKeys: boolean
	requireCanonical: boolean
	isEquivalent: NodeEquivalenceChecker
	getChildren: ChildrenGetter<T>
	reportError: ErrorReporter<T>
	attachTypeInfo?: TypeInfoAttacher<T>
	stringAttacher?: StringAttacher<T>
}
type McdocCheckerContextOptions<T> = Partial<McdocCheckerContext<T>>
export namespace McdocCheckerContext {
	export function create<T>(
		ctx: core.CheckerContext,
		options: McdocCheckerContextOptions<T>,
	): McdocCheckerContext<T> {
		return {
			...ctx,
			allowMissingKeys: options.allowMissingKeys ?? false,
			requireCanonical: options.requireCanonical ?? false,
			isEquivalent: options.isEquivalent ?? (() => false),
			getChildren: options.getChildren ?? (() => []),
			reportError: options.reportError ?? (() => {}),
			attachTypeInfo: options.attachTypeInfo,
			stringAttacher: options.stringAttacher,
		}
	}
}
