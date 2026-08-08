import type { RootUriString } from '../service/index.js'
import { normalizeUriPathname, Uri } from './util.js'

type FileNode = Record<string, never>
type DirectoryNode = Map<string, DirectoryNode | FileNode>

/**
 * Stores a collection of URIs in a trie. Each file URI can optionally have a metadata associated
 * with it. No actual file system I/O is performed by this class.
 */
export class UriStore {
	#trie: DirectoryNode = new Map()

	/**
	 * Adds a file URI or a directory URI to the store.
	 * Directory URIs must end with a slash (`/`), otherwise it will be treated as a file URI.
	 */
	add(uri: string): void {
		const [parts, isDir] = this.#dissectUri(uri)
		let node = this.#trie
		for (const [i, part] of parts.entries()) {
			const isLast = i === parts.length - 1
			const shouldAddDir = !isLast || isDir
			if (!node.has(part)) {
				node.set(part, shouldAddDir ? new Map() : {})
			}
			if (!isLast) {
				const next = node.get(part)!
				if (next instanceof Map) {
					node = next
				} else {
					throw new Error(
						`Cannot add '${uri}' because ${parts.slice(0, i + 1).join('/')} is a file`,
					)
				}
			}
		}
	}

	/**
	 * Returns true if the specified URI exists in the store and is of the expected type.
	 * Directory URIs must end with a slash (`/`), otherwise it will be treated as a file URI.
	 */
	has(uri: string): boolean {
		const [parts, isDir] = this.#dissectUri(uri)
		let node: DirectoryNode | FileNode | undefined = this.#trie
		for (const part of parts) {
			if (!(node instanceof Map)) {
				return false
			}
			node = node.get(part)
		}
		return isDir
			? node instanceof Map
			: !!node && typeof node === 'object' && !(node instanceof Map)
	}

	/**
	 * Deletes a URI from the store if it exists.
	 * For directories, all sub URIs under them will be recursively removed.
	 */
	delete(uri: string): void {
		const [parts, _isDir] = this.#dissectUri(uri)
		let node: DirectoryNode | FileNode | undefined = this.#trie

		for (const [i, part] of parts.entries()) {
			if (!(node instanceof Map)) {
				return
			}
			if (i === parts.length - 1) {
				node.delete(part)
			} else {
				node = node.get(part)
			}
		}
	}

	/**
	 * Returns names of all direct children of the URI.
	 * An empty result is generated if the directory URI does not exist.
	 */
	*getChildrenNames(uri: RootUriString): Generator<string> {
		const [parts, _isDir] = this.#dissectUri(uri)

		let node: DirectoryNode | FileNode | undefined = this.#trie
		for (const part of parts) {
			if (!(node instanceof Map)) {
				return
			}
			node = node.get(part)
		}

		if (!(node instanceof Map)) {
			return
		}

		yield* node.keys()
	}

	/**
	 * Returns URIs of all files under a directory and its subdirectories.
	 * An empty result is generated if the directory URI does not exist.
	 */
	*getSubFiles(uri: RootUriString): Generator<string> {
		const [parts, _isDir] = this.#dissectUri(uri)

		let node: DirectoryNode | FileNode | undefined = this.#trie
		for (const part of parts) {
			if (!(node instanceof Map)) {
				return
			}
			node = node.get(part)
		}

		if (!(node instanceof Map)) {
			return
		}

		yield* this.#collect(node, parts)
	}

	/**
	 * Removes all URIs from the store.
	 */
	clear(): void {
		this.#trie.clear()
	}

	/**
	 * Creates a deep copy of this store.
	 */
	clone(): UriStore {
		const clonedStore = new UriStore()
		clonedStore.#trie = structuredClone(this.#trie)
		return clonedStore
	}

	[Symbol.iterator]() {
		return this.#collect(this.#trie, [])
	}

	/**
	 * Dissects a URI string into parts that can be used as edges in the trie.
	 */
	#dissectUri(uriString: string): [parts: string[], isDir: boolean] {
		const uri = new Uri(uriString)
		const isDir = uriString.endsWith('/')
		const parts = [
			uri.protocol,
			uri.host || 'localhost',
			...normalizeUriPathname(uri.pathname).split('/')
				// Filter out empty segments
				.filter((p) => p)
				.map(decodeURIComponent),
		]
		return [parts, isDir]
	}

	/**
	 * Reconstructs a URI string from its parts.
	 *
	 * This is the inverse of `#dissectUri`.
	 * It handles special cases like omitting the host when it's 'localhost' and adding a trailing
	 * slash for directory URIs.
	 */
	#buildUri(parts: string[], isDir: boolean): string {
		const [protocol, host, ...segments] = parts
		const pathname = normalizeUriPathname(`/${segments.map(encodeURIComponent).join('/')}`)
		const trailingSlash = isDir && segments.length ? '/' : ''
		return `${protocol}//${host === 'localhost' ? '' : host}${pathname}${trailingSlash}`
	}

	/**
	 * Returns a generator that yields all URIs under a DirectoryNode recursively.
	 * @param currentParts Parts corresponding to the URI of the DirectoryNode.
	 */
	*#collect(node: DirectoryNode, currentParts: string[]): Generator<string> {
		for (const [key, value] of node) {
			const nextParts = [...currentParts, key]
			if (value instanceof Map) {
				yield* this.#collect(value, nextParts)
			} else {
				yield this.#buildUri(nextParts, false)
			}
		}
	}
}
