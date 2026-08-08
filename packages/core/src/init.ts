import type { Externals, Logger } from './common/index.js'
import * as dependency from './dependency/index.js'
import type { ProjectInitializer } from './service/Project.js'

/**
 * Default {@link ProjectInitializer} provided by `@spyglassmc/core` that
 * fetches and registers Unicode data (`UnicodeData.txt` + `Blocks.txt`)
 * for the `\N{…}` string escape parser and completion.
 *
 * Downstream consumers should invoke this from their own initializer, e.g.:
 * ```ts
 * export const initialize: core.ProjectInitializer = async (ctx) => {
 *   await core.initialize(ctx)
 *   // … other setup
 * }
 * ```
 *
 * Network and parsing errors are logged and swallowed - the parser will
 * simply reject every `\N{…}` escape if registration fails.
 */
export const initialize: ProjectInitializer = async ({ externals, logger, meta }) => {
	const data = await fetchWithLogging(externals, logger)
	if (!data) {
		return
	}
	meta.registerSymbolRegistrar('unicode-data', {
		checksum: data.checksum,
		registrar: dependency.symbolRegistrar(data),
	})
}

async function fetchWithLogging(externals: Externals, logger: Logger) {
	try {
		return await dependency.getUnicodeData(externals, logger)
	} catch (e) {
		logger.error('[core] [unicode] Failed fetching Unicode data', e)
		return undefined
	}
}
