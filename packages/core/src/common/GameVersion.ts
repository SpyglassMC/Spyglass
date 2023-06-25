export interface GameVersion {
	/**
	 * Identifier of the version.
	 *
	 * e.g. for Java Edition, could be the `"id"` specified in [`version_manifest.json`](https://piston-meta.mojang.com/mc/game/version_manifest.json).
	 *
	 * @example `1.20-rc1`
	 */
	id: string
	/**
	 * Human-readable name of the version.
	 *
	 * e.g. for Java Edition, could be the name specified in the game client jar's `version.json` file.
	 *
	 * @example `1.20 Release Candidate 1`
	 */
	name: string
}

/**
 * A comparator for a finite ordered list of strings.
 */
class OrderedStringComparator {
	#valueMap: Map<string, number>
	#latestString: string

	/**
	 * @param strings Sorted from smallest to biggest
	 */
	constructor(strings: readonly string[]) {
		if (!strings.length) {
			throw new Error('list is empty')
		}

		this.#latestString = strings[0]
		this.#valueMap = new Map()
		for (const [i, version] of strings.entries()) {
			this.#valueMap.set(version, i)
		}
	}

	/**
	 * @returns
	 * * Negative if `a` is smaller than `b`
	 * * 0 if `a` equals `b`
	 * * Positive if `a` is larger than `b`
	 */
	cmp(a: string, b: string): number {
		const [valueA, valueB] = [a, b].map((str) => {
			const value = this.#valueMap.get(str)
			if (value === undefined) {
				throw new Error(`Out of domain '${str}'`)
			}
			return value
		})
		return valueA - valueB
	}

	isLargest(v: string): boolean {
		return v === this.#latestString
	}
}

export class GameVersionComparator extends OrderedStringComparator {
	/**
	 * @param versions Sorted from latest to oldest
	 */
	constructor(versions: readonly GameVersion[]) {
		super(versions.map(GameVersionComparator.#getId).reverse())
	}

	/**
	 * @param a `GameVersion` or version ID.
	 * @param b `GameVersion` or version ID.
	 *
	 * @returns
	 * * Negative if `a` is older than `b`
	 * * 0 if `a` is the same version as `b`
	 * * Positive if `a` is newer than `b`
	 */
	override cmp(a: GameVersion | string, b: GameVersion | string): number {
		return super.cmp(
			GameVersionComparator.#getId(a),
			GameVersionComparator.#getId(b),
		)
	}

	/**
	 * @param v `GameVersion` or version ID.
	 * @returns If the version is the latest version.
	 */
	isLatest(v: GameVersion | string): boolean {
		return this.isLargest(GameVersionComparator.#getId(v))
	}

	static #getId(v: GameVersion | string): string {
		return typeof v === 'string' ? v : v.id
	}
}
