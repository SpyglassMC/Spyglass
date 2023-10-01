#!/usr/bin/env -S ts-node --esm
import { dirname, join, resolve, parse } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

import fs from 'fs-extra'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import walk from 'klaw'

import type { AstNode } from '@spyglassmc/core';
import {
	ConfigService,
	fileUtil,
	Service,
	VanillaConfig,
} from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import * as mcdoc from '@spyglassmc/mcdoc'
import * as je from '@spyglassmc/java-edition'

const parentPath = dirname(fileURLToPath(import.meta.url))
const cacheRoot = join(parentPath, 'cache')

const CLI = yargs(hideBin(process.argv));

await CLI.scriptName('mcdoc')
	.command(
		'generate [source]', 
		'Generate JSON files', 
		() => CLI.positional(
			'source', {
				describe: 'path to directory containing mcdoc source',
				type: 'string',
				default: '.'
			}
		).options({
			'locale': {
				alias: 'l',
				description: 'en-us language key-value store of all doc comments',
				default: false
			},
			'module': {
				alias: 'm',
				description: 'file tree mirroring definitions; to optimize for web',
				default: false
			},
			'pretty': {
				alias: 'p',
				description: 'pretty printed variants',
				default: false
			},
			'verbose': {
				alias: 'v',
				default: false
			},
			'dry': {
				alias: 'd',
				description: 'will not write to disk',
				default: false
			}
		}).boolean('locale').boolean('module').boolean('pretty').boolean('verbose').boolean('dry'),
		async (args) => {
			const include = [];

			if (args.locale) include.push('locales');
			if (args.module) include.push('modules');

			console.info(`Generating JSON files${args.locale || args.module ? `, including ${include.join(', ')}` : ''}`);

			const logger = {
				log: (...log_args: any[]) => args.verbose ? console.log(...log_args) : false,

				warn: (...log_args: any[]) => console.warn(...log_args),

				error: (...log_args: any[]) => console.error(...log_args),

				info: (...log_args: any[]) => args.verbose ? console.info(...log_args) : false,

				trace: (message?: any, ...params: any) => console.trace(message, ...params)
			}

			const projectPath = resolve(parentPath, args.source)
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
					initializers: [mcdoc.initialize, je.initialize],
					projectRoot: fileUtil.ensureEndingSlash(
						pathToFileURL(projectPath).toString(),
					),
				},
			});

			await service.project.ready();
			await service.project.cacheService.save();

			const out = 'out';

			if (args.dry !== true) {
				await fs.ensureDir(out)
			}

			const symbols = [];

			const internal_locales: Record<string, string[]> = {};

			const locales: Record<string, string> = {};
			
			for await (const doc_file of walk(projectPath)) {
				if (doc_file.path.endsWith('.mcdoc')) {
					const DocumentUri = pathToFileURL(doc_file.path).toString();

					await service.project.onDidOpen(DocumentUri, 'mcdoc', 0, await fs.readFile(doc_file.path, 'utf-8'));

					const check = await service.project.ensureClientManagedChecked(DocumentUri);

					if (check && check.doc && check.node) {
						const { doc, node } = check;

						const path = parse(fileURLToPath(doc.uri));

						const resource = join(path.dir.replace(`${projectPath}`, ''), path.name).replace(/^\//, '');

						logger.info(`parsing ${resource}\n`)

						if (node.children[0]) {
							const children = node.children

							function flattenChild (parent: string, self: string, _child: Partial<AstNode>) {
								const child: any = {};
								/* @ts-ignore */
								child.self = self;

								/* @ts-ignore */
								if (_child.parent) child.parent = parent;

								/* @ts-ignore */
								if (_child.parentMap) child.parentMap = parent;

								
								if (_child.children) {
									child.children = [];
									for (const [i, __child] of Object.entries(_child.children)) {
										/* @ts-ignore */
										child.children[Number(i)] = flattenChild(self, `${self}[${i}]`, __child)
									}
								}

								child.type = _child.type;

								/* @ts-ignore */
								if (Object.hasOwn(_child, 'isOptional')) child.isOptional = _child.isOptional;

								/* @ts-ignore */
								if (Object.hasOwn(_child, 'colorTokenType')) child.colorTokenType = _child.colorTokenType;

								/* @ts-ignore */
								if (Object.hasOwn(_child, 'value')) {
									/* @ts-ignore */
									child.value = _child.value;

									if (internal_locales[parent]) {
										locales[`mcdoc.${resource.replace(/\//g, '.')}.${child.value}`] = internal_locales[parent].join('\n');

										delete internal_locales[parent];
									}
								}

								if (Object.hasOwn(_child, 'comment')) {
									/* @ts-ignore */
									const comment: string = _child.comment.trim();
									child.comment = comment;

									if (!args.dry && args.locale && !comment.includes('TODO')) {
										const key = parent.replace(/\[\d+\]$/, '');

										if (!internal_locales.key) internal_locales[key] = [];

										internal_locales[key].push(comment);
									}
								}

								if (_child.hover) child.hover = _child.hover;

								if (_child.color) child.color = _child.color;

								if (_child.type !== 'error') return child;
								else {
									console.warn(`parsing error @ ${self} ${_child.range?.start}-${_child.range?.end}\n`);
									return false;
								}
							}

							children.forEach((child, i) => {
								/* @ts-ignore */
								children[i] = flattenChild(resource, `${resource}.[${i}]`, child);
							})

							const symbol = {
								resource,
	
								children,
							};

							symbols.push(symbol);

							if (!args.dry && args.module) {
								const dir = parse(join(out, 'module', resource)).dir;
								
								if (dir !== '') await fs.ensureDir(dir);

								await fs.writeFile(join(out, 'module', `${resource}.mcdoc.json`), JSON.stringify(symbol));

								if (args.pretty) {
									await fs.writeFile(join(out, 'module', `${resource}.pretty.mcdoc.json`), JSON.stringify(symbol, null, 3));
								}
							}
						}
					}
				}
			}

			if (!args.dry) {
				await fs.writeFile(join(out, 'generated.mcdoc.json'), JSON.stringify(symbols));

				if (args.pretty) {
					await fs.writeFile(join(out, 'generated.pretty.mcdoc.json'), JSON.stringify(symbols, null, 3));
				}

				if (args.module) {
					await fs.writeFile(join(out, 'module', 'index.json'), JSON.stringify(symbols.map(symbol => symbol.resource)));
				}

				if (args.locale) {
					const orphaned_doc = Object.keys(internal_locales);
					if (orphaned_doc.length !== 0) {
						console.warn(`parsing error, ${orphaned_doc.length} orphaned doc comments or incorrectly parsed markup comments`);
						console.warn(orphaned_doc);
					}
					await fs.writeFile(join(out, 'locale.en-us.json'), JSON.stringify(locales, null, 3))
				}

				await service.project.close()
			}
		}
	)
	.strict()
	.demandCommand(1)
	.parse()
	