import { SymbolAccessType } from '@spyglassmc/core'
import type { PartialRootTreeNode, PartialTreeNode } from './type'

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

const DataSource = {
	children: {
		storage: {
			children: {
				source: {
					properties: {
						category: 'storage',
					},
				},
			},
		},
	},
}

const DataTarget = {
	children: {
		storage: {
			children: {
				target: {
					properties: {
						category: 'storage',
						accessType: SymbolAccessType.Write,
					},
				},
			},
		},
	},
}

const DataModifySource: PartialTreeNode = {
	children: {
		from: DataSource,
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

const ExecuteCondition: PartialTreeNode = {
	children: {
		data: DataSource,
		predicate: {
			children: {
				predicate: {
					properties: {
						category: 'predicate',
					},
				},
			},
		},
	},
}

const ExecuteStoreTarget: PartialTreeNode = {
	children: {
		...DataTarget.children,
		bossbar: {
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
}

const LootSource: PartialTreeNode = {
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

const RecipeTargets: PartialTreeNode = {
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
 * - `spyglassmc:symbol`
 */
export const Tree1_15: PartialRootTreeNode = {
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
				merge: DataTarget,
				modify: {
					children: {
						block: {
							children: {
								targetPos: {
									children: {
										targetPath: DataModifyOperation,
									},
								},
							},
						},
						entity: {
							children: {
								target: {
									children: {
										targetPath: DataModifyOperation,
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
										targetPath: DataModifyOperation,
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
		loot: {
			children: {
				give: {
					children: {
						players: LootSource,
					},
				},
				insert: {
					children: {
						targetPos: LootSource,
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
												...LootSource.children,
												count: LootSource,
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
												...LootSource.children,
												count: LootSource,
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
						targetPos: LootSource,
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
				give: RecipeTargets,
				take: RecipeTargets,
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
