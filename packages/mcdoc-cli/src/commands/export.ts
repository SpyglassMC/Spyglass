import { fileUtil } from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import * as mcdoc from '@spyglassmc/mcdoc'
import { resolve } from 'path'
import { pathToFileURL } from 'url'
import { createLogger, createService } from '../common.js'

interface Args {
	source: string
	output?: string
	verbose: boolean
}
export async function exportCommand(args: Args) {
	const logger = createLogger(args.verbose)
	const projectRoot = resolve(process.cwd(), args.source)
	const service = await createService(logger, projectRoot)

	const data: { mcdoc: Record<string, unknown> } = { mcdoc: {} }

	const symbols = service.project.symbols.getVisibleSymbols('mcdoc')
	for (const [name, symbol] of Object.entries(symbols)) {
		if (mcdoc.binder.TypeDefSymbolData.is(symbol.data)) {
			data.mcdoc[name] = symbol.data.typeDef
		}
	}

	const outputFile = pathToFileURL(resolve(process.cwd(), args.output ?? 'export.json')).toString()
	await Promise.all([
		fileUtil.writeFile(NodeJsExternals, outputFile, JSON.stringify(data, undefined, '\t')),
		fileUtil.writeGzippedJson(NodeJsExternals, outputFile + '.gz', data),
		service.project.close(),
	])
}
