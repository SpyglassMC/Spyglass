import { describe, it } from "node:test";
import { UriStore } from "../../lib/index.js";
import assert from "node:assert/strict";

describe('UriStore', () => {
	it('Should normalize Windows drive letter and colons in pathname', () => {
		const store = new UriStore()

		store.add('file:///c:/foo.txt')

		const hasUri = store.has('file:///C%3A/foo.txt')
		assert.equal(hasUri, true)
	})
})
