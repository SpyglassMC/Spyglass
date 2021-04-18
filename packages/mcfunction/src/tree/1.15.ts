import { SymbolAccessType } from '@spyglassmc/core'
import type { PartialRootTreeNode, PartialTreeNode } from './type'

// TODO : minecraft:(resource_location|nbt_compound_tag|nbt_path|nbt_tag|objective)

const AdvancementTargets: PartialTreeNode = {
	children: {
		targets: {
			children: {
				from: {
					children: {
						advancement: {
							properties: {
								category: 'advancement',
							},
						},
					},
				},
				only: {
					children: {
						advancement: {
							properties: {
								category: 'advancement',
							},
						},
					},
				},
				through: {
					children: {
						advancement: {
							properties: {
								category: 'advancement',
							},
						},
					},
				},
				until: {
					children: {
						advancement: {
							properties: {
								category: 'advancement',
							},
						},
					},
				},
			},
		},
	},
}

const DataSource: PartialTreeNode = {
	children: {
		block: {
			children: {
				sourcePos: {
					children: {
						sourcePath: {
							parser: 'minecraft:nbt_path',
							// FIXME
						},
					},
				},
			},
		},
		entity: {
			children: {
				source: {
					children: {
						sourcePath: {
							parser: 'minecraft:nbt_path',
							// FIXME
						},
					},
				},
			},
		},
		storage: {
			children: {
				source: {
					properties: {
						category: 'storage',
					},
					children: {
						sourcePath: {
							parser: 'minecraft:nbt_path',
							// FIXME
						},
					},
				},
			},
		},
	},
}

const DataModifySource: PartialTreeNode = {
	children: {
		from: DataSource,
		value: {
			children: {
				value: {
					parser: 'minecraft:nbt_tag',
					// FIXME
				},
			},
		},
	},
}

const DataModifyOperation: PartialTreeNode = {
	children: {
		append: DataModifySource,
		insert: {
			children: {
				index: DataModifySource,
			},
		},
		merge: DataModifySource,
		prepend: DataModifySource,
		set: DataModifySource,
	},
}

// FIXME
const ExecuteCondition: PartialTreeNode = {
	children: {
		data: {
			type: 'literal',
			children: {
				block: {
					type: 'literal',
					children: {
						sourcePos: {
							type: 'argument',
							parser: 'minecraft:block_pos',
							children: {
								path: {
									type: 'argument',
									parser: 'minecraft:nbt_path',
									executable: true,
									redirect: [
										'execute',
									],
								},
							},
						},
					},
				},
				entity: {
					type: 'literal',
					children: {
						source: {
							type: 'argument',
							parser: 'minecraft:entity',
							properties: {
								amount: 'single',
								type: 'entities',
							},
							children: {
								path: {
									type: 'argument',
									parser: 'minecraft:nbt_path',
									executable: true,
									redirect: [
										'execute',
									],
								},
							},
						},
					},
				},
				storage: {
					type: 'literal',
					children: {
						source: {
							type: 'argument',
							parser: 'minecraft:resource_location',
							children: {
								path: {
									type: 'argument',
									parser: 'minecraft:nbt_path',
									executable: true,
									redirect: [
										'execute',
									],
								},
							},
						},
					},
				},
			},
		},
		predicate: {
			type: 'literal',
			children: {
				predicate: {
					type: 'argument',
					parser: 'minecraft:resource_location',
					executable: true,
					redirect: [
						'execute',
					],
				},
			},
		},
		score: {
			type: 'literal',
			children: {
				target: {
					type: 'argument',
					parser: 'minecraft:score_holder',
					properties: {
						amount: 'single',
					},
					children: {
						targetObjective: {
							type: 'argument',
							parser: 'minecraft:objective',
							children: {
								'<': {
									type: 'literal',
									children: {
										source: {
											type: 'argument',
											parser: 'minecraft:score_holder',
											properties: {
												amount: 'single',
											},
											children: {
												sourceObjective: {
													type: 'argument',
													parser: 'minecraft:objective',
													executable: true,
													redirect: [
														'execute',
													],
												},
											},
										},
									},
								},
								'<=': {
									type: 'literal',
									children: {
										source: {
											type: 'argument',
											parser: 'minecraft:score_holder',
											properties: {
												amount: 'single',
											},
											children: {
												sourceObjective: {
													type: 'argument',
													parser: 'minecraft:objective',
													executable: true,
													redirect: [
														'execute',
													],
												},
											},
										},
									},
								},
								'=': {
									type: 'literal',
									children: {
										source: {
											type: 'argument',
											parser: 'minecraft:score_holder',
											properties: {
												amount: 'single',
											},
											children: {
												sourceObjective: {
													type: 'argument',
													parser: 'minecraft:objective',
													executable: true,
													redirect: [
														'execute',
													],
												},
											},
										},
									},
								},
								'>': {
									type: 'literal',
									children: {
										source: {
											type: 'argument',
											parser: 'minecraft:score_holder',
											properties: {
												amount: 'single',
											},
											children: {
												sourceObjective: {
													type: 'argument',
													parser: 'minecraft:objective',
													executable: true,
													redirect: [
														'execute',
													],
												},
											},
										},
									},
								},
								'>=': {
									type: 'literal',
									children: {
										source: {
											type: 'argument',
											parser: 'minecraft:score_holder',
											properties: {
												amount: 'single',
											},
											children: {
												sourceObjective: {
													type: 'argument',
													parser: 'minecraft:objective',
													executable: true,
													redirect: [
														'execute',
													],
												},
											},
										},
									},
								},
								matches: {
									type: 'literal',
									children: {
										range: {
											type: 'argument',
											parser: 'minecraft:int_range',
											executable: true,
											redirect: [
												'execute',
											],
										},
									},
								},
							},
						},
					},
				},
			},
		},
	},
}

// FIXME
const ExecuteStoreTarget: PartialTreeNode = {
	type: 'literal',
	children: {
		block: {
			type: 'literal',
			children: {
				targetPos: {
					type: 'argument',
					parser: 'minecraft:block_pos',
					children: {
						path: {
							type: 'argument',
							parser: 'minecraft:nbt_path',
							children: {
								byte: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								double: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								float: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								int: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								long: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								short: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
							},
						},
					},
				},
			},
		},
		bossbar: {
			type: 'literal',
			children: {
				id: {
					type: 'argument',
					parser: 'minecraft:resource_location',
					children: {
						max: {
							type: 'literal',
							redirect: [
								'execute',
							],
						},
						value: {
							type: 'literal',
							redirect: [
								'execute',
							],
						},
					},
				},
			},
		},
		entity: {
			type: 'literal',
			children: {
				target: {
					type: 'argument',
					parser: 'minecraft:entity',
					properties: {
						amount: 'single',
						type: 'entities',
					},
					children: {
						path: {
							type: 'argument',
							parser: 'minecraft:nbt_path',
							children: {
								byte: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								double: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								float: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								int: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								long: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								short: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
							},
						},
					},
				},
			},
		},
		score: {
			type: 'literal',
			children: {
				targets: {
					type: 'argument',
					parser: 'minecraft:score_holder',
					properties: {
						amount: 'multiple',
					},
					children: {
						objective: {
							type: 'argument',
							parser: 'minecraft:objective',
							redirect: [
								'execute',
							],
						},
					},
				},
			},
		},
		storage: {
			type: 'literal',
			children: {
				target: {
					type: 'argument',
					parser: 'minecraft:resource_location',
					children: {
						path: {
							type: 'argument',
							parser: 'minecraft:nbt_path',
							children: {
								byte: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								double: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								float: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								int: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								long: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
								short: {
									type: 'literal',
									children: {
										scale: {
											type: 'argument',
											parser: 'brigadier:double',
											redirect: [
												'execute',
											],
										},
									},
								},
							},
						},
					},
				},
			},
		},
	},
}

const ObjectiveWriteTargets: PartialTreeNode = {
	children: {
		targets: {
			children: {
				objective: {
					properties: {
						accessType: SymbolAccessType.Write,
					},
				},
			},
		},
	},
}

const Sound: PartialTreeNode = {
	children: {
		sound: {
			properties: {
				category: 'sound_event',
			},
		},
	},
}

/**
 * Patch for Minecraft: Java Edition 1.15.2
 * 
 * The following parsers are patched with new properties:
 * - `minecraft:resource_location`
 * - `minecraft:nbt_compound_tag`
 * - `minecraft:nbt_path`
 * - `minecraft:nbt_tag`
 * - `minecraft:objective`
 */
export const Tree1_15: PartialRootTreeNode = {
	type: 'root',
	children: {
		advancement: {
			children: {
				grant: AdvancementTargets,
				revoke: AdvancementTargets,
			},
		},
		ban: {
			permission: 3,
		},
		'ban-ip': {
			permission: 3,
		},
		banlist: {
			permission: 3,
		},
		bossbar: {
			children: {
				add: {
					children: {
						id: {
							properties: {
								category: 'bossbar',
								usageType: 'definition',
							},
						},
					},
				},
				get: {
					children: {
						id: {
							properties: {
								category: 'bossbar',
							},
						},
					},
				},
				remove: {
					children: {
						id: {
							properties: {
								category: 'bossbar',
							},
						},
					},
				},
				set: {
					children: {
						id: {
							properties: {
								category: 'bossbar',
								accessType: SymbolAccessType.Write,
							},
						},
					},
				},
			},
		},
		data: {
			children: {
				get: DataSource,
				merge: DataSource, // FIXME: The storage here is being written.
				modify: {
					children: {
						block: {
							children: {
								targetPos: {
									children: {
										targetPath: {
											parser: 'minecraft:nbt_path',
											// FIXME
											children: DataModifyOperation.children,
										},
									},
								},
							},
						},
						entity: {
							children: {
								target: {
									children: {
										targetPath: {
											parser: 'minecraft:nbt_path',
											// FIXME
											children: DataModifyOperation.children,
										},
									},
								},
							},
						},
						storage: {
							children: {
								target: {
									properties: {
										category: 'storage',
										accessType: SymbolAccessType.Write,
									},
									children: {
										targetPath: {
											parser: 'minecraft:nbt_path',
											// FIXME
											children: DataModifyOperation.children,
										},
									},
								},
							},
						},
					},
				},
				remove: DataSource,
			},
		},
		debug: {
			permission: 3,
		},
		deop: {
			permission: 3,
		},
		execute: {
			children: {
				if: ExecuteCondition,
				store: {
					children: {
						result: ExecuteStoreTarget,
						success: ExecuteStoreTarget,
					},
				},
				unless: ExecuteCondition,
			},
		},
		help: {
			permission: 0,
		},
		kick: {
			permission: 3,
		},
		list: {
			permission: 0,
		},
		// FIXME: Extract
		loot: {
			children: {
				give: {
					children: {
						players: {
							children: {
								fish: {
									children: {
										loot_table: {
											properties: {
												category: 'loot_table',
											},
										},
									},
								},
								loot: {
									children: {
										loot_table: {
											properties: {
												category: 'loot_table',
											},
										},
									},
								},
							},
						},
					},
				},
				insert: {
					children: {
						targetPos: {
							children: {
								fish: {
									children: {
										loot_table: {
											properties: {
												category: 'loot_table',
											},
										},
									},
								},
								loot: {
									children: {
										loot_table: {
											properties: {
												category: 'loot_table',
											},
										},
									},
								},
							},
						},
					},
				},
				replace: {
					children: {
						block: {
							children: {
								targetPos: {
									children: {
										slot: {
											children: {
												fish: {
													children: {
														loot_table: {
															properties: {
																category: 'loot_table',
															},
														},
													},
												},
												loot: {
													children: {
														loot_table: {
															properties: {
																category: 'loot_table',
															},
														},
													},
												},
												count: {
													children: {
														fish: {
															children: {
																loot_table: {
																	properties: {
																		category: 'loot_table',
																	},
																},
															},
														},
														loot: {
															children: {
																loot_table: {
																	properties: {
																		category: 'loot_table',
																	},
																},
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
						entity: {
							children: {
								entities: {
									children: {
										slot: {
											children: {
												fish: {
													children: {
														loot_table: {
															properties: {
																category: 'loot_table',
															},
														},
													},
												},
												loot: {
													children: {
														loot_table: {
															properties: {
																category: 'loot_table',
															},
														},
													},
												},
												count: {
													children: {
														fish: {
															children: {
																loot_table: {
																	properties: {
																		category: 'loot_table',
																	},
																},
															},
														},
														loot: {
															children: {
																loot_table: {
																	properties: {
																		category: 'loot_table',
																	},
																},
															},
														},
													},
												},
											},
										},
									},
								},
							},
						},
					},
				},
				spawn: {
					children: {
						targetPos: {
							children: {
								fish: {
									children: {
										loot_table: {
											properties: {
												category: 'loot_table',
											},
										},
									},
								},
								loot: {
									type: 'literal',
									children: {
										loot_table: {
											properties: {
												category: 'loot_table',
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
		me: {
			permission: 0,
		},
		msg: {
			permission: 0,
		},
		op: {
			permission: 3,
		},
		pardon: {
			permission: 3,
		},
		'pardon-ip': {
			permission: 3,
		},
		playsound: Sound,
		publish: {
			permission: 4,
		},
		recipe: {
			children: {
				give: {
					children: {
						targets: {
							children: {
								recipe: {
									properties: {
										category: 'recipe',
									},
								},
							},
						},
					},
				},
				take: {
					children: {
						targets: {
							children: {
								recipe: {
									properties: {
										category: 'recipe',
									},
								},
							},
						},
					},
				},
			},
		},
		'save-all': {
			permission: 4,
		},
		'save-off': {
			permission: 4,
		},
		'save-on': {
			permission: 4,
		},
		scoreboard: {
			children: {
				objectives: {
					children: {
						add: {
							children: {
								objective: {
									parser: 'spyglassmc:symbol',
									properties: {
										category: 'objective',
										usageType: 'definition',
									},
								},
							},
						},
					},
				},
				players: {
					children: {
						add: ObjectiveWriteTargets,
						operation: ObjectiveWriteTargets,
						remove: ObjectiveWriteTargets,
						reset: ObjectiveWriteTargets,
						set: ObjectiveWriteTargets,
					},
				},
			},
		},
		setidletimeout: {
			permission: 3,
		},
		stop: {
			permission: 4,
		},
		stopsound: {
			children: {
				targets: {
					children: {
						'*': Sound,
						ambient: Sound,
						block: Sound,
						hostile: Sound,
						master: Sound,
						music: Sound,
						neutral: Sound,
						player: Sound,
						record: Sound,
						voice: Sound,
						weather: Sound,
					},
				},
			},
		},
		summon: {
			children: {
				entity: {
					children: {
						pos: {
							children: {
								nbt: {
									parser: 'minecraft:nbt_compound_tag',
									// FIXME
								},
							},
						},
					},
				},
			},
		},
		team: {
			children: {
				add: {
					children: {
						team: {
							parser: 'spyglassmc:symbol',
							properties: {
								category: 'team',
								usageType: 'definition',
							},
						},
					},
				},
			},
		},
		teammsg: {
			permission: 0,
		},
		tell: {
			permission: 0,
		},
		tm: {
			permission: 0,
		},
		trigger: {
			permission: 0,
			children: {
				objective: {
					properties: {
						category: 'objective',
						accessType: SymbolAccessType.Write,
					},
				},
			},
		},
		w: {
			permission: 0,
		},
		whitelist: {
			permission: 3,
		},
	},
}
