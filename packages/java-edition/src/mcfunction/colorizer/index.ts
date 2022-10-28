import * as core from '@spyglassmc/core'
import type {
	CoordinateNode,
	ObjectiveCriteriaNode,
	VectorNode,
} from '../node/index.js'

export const objectiveCriterion: core.Colorizer<ObjectiveCriteriaNode> = (
	node,
) => [core.ColorToken.create(node, 'type')]

export const vector: core.Colorizer<VectorNode> = (node) => {
	return [core.ColorToken.create(node, 'vector')]
}

export function register(meta: core.MetaRegistry) {
	meta.registerColorizer<CoordinateNode>(
		'mcfunction:coordinate',
		core.colorizer.number,
	)
	meta.registerColorizer<VectorNode>('mcfunction:vector', vector)
	meta.registerColorizer<ObjectiveCriteriaNode>(
		'mcfunction:objective_criteria',
		objectiveCriterion,
	)
}
