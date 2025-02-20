import type * as core from '@spyglassmc/core'

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

	/**
	 * @returns `true` if `version` is newer than `since` (inclusive) and older
	 * than `until` (exclusive)
	 */
	export function isBetween(
		version: ReleaseVersion,
		since: ReleaseVersion,
		until: ReleaseVersion,
	): boolean {
		return cmp(version, since) >= 0 && cmp(version, until) < 0
	}
}

export type VersionInfoReason = 'auto' | 'config' | 'fallback'

export interface VersionInfo {
	release: ReleaseVersion
	id: string
	name: string
	reason: VersionInfoReason
}

export interface PackMcmeta {
	pack: { pack_format: number }
}
export namespace PackMcmeta {
	export function assert(data: any): asserts data is PackMcmeta {
		const format: string | undefined = data?.pack?.pack_format?.toString()
		if (!format) {
			throw new Error('“pack.pack_format” undefined')
		}
	}

	export async function getType(packRoot: string, externals: core.Externals) {
		const dir = await externals.fs.readdir(packRoot)
		const isResourcePack = dir.some(e => e.isDirectory() && e.name === 'assets')
			&& !dir.some(e => e.isDirectory() && e.name === 'data')
		return isResourcePack ? 'assets' : 'data'
	}
}

export interface PackInfo {
	type: 'data' | 'assets'
	packRoot: string
	packMcmeta: PackMcmeta | undefined
	versionInfo: VersionInfo
}
