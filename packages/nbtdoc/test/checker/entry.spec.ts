import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { checkAssignability } from '../../lib/checker/entry'
import { CompoundFieldTypeNode } from '../../lib/node/CompoundDefinition'

describe('nbtdoc checker/entry.ts', () => {
	const cases: { source: CompoundFieldTypeNode.SymbolData, target: CompoundFieldTypeNode.SymbolData }[] = [
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
	]
	describe('checkAssignability()', () => {
		for (const { source, target } of cases) {
			it(`Assign '${CompoundFieldTypeNode.symbolDataToString(source)}' to '${CompoundFieldTypeNode.symbolDataToString(target)}'`, () => {
				snapshot(checkAssignability({ source, target }))
			})
		}
	})
})
