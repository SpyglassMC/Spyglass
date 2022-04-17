import type { JsonChecker, JsonCheckerContext, record } from '@spyglassmc/json/lib/checker'
import { deprecate } from '@spyglassmc/json/lib/checker'
import { ReleaseVersion } from '../../../dependency'

type CheckerRecord = Parameters<typeof record>[0]

function getVersion(ctx: JsonCheckerContext) {
	return ctx.project['loadedVersion'] as ReleaseVersion
}

function cmpVersion(ctx: JsonCheckerContext, target: ReleaseVersion): number {
	return ReleaseVersion.cmp(getVersion(ctx), target)
}

export function versioned(ctx: JsonCheckerContext, version: ReleaseVersion, checker: string[]): string[]
export function versioned(ctx: JsonCheckerContext, version: ReleaseVersion, checker: JsonChecker | undefined): JsonChecker | undefined
export function versioned(ctx: JsonCheckerContext, version: ReleaseVersion, checker: CheckerRecord | undefined): CheckerRecord | undefined

export function versioned(ctx: JsonCheckerContext, checker: string[], version: ReleaseVersion): string[]
export function versioned(ctx: JsonCheckerContext, checker: JsonChecker | undefined, version: ReleaseVersion): JsonChecker | undefined
export function versioned(ctx: JsonCheckerContext, checker: CheckerRecord | undefined, version: ReleaseVersion): CheckerRecord | undefined

export function versioned(ctx: JsonCheckerContext, checker: string[], version: ReleaseVersion, checker2: string[]): string[]
export function versioned(ctx: JsonCheckerContext, checker: JsonChecker, version: ReleaseVersion, checker2: JsonChecker): JsonChecker
export function versioned(ctx: JsonCheckerContext, checker: CheckerRecord, version: ReleaseVersion, checker2: CheckerRecord): CheckerRecord
export function versioned(ctx: JsonCheckerContext, arg1: any, arg2?: any, arg3?: any): any {
	if (typeof arg1 === 'string') {
		const check = cmpVersion(ctx, arg1 as ReleaseVersion) >= 0
		if (arg2 === undefined) {
			return arg2
		} else if (Array.isArray(arg2)) {
			return check ? arg2 : []
		} else {
			return check ? arg2 : undefined
		}
	} else {
		const check = cmpVersion(ctx, arg2 as ReleaseVersion) < 0
		if (arg1 === undefined) {
			return arg1
		} else if (Array.isArray(arg1)) {
			return check ? arg1 : (arg3 ?? [])
		} else {
			return check ? arg1 : (arg3 ?? undefined)
		}
	}
}

export function renamed(ctx: JsonCheckerContext, from: string, version: ReleaseVersion, to: string, checker: JsonChecker): CheckerRecord | undefined {
	return versioned(ctx, {
		[from]: checker,
	}, version, {
		[to]: checker,
	})
}

export function deprecated(ctx: JsonCheckerContext, version: ReleaseVersion, checker: JsonChecker | undefined) {
	if (cmpVersion(ctx, version) < 0) {
		return checker
	}
	return deprecate(checker)
}
