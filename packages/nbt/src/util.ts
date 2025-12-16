import type { ParserContext } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { NbtNode } from './node/index.js'

export function localizeTag(type: NbtNode['type']) {
	return localize(`nbt.node.${type.replace(/^nbt:/, '')}`)
}

export function newSyntax(ctx: ParserContext) {
	// TODO: don't have this inline java-edition version check
	const release = ctx.project['loadedVersion'] as string | undefined
	if (!release) {
		return true
	}
	const [majorA, minorA, patchA = 0] = release.split('.')
	const [majorB, minorB, patchB = 0] = '1.21.5'.split('.')
	if (majorA !== majorB) {
		return Number(majorA) >= Number(majorB)
	}
	if (minorA !== minorB) {
		return Number(minorA) >= Number(minorB)
	}
	return Number(patchA) >= Number(patchB)
}
