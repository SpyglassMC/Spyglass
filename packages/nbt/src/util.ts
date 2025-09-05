import type { ParserContext } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { NbtNode } from './node/index.js'

export function localizeTag(type: NbtNode['type']) {
	return localize(`nbt.node.${type.replace(/^nbt:/, '')}`)
}

export function newSyntax(ctx: ParserContext) {
	// TODO: don't have this inline java-edition version check
	const release = ctx.project['loadedVersion'] as string | undefined
	return !release || Number(release.slice(2)) >= Number('1.21.5'.slice(2))
}
