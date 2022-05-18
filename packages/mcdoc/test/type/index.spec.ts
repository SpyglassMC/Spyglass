import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { checkAssignability, McdocType } from '../../lib/type'
describe('mcdoc checker/type.ts', () => {
	const cases: { source: McdocType, target: McdocType }[] = [
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
			it(`Assign '${McdocType.toString(source)}' to '${McdocType.toString(target)}'`, () => {
				snapshot(checkAssignability({ source, target }))
			})
		}
	})
})
