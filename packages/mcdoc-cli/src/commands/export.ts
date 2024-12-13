import * as mcdoc from '@spyglassmc/mcdoc'
import * as cp from 'child_process'
import { resolve } from 'path'
import { pathToFileURL } from 'url'
import { promisify } from 'util'
import { createLogger, createProject as createProject, sortMaps, writeJson } from '../common.js'

const execFile = promisify(cp.execFile)

interface Export {
	mcdoc: Map<string, mcdoc.McdocType>
	'mcdoc/dispatcher': Map<string, Map<string, mcdoc.McdocType>>
}

interface Args {
	source: string
	output: string
	gzip: boolean
	ref: boolean
	verbose: boolean
}
export async function exportCommand(args: Args) {
	const logger = createLogger(args.verbose)
	const project = await createProject(logger, args.source)

	const data: Export = {
		mcdoc: new Map(),
		'mcdoc/dispatcher': new Map(),
	}

	const symbols = project.symbols.getVisibleSymbols('mcdoc')
	for (const [name, symbol] of Object.entries(symbols)) {
		if (mcdoc.binder.TypeDefSymbolData.is(symbol.data)) {
			data.mcdoc.set(name, symbol.data.typeDef)
		}
	}
	const dispatchers = project.symbols.getVisibleSymbols('mcdoc/dispatcher')
	for (const [name, symbol] of Object.entries(dispatchers)) {
		const dispatcherMap = new Map()
		data['mcdoc/dispatcher'].set(name, dispatcherMap)
		for (const [id, member] of Object.entries(symbol.members ?? {})) {
			if (mcdoc.binder.TypeDefSymbolData.is(member.data)) {
				dispatcherMap.set(id, member.data.typeDef)
			}
		}
	}

	const output = {
		...args.ref ? { ref: (await execFile('git', ['rev-parse', 'HEAD'])).stdout.trim() } : {},
		mcdoc: sortMaps(data.mcdoc),
		'mcdoc/dispatcher': sortMaps(data['mcdoc/dispatcher']),
	}
	const outputFile = pathToFileURL(resolve(process.cwd(), args.output)).toString()
	await writeJson(outputFile, output, args.gzip)

	await project.close()
}
