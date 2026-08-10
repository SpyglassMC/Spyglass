import * as dependency from './dependency/index.js'
import type { SyncProjectInitializer } from './service/Project.js'

/**
 * Default project initializer provided by `@spyglassmc/core` that registers
 * the bundled Unicode data (`UnicodeData.txt` + `Blocks.txt`) for the `\N{…}`
 * string escape parser and completion.
 *
 * Downstream consumers should invoke this from their own initializer, e.g.:
 * ```ts
 * export const initialize: core.ProjectInitializer = async (ctx) => {
 *   core.initialize(ctx)
 *   // … other setup
 * }
 * ```
 */
export const initialize: SyncProjectInitializer = ({ meta }) => {
	const data = dependency.getUnicodeData()
	meta.registerSymbolRegistrar('unicode-data', {
		checksum: data.checksum,
		registrar: dependency.symbolRegistrar(data),
	})
}
