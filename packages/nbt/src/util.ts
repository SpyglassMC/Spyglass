import { localize } from '@spyglassmc/locales'
import type { NbtNode } from './node'

export function localizeTag(type: NbtNode['type']) {
	return localize(`nbt.node.${type.replace(/^nbt:/, '')}`)
}
