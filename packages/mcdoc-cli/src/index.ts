#!/usr/bin/env -S node
import { dirname, join, resolve } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import fs from 'fs-extra'
import walk from 'klaw'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import {
	ConfigService,
	fileUtil,
	Service,
	VanillaConfig,
} from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import * as mcdoc from '@spyglassmc/mcdoc'

import { generate } from './generate/index.js'
import { update_locales } from './update_locales/index.js'

import type { AstNode } from '@spyglassmc/core'

const cache_root = join(dirname(fileURLToPath(import.meta.url)), 'cache')

const CLI = yargs(hideBin(process.argv))

export type Logger = {
	log: (...log_args: any[]) => void

	warn: (...log_args: any[]) => void

	error: (...log_args: any[]) => void

	info: (...log_args: any[]) => void

	trace: (message?: any, ...params: any) => void
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

			const logger: Logger = {
				log: (...log_args: any[]) =>
					args.verbose ? console.log(...log_args) : false,

				warn: (...log_args: any[]) => console.warn(...log_args),

				error: (...log_args: any[]) => console.error(...log_args),

				info: (...log_args: any[]) =>
					args.verbose ? console.info(...log_args) : false,

				trace: (message?: any, ...params: any) =>
					console.trace(message, ...params),
			}

			const project_path = resolve(process.cwd(), args.source)

			await fileUtil.ensureDir(NodeJsExternals, project_path)

			const service = new Service({
				logger,
				project: {
					cacheRoot: fileUtil.ensureEndingSlash(
						pathToFileURL(cache_root).toString(),
					),
					defaultConfig: ConfigService.merge(VanillaConfig, {
						env: { dependencies: [] },
					}),
					externals: NodeJsExternals,
					initializers: [mcdoc.initialize],
					projectRoot: fileUtil.ensureEndingSlash(
						pathToFileURL(project_path).toString(),
					),
				},
			})

			await service.project.ready()
			await service.project.cacheService.save()

			const generated_path = join('out', 'generated')

			if (args.dry !== true) {
				await fs.ensureDir(generated_path)

				if (args.module) {
					await fs.ensureDir(join(generated_path, 'module'))
				}
				if (args.locale) {
					await fs.ensureDir(join('out', 'locale'))
				}
			}

			for await (const doc_file of walk(project_path)) {
				if (doc_file.path.endsWith('.mcdoc')) {
					const DocumentUri = pathToFileURL(doc_file.path).toString()

					const doc_contents = await fs.readFile(doc_file.path, 'utf-8')

					await service.project.onDidOpen(
						DocumentUri,
						'mcdoc',
						0,
						doc_contents,
					)

					await service.project.ensureClientManagedChecked(
						DocumentUri,
					)

					await service.project.ensureBindingStarted(
						DocumentUri,
					)
				}
			}

			const response = await generate(
				project_path,
				generated_path,
				args,
				service,
				logger,
			)
			const locales = response[0]
			const errors = response[1]

			if (!args.dry) {
				if (args.locale) {
					const locale_path = join('out', 'locale', 'en-us.json')
					if (await fs.exists(locale_path)) {
						const old_locales = JSON.parse(
							await fs.readFile(locale_path, 'utf-8'),
						)

						await fs.ensureDir(join('out', 'meta'))

						await fs.writeFile(
							join('out', 'meta', 'locale.json'),
							JSON.stringify(
								{
									old_keys: Object.keys(old_locales),
									old_values: Object.values(old_locales),
									new_keys: Object.keys(locales),
									new_values: Object.values(locales),
								},
								undefined,
								3,
							),
						)
					}
					await fs.writeFile(
						join('out', 'locale', 'en-us.json'),
						JSON.stringify(locales, undefined, 3),
					)
				}
			}

			console.log(`Generated JSON files with ${errors} errors.`)

			await service.project.close()
		},
	)
	.command(
		'update_locales',
		'Attempt automatic upgrade of locales.',
		update_locales,
	)
	.strict()
	.demandCommand(1)
	.parse()
