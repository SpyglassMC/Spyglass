import type { ContextBase, ErrorSeverity } from '@spyglassmc/core'
import type { McdocType } from './index.js'

export function checkAssignability({
	ctx,
	ruleSet,
	source,
	sourceAdapter,
	target,
	targetAdapter,
}: {
	ctx: ContextBase
	ruleSet: RuleSet
	source: unknown
	sourceAdapter: Adapter
	target: unknown
	targetAdapter: Adapter
}): void {}

export interface Adapter {
	inferExactType(value: unknown): McdocType
	bind(target: McdocType, path: readonly string[]): void
	/**
	 * @param message
	 * @param target
	 * @param severity Defaults to `ErrorSeverity.Warning`.
	 */
	error(message: string, target: McdocType, severity?: ErrorSeverity): void
	/**
	 * @returns if the provided type is supported by the current adapter.
	 *
	 * this function MUST return `true` for objects returned by the `asType` function on the same adapter.
	 */
	supported(type: McdocType): boolean
}

export interface RuleSet {}
