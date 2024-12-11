import { fileUtil } from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import { resolve } from 'path'
import { pathToFileURL } from 'url'
import { createLogger, createProject as createProject } from '../common.js'

interface Args {
	source: string
	output: string
	verbose: boolean
}
export async function exportCommand(args: Args) {
	const logger = createLogger(args.verbose)
	const project = await createProject(logger, args.source)

	const data: { mcdoc: Record<string, unknown> } = { mcdoc: {} }

	const symbols = project.symbols.getVisibleSymbols('mcdoc')
	for (const [name, symbol] of Object.entries(symbols)) {
		if (mcdoc.binder.TypeDefSymbolData.is(symbol.data)) {
			data.mcdoc[name] = symbol.data.typeDef
		}
	}

	const outputFile = pathToFileURL(resolve(process.cwd(), args.output)).toString()
	await Promise.all([
		fileUtil.writeFile(project.externals, outputFile, JSON.stringify(data, undefined, 2)),
		fileUtil.writeGzippedJson(project.externals, `${outputFile}.gz`, data),
	])

	await project.close()
}
