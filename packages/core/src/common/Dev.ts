export namespace Dev {
	export function assertDefined<T>(
		value: T,
	): asserts value is Exclude<T, undefined> {
		if (value === undefined) {
			throw new Error(`'${Dev.stringify(value)}' is 'undefined'`)
		}
	}
	export function assertNever(value: never): never {
		throw new Error(`'${Dev.stringify(value)}' is not of type 'never'`)
	}
	export function assertTrue(value: boolean, message: string): void {
		if (!value) {
			throw new Error(
				`Assertion failed: ${message}. '${
					Dev.stringify(
						value,
					)
				}' should be true.`,
			)
		}
	}
	/**
	 * @returns An estimate of the memory taken by the given value, assuming objects are stored as array-like structures instead of dictionaries in the V8 engine.
	 */
	export function estimateMemoryUsage(value: unknown): number {
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
					ans += (2 + Math.ceil(bits / (ByteToBits * PointerSize))) *
						PointerSize // https://stackoverflow.com/a/54298760
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
	}
	export function stringify(value: unknown): string {
		if (value && typeof value === 'object') {
			try {
				const seen = new Set<object>()
				return JSON.stringify(value, (_k, v) => {
					if (v && typeof v === 'object') {
						return seen.has(v) ? '[Circular]' : (seen.add(v), v)
					} else {
						return v
					}
				})
			} catch (ignored) {
				// Most likely "Maximum callstack size exceeded".
				// Fall back to a shallow string representation.
				return `{ ${
					Object.entries(value)
						.map(([k, v]) => `'${k}': '${String(v)}'`)
						.join(', ')
				} }`
			}
		} else if (typeof value === 'symbol') {
			// JavaScript does not convert `Symbol`s to strings implicitly.
			return String(value)
		} else {
			return `${value}`
		}
	}
}
