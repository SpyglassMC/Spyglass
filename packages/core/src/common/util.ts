import crypto from 'crypto'
import rfdc from 'rfdc'
import type { URL as Uri } from 'url'
import { promisify } from 'util'
import zlib from 'zlib'
import type { ProcessorContext, RootUriString } from '../service'

export { URL as Uri } from 'url'

/**
 * @param getCacheKey A function that takes the actual arguments being passed into the decorated method, and returns anything.
 * The result of this function will be used as the key to cache the `Promise`. By default the first element in the argument
 * list will be used.
 * 
 * This is a decorator for async methods. Decorated methods will return the same `Promise` for
 * the same arguments, provided that the cached `Promise` is still pending.
 */
export function CachePromise(getCacheKey: (args: any[]) => any = args => args[0]): MethodDecorator {
	return (_target: Object, _key: string | symbol, descripter: PropertyDescriptor) => {
		const promises = new Map<unknown, Promise<unknown>>()
		const decoratedMethod: (...args: unknown[]) => Promise<unknown> = descripter.value
		// The `function` syntax is used to preserve `this` context from the decorated method.
		descripter.value = function (...args: unknown[]) {
			const cacheKey = getCacheKey(args)
			if (promises.has(cacheKey)) {
				return promises.get(cacheKey)!
			}
			const ans = decoratedMethod.apply(this, args)
				.then(ans => (promises.delete(cacheKey), ans), e => (promises.delete(cacheKey), Promise.reject(e)))
			promises.set(cacheKey, ans)
			return ans
		}
		return descripter
	}
}

/**
 * This is a decorator for async methods. Decorated methods will return the same `Promise` no matter what.
 */
export const SingletonPromise: MethodDecorator = (_target: Object, _key: string | symbol, descripter: PropertyDescriptor) => {
	let promise: Promise<unknown> | undefined
	const decoratedMethod: (...args: unknown[]) => Promise<unknown> = descripter.value
	// The `function` syntax is used to preserve `this` context from the decorated method.
	descripter.value = function (...args: unknown[]) {
		return promise ??= decoratedMethod.apply(this, args)
	}
	return descripter
}

/**
 * @param getKey A function that takes the actual arguments being passed into the decorated method, and returns anything.
 * The result of this function will be used as the key to cache the `Timeout`. By default the first element in the argument
 * list will be used.
 * 
 * Decorated methods will be scheduled to run after `ms` milliseconds. The timer will reset when the method is called again.
 */
export function Delay(ms: number, getKey: (args: any[]) => any = args => args[0]): MethodDecorator {
	return (_target: Object, _key: string | symbol, descripter: PropertyDescriptor) => {
		const timeouts = new Map<unknown, NodeJS.Timeout>()
		const decoratedMethod: (...args: unknown[]) => unknown = descripter.value
		// The `function` syntax is used to preserve `this` context from the decorated method.
		descripter.value = function (...args: unknown[]) {
			const key = getKey(args)
			if (timeouts.has(key)) {
				clearTimeout(timeouts.get(key)!)
			}
			timeouts.set(key, setTimeout(() => {
				timeouts.delete(key)
				decoratedMethod.apply(this, args)
			}, ms))
		}
		return descripter
	}
}

export namespace SpyglassUri {
	export const Protocol = 'spyglassmc:'
	export namespace Archive {
		export const Hostname = 'archive'


		export function get(archiveUri: string): RootUriString
		export function get(archiveUri: string, pathInArchive: string): string
		export function get(archiveUri: string, pathInArchive = '') {
			return `${Protocol}//${Hostname}/${encodeURIComponent(archiveUri)}/${pathInArchive.replace(/\\/g, '/')}`
		}

		export function is(uri: Uri): boolean {
			return uri.protocol === Protocol && uri.hostname === Hostname
		}

		/**
		 * @throws When `uri` has the wrong protocol or hostname.
		 */
		export function decode(uri: Uri): { archiveUri: string, pathInArchive: string } {
			if (uri.protocol !== Protocol) {
				throw new Error(`Expected protocol “${Protocol}” in “${uri.toString()}”`)
			}
			if (uri.hostname !== Hostname) {
				throw new Error(`Expected hostname “${Hostname}” in “${uri.toString()}”`)
			}
			// Ex. `pathname`: `/QzpcYS50YXIuZ3o=/foo/bar.json`
			const paths = uri.pathname.split('/')
			return {
				archiveUri: decodeURIComponent(paths[1]),
				pathInArchive: paths.slice(2).join('/'),
			}
		}
	}
}

export type FullResourceLocation = `${string}:${string}`

export interface ResourceLocation {
	isTag: boolean,
	namespace: string | undefined,
	path: readonly string[],
}
export namespace ResourceLocation {
	/**
	 * The prefix for tags.
	 */
	export const TagPrefix = '#'
	/**
	 * The seperator of namespace and path.
	 */
	export const NamespacePathSep = ':'
	/**
	 * The seperator between different path segments.
	 */
	export const PathSep = '/'
	export const DefaultNamespace = 'minecraft'

	export function lengthen(value: string): FullResourceLocation {
		switch (value.indexOf(NamespacePathSep)) {
			case -1:
				return `${DefaultNamespace}${NamespacePathSep}${value}`
			case 0:
				return `${DefaultNamespace}${value}` as unknown as FullResourceLocation
			default:
				return value as FullResourceLocation
		}
	}

	export function shorten(value: string): string {
		return value.replace(/^(?:minecraft)?:/, '')
	}
}

/**
 * @returns The string value decoded from the buffer according to UTF-8.
 * Byte order mark is correctly removed.
 */
export function bufferToString(buffer: Buffer): string {
	const ans = buffer.toString('utf-8')
	if (ans.charCodeAt(0) === 0xFEFF) {
		return ans.slice(1)
	}
	return ans
}

export function stringToBase64(str: string): string {
	return Buffer.from(str).toString('base64')
}
export function base64ToString(base64: string): string {
	return Buffer.from(base64, 'base64').toString('utf-8')
}

/**
 * @throws
 */
export function getSha1(data: string | Buffer): string {
	const hash = crypto.createHash('sha1')
	hash.update(data)
	return hash.digest('hex')
}

export function isErrorCode(e: unknown, code: string): boolean {
	return e instanceof Error && (e as NodeJS.ErrnoException).code === code
}

export function isEnoent(e: unknown): boolean {
	return isErrorCode(e, 'ENOENT')
}

export type Arrayable<T> = T | readonly T[]
export namespace Arrayable {
	export function is<T>(value: unknown, isT: (value: unknown) => value is T): value is Arrayable<T> {
		return Array.isArray(value)
			? value.every(e => isT(e))
			: isT(value)
	}

	export function toArray<T>(value: Arrayable<T>): T[] {
		return Array.isArray(value) ? value : [value]
	}
}

export namespace TypePredicates {
	export function isString(value: unknown): value is string {
		return typeof value === 'string'
	}
}

export function promisifyAsyncIterable<T, U>(iterable: AsyncIterable<T>, joiner: (chunks: T[]) => U): Promise<U> {
	return (async () => {
		const chunks: T[] = []
		for await (const chunk of iterable) {
			chunks.push(chunk)
		}
		return joiner(chunks)
	})()
}

export const unzip: (buffer: Buffer) => Promise<Buffer> = promisify(zlib.gunzip)
export const zip: (buffer: Buffer) => Promise<Buffer> = promisify(zlib.gzip)

export async function parseGzippedJson<T>(buffer: Buffer): Promise<T> {
	return JSON.parse(bufferToString(await unzip(buffer)))
}

export function isObject(value: unknown): value is Exclude<object, Array<any>> {
	return !!value && typeof value === 'object' && !Array.isArray(value)
}

export function merge<T extends Record<string, any>>(a: T, b: Record<string, any>): T {
	const ans = rfdc()(a)
	for (const [key, value] of Object.entries(b) as [keyof typeof ans, any][]) {
		if (isObject(ans[key]) && isObject(value)) {
			ans[key] = merge(ans[key], value)
		} else if (value === undefined) {
			delete ans[key]
		} else {
			ans[key] = value
		}
	}
	return ans
}

export type Lazy<T> = T | Lazy.ComplexLazy<T>
export namespace Lazy {
	const LazyDiscriminator = Symbol('LazyDiscriminator')
	export type UnresolvedLazy<T> = {
		discriminator: typeof LazyDiscriminator,
		getter: (this: void) => T,
	}
	export type ResolvedLazy<T> = {
		discriminator: typeof LazyDiscriminator,
		getter: (this: void) => T,
		value: T,
	}
	export type ComplexLazy<T> = ResolvedLazy<T> | UnresolvedLazy<T>

	export function create<T>(getter: (this: void) => T): UnresolvedLazy<T> {
		return {
			discriminator: LazyDiscriminator,
			getter,
		}
	}

	export function isComplex<T = any>(lazy: any): lazy is ComplexLazy<T> {
		return lazy?.discriminator === LazyDiscriminator
	}

	export function isUnresolved<T = any>(lazy: any): lazy is UnresolvedLazy<T> {
		return isComplex(lazy) && !('value' in lazy)
	}

	export function resolve<T>(lazy: Lazy<T>): T {
		return isUnresolved(lazy) ? (lazy as ResolvedLazy<T>).value = lazy.getter() : lazy
	}
}

/**
 * @param ids An array of block/fluid IDs, with or without the namespace.
 * @returns A map from state names to the corresponding sets of values.
 */
export function getStates(category: 'block' | 'fluid', ids: readonly string[], ctx: ProcessorContext): Record<string, readonly string[] | undefined> {
	const ans: Record<string, string[]> = {}
	ids = ids.map(ResourceLocation.lengthen)
	for (const id of ids) {
		ctx.symbols
			.query(ctx.doc, category, id)
			.forEachMember((state, stateQuery) => {
				const values = Object.keys(stateQuery.visibleMembers)
				const arr = ans[state] ??= []
				for (const value of values) {
					if (!arr.includes(value)) {
						arr.push(value)
					}
				}
			})
	}
	return ans
}
