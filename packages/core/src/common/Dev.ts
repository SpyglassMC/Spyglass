export const Dev = Object.freeze({
	assertNever(value: never): never {
		throw new Error(`'${String(value)}' is not of type 'never'`)
	},
	assertTrue(value: boolean, message: string): void {
		if (!value) {
			throw new Error(`Assertion failed: ${message}. '${value}' should be true.`)
		}
	},
	/**
	 * @returns An estimate of the memory taken by the given value, assuming objects are stored as array-like structures instead of dictionaries in the V8 engine.
	 */
	estimateMemoryUsage(value: unknown): number {
		const ByteToBits = 8
		const PointerSize = 8

		let ans = 0
		const calculatedObjects = new Set<object>()
		const stack: unknown[] = [value]

		while (stack.length) {
			const current = stack.pop()
			switch (typeof current) {
				case 'bigint': {
					const bits = Math.ceil(Math.log2(Number(current)))
					ans += (2 + Math.ceil(bits / (ByteToBits * PointerSize))) * PointerSize // https://stackoverflow.com/a/54298760
					break
				}
				case 'boolean':
					ans += PointerSize // Aggressive alignment estimation.
					break
				case 'number':
					ans += 8
					break
				case 'object':
					ans += PointerSize // Reference pointer.
					if (!current || calculatedObjects.has(current)) {
						break
					}
					ans += PointerSize // Header pointer.
					for (const value of Object.values(current)) {
						stack.push(value)
						ans += PointerSize // Aggressive padding estimation.
					}
					calculatedObjects.add(current)
					break
				case 'string':
					ans += current.length * 2
					break
				case 'symbol':
					ans += PointerSize
					break
				default:
					break
			}
		}

		return ans
	},
})
