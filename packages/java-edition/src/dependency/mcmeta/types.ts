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
	export function is(val: unknown): val is McmetaVersion {
		return (
			core.isObject(val)
			&& 'id' in val && typeof val.id === 'string'
			&& 'name' in val && typeof val.name === 'string'
			&& 'type' in val && (val.type === 'release' || val.type === 'snapshot')
			&& 'stable' in val && typeof val.stable === 'boolean'
			&& 'data_version' in val && typeof val.data_version === 'number'
			&& 'protocol_version' in val && typeof val.protocol_version === 'number'
			&& 'data_pack_version' in val && typeof val.data_pack_version === 'number'
			&& 'data_pack_version_minor' in val && typeof val.data_pack_version_minor === 'number'
			&& 'resource_pack_version' in val && typeof val.resource_pack_version === 'number'
			&& 'resource_pack_version_minor' in val
			&& typeof val.resource_pack_version_minor === 'number'
			&& 'build_time' in val && typeof val.build_time === 'string'
			&& 'release_time' in val && typeof val.release_time === 'string'
			&& 'sha1' in val && typeof val.sha1 === 'string'
		)
	}
}

export type McmetaVersions = [McmetaVersion, ...McmetaVersion[]]
export namespace McmetaVersions {
	export function assert(val: unknown): asserts val is McmetaVersions {
		if (!Array.isArray(val) || val.length === 0) {
			throw new Error('Expected non-empty array')
		}
		const badVersion = val.find((v) => !McmetaVersion.is(v))
		if (badVersion) {
			throw new Error(`Found malformed McmetaVersion: ${JSON.stringify(badVersion)}`)
		}
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
	export function is(val: unknown): val is MojangVersionManifestEntry {
		return core.isObject(val)
			&& 'id' in val && typeof val.id === 'string'
			&& 'type' in val && typeof val.type === 'string'
			&& 'url' in val && typeof val.url === 'string'
			&& 'time' in val && typeof val.time === 'string'
			&& 'releaseTime' in val && typeof val.releaseTime === 'string'
			&& 'sha1' in val && typeof val.sha1 === 'string'
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
	export function assert(val: unknown): asserts val is MojangVersionManifest {
		if (!(core.isObject(val) && 'versions' in val && Array.isArray(val.versions))) {
			throw new Error(`Missing versions array`)
		}
		const badEntry = val.versions.find((v) => !MojangVersionManifestEntry.is(v))
		if (badEntry) {
			throw new Error(`Found malformed MojangVersionManifestEntry: ${badEntry}`)
		}
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
	export function is(val: unknown): val is MojangClientJson {
		return core.isObject(val)
			&& 'downloads' in val && core.isObject(val.downloads)
			&& 'client' in val.downloads && core.isObject(val.downloads.client)
			&& 'url' in val.downloads.client && typeof val.downloads.client.url === 'string'
	}

	export function assert(val: unknown): asserts val is MojangClientJson {
		if (!is(val)) {
			throw new Error('Expected string at .downloads.client.url')
		}
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
	// ... other fields omitted
}
export namespace MojangVersionJson {
	export function is(val: unknown): val is MojangVersionJson {
		return core.isObject(val)
			&& 'name' in val && typeof val.name === 'string'
			&& 'pack_version' in val && core.isObject(val.pack_version)
			&& 'resource_major' in val.pack_version
			&& typeof val.pack_version.resource_major === 'number'
			&& 'resource_minor' in val.pack_version
			&& typeof val.pack_version.resource_minor === 'number'
			&& 'data_major' in val.pack_version && typeof val.pack_version.data_major === 'number'
			&& 'data_minor' in val.pack_version && typeof val.pack_version.data_minor === 'number'
			&& 'protocol_version' in val && typeof val.protocol_version === 'number'
			&& 'stable' in val && typeof val.stable === 'boolean'
			&& 'world_version' in val && typeof val.world_version === 'number'
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
