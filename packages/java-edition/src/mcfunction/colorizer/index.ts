import * as core from '@spyglassmc/core'
import type { CoordinateNode } from '../node'

export function register(meta: core.MetaRegistry) {
	meta.registerColorizer<CoordinateNode>('mcfunction:coordinate', core.colorizer.number)
}
