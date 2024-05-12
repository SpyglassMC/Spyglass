export class Operations {
	constructor(private readonly parent?: Operations) {}

	private readonly undoOps: (() => void)[] = []
	private readonly redoOps: (() => void)[] = []

	private addUndoOp(op: () => void): void {
		this.undoOps.push(op)
		this.parent?.addUndoOp(op)
	}
	private addRedoOp(op: () => void): void {
		this.redoOps.push(op)
		this.parent?.addRedoOp(op)
	}

	set<O extends object, K extends keyof O>(
		obj: O,
		key: K,
		value: O[K],
		receiver: any = obj,
	): void {
		const oldValue = Reflect.get(obj, key, receiver)
		const op = () => {
			if (Array.isArray(oldValue) && Array.isArray(value)) {
				console.log({ obj, key, oldValue, value, receiver })
				Reflect.set(obj, key, Array.from(value), receiver)
				// obj[key] = value
			} else {
				Reflect.set(obj, key, value, receiver)
			}
		}
		const undoOp = () => {
			Reflect.set(obj, key, oldValue, receiver)
		}
		this.addRedoOp(op)
		this.addUndoOp(undoOp)
		op()
	}

	undo(): void {
		for (let i = this.undoOps.length - 1; i >= 0; i--) {
			this.undoOps[i]()
		}
	}
	redo(): void {
		this.redoOps.forEach((op) => op())
	}
}
