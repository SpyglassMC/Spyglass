export class TwoWayMap<K, V> implements Map<K, V> {
	_map = new Map<K, V>()
	_reversedMap = new Map<V, K>()

	constructor(values: [K, V][] = []) {
		for (const [k, v] of values) {
			this._map.set(k, v)
			this._reversedMap.set(v, k)
		}
	}

	get size(): number {
		return this._map.size
	}

	clear(): void {
		this._map.clear()
		this._reversedMap.clear()
	}

	delete(key: K): boolean {
		const value = this._map.get(key)
		const ans = this._map.delete(key)
		if (value !== undefined) {
			this._reversedMap.delete(value)
		}
		return ans
	}

	deleteValue(value: V): boolean {
		const key = this._reversedMap.get(value)
		const ans = this._reversedMap.delete(value)
		if (key !== undefined) {
			this._map.delete(key)
		}
		return ans
	}

	get(key: K): V | undefined {
		return this._map.get(key)
	}
	getKey(value: V): K | undefined {
		return this._reversedMap.get(value)
	}

	has(key: K): boolean {
		return this._map.has(key)
	}
	hasValue(value: V): boolean {
		return this._reversedMap.has(value)
	}

	set(key: K, value: V): this {
		this._map.set(key, value)
		this._reversedMap.set(value, key)
		return this
	}

	forEach(
		callbackfn: (value: V, key: K, map: TwoWayMap<K, V>) => void,
		thisArg?: any,
	): void {
		for (const [key, value] of this._map) {
			callbackfn.apply(thisArg, [value, key, this])
		}
	}

	entries(): IterableIterator<[K, V]> {
		return this._map.entries()
	}

	keys(): IterableIterator<K> {
		return this._map.keys()
	}

	values(): IterableIterator<V> {
		return this._map.values()
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this._map.entries()
	}

	[Symbol.toStringTag] = 'TwoWayMap'
}
