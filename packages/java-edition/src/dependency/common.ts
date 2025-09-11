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

export interface VersionInfo {
	release: ReleaseVersion
	id: string
	name: string
}

export namespace PackMcmeta {
	export function readPackFormat(data: any): number {
		const pack = data?.pack
		if (!pack) {
			throw new Error('“pack” is not set')
		}

		const max_format = pack.max_format
		if (typeof max_format === 'number') {
			return max_format
		}
		if (Array.isArray(max_format) && max_format.length > 0 && typeof max_format[0] === 'number') {
			return pack.max_format[0] // TODO: Do we need the minor version as well?
		}
		const supported = pack.supported_formats
		if (Array.isArray(supported) && supported.length === 2 && typeof supported[1] === 'number') {
			return supported[1]
		}
		if (typeof supported === 'object' && typeof supported?.max_inclusive === 'number') {
			return supported.max_inclusive
		}
		const format = pack.pack_format
		if (typeof format === 'number') {
			return format
		}
		throw new Error('“pack.pack_format” is not a number')
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
	format: number
}
