import { SymbolAccessType } from '@spyglassmc/core'
import type {
	PartialRootTreeNode,
	PartialTreeNode,
} from '@spyglassmc/mcfunction'
import { ReleaseVersion } from '../../dependency/index.js'

export function getPatch(release: ReleaseVersion): PartialRootTreeNode {
	return {
		children: {
			advancement: {
				children: {
					grant: AdvancementTargets,
					revoke: AdvancementTargets,
				},
			},
			...(ReleaseVersion.cmp(release, '1.16') >= 0
				? {
						attribute: {
							children: {
								target: {
									children: {
										attribute: {
											properties: {
												category: 'attribute',
											},
											children: {
												modifier: {
													children: {
														add: {
															children: {
																uuid: {
																	properties: {
																		category: 'attribute_modifier_uuid',
																		usageType: 'definition',
																	},
																},
															},
														},
														remove: {
															children: {
																uuid: {
																	properties: {
																		category: 'attribute_modifier_uuid',
																	},
																},
															},
														},
														value: {
															children: {
																get: {
																	children: {
																		uuid: {
																			properties: {
																				category: 'attribute_modifier_uuid',
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
				  }
				: {}),
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
			...(ReleaseVersion.cmp(release, '1.17') >= 0
				? {
						item: {
							children: {
								replace: {
									children: {
										block: {
											children: {
												pos: {
													children: {
														slot: {
															children: {
																from: {
																	children: {
																		block: {
																			children: {
																				source: {
																					children: {
																						sourceSlot: {
																							children: {
																								modifier: {
																									properties: {
																										category: 'item_modifier',
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
																				source: {
																					children: {
																						sourceSlot: {
																							children: {
																								modifier: {
																									properties: {
																										category: 'item_modifier',
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
											},
										},
										entity: {
											children: {
												targets: {
													children: {
														slot: {
															children: {
																from: {
																	children: {
																		block: {
																			children: {
																				source: {
																					children: {
																						sourceSlot: {
																							children: {
																								modifier: {
																									properties: {
																										category: 'item_modifier',
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
																				source: {
																					children: {
																						sourceSlot: {
																							children: {
																								modifier: {
																									properties: {
																										category: 'item_modifier',
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
											},
										},
									},
								},
								modify: {
									children: {
										block: {
											children: {
												pos: {
													children: {
														slot: {
															children: {
																modifier: {
																	properties: {
																		category: 'item_modifier',
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
												targets: {
													children: {
														slot: {
															children: {
																modifier: {
																	properties: {
																		category: 'item_modifier',
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
				  }
				: {}),
			help: {
				permission: 0,
			},
			...(ReleaseVersion.cmp(release, '1.18') >= 0
				? {
						jfr: {
							permission: 4,
						},
				  }
				: {}),
			kick: {
				permission: 3,
			},
			list: {
				permission: 0,
			},
			...(ReleaseVersion.cmp(release, '1.16') >= 0
				? {
						locatebiome: {
							children: {
								biome: {
									properties: {
										category: 'worldgen/biome',
									},
								},
							},
						},
				  }
				: {}),
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
			...(ReleaseVersion.cmp(release, '1.17') >= 0
				? {
						perf: {
							permission: 4,
						},
				  }
				: {}),
			...(ReleaseVersion.cmp(release, '1.19') >= 0
				? {
						place: {
							children: {
								template: {
									children: {
										template: {
											properties: {
												category: 'structure'
											}
										}
									}
								}
							}
						},
				  }
				: {}),
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
										parser: 'minecraft:objective',
										properties: {
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
			tag: {
				children: {
					targets: {
						children: {
							add: {
								children: {
									name: {
										parser: 'spyglassmc:tag',
									},
								},
							},
							remove: {
								children: {
									name: {
										parser: 'spyglassmc:tag',
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
								parser: 'minecraft:team',
								properties: {
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
			/**
			 * Original command syntax:
			 * 1. `teleport <destination: entity(single)>`
			 * 2. `teleport <location: vec3>`
			 * 3. `teleport <targets: entity(multiple)> <...arguments>`
			 *
			 * It is impossible for Spyglass to differentiate between (1) and (3) when it encounters a single entity
			 * at the position of the first argument, due to its lack of ability to backtrack.
			 *
			 * Therefore, we have compromised to patch the trees to something like this:
			 * - `teleport <location: vec3>`
			 * - `teleport <targets: entity(multiple)> [<...arguments>]`
			 *
			 * Diff:
			 * - Removed (1) `teleport <destination: entity(single)>`.
			 * - Marked `<...arguments>` in (3) as optional.
			 *
			 * The downside of this patch is that entity selectors tracking multiple entities can now be used as the
			 * `<destination>` argument. We will see how this work.
			 */
			teleport: {
				children: {
					destination: undefined,
					targets: {
						executable: true,
					},
				},
			},
			tell: {
				permission: 0,
			},
			...(ReleaseVersion.cmp(release, '1.20.2') >= 0
				? {
						tick: {
							permission: 3,
						},
				  }
				: {}),
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
}

const AdvancementTargets: PartialTreeNode = Object.freeze({
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
})

const DataSource = Object.freeze({
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
})

const DataTarget = Object.freeze({
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
})

const DataModifySource: PartialTreeNode = Object.freeze({
	children: {
		from: DataSource,
	},
})

const DataModifyOperation: PartialTreeNode = Object.freeze({
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
})

const ExecuteCondition: PartialTreeNode = Object.freeze({
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
})

const ExecuteStoreTarget: PartialTreeNode = Object.freeze({
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
})

const LootSource: PartialTreeNode = Object.freeze({
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
})

const ObjectiveWriteTargets: PartialTreeNode = Object.freeze({
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
})

const RecipeTargets: PartialTreeNode = Object.freeze({
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
})

const Sound: PartialTreeNode = Object.freeze({
	children: {
		sound: {
			properties: {
				category: 'sound_event',
			},
		},
	},
})
