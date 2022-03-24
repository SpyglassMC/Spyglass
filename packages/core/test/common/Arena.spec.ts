import assert from 'assert'
import { describe } from 'mocha'
import { Arena, TreeArena } from '../../lib/common/Arena'

describe('Arena', () => {
	it('Should behave correctly', () => {
		const arena = new Arena<string>()
		assert.strictEqual(arena.get(0), undefined)
		assert.deepStrictEqual([...arena], [])
		assert.strictEqual(arena.put('foo'), 0)
		assert.strictEqual(arena.get(0), 'foo')
		assert.deepStrictEqual([...arena], ['foo'])
		assert.strictEqual(arena.put('bar'), 1)
		assert.deepStrictEqual([...arena], ['foo', 'bar'])
		arena.free(42)
		assert.deepStrictEqual([...arena], ['foo', 'bar'])
		arena.free(0)
		assert.strictEqual(arena.get(0), undefined)
		assert.deepStrictEqual([...arena], ['bar'])
		assert.strictEqual(arena.put('qux'), 0)
		assert.strictEqual(arena.get(0), 'qux')
		assert.deepStrictEqual([...arena], ['qux', 'bar'])
		assert.strictEqual(arena.put('baz'), 2)
		assert.deepStrictEqual([...arena], ['qux', 'bar', 'baz'])
	})
})

describe('TreeArena', () => {
	it('Should behave correctly', () => {
		const arena = new TreeArena<string>('root')
		assert.strictEqual(arena.get(0), 'root')
		assert.strictEqual(arena.put('foo'), 1)
		assert.strictEqual(arena.get(1), 'foo')
		assert.strictEqual(arena.put('bar'), 2)
		assert.strictEqual(arena.get(2), 'bar')
		assert.strictEqual(arena.put('bar.foo', 2), 3)
		assert.strictEqual(arena.get(3), 'bar.foo')
		assert.deepStrictEqual([...arena.getAll(3)], ['bar.foo', 'bar', 'root'])
		assert.deepStrictEqual([...arena], ['root', 'foo', 'bar', 'bar.foo'])
		arena.free(0)
		assert.deepStrictEqual([...arena], [])
		assert.strictEqual(arena.get(0), undefined)
		assert.strictEqual(arena.get(1), undefined)
		assert.strictEqual(arena.get(2), undefined)
		assert.strictEqual(arena.get(3), undefined)
	})
})
