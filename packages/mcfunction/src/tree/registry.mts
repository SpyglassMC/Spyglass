import type { PartialRootTreeNode, RootTreeNode } from './type.mjs'
import { merge } from '@spyglassmc/core'

/* istanbul ignore next */
/**
 * The registry for mcfunction command trees.
 * This is a singleton; use the `instance` static property to get an instance. 
 */
export class CommandTreeRegistry {
	readonly #trees = new Map<string, RootTreeNode>()

	/**
	 * Register command tree for an arbitrary version.
	 * 
	 * @param version The game version. e.g. `1.15-tdn`.
	 * @param tree The command tree for this version.
	 * @param treePatch A custom command tree patch that will be merged onto `tree`.
	 */
	public register(version: string, tree: RootTreeNode, treePatch?: PartialRootTreeNode): void {
		this.#trees.set(version, treePatch ? merge(tree, treePatch) : tree)
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
