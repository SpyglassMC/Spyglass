export const Dev = Object.freeze({
	assertNever(value: never): never {
		throw new Error(`'${String(value)}' is not of type 'never'`)
	},
})
