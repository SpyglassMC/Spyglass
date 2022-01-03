import type { URL as Uri } from 'url'
import type { RootUriString } from '../service'

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
			return `${Protocol}//${Hostname}/${stringToBase64(archiveUri)}/${pathInArchive.replace(/\\/g, '/')}`
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
				archiveUri: base64ToString(paths[1]),
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
