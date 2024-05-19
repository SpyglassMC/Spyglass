#!/usr/bin/env -S node
import { dirname, join, parse, resolve } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import fs from 'fs-extra'
import walk from 'klaw'
import lineColumn from 'line-column'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import type { AstNode } from '@spyglassmc/core'
import {
	ConfigService,
	fileUtil,
	Service,
	VanillaConfig,
} from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import * as mcdoc from '@spyglassmc/mcdoc'

const parentPath = dirname(fileURLToPath(import.meta.url))
const cacheRoot = join(parentPath, 'cache')

const CLI = yargs(hideBin(process.argv))

function removeWindowsCruft(str: string) {
	if (str.includes('\r')) return str.replaceAll('\r', '')
	return str
}

await CLI.scriptName('mcdoc')
	.command(
		'generate [source]',
		'Generate JSON files',
		() =>
			CLI.positional(
				'source',
				{
					describe: 'path to directory containing mcdoc source.',
					type: 'string',
					default: '.',
				},
			).options({
				'locale': {
					alias: 'l',
					description:
						'en-us language key-value store of all doc comments.',
					default: false,
				},
				'module': {
					alias: 'm',
					description:
						'file tree mirroring definitions; to optimize for web.',
					default: false,
				},
				'pretty': {
					alias: 'p',
					description: 'pretty printed variants.',
					default: false,
				},
				'verbose': {
					alias: 'v',
					default: false,
				},
				'dry': {
					alias: 'd',
					description: 'will not write to disk.',
					default: false,
				},
			}).boolean('locale').boolean('module').boolean('pretty').boolean(
				'verbose',
			).boolean('dry'),
		async (args) => {
			const include = []

			if (args.locale) include.push('locales')
			if (args.module) include.push('modules')

			console.info(
				`Generating JSON files${
					args.locale || args.module
						? `, including ${include.join(', ')}`
						: ''
				}`,
			)

			const logger = {
				log: (...log_args: any[]) =>
					args.verbose ? console.log(...log_args) : false,

				warn: (...log_args: any[]) => console.warn(...log_args),

				error: (...log_args: any[]) => console.error(...log_args),

				info: (...log_args: any[]) =>
					args.verbose ? console.info(...log_args) : false,

				trace: (message?: any, ...params: any) =>
					console.trace(message, ...params),
			}

			const projectPath = resolve(process.cwd(), args.source)

			await fileUtil.ensureDir(NodeJsExternals, projectPath)

			const service = new Service({
				logger,
				project: {
					cacheRoot: fileUtil.ensureEndingSlash(
						pathToFileURL(cacheRoot).toString(),
					),
					defaultConfig: ConfigService.merge(VanillaConfig, {
						env: { dependencies: [] },
					}),
					externals: NodeJsExternals,
					initializers: [mcdoc.initialize],
					projectRoot: fileUtil.ensureEndingSlash(
						pathToFileURL(projectPath).toString(),
					),
				},
			})

			await service.project.ready()
			await service.project.cacheService.save()

			const generated = join('out', 'generated')

			if (args.dry !== true) {
				await fs.ensureDir(generated)

				if (args.module) {
					await fs.ensureDir(join(generated, 'module'))
				}
				if (args.locale) {
					await fs.ensureDir(join('out', 'locale'))
				}
			}

			const symbols = []

			const internal_locales: Record<string, string[]> = {}

			const locales: Record<string, string> = {}

			let errors = 0

			for await (const doc_file of walk(projectPath)) {
				if (doc_file.path.endsWith('.mcdoc')) {
					const DocumentUri = pathToFileURL(doc_file.path).toString()

					const doc_contents = await fs.readFile(doc_file.path, 'utf-8')

					await service.project.onDidOpen(
						DocumentUri,
						'mcdoc',
						0,
						doc_contents,
					)

					const check = await service.project.ensureClientManagedChecked(
						DocumentUri,
					)

					if (check && check.doc && check.node) {
						const { doc, node } = check

						const path = parse(fileURLToPath(doc.uri))

						const resource = join(
							path.dir.replace(`${projectPath}`, ''),
							path.name,
						).replace(/^\//, '')

						logger.info(`parsing ${resource}\n`)

						if (node.children[0]) {
							const children = node.children

							function flattenChild(
								parent: string,
								self: string,
								_parent: Partial<AstNode> | undefined,
								_child: Partial<AstNode>,
							) {
								const child: any = {}

								const known_error = false

								/* @ts-ignore */
								child.self = self

								/* @ts-ignore */
								if (_child.parent) child.parent = parent

								/* @ts-ignore */
								if (_child.parentMap) child.parentMap = parent

								if (_child.children) {
									child.children = []
									for (
										const [i, __child] of Object.entries(
											_child.children,
										)
									) {
										/* @ts-ignore */
										child.children[Number(i)] = flattenChild(
											self,
											`${self}[${i}]`,
											_child,
											__child,
										)
									}
								}

								child.type = _child.type

								if (child.type === 'resource_location') {
									/* @ts-ignore */
									child.namespace = _child.namespace
									/* @ts-ignore */
									child.path = _child.path
								}

								if (Object.hasOwn(_child, 'isOptional')) {
									/* @ts-ignore */
									child.isOptional = _child.isOptional
								}

								if (Object.hasOwn(_child, 'colorTokenType')) {
									/* @ts-ignore */
									child.colorTokenType = _child.colorTokenType
								}

								/* @ts-ignore */
								if (Object.hasOwn(_child, 'value')) {
									/* @ts-ignore */
									child.value = _child.value

									if (internal_locales[parent]) {
										locales[
											`mcdoc.${
												resource.replace(/[\/\\]/g, '.')
											}.${child.value}`
										] = removeWindowsCruft(
											internal_locales[parent].join('').trimEnd(),
										)

										delete internal_locales[parent]
									}
								}

								if (
									child.type === 'mcdoc:struct/map_key' &&
									internal_locales[parent]
								) {
									locales[
										`mcdoc.${
											resource.replace(/[\/\\]/g, '.')
										}.map_key`
									] = removeWindowsCruft(
										internal_locales[parent].join('').trimEnd(),
									)

									delete internal_locales[parent]
								}

								if (Object.hasOwn(_child, 'comment')) {
									/* @ts-ignore */
									const comment: string = _child.comment
									child.comment = comment

									if (
										!args.dry && args.locale &&
										_parent?.type === 'mcdoc:doc_comments'
									) {
										const key = parent.replace(/\[\d+\]$/, '')

										if (!internal_locales[key]) {
											internal_locales[key] = []
										}

										internal_locales[key].push(comment.slice(1))
									}
								}

								if (_child.hover) child.hover = _child.hover

								if (_child.color) child.color = _child.color

								if (child.type !== 'error') return child
								else {
									errors++

									const lc = lineColumn(doc_contents)

									function range(
										range: { start: number; end: number },
									) {
										const start = lc.fromIndex(range.start)
										const end = lc.fromIndex(range.end)

										return `L${start?.line}${
											start?.col ? `:C${start?.col}` : ''
										} -> L${end?.line}${
											end?.col ? `:C${end?.col}` : ''
										}`
									}

									if (!known_error) {
										console.warn(`mcdoc error(s):`)
										/* @ts-ignore */
										if (_child.parent?.parserErrors.length !== 0) {
											console.warn('	parser:')
											/* @ts-ignore */
											_child.parent?.parserErrors.forEach(error => {
												console.warn(
													`		${error.message}\n		Location: ${
														range(error.range)
													}. Severity ${error.severity}.`,
												)
											})
										}

										/* @ts-ignore */
										if (_child.parent?.binderErrors.length !== 0) {
											console.warn('	binder:')
											/* @ts-ignore */
											_child.parent?.binderErrors.forEach(error => {
												console.warn(
													`		${error.message}\n		Location: ${
														range(error.range)
													}. Severity ${error.severity}.`,
												)
											})
										}
									}
									console.warn(`error @ ${doc_file.path}\n\n`)
									return false
								}
							}

							children.forEach((child, i) => {
								/* @ts-ignore */
								children[i] = flattenChild(
									resource,
									`${resource}.[${i}]`,
									undefined,
									child,
								)
							})

							const symbol = {
								resource,

								children,
							}

							symbols.push(symbol)

							if (!args.dry && args.module) {
								const dir =
									parse(join(generated, 'module', resource)).dir

								if (dir !== '') await fs.ensureDir(dir)

								await fs.writeFile(
									join(generated, 'module', `${resource}.mcdoc.json`),
									JSON.stringify(symbol),
								)

								if (args.pretty) {
									await fs.writeFile(
										join(
											generated,
											'module',
											`${resource}.pretty.mcdoc.json`,
										),
										JSON.stringify(symbol, undefined, 3),
									)
								}
							}
						}
					}
				}
			}

			if (!args.dry) {
				await fs.writeFile(
					join(generated, 'generated.mcdoc.json'),
					JSON.stringify(symbols),
				)

				if (args.pretty) {
					await fs.writeFile(
						join(generated, 'generated.pretty.mcdoc.json'),
						JSON.stringify(symbols, undefined, 3),
					)
				}

				if (args.module) {
					await fs.writeFile(
						join(generated, 'module', 'index.json'),
						JSON.stringify(symbols.map(symbol => symbol.resource)),
					)
				}

				if (args.locale) {
					const orphaned_doc = Object.keys(internal_locales)
					if (orphaned_doc.length !== 0) {
						console.warn(
							`parsing error, ${orphaned_doc.length} orphaned doc comments or incorrectly parsed markup comments`,
						)
						console.warn(internal_locales)
					}
					await fs.writeFile(
						join('out', 'locale', 'locale.en-us.json'),
						JSON.stringify(locales, undefined, 3),
					)
				}
			}

			console.log(`Generated JSON files with ${errors} errors.`)

			await service.project.close()
		},
	)
	.strict()
	.demandCommand(1)
	.parse()
