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
	doc_file: walk.Item,
	service: Service,
	logger: Logger,
) {
	const symbols = []

	let errors = 0

	const internal_locales: Record<string, string[]> = {}

	const locales: Record<string, string> = {}

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

		let resource = join(
			path.dir.replace(`${project_path}`, ''),
			path.name,
		).replace(/^[\/\\]/, '')

		// remove windows cruft
		if (resource.includes('\\')) resource = resource.replaceAll('\\', '/')

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

				// if you want to keep your sanity, avoid looking at this function
				function setLocale(end: string) {
					let container
					if (
						doc_file.path.endsWith(
							`${resource.split('/').slice(-1)[0]}.mcdoc`,
						)
					) {
						const threeBack = _parent?.parent?.parent

						if (threeBack?.type === 'mcdoc:struct') {
							const identifierIndex = threeBack?.children?.findIndex(
								child => child.type === 'mcdoc:identifier',
							)

							if (identifierIndex && identifierIndex !== -1) {
								/* @ts-ignore */
								container = threeBack?.children?.[identifierIndex].value
							} else {
								/* @ts-ignore */
								const fourBack = threeBack?.parent

								switch (fourBack?.type) {
									case 'mcdoc:struct/field/pair':
										{
											const key = fourBack.children?.find(child =>
												child.type === 'mcdoc:identifier'
												/* @ts-ignore */
											)?.value
											const sixBack = fourBack.parent?.parent
											const foundRoot = sixBack?.children?.find(
												child => child.type === 'mcdoc:identifier',
												/* @ts-ignore */
											)?.value

											if (key) {
												if (foundRoot) {
													container = `${foundRoot}.${key}`
												} else {
													// This is another nested anonymous struct
													// TODO: Yeah this should be recursive and smarter but I'm lazy
													const parentKey = sixBack?.parent
														?.children?.find(child =>
															child.type === 'mcdoc:identifier'
															/* @ts-ignore */
														)?.value
													const actualRoot = sixBack?.parent
														?.parent?.parent?.children?.find(
															child =>
																child.type ===
																	'mcdoc:identifier',
															/* @ts-ignore */
														)?.value

													container =
														`${actualRoot}.${parentKey}.${key}`
												}
											} else {
												// This is another nested anonymous struct
												// TODO: Yeah this should be recursive and smarter but I'm lazy
												const parentKey = sixBack?.parent?.children
													?.find(child =>
														child.type === 'mcdoc:identifier'
														/* @ts-ignore */
													)?.value
												const actualRoot = sixBack?.parent?.parent
													?.parent?.children?.find(child =>
														child.type === 'mcdoc:identifier'
														/* @ts-ignore */
													)?.value

												container =
													`${actualRoot}.${parentKey}.__map_key.__struct`
											}
										}
										break
									case 'mcdoc:type/union':
										{
											switch (fourBack?.parent?.type) {
												case 'mcdoc:struct/field/spread':
													{
														const root = fourBack?.parent?.parent
															?.parent?.children?.find(child =>
																child.type ===
																	'mcdoc:identifier'
																/* @ts-ignore */
															)?.value

														// java/server/world/entity/mob/breedable/llama.[0][2][4][2][9][0][0][1][0][0][0]
														// java/server/world/entity/mob/breedable/llama.[0][2][4][2][9][0][1][1][0][0][0]
														if (root) {
															container =
																`${root}.__spread.__union.__struct_${
																	self.split('][').slice(-4)[0]
																}` // THIS IS REALLY REALLY BAD
														} else {
															logger.warn(
																'Could not find root for union spread',
															)
														}
													}
													break
												case 'mcdoc:struct/field/pair':
													{
														const parentKey = fourBack?.parent
															?.children?.find(child =>
																child.type ===
																	'mcdoc:identifier'
																/* @ts-ignore */
															)?.value

														const root = fourBack?.parent?.parent
															?.parent?.children?.find(child =>
																child.type ===
																	'mcdoc:identifier'
																/* @ts-ignore */
															)?.value

														container =
															`${root}.${parentKey}.__union.__struct_${
																self.split('][').slice(-2)[0]
															}` // THIS IS REALLY REALLY BAD
													}
													break
												case 'mcdoc:dispatch_statement':
													{
														const registry = fourBack.parent
															.children?.find(child =>
																child.type ===
																	'resource_location'
																/* @ts-ignore */
															)?.path?.join('_')

														const key = fourBack.parent.children
															?.find(child =>
																child.type ===
																	'mcdoc:index_body'
																/* @ts-ignore */
															)?.children?.[0]?.value

														const indexGuess =
															self.split('][').slice(-6)[0] // THIS IS REALLY REALLY BAD

														if (indexGuess === '45') {
															container =
																`__dispatch.${registry}.${key}.__union.__struct_${
																	self.split('][').slice(-4)[0]
																}`
														} else {
															container =
																`__dispatch.${registry}.${key}.__union.__struct_${indexGuess}`
														}
													}
													break
												case 'mcdoc:type_alias':
													{
														container = fourBack?.parent?.children
															?.find(child =>
																child.type ===
																	'mcdoc:identifier'
																/* @ts-ignore */
															)?.value
													}
													break
												default: {
													// TODO: there's more cases here, but I'm done for now
													// console.log('aa ', fourBack?.parent?.type)
												}
											}
										}
										break
									case 'mcdoc:type/list':
										{
											const fiveBack = fourBack?.parent
											switch (fiveBack?.type) {
												case 'mcdoc:struct/field/pair':
													{
														const key = fiveBack.children?.find(
															child =>
																child.type ===
																	'mcdoc:identifier',
															/* @ts-ignore */
														)?.value
														const sevenBack = fiveBack.parent
															?.parent
														const foundRoot = sevenBack?.children
															?.find(child =>
																child.type ===
																	'mcdoc:identifier'
																/* @ts-ignore */
															)?.value

														if (foundRoot) {
															container =
																`${foundRoot}.${key}.__struct_list`
														} else {
															// This is another nested anonymous struct
															switch (sevenBack?.parent?.type) {
																case 'mcdoc:type/list':
																	{
																		const nineBack = sevenBack
																			.parent?.parent
																		/* @ts-ignore */
																		const parentKey = nineBack
																			?.children?.find(
																				child =>
																					child.type ===
																						'mcdoc:identifier',
																				/* @ts-ignore */
																			)?.value
																		// Credits husk
																		const actualRoot =
																			nineBack?.parent
																				?.parent?.parent
																				?.parent?.children
																				?.find(child =>
																					child.type ===
																						'mcdoc:identifier'
																					/* @ts-ignore */
																				)?.value
																		if (actualRoot) {
																			container =
																				`${actualRoot}.__struct_list.${parentKey}.__struct_list.${key}.__struct_list`
																		} else {
																			logger.warn(
																				"Could not find root for a bunch of nested struct lists, probably don't do this",
																			)
																		}
																	}
																	break
																case 'mcdoc:type/union': {
																	const actualRoot = sevenBack
																		.parent?.parent?.children
																		?.find(child =>
																			child.type ===
																				'mcdoc:identifier'
																			/* @ts-ignore */
																		)?.value

																	// block state definition, this is fragile

																	if (actualRoot) {
																		container =
																			`${actualRoot}.__struct_union.${key}.__struct_list`
																	} else {
																		logger.warn(
																			'Could not find root for struct list within struct union, this should be fixed',
																		)
																	}
																}
															}
														}
													}
													break
												case 'mcdoc:type_alias':
													{
														const root = fiveBack?.children?.find(
															child =>
																child.type ===
																	'mcdoc:identifier',
															/* @ts-ignore */
														)?.value

														container = `${root}.__struct_list`
													}
													break
											}
										}
										break
									case 'mcdoc:type_alias':
										{
											const root = fourBack?.children?.find(child =>
												child.type === 'mcdoc:identifier'
												/* @ts-ignore */
											)?.value

											if (root) {
												container = root
											} else {
												logger.warn(
													'Could not find root for type alias, hint:' +
														self,
												)
											}
										}
										break
									case 'mcdoc:dispatch_statement':
										{
											// anonymous struct
											container = `__dispatch.__struct${
												self.split('][').slice(-5)[0]
											}` // THIS IS REALLY REALLY BAD
										}
										break
								}
								// anonymous struct
								switch (fourBack?.type) {
									case 'mcdoc:struct/field/pair':
										{
											const key = fourBack.children?.find(child =>
												child.type === 'mcdoc:identifier'
												/* @ts-ignore */
											)?.value
											const sixBack = fourBack.parent?.parent
											const parentKey = sixBack?.children?.find(
												child => child.type === 'mcdoc:identifier',
												/* @ts-ignore */
											)?.value

											if (key) {
												if (parentKey) {
													container = `${parentKey}.${key}`
												} else {
													// memories
													const actualParentKey = sixBack?.parent
														?.children?.find(child =>
															child.type === 'mcdoc:identifier'
															/* @ts-ignore */
														)?.value

													const root = sixBack?.parent?.parent
														?.parent?.children?.find(child =>
															child.type === 'mcdoc:identifier'
															/* @ts-ignore */
														)?.value

													container =
														`${root}.${actualParentKey}.${key}`
												}
											} else {
												// advancement criteria trigger
												const sevenBack = fourBack?.parent?.parent
													?.parent
												const parentKey = sevenBack?.children?.find(
													child =>
														child.type === 'mcdoc:identifier',
													/* @ts-ignore */
												)?.value

												const root = sevenBack?.parent?.parent
													?.children?.find(child =>
														child.type === 'mcdoc:identifier'
														/* @ts-ignore */
													)?.value

												container =
													`${root}.${parentKey}.__map_key.__struct`
											}
										}
										break
									case 'mcdoc:type/union':
										{
											if (!container) { // yes
												switch (fourBack?.parent?.type) {
													case 'mcdoc:type_alias':
														{
															const root = fourBack?.parent
																?.children?.find(child =>
																	child.type ===
																		'mcdoc:identifier'
																	/* @ts-ignore */
																)?.value
															container =
																`${root}.__union.__struct_${
																	self.split('][').slice(-4)[0]
																}` // THIS IS REALLY REALLY BAD
														}
														break
													case 'mcdoc:struct/field/pair':
														{
															const parentKey = fourBack?.parent
																.children?.find(child =>
																	child.type ===
																		'mcdoc:identifier'
																	/* @ts-ignore */
																)?.value

															const root = fourBack?.parent
																?.parent?.parent?.children
																?.find(child =>
																	child.type ===
																		'mcdoc:identifier'
																	/* @ts-ignore */
																)?.value

															container = `${root}.${parentKey}`
														}
														break
													case 'mcdoc:dispatch_statement':
														{
															// kill

															const indexGuess =
																self.split('][').slice(-6)[0]
															if (indexGuess === '45') {
																container =
																	`__dispatch.__struct_${
																		self.split('][').slice(
																			-4,
																		)[0]
																	}`
															} else {
																container =
																	`__dispatch.__struct_${indexGuess}` // THIS IS REALLY REALLY BAD
															}
														}
														break
													case 'mcdoc:type/union':
														{
															// book lines
															const sevenBack = fourBack?.parent
																?.parent?.parent
															const parentKey = sevenBack
																?.children?.find(child =>
																	child.type ===
																		'mcdoc:identifier'
																	/* @ts-ignore */
																)?.value

															const root = sevenBack?.parent
																?.parent?.children?.find(
																	child =>
																		child.type ===
																			'mcdoc:identifier',
																	/* @ts-ignore */
																)?.value

															container =
																`${root}.${parentKey}.__union_list.__struct`
														}
														break
													case 'mcdoc:type/list':
														{
															// texture meta
															const parentKey = fourBack?.parent
																.parent?.children?.find(child =>
																	child.type ===
																		'mcdoc:identifier'
																	/* @ts-ignore */
																)?.value

															const rootKey = fourBack?.parent
																?.parent?.parent?.parent?.parent
																?.children?.find(child =>
																	child.type ===
																		'mcdoc:identifier'
																	/* @ts-ignore */
																)?.value

															const root = fourBack?.parent
																?.parent?.parent?.parent?.parent
																?.parent?.parent?.children
																?.find(child =>
																	child.type ===
																		'mcdoc:identifier'
																	/* @ts-ignore */
																)?.value

															container =
																`${root}.${rootKey}.${parentKey}.__union_list.__struct`
														}
														break
												}
											}
										}
										break
								}
							}
						} else {
							const threeBack = _parent?.parent?.parent
							switch (threeBack?.type) {
								case 'mcdoc:enum':
									{
										const root = threeBack?.children?.find(child =>
											child.type === 'mcdoc:identifier'
											/* @ts-ignore */
										)?.value

										if (root) {
											container = root
										} else {
											// inline enum
											const parentKey = threeBack?.parent?.children
												?.find(child =>
													child.type === 'mcdoc:identifier'
													/* @ts-ignore */
												)?.value
											const root = threeBack?.parent?.parent?.parent
												?.children?.find(child =>
													child.type === 'mcdoc:identifier'
													/* @ts-ignore */
												)?.value

											if (root) {
												container = `${root}.${parentKey}`
											} else {
												const rootKey = threeBack?.parent?.parent
													?.parent?.parent?.children?.find(child =>
														child.type === 'mcdoc:identifier'
														/* @ts-ignore */
													)?.value
												const root = threeBack?.parent?.parent
													?.parent?.parent?.parent?.parent
													?.children?.find(child =>
														child.type === 'mcdoc:identifier'
														/* @ts-ignore */
													)?.value

												container =
													`${root}.${rootKey}.${parentKey}`
											}
										}
									}
									break
								case 'file':
									{
										switch (_parent?.type) {
											case 'mcdoc:struct':
												{
													container = _parent?.children?.find(
														child =>
															child.type === 'mcdoc:identifier',
														/* @ts-ignore */
													)?.value
												}
												break
											case 'mcdoc:dispatch_statement':
												{
													if (_parent?.children) {
														container = _parent?.children?.find(
															child =>
																child.type ===
																	'resource_location',
															/* @ts-ignore */
														)?.path?.join('_')
													}
												}
												break
											case 'mcdoc:enum':
												{
													container = _parent?.children?.find(
														child =>
															child.type === 'mcdoc:identifier',
														/* @ts-ignore */
													)?.value
												}
												break
											case 'mcdoc:type_alias':
												{
													container = _parent?.children?.find(
														child =>
															child.type === 'mcdoc:identifier',
														/* @ts-ignore */
													)?.value
												}
												break
										}
									}
									break
								case 'mcdoc:struct/field/pair': {
									const key = threeBack.children?.find(child =>
										child.type === 'mcdoc:identifier'
										/* @ts-ignore */
									)?.value
									const root = threeBack.parent?.parent?.children
										?.find(child => child.type === 'mcdoc:identifier')
										/* @ts-ignore */
										?.value

									container = `${root}.${key}`
								}
							}
						}
					}
					const key = `mcdoc.${resource.replace(/\//g, '.')}${
						container ? `.${container}` : ''
					}.${end}`

					let value = internal_locales[parent].join('').trimEnd()

					/// remove windows cruft
					if (value.includes('\r')) value = value.replaceAll('\r', '')

					locales[key] = value
				}

				/* @ts-ignore */
				if (Object.hasOwn(_child, 'value')) {
					/* @ts-ignore */
					child.value = _child.value

					if (internal_locales[parent]) {
						if (child.value === 'dispatch') {
							const dispatchValue = _parent?.children?.slice(-1)[0]

							if (dispatchValue) {
								if (dispatchValue.type === 'mcdoc:struct') {
									/* @ts-ignore */
									const key = dispatchValue.children?.[1]?.value

									if (key) {
										setLocale(`__dispatch.${key}`)
									} else {
										/// anonymous struct
										setLocale(
											`__dispatch_${self.split('][').slice(-2)[0]}`,
										) // THIS IS REALLY REALLY BAD
									}
								} else {
									const key = `${
										/* @ts-ignore */
										_parent?.children?.[3]?.children?.[0].value}`
										.replace(/[\%\, ]/, '__') // should be sanitized enough

									setLocale(`__dispatch.${key}`)
								}
							}
						} else {
							setLocale(child.value)
						}

						delete internal_locales[parent]
					}
				}

				if (
					child.type === 'mcdoc:struct/map_key' &&
					internal_locales[parent]
				) {
					const attributes = _child.children?.[0]?.children?.[0]?.children
					if (
						attributes && attributes.length === 1 &&
						/* @ts-ignore */
						!attributes[0].children && attributes[0].value === 'id'
					) {
						/* @ts-ignore */
						setLocale(_child.children?.[0].children?.[1].value)
					} else {
						logger.warn(
							'Could not find good path, using __map_key. hint: ' + self,
						)
						setLocale('__map_key')
					}

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
						} -> L${end?.line}${end?.col ? `:C${end?.col}` : ''}`
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
				const dir = parse(join(generated_path, 'module', resource)).dir

				if (dir !== '') await fs.ensureDir(dir)

				await fs.writeFile(
					join(generated_path, 'module', `${resource}.mcdoc.json`),
					JSON.stringify(symbol),
				)

				if (args.pretty) {
					await fs.writeFile(
						join(
							generated_path,
							'module',
							`${resource}.pretty.mcdoc.json`,
						),
						JSON.stringify(symbol, undefined, 3),
					)
				}
			}
		}
	}

	return [symbols, locales, errors] as [
		{ resource: string; children: AstNode[] }[],
		typeof locales,
		number,
	]
}
