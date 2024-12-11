import { fileUtil } from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import { resolve } from 'path'
import { pathToFileURL } from 'url'
import { createLogger, createProject, sortMaps } from '../common.js'

interface Args {
	source: string
	output: string
	verbose: boolean
}
export async function localeCommand(args: Args) {
	const logger = createLogger(args.verbose)
	const project = await createProject(logger, args.source)

	const locale = new Map<string, string>()

	function add(name: string, desc: string) {
		if (locale.has(name)) {
			logger.warn(`Duplicate key, overwriting ${name}`)
		}
		locale.set(
			name,
			desc.replaceAll('\r', '').trim()
				.split('\n\n').map(line => line.trimStart()).join('\n'),
		)
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
					collect(fieldName, field.type)
				}
			}
		} else if (type.kind === 'union') {
			type.members.forEach((member, i) => {
				collect(name, member)
			})
		} else if (type.kind === 'enum') {
			// for (const field of type.values) {
			// 	if (field.desc) {
			// 		add(`${name}.${field.identifier}`, field.desc)
			// 	}
			// }
		} else if (type.kind === 'list') {
			collect(name, type.item)
		} else if (type.kind === 'tuple') {
			for (const item of type.items) {
				collect(name, item)
			}
		} else if (type.kind === 'template') {
			collect(name, type.child)
		} else if (type.kind === 'concrete') {
			collect(name, type.child)
			for (const arg of type.typeArgs) {
				collect(name, arg)
			}
		} else if (type.kind === 'indexed') {
			collect(name, type.child)
		}
	}

	const symbols = project.symbols.getVisibleSymbols('mcdoc')
	for (const [name, symbol] of Object.entries(symbols)) {
		if (name.match(/<anonymous \d+>$/)) {
			continue
		}
		if (symbol.desc) {
			add(name, symbol.desc)
		}
		if (mcdoc.binder.TypeDefSymbolData.is(symbol.data)) {
			collect(name, symbol.data.typeDef)
		}
	}

	const output = sortMaps(locale)
	const outputFile = pathToFileURL(resolve(process.cwd(), args.output)).toString()
	await Promise.all([
		fileUtil.writeFile(project.externals, outputFile, JSON.stringify(output, undefined, '\t')),
		fileUtil.writeGzippedJson(project.externals, `${outputFile}.gz`, output),
	])

	await project.close()
}
