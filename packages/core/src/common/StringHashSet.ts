export class StringHashSet implements Set<string> {
	#obj: Record<string, true | undefined> = Object.create(null)

	get size(): number {
		return Object.keys(this.#obj).length
	}

	add(value: string): this {
		this.#obj[value] = true
		return this
	}
	clear(): void {
		this.#obj = Object.create(null)
	}
	delete(value: string): boolean {
		if (this.has(value)) {
			return delete this.#obj[value]
		}
		return false
	}
	forEach(callbackfn: (value: string, value2: string, set: Set<string>) => void, thisArg?: any): void {
		for (const value of this) {
			callbackfn.call(thisArg, value, value, this)
		}
	}
	has(value: string): boolean {
		return Object.prototype.hasOwnProperty.call(this.#obj, value)
	}
	entries(): IterableIterator<[string, string]> {
		return Object
			.keys(this.#obj)
			.map(v => [v, v] as [string, string])
			.values()
	}
	keys(): IterableIterator<string> {
		return this[Symbol.iterator]()
	}
	values(): IterableIterator<string> {
		return this[Symbol.iterator]()
	}
	[Symbol.iterator](): IterableIterator<string> {
		return Object.keys(this.#obj).values()
	}
	get [Symbol.toStringTag]() {
		return 'StringHashSet'
	}
}
