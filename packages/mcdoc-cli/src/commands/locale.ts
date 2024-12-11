import * as mcdoc from '@spyglassmc/mcdoc'
import { resolve } from 'path'
import { createLogger, createService } from '../common.js'

interface Args {
	source: string
	output?: string
	verbose: boolean
}
export async function localeCommand(args: Args) {
	const logger = createLogger(args.verbose)
	const projectRoot = resolve(process.cwd(), args.source)
	const service = await createService(logger, projectRoot)

	const symbols = service.project.symbols.getVisibleSymbols('mcdoc')
	// TODO

	await service.project.close()
}
