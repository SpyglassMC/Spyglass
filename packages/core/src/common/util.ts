import type { URL as Uri } from 'url'

export { URL as Uri } from 'url'

/**
 * `rfdc` cannot handle objects like `{ valueNode: V, children: [V] }` properly (the `V` will be cloned to
 * two different objects). This method does not have such problem.
 */
export function deepClone<T>(ele: T, references = new Map()): T {
	if (typeof ele !== 'object' || ele === null) {
		return ele
	} else if (references.has(ele)) {
		return references.get(ele)
	}
	let ans: any
	if (Array.isArray(ele)) {
		ans = deepCloneArray(ele, references)
	} else if (ele instanceof Date) {
		ans = new Date(ele)
		references.set(ele, ans)
	} else if (ele instanceof Map) {
		ans = new Map(deepCloneArray(Array.from(ele), references))
		references.set(ele, ans)
	} else if (ele instanceof Set) {
		ans = new Set(deepCloneArray(Array.from(ele), references))
		references.set(ele, ans)
	} else {
		ans = deepCloneObject(ele as unknown as object, references)
	}
	return ans
}

function deepCloneArray<T>(arr: T[], references: Map<object, object>): T[] {
	const ans: T[] = []
	references.set(arr, ans)
	for (const ele of arr) {
		ans.push(deepClone(ele, references))
	}
	return ans
}

function deepCloneObject<T extends object>(obj: T, references: Map<object, object>): T {
	const ans: any = {} // Object.create(Object.getPrototypeOf(obj)) - Setting prototypes is slow.
	references.set(obj, ans)
	for (const [key, value] of Object.entries(obj)) {
		ans[key] = deepClone(value, references)
	}
	return ans
}

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
