import * as core from '@spyglassmc/core'
import type { JsonFileNode } from '../node/index.js'
import { entry } from './entry.js'

export const file: core.Parser<JsonFileNode> = core.map(
	core.dumpErrors(entry),
	(res) => ({ type: 'json:file', range: res.range, children: [res] }),
)
