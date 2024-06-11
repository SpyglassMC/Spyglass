import { join, parse } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import fs from 'fs-extra'
import lineColumn from 'line-column'

import type { AstNode, Service } from '@spyglassmc/core'
import type walk from 'klaw'
import type { Logger } from '../index.js'

type Args = {
	locale?: boolean
	module?: boolean
	pretty?: boolean
	verbose?: boolean
	dry?: boolean
}

export async function generate(
	project_path: string,
	generated_path: string,
	args: Args,
	service: Service,
	logger: Logger,
) {
	let errors = 0

	const locales: Record<string, string> = {}

	const project_path_uri = pathToFileURL(project_path).toString() + '/'

	const module_paths = new Set<string>()

	const modules: Record<string, {
		dependency_symbols: Record<string, unknown>
		symbols: Record<string, unknown>
	}> = {}

	const new_symbols: {
		dependency_symbols: Record<string, unknown>
		symbols: Record<string, {
			available: string[]
			members: Record<string, unknown>
		}>
	} = {
		dependency_symbols: Object.fromEntries(
			Object.entries(service.project.symbols.getVisibleSymbols('mcdoc')).map(
				([key, value]) => {
					/* @ts-ignore */
					const _value = value.data?.typeDef as any
					if (
						_value && value.definition && value.definition.length !== 0 &&
						value.reference?.length !== 0
					) {
						_value.module_path =
							value.definition[0].uri.split(project_path_uri)[1]

						module_paths.add(_value.module_path)
						/* @ts-ignore */
						return [key, _value]
					} else {
						return ['key', undefined]
					}
				},
			),
		),
		symbols: {},
	}

	const disableCruft = true

	const dispatched_symbol_types = Object.entries(
		service.project.symbols.getVisibleSymbols('mcdoc/dispatcher'),
	)

	const key_blacklist = new RegExp(
		`^(?:${['parentMap', 'parent', 'parentSymbol'].join(')|(?:')})$`,
	)

	const replacer = (key: string, value: any) => {
		const remove = key_blacklist.test(key)
		return remove ? undefined : value
	}

	for (const [symbol_type_name, symbol_type] of dispatched_symbol_types) {
		if (!new_symbols.symbols[symbol_type_name]) {
			new_symbols.symbols[symbol_type_name] = {
				available: [],
				members: {},
			}
		}

		for (
			const [symbol_name, symbol] of Object.entries(
				symbol_type.members ?? {},
			)
		) {
			/* @ts-ignore */
			const value = symbol.data?.typeDef as any

			if (value && symbol.definition && symbol.definition.length !== 0) {
				new_symbols.symbols[symbol_type_name].available.push(symbol_name)
				value.module_path =
					symbol.definition[0].uri.split(project_path_uri)[1]
				if (args.module) {
					if (!modules[value.module_path]) {
						modules[value.module_path] = {
							symbols: {},
							dependency_symbols: {},
						}
					}
					modules[value.module_path].symbols[symbol_name] = value
				}
				/* @ts-ignore */
				new_symbols.symbols[symbol_type_name].members[symbol_name] = value
			}
		}
	}

	const out_symbols = JSON.stringify(new_symbols, replacer)

	// Removes unused symbols
	for (const parsed_symbol of Object.keys(new_symbols.dependency_symbols)) {
		if (new_symbols.dependency_symbols[parsed_symbol]) {
			if (
				out_symbols.indexOf(
					parsed_symbol,
					out_symbols.indexOf(parsed_symbol) + 1,
				) === -1
			) {
				delete new_symbols.dependency_symbols[parsed_symbol]
			} else if (args.module) {
				const symbol = new_symbols.dependency_symbols[parsed_symbol]! as any
				const module_path = symbol.module_path as string

				if (!modules[module_path]) {
					modules[module_path] = { symbols: {}, dependency_symbols: {} }
				}
				modules[module_path].dependency_symbols[parsed_symbol] = symbol
			}
		}
	}

	if (!args.dry) {
		await fs.writeFile(
			join(generated_path, 'generated.mcdoc.json'),
			JSON.stringify(new_symbols, replacer),
		)

		if (args.pretty) {
			await fs.writeFile(
				join(generated_path, 'generated.mcdoc.pretty.json'),
				JSON.stringify(new_symbols, replacer, 3),
			)
		}

		const generated_module_path = join(generated_path, 'module')
		if (args.module) {
			for await (
				const [local_module_path, module] of Object.entries(modules)
			) {
				const dir = join(
					generated_module_path,
					local_module_path.split('/').slice(0, -1).join('/'),
				)

				if (dir !== '') await fs.ensureDir(dir)

				const module_key_blacklist = new RegExp(
					`^(?:${
						['parentMap', 'parent', 'parentSymbol', 'module_path'].join(
							')|(?:',
						)
					})$`,
				)

				const module_replacer = (key: string, value: any) => {
					const remove = module_key_blacklist.test(key)
					return remove ? undefined : value
				}

				await fs.writeFile(
					join(generated_module_path, `${local_module_path}.json`),
					JSON.stringify(module, module_replacer),
				)

				if (args.pretty) {
					await fs.writeFile(
						join(
							generated_module_path,
							`${local_module_path}.pretty.json`,
						),
						JSON.stringify(module, module_replacer, 3),
					)
				}
			}

			const index: {
				modules: Record<string, {
					dependency_symbols: string[]
					symbols: string[]
				}>
				dependency_symbols: Record<string, string>

				symbols: Record<string, string>
			} = {
				modules: {},
				dependency_symbols: {},
				symbols: {},
			}

			for (const module_path of module_paths) {
				const dependency_symbols = Object.keys(
					modules[module_path].dependency_symbols,
				)
				const symbols = Object.keys(modules[module_path].symbols)
				const module_key = module_path.split('.').slice(0, -1).join('.')
				index.modules[module_key] = {
					dependency_symbols,
					symbols,
				}
				for (const dependency_symbol of dependency_symbols) {
					index.dependency_symbols[dependency_symbol] = module_key
				}
				for (const symbol of symbols) {
					index.symbols[symbol] = module_key
				}
			}

			await fs.writeFile(
				join(generated_module_path, 'index.json'),
				JSON.stringify(index),
			)
		}
	}

	return [locales, errors] as [
		typeof locales,
		number,
	]
}
