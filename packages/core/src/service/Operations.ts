export class Operations {
	private readonly undoOps: (() => unknown)[] = []
	private readonly redoOps: (() => unknown)[] = []

	set<O extends object, K extends keyof O>(obj: O, key: K, value: O[K]): void {
		const oldValue = obj[key]
		const op = () => { obj[key] = value }
		this.redoOps.push(op)
		this.undoOps.unshift(() => { obj[key] = oldValue })
		op()
	}

	undo(): void {
		this.undoOps.forEach(f => f())
	}
	redo(): void {
		this.redoOps.forEach(f => f())
	}
}
