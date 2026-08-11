import type { ResourceLocationNode } from '../node/index.js'
import type { Checker } from '../processor/checker/Checker.js'

export const resourceLocation: Checker<ResourceLocationNode> = (node, ctx) => {
	// const full = ResourceLocationNode.toString(node, 'full')
	// if (node.options.pool) {
	// 	if (!node.options.pool.includes(full)) {
	// 		ctx.err.report(localize('expected', node.options.pool), node, ErrorSeverity.Error)
	// 	}
	// 	return
	// }
}
