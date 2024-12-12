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

export async function createProject(
	logger: core.Logger,
	root: string,
): Promise<core.Project> {
	const cacheRoot = resolve(process.cwd(), '.cache')
	const projectRoot = resolve(process.cwd(), root)

	const project = new core.Project({
		logger,
		profilers: new core.ProfilerFactory(logger, [
			'project#init',
			'project#ready',
			'project#ready#bind',
		]),
		cacheRoot: core.fileUtil.ensureEndingSlash(pathToFileURL(cacheRoot).toString()),
		defaultConfig: core.ConfigService.merge(core.VanillaConfig, {
			env: { dependencies: [] },
		}),
		externals: NodeJsExternals,
		initializers: [mcdoc.initialize],
		projectRoots: [core.fileUtil.ensureEndingSlash(pathToFileURL(projectRoot).toString())],
	})

	await project.ready()
	await project.cacheService.save()

	return project
}

export function sortMaps(data: unknown): unknown {
	if (data instanceof Map) {
		return Object.fromEntries(
			[...data.entries()]
				.sort((a, b) => a[0].localeCompare(b[0]))
				.map(([k, v]) => [k, sortMaps(v)]),
		)
	}
	return data
}

export async function writeJson(path: string, data: unknown, gzip: boolean) {
	const contents = JSON.stringify(data, undefined, '\t') + '\n'
	await core.fileUtil.writeFile(NodeJsExternals, path, contents)
	if (gzip) {
		await core.fileUtil.writeGzippedJson(NodeJsExternals, `${path}.gz`, data)
	}
}
