export interface VanillaResources {
	blocks: VanillaBlocks,
	commands: VanillaCommands,
	registries: VanillaRegistries,
}

export interface VanillaBlocks {
	[id: string]: {
		properties: {
			[name: string]: string[],
		},
		default: {
			[name: string]: string,
		},
	}
}

export type VanillaCommands = VanillaCommandRootNode

interface BaseNode {
	type: string,
	children?: {
		[name: string]: VanillaCommandNode,
	},
	executable?: boolean,
	redirect?: [string],
}

export interface VanillaCommandArgumentNode extends BaseNode {
	type: 'argument',
	parser: string,
	properties?: {
		[name: string]: any,
	},
}

export interface VanillaCommandLiteralNode extends BaseNode {
	type: 'literal',
}

export interface VanillaCommandRootNode extends BaseNode {
	type: 'root',
	children: {
		[command: string]: VanillaCommandLiteralNode,
	},
}

export type VanillaCommandNode =
	| VanillaCommandArgumentNode
	| VanillaCommandLiteralNode
	| VanillaCommandRootNode

export interface VanillaRegistries {
	[id: string]: string[]
}

export interface VersionManifest {
	latest: {
		release: string,
		snapshot: string,
	},
	versions: {
		id: string,
		type: 'snapshot' | 'release',
		url: string,
		time: string,
		releaseTime: string,
	}[],
}

export const enum VersionStatus {
	Generated = 1 << 0,
	ProcessedWithVariableName = 1 << 1,
	ProcessedWithStaticName = 1 << 2,
	ProcessedSimplifiedBlock = 1 << 3,
	Latest = 1 << 4,
}
