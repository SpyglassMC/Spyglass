import * as core from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import * as mcdoc from '@spyglassmc/mcdoc'
import { resolve } from 'path'
import { pathToFileURL } from 'url'

export function createLogger(verbose?: boolean): core.Logger {
	return {
		log: (...args: any[]) => verbose ? console.log(...args) : {},
		info: (...args: any[]) => verbose ? console.info(...args) : {},
		warn: (...args: any[]) => console.warn(...args),
		error: (...args: any[]) => console.error(...args),
	}
}

export async function createService(
	logger: core.Logger,
	projectRoot: string,
): Promise<core.Service> {
	const cacheRoot = resolve(process.cwd(), '.cache')

	const service = new core.Service({
		logger,
		profilers: new core.ProfilerFactory(logger, [
			'project#init',
			'project#ready',
			'project#ready#bind',
		]),
		project: {
			cacheRoot: core.fileUtil.ensureEndingSlash(pathToFileURL(cacheRoot).toString()),
			defaultConfig: core.ConfigService.merge(core.VanillaConfig, {
				env: { dependencies: [] },
			}),
			externals: NodeJsExternals,
			initializers: [mcdoc.initialize],
			projectRoots: [core.fileUtil.ensureEndingSlash(pathToFileURL(projectRoot).toString())],
		},
	})

	await service.project.ready()
	await service.project.cacheService.save()

	return service
}
