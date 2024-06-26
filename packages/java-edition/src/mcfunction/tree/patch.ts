import { SymbolAccessType } from '@spyglassmc/core'
import type { PartialRootTreeNode, PartialTreeNode } from '@spyglassmc/mcfunction'
import { ReleaseVersion } from '../../dependency/index.js'
import type { NbtParserProperties } from './argument.js'

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
					get: getDataPatch('target', 'path'),
					merge: getDataPatch('target', 'nbt', {
						isMerge: true,
						vaultAccessType: SymbolAccessType.Write,
					}),
					modify: getDataPatch('target', 'targetPath', {
						nbtAccessType: SymbolAccessType.Write,
						vaultAccessType: SymbolAccessType.Write,
						children: (type) => ({
							append: getDataModifySource(type, {
								isListIndex: true,
							}),
							insert: {
								children: {
									index: getDataModifySource(type),
								},
							},
							merge: getDataModifySource(type, {
								isMerge: true,
							}),
							prepend: getDataModifySource(type, {
								isListIndex: true,
							}),
							set: getDataModifySource(type),
						}),
					}),
					remove: getDataPatch('target', 'path', {
						nbtAccessType: SymbolAccessType.Write,
						vaultAccessType: SymbolAccessType.Write,
					}),
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
			function: {
				children: {
					name: {
						...(ReleaseVersion.cmp(release, '1.20.2') >= 0
							? {
								children: {
									// Added in 23w31a (1.20.2, pack format 16)
									arguments: {
										properties: {
											dispatcher: 'minecraft:macro_function',
											dispatchedBy: 'name',
										} satisfies NbtParserProperties,
									},
									with: getDataPatch('source', 'path'),
								},
							}
							: {}),
					},
				},
			},
			...(ReleaseVersion.cmp(release, '1.17') >= 0
				? {
					// Added in 20w46a (1.17, pack format 7)
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
																									category:
																										'item_modifier',
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
																									category:
																										'item_modifier',
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
																									category:
																										'item_modifier',
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
																									category:
																										'item_modifier',
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
					// Added in 21w37a (1.18, pack format 8)
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
			...(ReleaseVersion.isBetween(release, '1.16', '1.19')
				? {
					// Added in 20w06a (1.16, pack format 5)
					// Removed in 22w19a (1.19, pack format 10)
					locatebiome: {
						children: {
							biome: {
								properties: {
									category: 'worldgen/biome',
									// Allowed in 1.18.2-pre1 (1.18.2, pack format 9)
									allowTag: ReleaseVersion.cmp(release, '1.18.2') >= 0,
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
					// Added in 1.17 Pre-release 1 (1.17, pack format 7)
					perf: {
						permission: 4,
					},
				}
				: {}),
			...(ReleaseVersion.cmp(release, '1.19') >= 0
				? {
					// Added in 22w18a (1.19, pack format 10)
					place: {
						children: {
							jigsaw: {
								children: {
									pool: {
										children: {
											target: {
												properties: {
													category: 'jigsaw_block_name',
													allowUnknown: true,
												},
											},
										},
									},
								},
							},
							template: {
								children: {
									template: {
										properties: {
											category: 'structure',
										},
									},
								},
							},
						},
					},
				}
				: {}),
			playsound: Sound,
			publish: {
				permission: 4,
			},
			...(ReleaseVersion.cmp(release, '1.20.2') >= 0
				? {
					// Added in 23w31a (1.20.2, pack format 16)
					random: {
						children: {
							reset: {
								children: {
									sequence: {
										properties: {
											category: 'random_sequence',
											allowUnknown: true,
										},
									},
								},
							},
							roll: {
								children: {
									range: {
										children: {
											sequence: {
												properties: {
													category: 'random_sequence',
													allowUnknown: true,
												},
											},
										},
									},
								},
							},
							value: {
								children: {
									range: {
										children: {
											sequence: {
												properties: {
													category: 'random_sequence',
													allowUnknown: true,
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
			schedule: {
				children: {
					clear: {
						children: {
							function: {
								parser: 'minecraft:function',
								properties: undefined,
							},
						},
					},
				},
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
			summon: {
				children: {
					entity: {
						children: {
							pos: {
								children: {
									nbt: {
										properties: {
											dispatcher: 'minecraft:entity',
											dispatchedBy: 'entity',
										} satisfies NbtParserProperties,
									},
								},
							},
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
			...(ReleaseVersion.cmp(release, '1.20.3') >= 0
				? {
					// Added in 23w43a (1.20.3, pack format 22)
					tick: {
						permission: 3,
					},
				}
				: {}),
			tm: {
				permission: 0,
			},
			...(ReleaseVersion.cmp(release, '1.20.5') >= 0
				? {
					// Added in 24w04a (1.20.5, pack format 29)
					transfer: {
						permission: 3,
					},
				}
				: {}),
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

/**
 * Return the command tree patch for anything related to data sources as used in
 * `data`, `execute if` and `execute store` commands.
 *
 * A **vault** refers to a block, an entity, or a storage that contains NBT data.
 *
 * e.g., in a syntax like
 * `block <targetPos>|entity <target>|storage <target>) <targetPath>`, the
 * `<targetPos>` and `<target>` arguments identify a vault, and the
 * `<targetPath>` argument is an NBT path that points to data in the vault.
 *
 * @param vaultKey Key of the argument identifying a vault. This argument should
 *                 be a vec3, an entity, or a storage resource location.
 * @param nbtKey Key of the argument containing an NBT tag or an NBT path.
 * @param nbtAccessType Access type for the NBT argument. This is only
 *                      meaningful for NBT paths and should be enforced by the
 *                      NBT path checker.
 *                      Note this usually match `vaultAccessType`. The only case
 *                      where they don't match is in `data merge`, where the
 *                      vault is being written to while the NBT argument is
 *                      being read from.
 *                      @default {@link SymbolAccessType.Read}
 * @param vaultAccessType Access type for the vault. This is only meaningful for
 *                        storage vaults and should be enforced by the resource
 *                        location checker.
 *                        @see {@link nbtAccessType}
 *                        @default {@link SymbolAccessType.Read}
 * @param children Optional patch for children after the NBT argument.
 */
function getDataPatch(
	vaultKey: 'source' | 'target',
	nbtKey: 'nbt' | 'path' | 'sourcePath' | 'targetPath' | 'value',
	{
		children,
		isPredicate = false,
		isMerge = false,
		nbtAccessType = SymbolAccessType.Read,
		vaultAccessType = SymbolAccessType.Read,
	}: {
		children?:
			| ((
				type: 'block' | 'entity' | 'storage',
			) => PartialTreeNode['children'])
			| undefined
		isPredicate?: boolean | undefined
		isMerge?: boolean | undefined
		nbtAccessType?: SymbolAccessType | undefined
		vaultAccessType?: SymbolAccessType | undefined
	} = {},
) {
	return Object.freeze({
		children: {
			block: {
				children: {
					[`${vaultKey}Pos`]: {
						children: {
							[nbtKey]: {
								properties: {
									dispatcher: 'minecraft:block',
									dispatchedBy: `${vaultKey}Pos`,
									accessType: nbtAccessType,
									isPredicate,
									isMerge,
								} satisfies NbtParserProperties,
								...children ? { children: children('block') } : {},
							},
						},
					},
				},
			},
			entity: {
				children: {
					[vaultKey]: {
						children: {
							[nbtKey]: {
								properties: {
									dispatcher: 'minecraft:entity',
									dispatchedBy: vaultKey,
									accessType: nbtAccessType,
									isPredicate,
									isMerge,
								} satisfies NbtParserProperties,
								...children ? { children: children('entity') } : {},
							},
						},
					},
				},
			},
			storage: {
				children: {
					[vaultKey]: {
						properties: {
							category: 'storage',
							accessType: vaultAccessType,
						},
						children: {
							[nbtKey]: {
								properties: {
									dispatcher: 'minecraft:storage',
									dispatchedBy: vaultKey,
									accessType: nbtAccessType,
									isPredicate,
									isMerge,
								} satisfies NbtParserProperties,
								...children ? { children: children('storage') } : {},
							},
						},
					},
				},
			},
		},
	})
}

const getDataModifySource = (
	type: 'block' | 'entity' | 'storage',
	{
		isMerge = false,
		isListIndex = false,
	}: {
		isMerge?: boolean | undefined
		isListIndex?: boolean | undefined
	} = {},
): PartialTreeNode =>
	Object.freeze({
		children: {
			from: getDataPatch('source', 'sourcePath'),
			string: getDataPatch('source', 'sourcePath'),
			value: {
				children: {
					value: {
						properties: {
							dispatcher: `minecraft:${type}`,
							dispatchedBy: type === 'block' ? 'targetPos' : 'target',
							indexedBy: 'targetPath',
							isMerge,
							isListIndex,
						} satisfies NbtParserProperties,
					},
				},
			},
		},
	})

const ExecuteCondition: PartialTreeNode = Object.freeze({
	children: {
		data: getDataPatch('source', 'path', {
			isPredicate: true,
		}),
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
		...getDataPatch('target', 'path', {
			nbtAccessType: SymbolAccessType.Write,
			vaultAccessType: SymbolAccessType.Write,
		})
			.children,
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
