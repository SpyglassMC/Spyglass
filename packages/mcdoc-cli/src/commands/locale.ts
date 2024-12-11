import { fileUtil } from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import { resolve } from 'path'
import { pathToFileURL } from 'url'
import { createLogger, createProject } from '../common.js'

interface Args {
	source: string
	output: string
	verbose: boolean
}
export async function localeCommand(args: Args) {
	const logger = createLogger(args.verbose)
	const project = await createProject(logger, args.source)

	const locale: Record<string, string> = {}

	function add(name: string, desc: string) {
		// TODO: handle duplicate names
		locale[name] = desc.replaceAll('\r', '').trim()
			.split('\n\n').map(line => line.trimStart()).join('\n')
	}

	function collect(name: string, type: mcdoc.McdocType) {
		if (type.kind === 'struct') {
			for (const field of type.fields) {
				if (field.kind === 'spread') {
					collect(name, field.type)
				} else if (field.desc) {
					const fieldName = typeof field.key === 'string'
						? `${name}.${field.key}`
						: `${name}.[${field.key.kind}]`
					add(fieldName, field.desc)
					// TODO: don't collect when struct is named
					collect(fieldName, field.type)
				}
			}
		}
		// TODO: handle other kinds?
	}

	const symbols = project.symbols.getVisibleSymbols('mcdoc')
	for (const [name, symbol] of Object.entries(symbols)) {
		if (mcdoc.binder.TypeDefSymbolData.is(symbol.data)) {
			if (name.match(/<anonymous \d+>$/)) {
				continue
			}
			collect(name, symbol.data.typeDef)
		}
	}

	const outputFile = pathToFileURL(resolve(process.cwd(), args.output)).toString()
	await Promise.all([
		fileUtil.writeFile(project.externals, outputFile, JSON.stringify(locale, undefined, 2)),
		fileUtil.writeGzippedJson(project.externals, `${outputFile}.gz`, locale),
	])

	await project.close()
}
