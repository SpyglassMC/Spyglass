import type { URL as Uri } from 'url'

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
				.then(() => promises.delete(cacheKey), () => promises.delete(cacheKey))
			promises.set(cacheKey, ans)
			return ans
		}
		return descripter
	}
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

		export function get(archiveFsPath: string, pathInArchive?: string) {
			return `${Protocol}//${Hostname}/${encodeURIComponent(archiveFsPath)}/${pathInArchive ? pathInArchive.replace(/\\/g, '/') : ''}`
		}

		export function is(uri: Uri): boolean {
			return uri.protocol === SpyglassUri.Protocol && uri.hostname === SpyglassUri.Archive.Hostname
		}

		/**
		 * @throws When `uri` has the wrong protocol or hostname.
		 */
		export function decode(uri: Uri): { archiveFsPath: string, pathInArchive: string } {
			if (uri.protocol !== Protocol) {
				throw new Error(`Unexpected protocol “${uri.protocol}” in “${uri.toString()}”`)
			}
			if (uri.hostname !== Hostname) {
				throw new Error(`Unexpected hostname “${uri.hostname}” in “${uri.toString()}”`)
			}
			// Ex. `pathname`: `/C%3A%5Ca.tar.gz/foo/bar.json`
			const paths = uri.pathname.split('/')
			return {
				archiveFsPath: decodeURIComponent(paths[1]),
				pathInArchive: paths.slice(2).join('/'),
			}
		}
	}
}
