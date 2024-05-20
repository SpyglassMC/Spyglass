import type { RootTreeNode } from '../../../java-edition/lib/dependency/mcmeta.js'

export const tree: RootTreeNode = {
	type: 'root',
	children: {
		execute: {
			type: 'literal',
			children: {
				if: {
					type: 'literal',
					children: {
						true: {
							type: 'literal',
							executable: true,
							redirect: ['execute'],
						},
					},
				},
				run: {
					type: 'literal',
				},
			},
		},
		say: {
			type: 'literal',
			children: {
				hi: {
					type: 'literal',
					executable: true,
				},
			},
		},
	},
}
