/**
 * `rfdc` cannot handle objects like `{ valueNode: V, children: [V] }` properly (the `V` will be cloned to
 * two different objects). This method does not have such problem.
 */
export function deepClone<T>(ele: T, references = new Map()): T {
	if (typeof ele !== 'object' || ele === null) {
		return ele
	} else if (references.has(ele)) {
		return references.get(ele)
	}
	let ans: any
	if (Array.isArray(ele)) {
		ans = deepCloneArray(ele, references)
	} else if (ele instanceof Date) {
		ans = new Date(ele)
		references.set(ele, ans)
	} else if (ele instanceof Map) {
		ans = new Map(deepCloneArray(Array.from(ele), references))
		references.set(ele, ans)
	} else if (ele instanceof Set) {
		ans = new Set(deepCloneArray(Array.from(ele), references))
		references.set(ele, ans)
	} else {
		ans = deepCloneObject(ele as unknown as object, references)
	}
	return ans
}

function deepCloneArray<T>(arr: T[], references: Map<object, object>): T[] {
	const ans: T[] = []
	references.set(arr, ans)
	for (const ele of arr) {
		ans.push(deepClone(ele, references))
	}
	return ans
}

function deepCloneObject<T extends object>(obj: T, references: Map<object, object>): T {
	const ans: any = {} // Object.create(Object.getPrototypeOf(obj)) - Setting prototypes is slow.
	references.set(obj, ans)
	for (const [key, value] of Object.entries(obj)) {
		ans[key] = deepClone(value, references)
	}
	return ans
}
