/**
 * Json replacer that writes bigints as a json string of the form `"$$type:bigint;$$value:91"`.
 * Intended to be used with `bigintJsonLosslessReviver`
 * @param _key The key at which the value lives
 * @param value The value to encode
 * @returns Replaced value
 */
export function bigintJsonLosslessReplacer(_key: string, value: any) {
	return typeof value === 'bigint'
		? `$$type:bigint;$$value:${value}`
		: value
}

/**
 * Json reviver that revives bigints encoded by `bigintJsonLosslessReplacer`
 * @param _key
 * @param value
 * @returns
 */
export function bigintJsonLosslessReviver(_key: string, value: any) {
	return typeof value === 'string' && value.startsWith('$$type:bigint;$$value:')
		? BigInt(value.substring(22))
		: value
}

/**
 * Json replacer that replaces bigints with raw json number literals, encoding the entire number.
 * @param _key The key at which the value lives
 * @param value The value to encode
 * @returns Replaced value
 */
export function bigintJsonNumberReplacer(_key: string, value: any) {
	return typeof value === 'bigint'
		? (JSON as any).rawJSON(value.toString())
		: value
}

/**
 * Json reviver that when encountering a number will decide whether that number needs to be
 * represented as a bigint in order to be lossless. Uses normal numbers whenever possible or required.
 * @param _key The key at which the value lives
 * @param value The value that was read
 * @param data Additional data, source includes the raw json value.
 * @returns The javascript value
 */
export function bigintJsonNumberReviver(_key: string, value: any, data?: { source?: string }) {
	return typeof value === 'number'
			&& data?.source !== undefined
			&& !data.source.includes('.')
			&& value.toString() !== data.source
		? BigInt(data.source)
		: value
}
