import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { checkAssignability, NbtdocType } from '../../lib/type'

describe('nbtdoc checker/type.ts', () => {
	const cases: { source: NbtdocType, target: NbtdocType }[] = [
		{
			source: { kind: 'string' },
			target: { kind: 'string' },
		},
		{
			source: { kind: 'int' },
			target: { kind: 'string' },
		},
		{
			source: { kind: 'union', members: [{ kind: 'string' }, { kind: 'int' }] },
			target: { kind: 'string' },
		},
		{
			source: { kind: 'string' },
			target: { kind: 'union', members: [{ kind: 'string' }, { kind: 'int' }] },
		},
		{
			source: { kind: 'union', members: [{ kind: 'string' }, { kind: 'union', members: [{ kind: 'string' }, { kind: 'int' }] }] },
			target: { kind: 'union', members: [{ kind: 'string' }, { kind: 'int' }] },
		},
		{
			source: { kind: 'union', members: [{ kind: 'string' }, { kind: 'int' }, { kind: 'boolean' }] },
			target: { kind: 'union', members: [{ kind: 'string' }, { kind: 'int' }] },
		},
		{
			source: { kind: 'union', members: [{ kind: 'string' }, { kind: 'int' }] },
			target: { kind: 'union', members: [{ kind: 'string' }, { kind: 'int' }, { kind: 'boolean' }] },
		},
		{
			source: { kind: 'list', item: { kind: 'list', item: { kind: 'union', members: [{ kind: 'string' }, { kind: 'int' }] } } },
			target: { kind: 'list', item: { kind: 'list', item: { kind: 'union', members: [{ kind: 'string' }, { kind: 'int' }, { kind: 'boolean' }] } } },
		},
		{
			source: { kind: 'list', item: { kind: 'list', item: { kind: 'union', members: [{ kind: 'string' }, { kind: 'int' }, { kind: 'boolean' }] } } },
			target: { kind: 'list', item: { kind: 'list', item: { kind: 'union', members: [{ kind: 'string' }, { kind: 'int' }] } } },
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
