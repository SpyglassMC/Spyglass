import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { checkAssignability, NbtdocType } from '../../lib/type'

describe('nbtdoc checker/type.ts', () => {
	const cases: { source: NbtdocType, target: NbtdocType }[] = [
		{
			source: { type: 'string' },
			target: { type: 'string' },
		},
		{
			source: { type: 'int' },
			target: { type: 'string' },
		},
		{
			source: { type: 'union', members: [{ type: 'string' }, { type: 'int' }] },
			target: { type: 'string' },
		},
		{
			source: { type: 'string' },
			target: { type: 'union', members: [{ type: 'string' }, { type: 'int' }] },
		},
		{
			source: { type: 'union', members: [{ type: 'string' }, { type: 'union', members: [{ type: 'string' }, { type: 'int' }] }] },
			target: { type: 'union', members: [{ type: 'string' }, { type: 'int' }] },
		},
		{
			source: { type: 'union', members: [{ type: 'string' }, { type: 'int' }, { type: 'boolean' }] },
			target: { type: 'union', members: [{ type: 'string' }, { type: 'int' }] },
		},
		{
			source: { type: 'union', members: [{ type: 'string' }, { type: 'int' }] },
			target: { type: 'union', members: [{ type: 'string' }, { type: 'int' }, { type: 'boolean' }] },
		},
		{
			source: { type: 'list', item: { type: 'list', item: { type: 'union', members: [{ type: 'string' }, { type: 'int' }] } } },
			target: { type: 'list', item: { type: 'list', item: { type: 'union', members: [{ type: 'string' }, { type: 'int' }, { type: 'boolean' }] } } },
		},
		{
			source: { type: 'list', item: { type: 'list', item: { type: 'union', members: [{ type: 'string' }, { type: 'int' }, { type: 'boolean' }] } } },
			target: { type: 'list', item: { type: 'list', item: { type: 'union', members: [{ type: 'string' }, { type: 'int' }] } } },
		},
	]
	describe('checkAssignability()', () => {
		for (const { source, target } of cases) {
			it(`Assign '${NbtdocType.toString(source)}' to '${NbtdocType.toString(target)}'`, () => {
				snapshot(checkAssignability({ source, target }))
			})
		}
	})
})
