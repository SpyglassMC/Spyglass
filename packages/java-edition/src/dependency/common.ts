export type ReleaseVersion = `1.${number}`
export namespace ReleaseVersion {
	/**
	 * @returns
	 * * `-1` if `a` is older than `b`.
	 * * `0` if `a` is the same as `b`.
	 * * `1` if `a` is newer than `b`.
	 */
	export function cmp(a: ReleaseVersion, b: ReleaseVersion): number {
		return Math.sign(Number(a.slice(2)) - Number(b.slice(2)))
	}
}

export interface VersionInfo {
	release: ReleaseVersion
	id: string
	name: string
	isLatest: boolean
}

export interface PackMcmeta {
	pack: {
		pack_format: number
	}
}
export namespace PackMcmeta {
	export function assert(data: any): asserts data is PackMcmeta {
		const format: string | undefined = data?.pack?.pack_format?.toString()
		if (!format) {
			throw new Error('“pack.pack_format” undefined')
		}
	}
}
