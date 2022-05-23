export class Operations {
	private readonly undoOps: (() => unknown)[] = []
	private readonly redoOps: (() => unknown)[] = []

	set<O extends object, K extends keyof O>(obj: O, key: K, value: O[K]): void {
		const oldValue = obj[key]
		const op = () => { obj[key] = value }
		this.redoOps.push(op)
		this.undoOps.push(() => { obj[key] = oldValue })
		op()
	}

	undo(): void {
		for (let i = this.undoOps.length - 1; i >= 0; i--) {
			this.undoOps[i]()
		}
	}
	redo(): void {
		this.redoOps.forEach(f => f())
	}
}
