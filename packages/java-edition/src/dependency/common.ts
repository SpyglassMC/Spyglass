export interface GameVersion {
	/**
	 * ID of the version as specified in [`version_manifest.json`](https://piston-meta.mojang.com/mc/game/version_manifest.json).
	 *
	 * @example `1.20-rc1`
	 */
	id: string
	/**
	 * Human-readable name of the version as specified in the game client jar's `version.json` file.
	 *
	 * @example `1.20 Release Candidate 1`
	 */
	name: string
}

// DOCS: Update here when format_version is changed.
/**
 * A map from `pack_format` numbers to a RegExp. The latest version whose `release_target` matches the RegExp should be used.
 */
export const PackVersionMap: Record<number, RegExp | undefined> = {
	5: /^1\.15.*$/,
	6: /^1\.16.*$/,
	7: /^1\.17.*$/,
	8: /^1\.18(\.1)?$/,
	9: /^1\.18.*$/,
	10: /^1\.19(\.[1-3])?$/,
	12: /^1\.19.*$/,
	15: /^1\.20(\.1)?$/,
	18: /^1\.20\.2$/,
	26: /^1\.20\.[3-4]$/,
	41: /^1\.20\.[5-6]$/,
}

export interface PackMcmeta {
	pack: {
		pack_format: number
	}
}
export namespace PackMcmeta {
	export function assert(data: any): asserts data is PackMcmeta {
		const format: unknown = data?.pack?.pack_format
		// eslint-disable-next-line no-restricted-syntax
		if (!(typeof format === 'number' && Number.isInteger(format))) {
			throw new Error('Expected pack.pack_format to be an integer ')
		}
	}
}
