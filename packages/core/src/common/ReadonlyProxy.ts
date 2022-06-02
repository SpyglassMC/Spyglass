import { AstNode } from '../index.js'
import { emplaceMap } from './util.js'

type Wrap<T> = T extends object ? ReadonlyProxy<T> : T
export type ReadonlyProxy<T extends object> = {
	readonly [K in keyof T]: Wrap<T[K]>
}

export const ReadonlyProxy = Object.freeze({
	create<T extends object>(obj: T): ReadonlyProxy<T> {
		return new Proxy(obj, new ReadonlyProxyHandler()) as any
	},
})

class ReadonlyProxyHandler<T extends object> implements ProxyHandler<T> {
	private readonly map = new Map<string | symbol, ReadonlyProxy<object>>()

	get(target: T, p: string | symbol, receiver: any): any {
		const value = Reflect.get(target, p, receiver)
		if (value && typeof value === 'object') {
			return emplaceMap(this.map, p, { insert: () => ReadonlyProxy.create(value) })
		}
		return value
	}

	set(_target: T, p: string | symbol, _value: any, _receiver: any): boolean {
		throw new Error(`Cannot set property '${String(p)}' on a readonly proxy`)
	}
}
