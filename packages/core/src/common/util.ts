import externalBinarySearch from 'binary-search'
import rfdc from 'rfdc'
import type { ProcessorContext } from '../service'
import { Externals } from './externals'

export const Uri = URL
export type Uri = URL

/** 
 * `NodeJS.Timeout` on Node.js and `number` on browser.
 */
export type IntervalId = any

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
 * This is a decorator for methods. Decorated methods will return the same non-`undefined` value no matter what.
 */
export const Singleton: MethodDecorator = (_target: Object, _key: string | symbol, descripter: PropertyDescriptor) => {
	let value: unknown
	const decoratedMethod: (...args: unknown[]) => unknown = descripter.value
	// The `function` syntax is used to preserve `this` context from the decorated method.
	descripter.value = function (...args: unknown[]) {
		return value ??= decoratedMethod.apply(this, args)
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
		const timeouts = new Map<unknown, IntervalId>()
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
export function bufferToString(buffer: Uint8Array): string {
	const ans = new TextDecoder().decode(buffer)
	// if (ans.charCodeAt(0) === 0xFEFF) {
	// 	return ans.slice(1)
	// }
	return ans
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

export async function parseGzippedJson<T>(buffer: Uint8Array): Promise<T> {
	return JSON.parse(bufferToString(await Externals.archive.gunzip(buffer)))
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
 * @returns A map from state names to the corresponding sets of values. The first element in the value array is the default
 * value for that state.
 */
export function getStates(category: 'block' | 'fluid', ids: readonly string[], ctx: ProcessorContext): Record<string, string[]> {
	const ans: Record<string, Set<string>> = {}
	ids = ids.map(ResourceLocation.lengthen)
	for (const id of ids) {
		ctx.symbols
			.query(ctx.doc, category, id)
			.forEachMember((state, stateQuery) => {
				const values = Object.keys(stateQuery.visibleMembers)
				const set = ans[state] ??= new Set()
				const defaultValue = stateQuery.symbol?.relations?.default
				if (defaultValue) {
					set.add(defaultValue.path[defaultValue.path.length - 1])
				}
				for (const value of values) {
					set.add(value)
				}
			})
	}
	return Object.fromEntries(Object.entries(ans).map(([k, v]) => [k, [...v]]))
}

export const binarySearch = externalBinarySearch

export function isIterable(value: unknown): value is Iterable<unknown> {
	return !!(value as Iterable<unknown>)[Symbol.iterator]
}
