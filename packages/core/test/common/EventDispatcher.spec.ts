import assert from 'node:assert/strict'
import { describe, it, mock } from 'node:test'
import { EventDispatcher } from '../../lib/index.js'

describe('EventDispatcher', () => {
	it('Should dispatch events correctly', () => {
		const dispatcher = new EventDispatcher<{ test: string }>()
		const listener = mock.fn()

		dispatcher.on('test', listener)
		dispatcher.emit('test', 'test-data-0')
		dispatcher.emit('test', 'test-data-1')

		assert.equal(listener.mock.callCount(), 2)
		assert.deepEqual(listener.mock.calls[0].arguments, ['test-data-0'])
		assert.deepEqual(listener.mock.calls[1].arguments, ['test-data-1'])
	})
})
