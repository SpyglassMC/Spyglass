import type { VanillaCommandRootNode } from '@spyglassmc/vanilla-resource'
import { Tree1_15 } from './1.15'
import { Tree1_16 } from './1.16'
import { Tree1_17 } from './1.17'
import type { PartialRootTreeNode, RootTreeNode } from './type'
import { merge } from './util'

type PatchedVersion = '1.15' | '1.16' | '1.17'

/* istanbul ignore next */
/**
 * The registry for mcfunction command trees.
 * This is a singleton; use the `instance` static property to get an instance. 
 */
export class CommandTreeRegistry {
	readonly #trees = new Map<string, RootTreeNode>()

	/**
	 * @throws When there's no patched command tree for the version.
	 */
	private static getTreePatch(version: string): PartialRootTreeNode {
		switch (version) {
			case '1.15':
				return Tree1_15
			case '1.16':
				return Tree1_16
			case '1.17':
				return Tree1_17
			default:
				throw new Error(`No patched command tree for version “${version}”`)
		}
	}

	/**
	 * Register command tree for a version that has a built-in tree patch.
	 * 
	 * @param version The game version. e.g. `1.15`.
	 * @param vanillaTree The vanilla command tree for this version.
	 */
	public register(version: PatchedVersion, vanillaTree: VanillaCommandRootNode): void
	/**
	 * Register command tree for an arbitrary version.
	 * 
	 * @param version The game version. e.g. `1.15-tdn`.
	 * @param vanillaTree The vanilla command tree for this version.
	 * @param treePatch A custom command tree patch that will be merged onto the `vanillaTree`.
	 */
	public register(version: string, vanillaTree: VanillaCommandRootNode, treePatch: PartialRootTreeNode): void
	public register(version: string, vanillaTree: VanillaCommandRootNode, treePatch?: PartialRootTreeNode): void {
		this.#trees.set(version, merge(vanillaTree as RootTreeNode, treePatch ?? CommandTreeRegistry.getTreePatch(version)))
	}

	/**
	 * @throws When there's no command tree associated with the version.
	 */
	public get(version: string): RootTreeNode {
		const ans = this.#trees.get(version)
		if (!ans) {
			throw new Error(`No command tree exist for version “${version}”`)
		}
		return ans
	}

	/**
	 * An instance of `CommandTreeRegistry`.
	 */
	public static get instance(): CommandTreeRegistry {
		return this._instance ?? (this._instance = new CommandTreeRegistry())
	}
	private constructor() {
		if (CommandTreeRegistry._instance) {
			throw new Error('Use the `instance` static property to get an instance.')
		}
	}
	private static _instance: CommandTreeRegistry
}
