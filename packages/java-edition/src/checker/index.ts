import type * as core from '@spyglassmc/core'
import * as nbt from '@spyglassmc/nbt'
import { ReleaseVersion } from '../dependency/index.js'
import { unicodeEscapes } from './string.js'

export * from './string.js'

/**
 * NBT lists were heterogeneous before this release; afterwards the game's
 * parser accepts mixed element types.
 */
const HomogeneousListsUntil: ReleaseVersion = '1.21.5'

/**
 * The checker each node type had before {@link register} chained onto it, per
 * registry. Keeping it lets a second `register` call (e.g. a re-initialized
 * project) rebuild the chain from the original checker instead of stacking a
 * second copy of ours on top, which would report every diagnostic twice.
 */
const baseCheckers = new WeakMap<
	core.MetaRegistry,
	Map<string, core.Checker<any> | undefined>
>()

/**
 * Appends `extra` to the checker already registered for `type`, instead of
 * replacing it. `MetaRegistry.registerChecker` is a plain map write, so a
 * naive registration here would silently drop the checker that another
 * package registered for the same node type.
 *
 * The result stays synchronous when the existing checker is synchronous:
 * `checker.fallbackSync` warns about checkers that return a promise.
 */
function chain<N extends core.AstNode>(
	meta: core.MetaRegistry,
	type: N['type'],
	extra: core.SyncChecker<N>,
): void {
	let bases = baseCheckers.get(meta)
	if (!bases) {
		bases = new Map()
		baseCheckers.set(meta, bases)
	}
	if (!bases.has(type)) {
		bases.set(type, meta.hasChecker<N>(type) ? meta.getChecker<N>(type) : undefined)
	}
	const previous = bases.get(type) as core.Checker<N> | undefined
	meta.registerChecker<N>(type, (node, ctx) => {
		const result = previous?.(node, ctx)
		if (result instanceof Promise) {
			return result.then(() => {
				extra(node, ctx)
			})
		}
		extra(node, ctx)
		return undefined
	})
}

/**
 * Registers the java-edition-specific checks on top of the generic parsers and
 * checkers of `core`, `json`, and `nbt`. Must run after those packages have
 * registered theirs, as it chains onto whatever they registered.
 *
 * Registering `string` / `json:string` / `nbt:string` here also makes
 * `checker.fallback` stop descending at string nodes, which is why those
 * packages no longer need a no-op registration of their own.
 */
export function register(meta: core.MetaRegistry, release: ReleaseVersion): void {
	const escapes = unicodeEscapes(release)
	chain<core.StringNode>(meta, 'string', escapes)
	chain<core.StringBaseNode>(meta, 'json:string', escapes)
	chain<core.StringBaseNode>(meta, 'nbt:string', escapes)

	if (ReleaseVersion.cmp(release, HomogeneousListsUntil) < 0) {
		chain<nbt.NbtListNode>(meta, 'nbt:list', nbt.checker.listTypeHomogeneous)
	}
}
