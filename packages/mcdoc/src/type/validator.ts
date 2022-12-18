import type { ContextBase, ErrorSeverity } from '@spyglassmc/core'
import type { McdocType } from './index.js'

export function validateValue(
	type: McdocType,
	value: RuntimeValue,
	ctx: ValidatorContext,
): void {}

export function checkAssignability(
	target: McdocType,
	source: McdocType,
	ctx: ValidatorContext,
): void {}

export interface ValidatorContext extends ContextBase {
	/**
	 * @param message
	 * @param target
	 * @param severity Defaults to `ErrorSeverity.Warning`.
	 */
	error(message: string, target: RuntimeValue, severity?: ErrorSeverity): void
	bind(target: RuntimeValue, path: readonly string[]): void
}

export interface RuntimeValue {
	asType(): McdocType
	asString(): string
	getKeyOnParent(): RuntimeValue | undefined
	getParent(): RuntimeValue | undefined
	getValue(key: string): RuntimeValue | undefined
}

export interface ValidatorHook {
	name: McdocType['kind'] | `attributed-${string}`
}
