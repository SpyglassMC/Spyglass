import { emplaceMap, isObject } from './util.js'

type DeepReadonlyValue<T> = T extends object ? DeepReadonly<T> : T
export type DeepReadonly<T extends object> = {
	readonly [K in keyof T]: DeepReadonlyValue<T[K]>
}

export type ReadWrite<T extends object> = {
	-readonly [K in keyof T]: T[K]
}

export namespace ReadonlyProxy {
	export function create<T extends object>(obj: T): DeepReadonly<T> {
		return new Proxy(obj, new ReadonlyProxyHandler()) as any
	}
}

class ReadonlyProxyHandler<T extends object> implements ProxyHandler<T> {
	private readonly map = new Map<string | symbol, DeepReadonly<object>>()

	get(target: T, p: string | symbol, receiver: any): any {
		const value = Reflect.get(target, p, receiver)
		if (p !== 'prototype' && isObject(value)) {
			return emplaceMap(this.map, p, {
				insert: () => ReadonlyProxy.create(value),
			})
		}
		return value
	}

	set(_target: T, p: string | symbol, _value: any, _receiver: any): boolean {
		throw new TypeError(
			`Cannot set property '${String(p)}' on a readonly proxy`,
		)
	}

	deleteProperty(_target: T, p: string | symbol): boolean {
		throw new TypeError(
			`Cannot delete property '${String(p)}' on a readonly proxy`,
		)
	}
}
