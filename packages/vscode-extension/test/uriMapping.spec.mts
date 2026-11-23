import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { UriApi, UriLike } from '../out/uriMapping.mjs'
import { createUriMapper, MappedRootPath, ServerCacheRootPath } from '../out/uriMapping.mjs'

/**
 * A stand-in for `vscode.Uri`, built on the WHATWG `URL`. Like the real one, it keeps `path` decoded
 * and percent-encodes it when turned into a string.
 */
class FakeUri implements UriLike {
	readonly scheme: string
	readonly authority: string
	readonly path: string

	constructor(scheme: string, authority: string, path: string) {
		this.scheme = scheme
		this.authority = authority
		this.path = path
	}

	toString() {
		const encodedPath = this.path.split('/').map(encodeURIComponent).join('/')
		return `${this.scheme}://${this.authority}${encodedPath}`
	}

	static from(c: { scheme: string; authority: string; path: string }) {
		return new FakeUri(c.scheme, c.authority, c.path)
	}

	static parse(value: string) {
		const url = new URL(value)
		return new FakeUri(
			url.protocol.slice(0, -1),
			url.host,
			decodeURIComponent(url.pathname),
		)
	}
}
const api: UriApi<FakeUri> = FakeUri
const mapper = createUriMapper(api)

const roundTrip = (value: string) => mapper.toServer(mapper.fromServer(value))

describe('createUriMapper()', () => {
	it('Should leave file URIs alone', () => {
		const uri = FakeUri.parse('file:///home/user/pack/data/a.json')
		assert.equal(mapper.toServer(uri), 'file:///home/user/pack/data/a.json')
		assert.equal(
			mapper.fromServer('file:///home/user/pack/data/a.json').toString(),
			uri.toString(),
		)
	})

	it('Should disguise other schemes as file URIs, keeping the path readable', () => {
		const uri = FakeUri.parse('vscode-vfs://github/owner/repo/data/ns/function/a.mcfunction')
		assert.equal(
			mapper.toServer(uri),
			'file:///.spyglass-uri/vscode-vfs/github/owner/repo/data/ns/function/a.mcfunction',
		)
	})

	it('Should restore the original URI', () => {
		const original = 'vscode-vfs://github/owner/repo/data/ns/function/a.mcfunction'
		const restored = mapper.fromServer(mapper.toServer(FakeUri.parse(original)))
		assert.equal(restored.scheme, 'vscode-vfs')
		assert.equal(restored.authority, 'github')
		assert.equal(restored.path, '/owner/repo/data/ns/function/a.mcfunction')
		assert.equal(restored.toString(), original)
	})

	it('Should survive characters that need percent-encoding', () => {
		const uri = new FakeUri('vscode-vfs', 'github', '/o/r/data/my pack/ü ö #1.json')
		const restored = mapper.fromServer(mapper.toServer(uri))
		assert.equal(restored.path, uri.path)
		assert.equal(restored.authority, uri.authority)
		assert.equal(restored.scheme, uri.scheme)
	})

	it('Should keep an empty authority distinct from a real one', () => {
		const empty = new FakeUri('vscode-local', '', '/foo/bar.json')
		const underscore = new FakeUri('vscode-local', '_', '/foo/bar.json')
		const doubleUnderscore = new FakeUri('vscode-local', '__x', '/foo/bar.json')
		for (const uri of [empty, underscore, doubleUnderscore]) {
			const restored = mapper.fromServer(mapper.toServer(uri))
			assert.equal(restored.authority, uri.authority)
			assert.equal(restored.path, uri.path)
		}
		assert.notEqual(mapper.toServer(empty), mapper.toServer(underscore))
		assert.notEqual(mapper.toServer(underscore), mapper.toServer(doubleUnderscore))
	})

	it('Should handle workspace folder roots with and without trailing slash', () => {
		for (const path of ['/owner/repo', '/owner/repo/', '/']) {
			const uri = new FakeUri('vscode-vfs', 'github', path)
			assert.equal(mapper.fromServer(mapper.toServer(uri)).path, path)
		}
		const bare = new FakeUri('vscode-vfs', 'github', '')
		assert.equal(mapper.fromServer(mapper.toServer(bare)).authority, 'github')
	})

	it('Should be stable when applied repeatedly', () => {
		const once = mapper.toServer(FakeUri.parse('vscode-test-web://mount/data/a.json'))
		assert.equal(roundTrip(once), once)
	})

	it('Should not touch file URIs that merely look similar, nor malformed mapped ones', () => {
		assert.equal(mapper.fromServer('file:///.spyglass-uriX/a/b').path, '/.spyglass-uriX/a/b')
		assert.equal(mapper.fromServer('file:///.spyglass-uri/nopath').scheme, 'file')
	})

	it('Should have root paths that cannot overlap with each other', () => {
		assert.equal(MappedRootPath.startsWith(ServerCacheRootPath), false)
		assert.equal(ServerCacheRootPath.startsWith(MappedRootPath), false)
	})
})
