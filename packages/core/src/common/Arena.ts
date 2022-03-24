export interface IArena<T> extends Iterable<T> {
	put(data: T): number
	get(index: number): T | undefined
	free(index: number): void
}
export class Arena<T> implements IArena<T> {
	#arena: T[] = []
	#freedIndices = new Set<number>()

	put(data: T): number {
		const r = this.#freedIndices.values().next()
		if (!r.done) {
			const i = r.value
			this.#freedIndices.delete(i)
			this.#arena[i] = data
			return i
		}
		return this.#arena.push(data) - 1
	}

	get(index: number): T | undefined {
		if (this.#freedIndices.has(index)) {
			return undefined
		}
		return this.#arena[index]
	}

	free(index: number): void {
		if (this.#arena[index]) {
			this.#freedIndices.add(index)
		}
	}

	*[Symbol.iterator](): Iterator<T, any, undefined> {
		for (const [i, data] of this.#arena.entries()) {
			if (this.#freedIndices.has(i)) {
				continue
			}
			yield data
		}
	}
}

interface Node<T> {
	data: T,
	parent?: number,
	children?: Set<number>,
}
export class TreeArena<T> implements IArena<T> {
	#arena = new Arena<Node<T>>()
	#rootIndex: number

	constructor(root: T) {
		this.#rootIndex = this.#arena.put({ data: root })
	}

	put(data: T, parent = this.#rootIndex): number {
		const index = this.#arena.put({ data, parent })
		this.addKid(parent, index)
		return index
	}

	get(index: number): T | undefined {
		return this.#arena.get(index)?.data
	}

	*getAll(index: number): Generator<T> {
		let i: number | undefined = index
		let node: Node<T> | undefined
		while (i !== undefined && (node = this.#arena.get(i))) {
			yield node.data
			i = node.parent
		}
	}

	free(index: number): void {
		for (const kid of this.getKids(index)) {
			this.free(kid)
		}
		this.#arena.free(index)
	}

	private addKid(parent: number, kid: number): void {
		(this.#arena.get(parent)!.children ??= new Set()).add(kid)
	}
	private getKids(index: number): Iterable<number> {
		return this.#arena.get(index)?.children ?? []
	}

	*[Symbol.iterator](): Iterator<T, any, undefined> {
		for (const { data } of this.#arena) {
			yield data
		}
	}
}
