export type MajorVersion = `1.${bigint}`
export namespace MajorVersion {
	/**
	 * @returns
	 * * `-1` if `a` is older than `b`.
	 * * `0` if `a` is the same as `b`.
	 * * `1` if `a` is newer than `b`.
	 */
	export function cmp(a: MajorVersion, b: MajorVersion): number {
		return Math.sign(Number(a) - Number(b))
	}
}

export interface VersionInfo {
	major: MajorVersion,
	id: string,
	name: string,
	isLatest: boolean,
}

// DOCS: Update here when format_version is changed.
export const PackVersionMap: Record<number, MajorVersion | undefined> = {
	5: '1.15',
	6: '1.16',
	7: '1.17',
	8: '1.18',
	9: '1.18',
	10: '1.19',
}

export interface PackMcmeta {
	pack: {
		pack_format: number,
	}
}
export namespace PackMcmeta {
	export function assert(data: any): asserts data is PackMcmeta {
		const format: string | undefined = data?.pack?.pack_format?.toString()
		if (!format) {
			throw new Error('“pack.pack_format” undefined')
		}
		if (!Object.keys(PackVersionMap).includes(format)) {
			throw new Error(`Unknown pack_format “${format}”`)
		}
	}
}
