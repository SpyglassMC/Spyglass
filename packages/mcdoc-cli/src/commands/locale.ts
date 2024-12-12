import type { Logger } from '@spyglassmc/core'
import { fileUtil } from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import * as mcdoc from '@spyglassmc/mcdoc'
import { resolve } from 'path'
import { pathToFileURL } from 'url'
import { createLogger, createProject, sortMaps, writeJson } from '../common.js'

interface Args {
	source: string
	output: string
	upgrade?: boolean
	gzip: boolean
	verbose: boolean
}
export async function localeCommand(args: Args) {
	const logger = createLogger(args.verbose)
	const project = await createProject(logger, args.source)

	const locale = new Map<string, string>()

	function add(name: string, desc: string) {
		if (locale.has(name)) {
			logger.warn(`Duplicate key ${name}`)
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
			for (const field of type.values) {
				if (field.desc) {
					add(`${name}.${field.identifier}`, field.desc)
				}
			}
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

	const outputFile = pathToFileURL(resolve(process.cwd(), args.output)).toString()

	if (args.upgrade) {
		const oldLocale = await readLocale(outputFile)
		const outputDir = fileUtil.getParentOfFile(NodeJsExternals, outputFile).toString()
		const entries = await NodeJsExternals.fs.readdir(outputDir)
		const others = entries.filter(e => e.isFile() && e.name.endsWith('.json'))
			.map(e => e.name.slice(0, e.name.length - '.json'.length))
		for (const key of others) {
			const otherFile = `${outputDir}${key}.json`
			if (otherFile === outputFile) {
				continue
			}
			logger.info(`Upgrading ${otherFile}`)
			const oldOther = await readLocale(otherFile)
			const other = upgradeLocale(oldOther, oldLocale, locale, logger)
			await writeJson(otherFile, sortMaps(other), args.gzip)
		}
	}

	await writeJson(outputFile, sortMaps(locale), args.gzip)

	await project.close()
}

type Locale = Map<string, string>

async function readLocale(path: string): Promise<Locale> {
	const data = await fileUtil.readJson(NodeJsExternals, path)
	const locale = new Map<string, string>()
	for (const [key, value] of Object.entries(data ?? {})) {
		if (typeof value === 'string') {
			locale.set(key, value)
		}
	}
	return locale
}

function upgradeLocale(other: Locale, oldBase: Locale, newBase: Locale, logger: Logger): Locale {
	const invertedNew = new Map<string, string[]>()
	for (const [key, value] of newBase.entries()) {
		const otherKeys = invertedNew.get(value)
		if (otherKeys) {
			invertedNew.set(value, [...otherKeys, key])
		} else {
			invertedNew.set(value, [key])
		}
	}

	const upgraded = new Map<string, string>()
	for (const [key, value] of other.entries()) {
		if (newBase.has(key)) {
			// Key exists, base value may have been altered.
			upgraded.set(key, value)
			continue
		}
		const baseValue = oldBase.get(key)
		if (!baseValue) {
			// Key was already removed previously. Prune.
			continue
		}
		const possibleKeys = invertedNew.get(baseValue) ?? []
		if (possibleKeys.length === 1) {
			logger.info('Moved key', key, '->', possibleKeys[0])
			upgraded.set(possibleKeys[0], value)
		} else {
			// Unknown move or removal. Keeping unused key for one cycle.
			upgraded.set(key, value)
		}
	}

	return upgraded
}
