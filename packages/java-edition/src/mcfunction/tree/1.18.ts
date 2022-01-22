import type { PartialRootTreeNode } from '@spyglassmc/mcfunction'
import { merge } from '@spyglassmc/mcfunction'
import { Tree1_17 } from './1.17'

export const Tree1_18: PartialRootTreeNode = merge(Tree1_17, {
	locate: {
		children: {
			structure: {
				properties: {
					category: 'worldgen/structure_feature',
				},
			},
		},
	},
	placefeature: {
		children: {
			feature: {
				properties: {
					category: 'worldgen/configured_feature',
				},
			},
		},
	},
})
