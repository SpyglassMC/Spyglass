function isObject(value: any): value is Exclude<object, Array<any>> {
	return value && typeof value === 'object' && !Array.isArray(value)
}

export function merge<T extends Record<string, any>>(a: T, b: Record<string, any>): T {
	const ans = JSON.parse(JSON.stringify(a))
	for (const key of Object.keys(b)) {
		if (isObject(ans[key]) && isObject(b[key])) {
			merge(ans[key], b[key])
		} else if (b[key] === undefined) {
			delete ans[key]
		} else {
			ans[key] === b[key]
		}
	}
	return ans
}
