import type { PartialRootTreeNode, PartialTreeNode } from '@spyglassmc/mcfunction'
import { merge } from '@spyglassmc/mcfunction'
import { Tree1_16 } from './1.16'

const ItemOperation: PartialTreeNode = {
	children: {
		modify: {
			children: {
				modifier: {
					properties: {
						category: 'item_modifier',
					},
				},
			},
		},
		copy: {
			children: {
				block: {
					children: {
						source: {
							children: {
								sourceSlot: {
									children: {
										modifier: {
											properties: {
												category: 'item_modifier',
											},
										},
									},
								},
							},
						},
					},
				},
				entity: {
					children: {
						source: {
							children: {
								sourceSlot: {
									children: {
										modifier: {
											properties: {
												category: 'item_modifier',
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	},
}

/**
 * Patch for Minecraft: Java Edition 21w15a
 * 
 * The following parsers are patched with new properties:
 * - `minecraft:resource_location`
 */
export const Tree1_17: PartialRootTreeNode = merge(Tree1_16, {
	children: {
		item: {
			children: {
				block: {
					children: {
						pos: {
							children: {
								slot: ItemOperation,
							},
						},
					},
				},
				entity: {
					children: {
						targets: {
							children: {
								slot: ItemOperation,
							},
						},
					},
				},
			},
		},
		replaceitem: undefined,
	},
})
