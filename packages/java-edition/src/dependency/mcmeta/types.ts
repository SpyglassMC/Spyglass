import * as core from '@spyglassmc/core'

export interface McmetaVersion {
	id: string
	name: string
	type: 'release' | 'snapshot'
	stable: boolean
	data_version: number
	protocol_version: number
	data_pack_version: number
	data_pack_version_minor: number
	resource_pack_version: number
	resource_pack_version_minor: number
	build_time: string
	release_time: string
	sha1: string
}
export namespace McmetaVersion {
	export function check(val: unknown): string | undefined {
		if (!core.isObject(val)) {
			return 'not an object'
		}
		if (!('id' in val && typeof val.id === 'string')) {
			return 'id is not a string'
		}
		if (!('name' in val && typeof val.name === 'string')) {
			return 'name is not a string'
		}
		if (!('type' in val && (val.type === 'release' || val.type === 'snapshot'))) {
			return "type is not 'release' or 'snapshot'"
		}
		if (!('stable' in val && typeof val.stable === 'boolean')) {
			return 'stable is not a boolean'
		}
		if (!('data_version' in val && typeof val.data_version === 'number')) {
			return 'data_version is not a number'
		}
		if (!('protocol_version' in val && typeof val.protocol_version === 'number')) {
			return 'protocol_version is not a number'
		}
		if (!('data_pack_version' in val && typeof val.data_pack_version === 'number')) {
			return 'data_pack_version is not a number'
		}
		if (!('data_pack_version_minor' in val && typeof val.data_pack_version_minor === 'number')) {
			return 'data_pack_version_minor is not a number'
		}
		if (!('resource_pack_version' in val && typeof val.resource_pack_version === 'number')) {
			return 'resource_pack_version is not a number'
		}
		if (
			!('resource_pack_version_minor' in val
				&& typeof val.resource_pack_version_minor === 'number')
		) {
			return 'resource_pack_version_minor is not a number'
		}
		if (!('build_time' in val && typeof val.build_time === 'string')) {
			return 'build_time is not a string'
		}
		if (!('release_time' in val && typeof val.release_time === 'string')) {
			return 'release_time is not a string'
		}
		if (!('sha1' in val && typeof val.sha1 === 'string')) {
			return 'sha1 is not a string'
		}
		return undefined
	}

	export function assert(val: unknown): asserts val is McmetaVersion {
		const error = check(val)
		if (error !== undefined) {
			throw new Error(error)
		}
	}

	export function is(val: unknown): val is McmetaVersion {
		return check(val) === undefined
	}
}

export type McmetaVersions = [McmetaVersion, ...McmetaVersion[]]
export namespace McmetaVersions {
	export function check(val: unknown): string | undefined {
		if (!Array.isArray(val) || val.length === 0) {
			return 'not a non-empty array'
		}
		const badVersion = val.find((v) => !McmetaVersion.is(v))
		if (badVersion) {
			const error = McmetaVersion.check(badVersion)
			return `malformed McmetaVersion ${JSON.stringify(badVersion)}: ${error}`
		}
		return undefined
	}

	export function assert(val: unknown): asserts val is McmetaVersions {
		const error = check(val)
		if (error !== undefined) {
			throw new Error(error)
		}
	}

	export function is(val: unknown): val is McmetaVersions {
		return check(val) === undefined
	}
}

/**
 * https://minecraft.wiki/w/Version_manifest.json
 */
export interface MojangVersionManifestEntry {
	id: string
	type: string
	/**
	 * URL to download a `MojangClientJson`
	 */
	url: string
	time: string
	releaseTime: string
	sha1: string
	// ... other fields omitted
}
export namespace MojangVersionManifestEntry {
	export function check(val: unknown): string | undefined {
		if (!core.isObject(val)) {
			return 'not an object'
		}
		if (!('id' in val && typeof val.id === 'string')) {
			return 'id is not a string'
		}
		if (!('type' in val && typeof val.type === 'string')) {
			return 'type is not a string'
		}
		if (!('url' in val && typeof val.url === 'string')) {
			return 'url is not a string'
		}
		if (!('time' in val && typeof val.time === 'string')) {
			return 'time is not a string'
		}
		if (!('releaseTime' in val && typeof val.releaseTime === 'string')) {
			return 'releaseTime is not a string'
		}
		if (!('sha1' in val && typeof val.sha1 === 'string')) {
			return 'sha1 is not a string'
		}
		return undefined
	}

	export function assert(val: unknown): asserts val is MojangVersionManifestEntry {
		const error = check(val)
		if (error !== undefined) {
			throw new Error(error)
		}
	}

	export function is(val: unknown): val is MojangVersionManifestEntry {
		return check(val) === undefined
	}
}

/**
 * https://minecraft.wiki/w/Version_manifest.json
 */
export interface MojangVersionManifest {
	versions: MojangVersionManifestEntry[]
	// ... other fields omitted
}
export namespace MojangVersionManifest {
	export function check(val: unknown): string | undefined {
		if (!core.isObject(val)) {
			return 'not an object'
		}
		if (!('versions' in val && Array.isArray(val.versions))) {
			return 'versions is not an array'
		}
		const badEntry = val.versions.find((v) => !MojangVersionManifestEntry.is(v))
		if (badEntry) {
			const error = MojangVersionManifestEntry.check(badEntry)
			return `malformed MojangVersionManifestEntry ${JSON.stringify(badEntry)}: ${error}`
		}
		return undefined
	}

	export function assert(val: unknown): asserts val is MojangVersionManifest {
		const error = check(val)
		if (error !== undefined) {
			throw new Error(error)
		}
	}

	export function is(val: unknown): val is MojangVersionManifest {
		return check(val) === undefined
	}
}

/**
 * https://minecraft.wiki/w/Client.json
 */
export interface MojangClientJson {
	downloads: {
		client: {
			/**
			 * URL to download a client Jar, whicn includes a `MojangVersionJson`
			 */
			url: string
		}
		// ... other fields omitted
	}
	// ... other fields omitted
}
export namespace MojangClientJson {
	export function check(val: unknown): string | undefined {
		if (!core.isObject(val)) {
			return 'not an object'
		}
		if (!('downloads' in val && core.isObject(val.downloads))) {
			return 'downloads is not an object'
		}
		if (!('client' in val.downloads && core.isObject(val.downloads.client))) {
			return 'downloads.client is not an object'
		}
		if (!('url' in val.downloads.client && typeof val.downloads.client.url === 'string')) {
			return 'downloads.client.url is not a string'
		}
		return undefined
	}

	export function assert(val: unknown): asserts val is MojangClientJson {
		const error = check(val)
		if (error !== undefined) {
			throw new Error(error)
		}
	}

	export function is(val: unknown): val is MojangClientJson {
		return check(val) === undefined
	}
}

/**
 * https://minecraft.wiki/w/Version.json
 */
export interface MojangVersionJson {
	name: string
	pack_version: {
		resource_major: number
		resource_minor: number
		data_major: number
		data_minor: number
	}
	protocol_version: number
	stable: boolean
	world_version: number
	build_time: string
	// ... other fields omitted
}
export namespace MojangVersionJson {
	export function check(val: unknown): string | undefined {
		if (!core.isObject(val)) {
			return 'not an object'
		}
		if (!('name' in val && typeof val.name === 'string')) {
			return 'name is not a string'
		}
		if (!('pack_version' in val && core.isObject(val.pack_version))) {
			return 'pack_version is not an object'
		}
		if (
			!('resource_major' in val.pack_version
				&& typeof val.pack_version.resource_major === 'number')
		) {
			return 'pack_version.resource_major is not a number'
		}
		if (
			!('resource_minor' in val.pack_version
				&& typeof val.pack_version.resource_minor === 'number')
		) {
			return 'pack_version.resource_minor is not a number'
		}
		if (!('data_major' in val.pack_version && typeof val.pack_version.data_major === 'number')) {
			return 'pack_version.data_major is not a number'
		}
		if (!('data_minor' in val.pack_version && typeof val.pack_version.data_minor === 'number')) {
			return 'pack_version.data_minor is not a number'
		}
		if (!('protocol_version' in val && typeof val.protocol_version === 'number')) {
			return 'protocol_version is not a number'
		}
		if (!('stable' in val && typeof val.stable === 'boolean')) {
			return 'stable is not a boolean'
		}
		if (!('world_version' in val && typeof val.world_version === 'number')) {
			return 'world_version is not a number'
		}
		if (!('build_time' in val && typeof val.build_time === 'string')) {
			return 'build_time is not a string'
		}
		return undefined
	}

	export function assert(val: unknown): asserts val is MojangVersionJson {
		const error = check(val)
		if (error !== undefined) {
			throw new Error(error)
		}
	}

	export function is(val: unknown): val is MojangVersionJson {
		return check(val) === undefined
	}
}

export interface McmetaSummary {
	blocks: McmetaStates
	commands: McmetaCommands
	fluids: McmetaStates
	registries: McmetaRegistries
}

export interface McmetaStates {
	[id: string]: [{ [name: string]: string[] }, { [name: string]: string }]
}

export type McmetaCommands = RootTreeNode

interface BaseTreeNode {
	type: string
	children?: { [name: string]: CommandTreeNode }
	executable?: boolean
	redirect?: [string]
}

export interface ArgumentTreeNode extends BaseTreeNode {
	type: 'argument'
	parser: string
	properties?: { [name: string]: any }
}

export interface LiteralTreeNode extends BaseTreeNode {
	type: 'literal'
}

export interface RootTreeNode extends BaseTreeNode {
	type: 'root'
	children: { [command: string]: LiteralTreeNode }
}

export type CommandTreeNode = ArgumentTreeNode | LiteralTreeNode | RootTreeNode

export interface McmetaRegistries {
	[id: string]: string[]
}
