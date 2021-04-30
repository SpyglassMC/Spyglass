import * as core from '@spyglassmc/core'
import type { LiteralNode } from '../node'

export function literal(names: string[], isRoot = false): core.Parser<LiteralNode> {
	return core.map(
		core.failOnEmpty<core.LiteralNode>(core.literal(...names)),
		res => ({
			...res,
			type: 'mcfunction:literal',
			name: res.value,
			isRoot,
		})
	)
}
