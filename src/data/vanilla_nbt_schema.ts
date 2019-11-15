/**
 * The following contents are adjusted from [mc-nbt-paths](https://github.com/MrYurihi/mc-nbt-paths).
 * I personally really appreciate what MrYurihi, Levertion and Bassab03 have done, and thanks for your 
 * `Unlicense` license, which is really cool.
 */
export default {
	"block/banner.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json",
			"../ref/nameable.json"
		],
		"children": {
			"Base": {
				"type": "int",
				"description": "The base color of the banner"
			},
			"Patterns": {
				"type": "compound",
				"children": {
					"Color": {
						"type": "int",
						"description": "The color of the pattern"
					},
					"Pattern": {
						"type": "string",
						"description": "The name of the pattern",
						"suggestions": [
							{
								"value": "bs",
								"description": "Bottom Stripe (Base)"
							},
							{
								"value": "bl",
								"description": "Bottom Left Corner (Base dexter canton)"
							},
							{
								"value": "gru",
								"description": "Gradient upside-down (Base gradient)"
							},
							{
								"value": "bts",
								"description": "Bottom Triangle Sawtooth (Base indented)"
							},
							{
								"value": "br",
								"description": "Bottom Right Corner (Base sinister canton)"
							},
							{
								"value": "drs",
								"description": "Down Right Stripe (Bend)"
							},
							{
								"value": "dls",
								"description": "Down Left Stripe (Bend sinister)"
							},
							{
								"value": "bo",
								"description": "Border (Bordure)"
							},
							{
								"value": "cbo",
								"description": "Curly Border (Bordure indented)"
							},
							{
								"value": "bt",
								"description": "Bottom Triangle (Chevron)"
							},
							{
								"value": "ts",
								"description": "Top Stripe (Chief)"
							},
							{
								"value": "tl",
								"description": "Top Left Corner (Chief dexter canton)"
							},
							{
								"value": "tts",
								"description": "Top Triangle Sawtooth (Chief indented)"
							}
						]
					}
				}
			}
		}
	},
	"block/beacon.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json",
			"../ref/lockable.json"
		],
		"children": {
			"Levels": {
				"type": "int",
				"description": "The number of pyramid steps this beacon is on",
				"suggestions": [
					"0",
					"1",
					"2",
					"3",
					"4"
				]
			},
			"Primary": {
				"type": "int",
				"suggestions": [
					{
						"parser": "NumericID",
						"params": [
							"minecraft:mob_effect"
						]
					}
				]
			},
			"Secondary": {
				"type": "int",
				"suggestions": [
					{
						"parser": "NumericID",
						"params": [
							"minecraft:mob_effect"
						]
					}
				]
			}
		}
	},
	"block/beehive.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json"
		],
		"children": {
			"FlowerPos": {
				"type": "compound",
				"children": {
					"X": {
						"type": "int"
					},
					"Y": {
						"type": "int"
					},
					"Z": {
						"type": "int"
					}
				}
			},
			"Bees": {
				"type": "list",
				"item": {
					"type": "compound",
					"children": {
						"EntityData": {
							"ref": "../entity/bee.json"
						},
						"MinOccupationTicks": {
							"type": "int"
						},
						"TicksInHive": {
							"type": "int"
						}
					}
				}
			}
		}
	},
	"block/brewing_stand.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json",
			"../ref/nameable.json",
			"../ref/lockable.json"
		],
		"children": {
			"Items": {
				"type": "list",
				"item": {
					"ref": "../ref/inventory_item.json"
				},
				"description": "Items in the brewing stand"
			},
			"BrewTime": {
				"type": "int",
				"description": "The number of ticks left in brewing"
			},
			"Fuel": {
				"type": "byte",
				"description": "The amount of active fuel (Not in the slot)"
			}
		}
	},
	"block/chest.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json",
			"../ref/inventory_holder.json",
			"../ref/nameable.json",
			"../ref/lockable.json"
		]
	},
	"block/command_block.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json",
			"../ref/nameable.json"
		],
		"children": {
			"auto": {
				"type": "byte",
				"description": "Whether the command block should be automatically powered"
			},
			"Command": {
				"type": "string",
				"description": "The command to run",
				"suggestions": [
					{
						"parser": "#",
						"params": [
							null,
							"commands"
						]
					}
				]
			},
			"conditionMet": {
				"type": "byte",
				"description": "If the command block executed last time it was powered (True if not conditional)"
			},
			"LastExecution": {
				"type": "long",
				"description": "Tick the chain command block last executed"
			},
			"LastOutput": {
				"type": "string",
				"description": "The description of the last output"
			},
			"powered": {
				"type": "byte",
				"description": "If the command block is powered by redstone"
			},
			"SuccessCount": {
				"type": "int",
				"description": "The success count of the command run"
			},
			"TrackOutput": {
				"type": "byte",
				"description": "Should the command block should write to LastOutput"
			},
			"UpdateLastExecution": {
				"type": "byte",
				"description": "Should the command block only execute once a tick"
			}
		}
	},
	"block/comparator.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json"
		],
		"children": {
			"OutputSignal": {
				"type": "int",
				"description": "The redstone output strength given off by this comparator"
			}
		}
	},
	"block/enchanting_table.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json",
			"../ref/nameable.json"
		]
	},
	"block/end_gateway.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json"
		],
		"children": {
			"Age": {
				"type": "long",
				"description": "The age in ticks of this gateway. If below 200, will display purple beam"
			},
			"ExactTeleport": {
				"type": "byte",
				"description": "Should an entity teleport to the exact location of the exit portal"
			},
			"ExitPortal": {
				"type": "compound",
				"children": {
					"X": {
						"type": "int",
						"description": "The x coordinate of the exit"
					},
					"Y": {
						"type": "int",
						"description": "The y coordinate of the exit"
					},
					"Z": {
						"type": "int",
						"description": "The z coordinate of the exit"
					}
				},
				"description": "Coordinates of where the gateway should teleport entities to"
			}
		}
	},
	"block/furnace.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json",
			"../ref/nameable.json",
			"../ref/lockable.json"
		],
		"children": {
			"BurnTime": {
				"type": "short",
				"description": "Number of ticks until fuel runs out"
			},
			"CookTime": {
				"type": "short",
				"description": "Number of ticks the current item has been smelting"
			},
			"CookTimeTotal": {
				"type": "short",
				"description": "How long (in ticks) the item takes to smelt"
			},
			"Items": {
				"type": "list",
				"item": {
					"ref": "../ref/inventory_item.json"
				},
				"description": "Items in the furnace"
			}
		}
	},
	"block/group/command_block.json": [
		"minecraft:command_block",
		"minecraft:chain_command_block",
		"minecraft:repeating_command_block"
	],
	"block/group/shulker_box.json": [
		"minecraft:shulker_box",
		"minecraft:white_shulker_box",
		"minecraft:orange_shulker_box",
		"minecraft:magenta_shulker_box",
		"minecraft:light_blue_shulker_box",
		"minecraft:yellow_shulker_box",
		"minecraft:lime_shulker_box",
		"minecraft:pink_shulker_box",
		"minecraft:gray_shulker_box",
		"minecraft:light_gray_shulker_box",
		"minecraft:cyan_shulker_box",
		"minecraft:purple_shulker_box",
		"minecraft:blue_shulker_box",
		"minecraft:brown_shulker_box",
		"minecraft:green_shulker_box",
		"minecraft:red_shulker_box",
		"minecraft:black_shulker_box"
	],
	"block/hopper.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json",
			"../ref/inventory_holder.json",
			"../block/chest.json"
		],
		"children": {
			"TransferCooldown": {
				"type": "int",
				"description": "Number of ticks before the next item is transfered"
			}
		}
	},
	"block/jukebox.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json"
		],
		"children": {
			"RecordItem": {
				"ref": "../ref/item.json"
			}
		}
	},
	"block/mob_spawner.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json",
			"../ref/spawner.json"
		]
	},
	"block/player_head.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json"
		],
		"children": {
			"Owner": {
				"description": "The skin displayed by this head",
				"type": "compound",
				"children": {
					"Id": {
						"type": "string",
						"description": "UUID of the owning player"
					},
					"Name": {
						"type": "string",
						"description": "Name of the owning player"
					},
					"Properties": {
						"type": "compound",
						"description": "Properties of the skull",
						"children": {
							"textures": {
								"description": "A list of textures",
								"type": "list",
								"item": {
									"type": "compound",
									"children": {
										"Value": {
											"type": "string",
											"description": "Base64 encoded JSON object of the texture"
										},
										"Signature": {
											"type": "string",
											"description": "The signiature of this skull"
										}
									}
								}
							}
						}
					}
				}
			}
		}
	},
	"block/sign.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json"
		],
		"children": {
			"Text1": {
				"type": "string",
				"description": "Text component of the text on line 1",
				"suggestions": [
					{
						"parser": "TextComponent"
					}
				]
			},
			"Text2": {
				"type": "string",
				"description": "Text component of the text on line 2",
				"suggestions": [
					{
						"parser": "TextComponent"
					}
				]
			},
			"Text3": {
				"type": "string",
				"description": "Text component of the text on line 3",
				"suggestions": [
					{
						"parser": "TextComponent"
					}
				]
			},
			"Text4": {
				"type": "string",
				"description": "Text component of the text on line 4",
				"suggestions": [
					{
						"parser": "TextComponent"
					}
				]
			}
		}
	},
	"block/structure_block.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json"
		],
		"children": {
			"author": {
				"type": "string",
				"description": "The author of this structure"
			},
			"ignoreEntities": {
				"type": "byte",
				"description": "Should the structure ignore entities"
			},
			"integrity": {
				"type": "float",
				"description": "What percent of blocks should be placed"
			},
			"metadata": {
				"type": "string"
			},
			"mirror": {
				"type": "string",
				"description": "The mirror if this structure",
				"suggestions": [
					"NONE",
					"LEFT_RIGHT",
					"FRONT_BACK"
				]
			},
			"mode": {
				"type": "string",
				"description": "Mode of this structure block",
				"suggestions": [
					"SAVE",
					"LOAD",
					"CORNER",
					"DATA"
				]
			},
			"name": {
				"type": "string",
				"description": "Name of the structure"
			},
			"posX": {
				"type": "int",
				"description": "Offset of the structure on the x axis "
			},
			"posY": {
				"type": "int",
				"description": "Offset of the structure on the y axis "
			},
			"posZ": {
				"type": "int",
				"description": "Offset of the structure on the z axis "
			},
			"powered": {
				"type": "byte",
				"description": "If the structure block is powered by redstone"
			},
			"rotation": {
				"type": "string",
				"description": "Rotation of the structure",
				"suggestions": [
					"NONE",
					"CLOCKWISE_90",
					"COUNTERCLOCKWISE_90",
					"CLOCKWISE_180"
				]
			},
			"seed": {
				"type": "long",
				"description": "The seed for the integerity"
			},
			"showair": {
				"type": "byte",
				"description": "Should the structure block show air"
			},
			"showboundingbox": {
				"type": "byte",
				"description": "Should the structure block show the bounding box"
			},
			"sizeX": {
				"type": "int",
				"description": "Size of the structure on the x axis. (Length)"
			},
			"sizeY": {
				"type": "int",
				"description": "Size of the structure on the y axis. (Height)"
			},
			"sizeZ": {
				"type": "int",
				"description": "Size of the structure on the z axis. (Width)"
			}
		}
	},
	"entity/area_effect_cloud.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"Age": {
				"type": "int",
				"description": "Number of ticks the area effect cloud has existed"
			},
			"Color": {
				"type": "int",
				"description": "Color of the particles"
			},
			"Duration": {
				"type": "int",
				"description": "Many ticks the area effect cloud should last",
				"suggestions": [
					"0",
					"2147483647"
				]
			},
			"ReapplicationDelay": {
				"type": "int",
				"description": "How many ticks until the effect get reapplied"
			},
			"WaitTime": {
				"type": "int",
				"description": "Time before the area effect cloud appears"
			},
			"OwnerUUIDLeast": {
				"type": "long",
				"description": "UUIDLeast of the player who threw the lingering potion"
			},
			"OwnerUUIDMost": {
				"type": "long",
				"description": "UUIDMost of the player who threw the lingering potion"
			},
			"DurationOnUse": {
				"type": "float",
				"description": "How much \"Duration\" increases when the effect gets applied"
			},
			"Radius": {
				"type": "float",
				"description": "Radius of the area effect cloud"
			},
			"RadiusOnUse": {
				"type": "float",
				"description": "How much the radius should decrease when the effect gets applied"
			},
			"Particle": {
				"type": "string",
				"description": "Particle id displayed"
			},
			"ParticleParam1": {
				"type": "int"
			},
			"ParticleParam2": {
				"type": "int"
			},
			"Effects": {
				"type": "list",
				"item": {
					"ref": "../ref/potion_effect.json"
				}
			}
		}
	},
	"entity/armor_stand.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"DisabledSlots": {
				"type": "int",
				"description": "What slots should be disabled",
				"suggestions": [
					{
						"value": "2039583",
						"description": "Disables everything"
					}
				]
			},
			"HandItems": {
				"type": "list",
				"item": {
					"ref": "../ref/inventory_item.json"
				},
				"description": "Items in main and offhand"
			},
			"ArmorItems": {
				"type": "list",
				"item": {
					"ref": "../ref/inventory_item.json"
				},
				"description": "Armor in armor slots"
			},
			"Marker": {
				"type": "byte",
				"description": "Should the armor stand have no hitbox"
			},
			"Invisible": {
				"type": "byte",
				"description": "Should the armor stand be invisible"
			},
			"NoBasePlate": {
				"type": "byte",
				"description": "Should the armor stand have no base plate"
			},
			"FallFlying": {
				"type": "byte",
				"description": "Should the entity glide when falling as long as it has an elytra in it's chest slot"
			},
			"Pose": {
				"type": "compound",
				"description": "The post of the armor stand",
				"children": {
					"Body": {
						"type": "list",
						"item": {
							"type": "float"
						}
					},
					"LeftArm": {
						"type": "list",
						"item": {
							"type": "float"
						}
					},
					"RightArm": {
						"type": "list",
						"item": {
							"type": "float"
						}
					},
					"LeftLeg": {
						"type": "list",
						"item": {
							"type": "float"
						}
					},
					"RightLeg": {
						"type": "list",
						"item": {
							"type": "float"
						}
					},
					"Head": {
						"type": "list",
						"item": {
							"type": "float"
						}
					}
				}
			},
			"ShowArms": {
				"type": "byte",
				"description": "Should the arms be displayed"
			},
			"Small": {
				"type": "byte",
				"description": "Should the armor stand be small"
			}
		}
	},
	"entity/arrow.json": {
		"type": "compound",
		"child_ref": [
			"../ref/projectile.json"
		],
		"children": {
			"pickup": {
				"type": "byte",
				"description": "Can the arrow be picked up"
			},
			"player": {
				"type": "byte",
				"description": "If a player shot the arrow"
			},
			"life": {
				"type": "short",
				"description": "How many ticks the arrow has exsisted without moving"
			},
			"damage": {
				"type": "double",
				"description": "How much damage the arrow does"
			},
			"inGround": {
				"type": "byte",
				"description": "If the arrow is in a block"
			},
			"crit": {
				"type": "byte",
				"description": "Should the arrow do critical damage"
			},
			"Potion": {
				"type": "string",
				"description": "Name of the potion effect on the arrow"
			},
			"CustomPotionEffects": {
				"type": "list",
				"item": {
					"ref": "../ref/potion_effect.json"
				},
				"description": "List of potion effects to give to the entity who got hit"
			}
		}
	},
	"entity/bat.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"BatFlags": {
				"type": "byte",
				"description": "Is the bat upside-down"
			}
		}
	},
	"entity/bee.json": {
		"type": "compound",
		"child_ref": [
			"../ref/breedable.json"
		],
		"children": {
			"HivePos": {
				"type": "compound",
				"children": {
					"X": {
						"type": "int"
					},
					"Y": {
						"type": "int"
					},
					"Z": {
						"type": "int"
					}
				}
			},
			"FlowerPos": {
				"type": "compound",
				"children": {
					"X": {
						"type": "int"
					},
					"Y": {
						"type": "int"
					},
					"Z": {
						"type": "int"
					}
				}
			},
			"HasNectar": {
				"type": "byte"
			},
			"HasStung": {
				"type": "byte"
			},
			"TicksSincePollination": {
				"type": "int"
			},
			"CannotEnterHiveTicks": {
				"type": "int"
			},
			"CropsGrownSincePollination": {
				"type": "int"
			},
			"Anger": {
				"type": "int"
			},
			"HurtBy": {
				"type": "string"
			}
		}
	},
	"entity/boat.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"Type": {
				"type": "string",
				"description": "Type of the boat",
				"suggestions": [
					"oak",
					"spruce",
					"birch",
					"jungle",
					"acacia",
					"dark_oak"
				]
			}
		}
	},
	"entity/chest_horse.json": {
		"type": "compound",
		"child_ref": [
			"../ref/horse.json"
		],
		"children": {
			"ChestedHorse": {
				"type": "byte",
				"description": "If the horse has a chest"
			},
			"Items": {
				"type": "list",
				"item": {
					"ref": "./inventory_item.json"
				},
				"description": "Items in the horse chest"
			}
		}
	},
	"entity/chest_minecart.json": {
		"type": "compound",
		"child_ref": [
			"./minecart.json",
			"../ref/inventory_holder.json"
		]
	},
	"entity/commandblock_minecart.json": {
		"type": "compound",
		"child_ref": [
			"./minecart.json"
		],
		"children": {
			"Command": {
				"type": "string",
				"description": "The command to run",
				"suggestions": [
					{
						"parser": "#",
						"params": [
							null,
							"commands"
						]
					}
				]
			},
			"SuccessCount": {
				"type": "int",
				"description": "The success count of the command run"
			},
			"LastOutput": {
				"type": "string",
				"description": "The description of the last output"
			},
			"TrackOutput": {
				"type": "byte",
				"description": "Should the command block should write to LastOutput"
			}
		}
	},
	"entity/creeper.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"powered": {
				"type": "byte",
				"description": "If the creeper is a charged creeper"
			},
			"ExplosionRadius": {
				"type": "byte",
				"description": "Radius of the resulting explosion"
			},
			"Fuse": {
				"type": "short",
				"description": "How long until the creeper blows up"
			},
			"ignited": {
				"type": "byte",
				"description": "If the creeper was ignited with flint and steel"
			}
		}
	},
	"entity/ender_crystal.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"ShowBottom": {
				"type": "byte",
				"description": "Should the bottom of the ender crystal show"
			},
			"BeamTarget": {
				"description": "Where the beam should point to",
				"type": "compound",
				"children": {
					"X": {
						"type": "int",
						"description": "X coordinate of the beam target"
					},
					"Y": {
						"type": "int",
						"description": "X coordinate of the beam target"
					},
					"Z": {
						"type": "int",
						"description": "X coordinate of the beam target"
					}
				}
			}
		}
	},
	"entity/ender_dragon.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"DragonPhase": {
				"type": "int",
				"description": "Phase the dragon is in",
				"suggestions": [
					{
						"value": "0",
						"description": "Dragon is circling aroung island"
					},
					{
						"value": "1",
						"description": "Preparing to shoot fireball"
					},
					{
						"value": "2",
						"description": "Flying to the portal"
					},
					{
						"value": "3",
						"description": "Landing on the portal"
					},
					{
						"value": "4",
						"description": "Taking off from the portal"
					},
					{
						"value": "5",
						"description": "Landed. Attacking player with dragon breath"
					},
					{
						"value": "6",
						"description": "Landed. Searching for player to attack"
					},
					{
						"value": "7",
						"description": "Landed. Roaring"
					},
					{
						"value": "8",
						"description": "Flying at player"
					},
					{
						"value": "9",
						"description": "Dying."
					},
					{
						"value": "10",
						"description": "Flapping wings and not moving"
					}
				]
			}
		}
	},
	"entity/enderman.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"carriedBlockState": {
				"type": "compound",
				"description": "The carried block",
				"children": {
					"Name": {
						"type": "string",
						"description": "ID of carried block",
						"suggestions": [
							{
								"parser": "NamespacedID",
								"params": [
									"minecraft:block"
								]
							}
						]
					},
					"Properties": {
						"type": "compound",
						"description": "Name value pairs of block states and values"
					}
				}
			}
		}
	},
	"entity/endermite.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"Lifetime": {
				"type": "int",
				"description": "How many ticks the endermite has existed"
			},
			"PlayerSpawned": {
				"type": "byte",
				"description": "If the endermite was spawned by a player (not through an enderpearl)"
			}
		}
	},
	"entity/evocation_fangs.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"Warmup": {
				"type": "int",
				"description": "How many ticks before the fangs apear"
			},
			"Owner": {
				"type": "compound",
				"description": "UUID of the entity that summoned the fangs",
				"children": {
					"OwnerUUIDLeast": {
						"type": "long",
						"description": "UUIDLeast of the owner"
					},
					"OwnerUUIDMost": {
						"type": "long",
						"description": "UUIDMost of the owner"
					}
				}
			}
		}
	},
	"entity/falling_block.json": {
		"type": "compound",
		"child_ref": [
			"../ref/block_entity.json"
		],
		"children": {
			"TileEntityData": {
				"ref": "compound"
			},
			"BlockState": {
				"description": "Block that the falling block represents",
				"type": "compound",
				"children": {
					"Name": {
						"type": "string",
						"description": "ID of the block",
						"suggestions": [
							{
								"parser": "NamespacedID",
								"params": [
									"minecraft:block"
								]
							}
						]
					},
					"Properties": {
						"type": "compound",
						"description": "Name value pairs of block states and values"
					}
				}
			},
			"Time": {
				"type": "int",
				"description": "Time until the block disapears. Disapears if it reaches 0 or 600",
				"suggestions": [
					"-2147483648"
				]
			},
			"DropItem": {
				"type": "byte",
				"description": "Should the block drop as an item if the block cannot be placed"
			},
			"HurtEntities": {
				"type": "byte",
				"description": "Should the block hurt entities"
			},
			"FallHurtMax": {
				"type": "int",
				"description": "Maximum amount of damage the block can do"
			},
			"FallHurtAmount": {
				"type": "float",
				"description": "How much damage the block should do initially"
			}
		}
	},
	"entity/fireball.json": {
		"type": "compound",
		"child_ref": [
			"../ref/fireball_base.json"
		],
		"children": {
			"ExplosionPower": {
				"type": "int",
				"description": "Power of the explosion"
			}
		}
	},
	"entity/fireworks_rocket.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"Life": {
				"type": "int",
				"description": "How long this rocket has been flying"
			},
			"LifeTime": {
				"type": "int",
				"description": "How many ticks until the rocket explodes"
			},
			"FireworksItem": {
				"ref": "../item/firework_rocket.json",
				"description": "The rocket item to use for explosions"
			}
		}
	},
	"entity/fish.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"FromBucket": {
				"type": "byte",
				"description": "If the fish is from a bucket"
			}
		}
	},
	"entity/furnace_minecart.json": {
		"type": "compound",
		"child_ref": [
			"./minecart.json"
		],
		"children": {
			"PushX": {
				"type": "double",
				"description": "How much this should push on the X axis"
			},
			"PushZ": {
				"type": "double",
				"description": "How much this should push on the Y axis"
			},
			"Fuel": {
				"type": "short",
				"description": "How much this should push on the Z axis"
			}
		}
	},
	"entity/ghast.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"ExplosionPower": {
				"type": "int",
				"description": "Explosion power of created fireballs"
			}
		}
	},
	"entity/group/breedable.json": [
		"minecraft:cow",
		"minecraft:mooshroom",
		"minecraft:polar_bear"
	],
	"entity/group/fireball.json": [
		"minecraft:dragon_fireball",
		"minecraft:small_fireball",
		"minecraft:wither_skull"
	],
	"entity/group/mob.json": [
		"minecraft:blaze",
		"minecraft:cave_spider",
		"minecraft:elder_guardian",
		"minecraft:guardian",
		"minecraft:giant",
		"minecraft:silverfish",
		"minecraft:skeleton",
		"minecraft:spider",
		"minecraft:squid",
		"minecraft:stray",
		"minecraft:witch",
		"minecraft:wither_skeleton",
		"minecraft:dolphin"
	],
	"entity/group/throwable.json": [
		"minecraft:egg",
		"minecraft:ender_pearl",
		"minecraft:snowball",
		"minecraft:xp_bottle"
	],
	"entity/hopper_minecart.json": {
		"type": "compound",
		"child_ref": [
			"./minecart.json",
			"../ref/inventory_holder.json"
		],
		"children": {
			"TransferCooldown": {
				"type": "int",
				"description": "How many ticks until the next item gets transfered"
			},
			"Enabled": {
				"type": "byte",
				"description": "Is the hopper minecart enabled"
			}
		}
	},
	"entity/horse.json": {
		"type": "compound",
		"child_ref": [
			"../ref/horse.json"
		],
		"children": {
			"Variant": {
				"type": "int",
				"description": "Type of horse"
			}
		}
	},
	"entity/illager_beast.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"AttackTick": {
				"type": "int",
				"description": "How many ticks until the beast can attack"
			},
			"StunTick": {
				"type": "int",
				"description": "How many ticks the beast is stunned for"
			},
			"RoarTick": {
				"type": "int",
				"description": "How many ticks until the beast roars"
			}
		}
	},
	"entity/item.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"Age": {
				"type": "short",
				"description": "How long the item has been alive"
			},
			"Health": {
				"type": "short",
				"description": "Health of the item"
			},
			"PickupDelay": {
				"type": "short",
				"description": "How long before the item can be picked up"
			},
			"Owner": {
				"description": "UUID of the owner of the item",
				"type": "compound",
				"children": {
					"M": {
						"description": "UUIDMost of the owner",
						"type": "long"
					},
					"L": {
						"description": "UUIDLeast of the owner",
						"type": "long"
					}
				}
			},
			"Thrower": {
				"type": "compound",
				"description": "UUID of the thrower of the item",
				"children": {
					"M": {
						"description": "UUIDMost of the thrower",
						"type": "long"
					},
					"L": {
						"description": "UUIDLeast of the thrower",
						"type": "long"
					}
				}
			},
			"Item": {
				"ref": "../ref/item.json",
				"description": "The item that this item entity represents"
			}
		}
	},
	"entity/item_frame.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"TileX": {
				"type": "int",
				"description": "X value of the block the frame is on"
			},
			"TileY": {
				"type": "int",
				"description": "Y value of the block the frame is on"
			},
			"TileZ": {
				"type": "int",
				"description": "Z value of the block the frame is on"
			},
			"Facing": {
				"type": "byte",
				"description": "The facing direction of the item frame"
			},
			"Item": {
				"ref": "../ref/inventory_item.json",
				"description": "The item in the item frame"
			},
			"ItemDropChance": {
				"type": "float",
				"description": "Chance for item to drop"
			},
			"ItemRotation": {
				"type": "byte",
				"description": "Rotation of item"
			}
		}
	},
	"entity/llama.json": {
		"type": "compound",
		"child_ref": [
			"./breedable.json"
		],
		"children": {
			"Bred": {
				"type": "byte",
				"description": "If the llama was bred, not naturally spawned"
			},
			"EatingHaystack": {
				"type": "byte",
				"description": "If the llama is eating a haystack"
			},
			"Tame": {
				"type": "byte",
				"description": "If the llama is tamed"
			},
			"Temper": {
				"type": "int",
				"description": "How hard it is to tame. Lower values are harder"
			},
			"Variant": {
				"type": "int",
				"description": "Type of llama"
			},
			"Strength": {
				"type": "int",
				"description": "1/3 of the number of items a llama can carry."
			},
			"DecorItem": {
				"ref": "../ref/inventory_item.json",
				"description": "Item (usually carpet) on the llama"
			},
			"OwnerUUID": {
				"type": "string",
				"description": "Owner of the llama"
			},
			"Items": {
				"type": "list",
				"description": "Items carried by the llama",
				"item": {
					"ref": "./inventory_item.json"
				}
			}
		}
	},
	"entity/llama_spit.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"Owner": {
				"description": "UUID of the entity that made this llama spit",
				"type": "compound",
				"children": {
					"OwnerUUIDMost": {
						"type": "long",
						"description": "UUIDMost of the owner"
					},
					"OwnerUUIDLeast": {
						"type": "long",
						"description": "UUIDLeast of the owner"
					}
				}
			}
		}
	},
	"entity/minecart.json": {
		"type": "compound",
		"child_ref": [
			"./entity.json"
		],
		"children": {
			"DisplayState": {
				"type": "compound",
				"description": "Displayed block",
				"children": {
					"Tile": {
						"type": "string",
						"description": "Displayed block id"
					},
					"Properties": {
						"type": "compound",
						"description": "Key value pairs of block states and values"
					}
				}
			},
			"DisplayOffset": {
				"type": "int",
				"description": "How many pixels the display should be offset"
			}
		}
	},
	"entity/ocelot.json": {
		"type": "compound",
		"child_ref": [
			"../ref/breedable.json",
			"../ref/tameable.json"
		],
		"children": {
			"CatType": {
				"type": "int",
				"description": "Type of cat once tamed"
			}
		}
	},
	"entity/painting.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"TileX": {
				"type": "int",
				"description": "X coordinate of the block the painting is on"
			},
			"TileY": {
				"type": "int",
				"description": "Y coordinate of the block the painting is on"
			},
			"TileZ": {
				"type": "int",
				"description": "Z coordinate of the block the painting is on"
			},
			"Facing": {
				"type": "byte",
				"description": "Direction the painting is facing"
			},
			"Motive": {
				"type": "string",
				"description": "Name of painting",
				"suggestions": [
					"minecraft:kebab",
					"minecraft:aztec",
					"minecraft:alban",
					"minecraft:aztec2",
					"minecraft:bomb",
					"minecraft:plant",
					"minecraft:wasteland",
					"minecraft:wanderer",
					"minecraft:graham",
					"minecraft:pool",
					"minecraft:courbet",
					"minecraft:sunset",
					"minecraft:sea",
					"minecraft:match",
					"minecraft:bust",
					"minecraft:stage",
					"minecraft:void",
					"minecraft:skull_and_roses",
					"minecraft:wither",
					"minecraft:fighters",
					"minecraft:skeleton",
					"minecraft:donkey_kong",
					"minecraft:pointer",
					"minecraft:pigscene",
					"minecraft:burning_skull"
				]
			}
		}
	},
	"entity/panda.json": {
		"type": "compound",
		"child_ref": [
			"../ref/breedable.json"
		],
		"children": {
			"MainGene": {
				"ref": "#Gene",
				"description": "The displayed gene.\nIf this gene is recessive '(r)' and 'HiddenGene' is not the same, the panda will display the 'normal' gene"
			},
			"HiddenGene": {
				"ref": "#Gene",
				"description": "The hidden gene"
			}
		},
		"references": {
			"Gene": {
				"type": "string",
				"suggestions": [
					{
						"description": "(d)",
						"value": "normal"
					},
					{
						"description": "(d)",
						"value": "lazy"
					},
					{
						"description": "(d)",
						"value": "worried"
					},
					{
						"description": "(d)",
						"value": "playful"
					},
					{
						"description": "(r)",
						"value": "brown"
					},
					{
						"description": "(r)",
						"value": "weak"
					},
					{
						"description": "(d)",
						"value": "aggressive"
					}
				]
			}
		}
	},
	"entity/parrot.json": {
		"type": "compound",
		"child_ref": [
			"../ref/tameable.json"
		],
		"children": {
			"Variant": {
				"type": "int",
				"description": "Type of parot"
			}
		}
	},
	"entity/phantom.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"Size": {
				"type": "int",
				"description": "Size of the phantom"
			},
			"AX": {
				"type": "int",
				"description": "X coord to circle around"
			},
			"AY": {
				"type": "int",
				"description": "Y coord to circle around"
			},
			"AZ": {
				"type": "int",
				"description": "Z coord to circle around"
			}
		}
	},
	"entity/pig.json": {
		"type": "compound",
		"child_ref": [
			"../ref/breedable.json"
		],
		"children": {
			"Saddle": {
				"type": "byte",
				"description": "If the pig has a saddle"
			}
		}
	},
	"entity/potion.json": {
		"type": "compound",
		"child_ref": [
			"../ref/throwable.json"
		],
		"children": {
			"Potion": {
				"description": "The potion this thrown potion represents",
				"type": "compound",
				"child_ref": [
					"../ref/item_ntt.json"
				],
				"children": {
					"tag": {
						"ref": "../item/potion_base.json"
					}
				}
			}
		}
	},
	"entity/pufferfish_mob.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"PuffState": {
				"type": "int",
				"description": "How puffed the fish is",
				"suggestions": [
					{
						"value": "0",
						"description": "Not puffed"
					},
					{
						"value": "1",
						"description": "Medium puffed"
					},
					{
						"value": "2",
						"description": "Fully puffed"
					}
				]
			}
		}
	},
	"entity/rabbit.json": {
		"type": "compound",
		"child_ref": [
			"../ref/breedable.json"
		],
		"children": {
			"RabbitType": {
				"description": "Type of the rabbit",
				"type": "int"
			},
			"MoreCarrotTicks": {
				"description": "Ticks unntil the rabbit eats more carrots",
				"type": "int"
			}
		}
	},
	"entity/sheep.json": {
		"type": "compound",
		"child_ref": [
			"../ref/breedable.json"
		],
		"children": {
			"Sheared": {
				"type": "byte",
				"description": "If the sheep is sheared"
			},
			"Color": {
				"description": "Color of the sheep",
				"type": "byte"
			}
		}
	},
	"entity/shulker.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"Peek": {
				"type": "byte",
				"description": "Height of the top shell"
			},
			"AttachFace": {
				"type": "byte",
				"description": "The face of the block the shulker is attacked to"
			},
			"Color": {
				"type": "byte",
				"description": "Color of the shulker"
			},
			"APX": {
				"type": "int",
				"description": "Approximate x coordinate"
			},
			"APY": {
				"type": "int",
				"description": "Approximate y coordinate"
			},
			"APZ": {
				"type": "int",
				"description": "Approximate z coordinate"
			}
		}
	},
	"entity/shulker_bullet.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"Owner": {
				"description": "The entity that this bullet originated from",
				"type": "compound",
				"children": {
					"L": {
						"type": "long",
						"description": "UUIDLeast of the owner"
					},
					"M": {
						"type": "long",
						"description": "UUIDMost of the owner"
					},
					"X": {
						"type": "int",
						"description": "X position of the owner"
					},
					"Y": {
						"type": "int",
						"description": "Y position of the owner"
					},
					"Z": {
						"type": "int",
						"description": "Z position of the owner"
					}
				}
			},
			"Steps": {
				"type": "int",
				"description": "Number of blocks the bullet has traveled"
			},
			"Target": {
				"type": "compound",
				"description": "The target of the bullet",
				"children": {
					"L": {
						"type": "long",
						"description": "The UUIDLeast of the target"
					},
					"M": {
						"type": "long",
						"description": "The UUIDMost of the target"
					},
					"X": {
						"type": "int",
						"description": "X position of the target"
					},
					"Y": {
						"type": "int",
						"description": "Y position of the target"
					},
					"Z": {
						"type": "int",
						"description": "Z position of the target"
					}
				}
			},
			"TXD": {
				"type": "double",
				"description": "Offset on x axis"
			},
			"TYD": {
				"type": "double",
				"description": "Offset on y axis"
			},
			"TZD": {
				"type": "double",
				"description": "Offset on z axis"
			}
		}
	},
	"entity/skeleton_horse.json": {
		"type": "compound",
		"child_ref": [
			"../ref/horse.json"
		],
		"children": {
			"SkeletonTrap": {
				"type": "byte",
				"description": "Should the skeleton horse be a trap"
			},
			"SkeletonTrapTime": {
				"type": "int",
				"description": "How many ticks the trap horse has existed"
			}
		}
	},
	"entity/slime.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"Size": {
				"type": "int",
				"description": "Size of slime"
			},
			"wasOnGround": {
				"type": "byte",
				"description": "If the slime is touching the ground"
			}
		}
	},
	"entity/snowman.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"Pumpkin": {
				"type": "byte",
				"description": "If the snow golem has the pumpkin"
			}
		}
	},
	"entity/spawner_minecart.json": {
		"type": "compound",
		"child_ref": [
			"../ref/spawner.json",
			"../ref/minecart.json"
		]
	},
	"entity/spectral_arrow.json": {
		"type": "compound",
		"child_ref": [
			"./arrow.json"
		],
		"children": {
			"Duration": {
				"type": "int",
				"description": "How long the glowing should last"
			}
		}
	},
	"entity/spell_illager.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"SpellTicks": {
				"type": "int",
				"description": "How long until the illager casts a spell"
			}
		}
	},
	"entity/tnt.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"Fuse": {
				"type": "short",
				"description": "How long until the tnt blows up"
			}
		}
	},
	"entity/tnt_minecart.json": {
		"type": "compound",
		"child_ref": [
			"../ref/minecart.json"
		],
		"children": {
			"TNTFuse": {
				"type": "int",
				"description": "How long until the tnt minecart blows up"
			}
		}
	},
	"entity/trident.json": {
		"type": "compound",
		"child_ref": [
			"../ref/projectile.json"
		],
		"children": {
			"pickup": {
				"type": "byte",
				"description": "Can the arrow be picked up"
			},
			"life": {
				"type": "short",
				"description": "How many ticks the trident has exsisted"
			},
			"damage": {
				"type": "double",
				"description": "How much damage the trident does"
			},
			"inGround": {
				"type": "byte",
				"description": "If the trident is in a block"
			},
			"crit": {
				"type": "byte",
				"description": "Should the trident do critical damage"
			},
			"Trident": {
				"type": "compound",
				"child_ref": [
					"../roots/items.json#minecraft:trident"
				]
			}
		}
	},
	"entity/tropical_fish.json": {
		"type": "compound",
		"child_ref": [
			"./fish.json"
		],
		"children": {
			"Variant": {
				"type": "int",
				"description": "Design of the fish"
			}
		}
	},
	"entity/turtle.json": {
		"type": "compound",
		"child_ref": [
			"../ref/breedable.json"
		],
		"children": {
			"HomePosX": {
				"type": "int",
				"description": "The x coord where the turtle was born"
			},
			"HomePosY": {
				"type": "int",
				"description": "The y coord where the turtle was born"
			},
			"HomePosZ": {
				"type": "int",
				"description": "The z coord where the turtle was born"
			},
			"TravelPosX": {
				"type": "int",
				"description": "The x coord where the turtle is going to"
			},
			"TravelPosY": {
				"type": "int",
				"description": "The y coord where the turtle is going to"
			},
			"TravelPosZ": {
				"type": "int",
				"description": "The z coord where the turtle is going to"
			},
			"HasEgg": {
				"type": "byte",
				"description": "Does the turtle have layed eggs"
			}
		}
	},
	"entity/vex.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"BoundX": {
				"type": "int",
				"description": "The x coordinate of the point the vex stays around"
			},
			"BoundY": {
				"type": "int",
				"description": "The y coordinate of the point the vex stays around"
			},
			"BoundZ": {
				"type": "int",
				"description": "The z coordinate of the point the vex stays around"
			},
			"LifeTicks": {
				"type": "int",
				"description": "How many ticks the vex has been alive for"
			}
		}
	},
	"entity/villager.json": {
		"type": "compound",
		"child_ref": [
			"../ref/breedable.json"
		],
		"children": {
			"VillagerData": {
				"type": "compound",
				"children": {
					"level": {
						"type": "int"
					},
					"profession": {
						"type": "string",
						"suggestions": [
							"minecraft:armorer",
							"minecraft:butcher",
							"minecraft:cartographer",
							"minecraft:cleric",
							"minecraft:farmer",
							"minecraft:fisherman",
							"minecraft:fletcher",
							"minecraft:leatherworker",
							"minecraft:librarian",
							"minecraft:nitwit",
							"minecraft:none",
							"minecraft:mason",
							"minecraft:shepherd",
							"minecraft:toolsmith",
							"minecraft:weaponsmith"
						]
					},
					"type": {
						"type": "string",
						"suggestions": [
							"minecraft:desert",
							"minecraft:jungle",
							"minecraft:plains",
							"minecraft:savanna",
							"minecraft:snow",
							"minecraft:swamp",
							"minecraft:taiga"
						]
					}
				}
			},
			"Gossips": {
				"type": "list",
				"item": {
					"type": "compound",
					"children": {
						"Type": {
							"type": "string",
							"suggestions": [
								"major_negative",
								"minor_negative",
								"major_positive",
								"minor_positive",
								"trading"
							]
						},
						"Value": {
							"type": "int"
						},
						"TargetMost": {
							"type": "long"
						},
						"TargetLeast": {
							"type": "long"
						}
					}
				}
			},
			"Willing": {
				"type": "byte",
				"description": "Is the villager willing to breed"
			},
			"LastRestock": {
				"type": "long"
			},
			"LastGossipDecay": {
				"type": "long"
			},
			"RestocksToday": {
				"type": "int"
			},
			"Xp": {
				"type": "int",
				"description": "The experience the villager has"
			},
			"Inventory": {
				"type": "list",
				"item": {
					"ref": "./inventory_item.json"
				},
				"description": "The items a villager has in their inventory"
			},
			"Offers": {
				"description": "Trading offers",
				"type": "compound",
				"children": {
					"Recipes": {
						"description": "List of trading offers",
						"type": "list",
						"item": {
							"description": "A trading offer",
							"type": "compound",
							"children": {
								"rewardExp": {
									"type": "byte",
									"description": "How much XP is rewarded to the player"
								},
								"maxUses": {
									"type": "int",
									"description": "How many times this trade can be used"
								},
								"uses": {
									"type": "int",
									"description": "How many times this trade has been used"
								},
								"buy": {
									"ref": "../ref/inventory_item.json",
									"description": "The first item the villager is buying"
								},
								"buyB": {
									"ref": "../ref/inventory_item.json",
									"description": "The second item the villager is buying"
								},
								"sell": {
									"ref": "../ref/inventory_item.json",
									"description": "The item the villager is selling"
								},
								"xp": {
									"type": "int",
									"description": "The experience the villager will get from this recipe"
								},
								"priceMultiplier": {
									"type": "float"
								},
								"specialPrice": {
									"type": "int"
								},
								"demand": {
									"type": "int"
								}
							}
						}
					}
				}
			}
		},
		"references": {
			"careers": {
				"references": {
					"0": {
						"type": "int",
						"suggestions": [
							{
								"value": "1",
								"description": "Farmer"
							},
							{
								"value": "2",
								"description": "Fisherman"
							},
							{
								"value": "3",
								"description": "Shepherd"
							},
							{
								"value": "4",
								"description": "Fletcher"
							}
						]
					},
					"1": {
						"type": "int",
						"suggestions": [
							{
								"value": "1",
								"description": "Librarian"
							},
							{
								"value": "2",
								"description": "Cartographer"
							}
						]
					},
					"2": {
						"type": "int",
						"suggestions": [
							{
								"value": "1",
								"description": "Cleric"
							}
						]
					},
					"3": {
						"type": "int",
						"suggestions": [
							{
								"value": "1",
								"description": "Armorer"
							},
							{
								"value": "2",
								"description": "Weapon Smith"
							},
							{
								"value": "3",
								"description": "Tool Smith"
							}
						]
					},
					"4": {
						"type": "int",
						"suggestions": [
							{
								"value": "1",
								"description": "Butcher"
							},
							{
								"value": "2",
								"description": "Leatherworker"
							}
						]
					},
					"5": {
						"type": "int",
						"suggestions": [
							{
								"value": "1",
								"description": "Nitwit"
							}
						]
					},
					"none": {
						"type": "int"
					}
				}
			}
		}
	},
	"entity/villager_careers/0.json": {
		"type": "int",
		"suggestions": [
			{
				"value": "1",
				"description": "Farmer"
			},
			{
				"value": "2",
				"description": "Fisherman"
			},
			{
				"value": "3",
				"description": "Shepherd"
			},
			{
				"value": "4",
				"description": "Fletcher"
			}
		]
	},
	"entity/villager_careers/1.json": {
		"type": "int",
		"suggestions": [
			{
				"value": "1",
				"description": "Librarian"
			},
			{
				"value": "2",
				"description": "Cartographer"
			}
		]
	},
	"entity/villager_careers/2.json": {
		"type": "int",
		"suggestions": [
			{
				"value": "1",
				"description": "Cleric"
			}
		]
	},
	"entity/villager_careers/3.json": {
		"type": "int",
		"suggestions": [
			{
				"value": "1",
				"description": "Armorer"
			},
			{
				"value": "2",
				"description": "Weapon Smith"
			},
			{
				"value": "3",
				"description": "Tool Smith"
			}
		]
	},
	"entity/villager_careers/4.json": {
		"type": "int",
		"suggestions": [
			{
				"value": "1",
				"description": "Butcher"
			},
			{
				"value": "2",
				"description": "Leatherworker"
			}
		]
	},
	"entity/villager_careers/5.json": {
		"type": "int",
		"suggestions": [
			{
				"value": "1",
				"description": "Nitwit"
			}
		]
	},
	"entity/villager_careers/none.json": {
		"type": "int"
	},
	"entity/villager_golem.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"PlayerCreated": {
				"type": "byte",
				"description": "If a player created the golem"
			}
		}
	},
	"entity/vindication_illager.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"Johnny": {
				"type": "byte",
				"description": "Should the vindicator attack all mobs"
			}
		}
	},
	"entity/wither.json": {
		"type": "compound",
		"child_ref": [
			"../ref/mob.json"
		],
		"children": {
			"Invul": {
				"type": "byte",
				"description": "How many ticks of invulnerability left"
			}
		}
	},
	"entity/wolf.json": {
		"type": "compound",
		"child_ref": [
			"../ref/breedable.json",
			"../ref/tameable.json"
		],
		"children": {
			"Angry": {
				"type": "byte",
				"description": "If the wolf is angry"
			},
			"CollarColor": {
				"type": "byte",
				"description": "Collar color for dogs"
			}
		}
	},
	"entity/xp_orb.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"Age": {
				"type": "short",
				"description": "How long the XP orb has existed"
			},
			"Health": {
				"type": "byte",
				"description": "How much health the orb has"
			},
			"Value": {
				"type": "short",
				"description": "How much experience the orb gives"
			}
		}
	},
	"entity/zombie_pigman.json": {
		"type": "compound",
		"child_ref": [
			"../ref/zombie.json"
		],
		"children": {
			"Anger": {
				"type": "short",
				"description": "How many ticks until it isn't angry"
			},
			"HurtBy": {
				"type": "string",
				"description": "The UUID of the last player who attacked it"
			}
		}
	},
	"entity/zombie_villager.json": {
		"type": "compound",
		"child_ref": [
			"../ref/zombie.json"
		],
		"children": {
			"Profession": {
				"type": "int",
				"description": "Profession of the zombie villager"
			},
			"ConversionTime": {
				"type": "int",
				"description": "Number of ticks until turned into villager. -1 when not being converted"
			},
			"ConversionPlayerLeast": {
				"type": "long",
				"description": "UUIDLeast of player converting the zombie villager"
			},
			"ConversionPlayerMost": {
				"type": "long",
				"description": "UUIDMost of player converting the zombie villager"
			}
		}
	},
	"item/block_item.json": {
		"type": "compound",
		"child_ref": [
			"../ref/item_tag.json"
		],
		"children": {
			"BlockEntityTag": {
				"ref": "../ref/block_entity.json",
				"description": "NBT data when placed"
			},
			"BlockStateTag": {
				"type": "compound",
				"additionalChildren": true,
				"description": "Block states when placed"
			}
		}
	},
	"item/breakable.json": {
		"type": "compound",
		"child_ref": [
			"../ref/item_tag.json"
		],
		"children": {
			"Damage": {
				"type": "short",
				"description": "How much damage this item has had"
			},
			"Unbreakable": {
				"type": "byte",
				"description": "Should this item not break"
			},
			"RepairCost": {
				"type": "int",
				"description": "How much experience it costs to repair"
			}
		}
	},
	"item/crossbow.json": {
		"type": "compound",
		"child_ref": [
			"../ref/item_tag.json",
			"./breakable.json"
		],
		"children": {
			"ChargedProjectiles": {
				"type": "list",
				"item": {
					"ref": "../ref/item.json",
					"description": "An item that has been charged"
				},
				"description": "A list of items that have been charged"
			},
			"Charged": {
				"type": "byte",
				"description": "If the crossbow is ready to be fired"
			}
		}
	},
	"item/firework_rocket.json": {
		"type": "compound",
		"child_ref": [
			"../ref/item_tag.json"
		],
		"children": {
			"Fireworks": {
				"type": "compound",
				"children": {
					"Flight": {
						"description": "Flight duration",
						"type": "byte"
					},
					"Explosions": {
						"description": "List of various explosions this firework will cause",
						"type": "list",
						"item": {
							"ref": "../ref/firework_explosion.json"
						}
					}
				}
			}
		}
	},
	"item/firework_star.json": {
		"type": "compound",
		"child_ref": [
			"../ref/item_tag.json"
		],
		"children": {
			"Explosion": {
				"description": "Explosion to add to the firework rocket on creation",
				"ref": "../ref/firework_explosion"
			}
		}
	},
	"item/group/block_item.json": [
		"minecraft:command_block",
		"minecraft:chain_command_block",
		"minecraft:repeating_command_block",
		"minecraft:chest",
		"minecraft:banner",
		"minecraft:beacon",
		"minecraft:brewing_stand",
		"minecraft:comparator",
		"minecraft:enchanting_table",
		"minecraft:furnace",
		"minecraft:hopper",
		"minecraft:jukebox",
		"minecraft:mob_spawner",
		"minecraft:player_head",
		"minecraft:structure_block",
		"minecraft:white_shulker_box",
		"minecraft:orange_shulker_box",
		"minecraft:magenta_shulker_box",
		"minecraft:light_blue_shulker_box",
		"minecraft:yellow_shulker_box",
		"minecraft:lime_shulker_box",
		"minecraft:pink_shulker_box",
		"minecraft:gray_shulker_box",
		"minecraft:light_gray_shulker_box",
		"minecraft:cyan_shulker_box",
		"minecraft:purple_shulker_box",
		"minecraft:blue_shulker_box",
		"minecraft:brown_shulker_box",
		"minecraft:green_shulker_box",
		"minecraft:red_shulker_box",
		"minecraft:black_shulker_box",
		"minecraft:oak_sign",
		"minecraft:spruce_sign",
		"minecraft:birch_sign",
		"minecraft:acacia_sign",
		"minecraft:jungle_sign",
		"minecraft:dark_oak_sign"
	],
	"item/group/breakable.json": [
		"minecraft:bow",
		"minecraft:wooden_sword",
		"minecraft:stone_sword",
		"minecraft:iron_sword",
		"minecraft:golden_sword",
		"minecraft:diamond_sword",
		"minecraft:wooden_pickaxe",
		"minecraft:stone_pickaxe",
		"minecraft:iron_pickaxe",
		"minecraft:golden_pickaxe",
		"minecraft:diamond_pickaxe",
		"minecraft:wooden_axe",
		"minecraft:stone_axe",
		"minecraft:iron_axe",
		"minecraft:golden_axe",
		"minecraft:diamond_axe",
		"minecraft:wooden_shovel",
		"minecraft:stone_shovel",
		"minecraft:iron_shovel",
		"minecraft:golden_shovel",
		"minecraft:diamond_shovel",
		"minecraft:wooden_hoe",
		"minecraft:stone_hoe",
		"minecraft:iron_hoe",
		"minecraft:golden_hoe",
		"minecraft:diamond_hoe",
		"minecraft:leather_helmet",
		"minecraft:chainmail_helmet",
		"minecraft:iron_helmet",
		"minecraft:golden_helmet",
		"minecraft:diamond_helmet",
		"minecraft:leather_chestplate",
		"minecraft:chainmail_chestplate",
		"minecraft:iron_chestplate",
		"minecraft:golden_chestplate",
		"minecraft:diamond_chestplate",
		"minecraft:leather_leggings",
		"minecraft:chainmail_leggings",
		"minecraft:iron_leggings",
		"minecraft:golden_leggings",
		"minecraft:diamond_leggings",
		"minecraft:leather_boots",
		"minecraft:chainmail_boots",
		"minecraft:iron_boots",
		"minecraft:golden_boots",
		"minecraft:diamond_boots",
		"minecraft:shears",
		"minecraft:flint_and_steel",
		"minecraft:fishing_rod",
		"minecraft:carrot_on_a_stick",
		"minecraft:trident"
	],
	"item/group/generic.json": [
		"minecraft:apple",
		"minecraft:arrow",
		"minecraft:coal",
		"minecraft:charcoal",
		"minecraft:diamond",
		"minecraft:iron_ingot",
		"minecraft:gold_ingot",
		"minecraft:stick",
		"minecraft:bowl",
		"minecraft:mushroom_stew",
		"minecraft:string",
		"minecraft:feather",
		"minecraft:gunpowder",
		"minecraft:wheat_seeds",
		"minecraft:bread",
		"minecraft:flint",
		"minecraft:porkchop",
		"minecraft:cooked_porkchop",
		"minecraft:painting",
		"minecraft:golden_apple",
		"minecraft:enchanted_golden_apple",
		"minecraft:bucket",
		"minecraft:water_bucket",
		"minecraft:lava_bucket",
		"minecraft:minecart",
		"minecraft:saddle",
		"minecraft:redstone",
		"minecraft:snowball",
		"minecraft:oak_boat",
		"minecraft:leather",
		"minecraft:milk_bucket",
		"minecraft:brick",
		"minecraft:clay_ball",
		"minecraft:paper",
		"minecraft:book",
		"minecraft:slime_ball",
		"minecraft:chest_minecart",
		"minecraft:furnace_minecart",
		"minecraft:egg",
		"minecraft:compass",
		"minecraft:clock",
		"minecraft:glowstone_dust",
		"minecraft:cod",
		"minecraft:salmon",
		"minecraft:clownfish",
		"minecraft:pufferfish",
		"minecraft:cooked_cod",
		"minecraft:cooked_salmon",
		"minecraft:ink_sac",
		"minecraft:rose_red",
		"minecraft:cactus_green",
		"minecraft:cocoa_beans",
		"minecraft:lapis_lazuli",
		"minecraft:purple_dye",
		"minecraft:cyan_dye",
		"minecraft:light_gray_dye",
		"minecraft:gray_dye",
		"minecraft:pink_dye",
		"minecraft:lime_dye",
		"minecraft:dandelion_yellow",
		"minecraft:light_blue_dye",
		"minecraft:magenta_dye",
		"minecraft:orange_dye",
		"minecraft:bone_meal",
		"minecraft:bone",
		"minecraft:sugar",
		"minecraft:cookie",
		"minecraft:filled_map",
		"minecraft:melon",
		"minecraft:pumpkin_seeds",
		"minecraft:melon_seeds",
		"minecraft:beef",
		"minecraft:cooked_beef",
		"minecraft:chicken",
		"minecraft:cooked_chicken",
		"minecraft:rotten_flesh",
		"minecraft:ender_pearl",
		"minecraft:blaze_rod",
		"minecraft:ghast_tear",
		"minecraft:gold_nugget",
		"minecraft:glass_bottle",
		"minecraft:spider_eye",
		"minecraft:fermented_spider_eye",
		"minecraft:blaze_powder",
		"minecraft:magma_cream",
		"minecraft:ender_eye",
		"minecraft:speckled_melon",
		"minecraft:bat_spawn_egg",
		"minecraft:blaze_spawn_egg",
		"minecraft:cave_spider_spawn_egg",
		"minecraft:chicken_spawn_egg",
		"minecraft:cow_spawn_egg",
		"minecraft:creeper_spawn_egg",
		"minecraft:donkey_spawn_egg",
		"minecraft:elder_guardian_spawn_egg",
		"minecraft:enderman_spawn_egg",
		"minecraft:endermite_spawn_egg",
		"minecraft:evocation_illager_spawn_egg",
		"minecraft:ghast_spawn_egg",
		"minecraft:guardian_spawn_egg",
		"minecraft:horse_spawn_egg",
		"minecraft:husk_spawn_egg",
		"minecraft:llama_spawn_egg",
		"minecraft:magma_cube_spawn_egg",
		"minecraft:mooshroom_spawn_egg",
		"minecraft:mule_spawn_egg",
		"minecraft:ocelot_spawn_egg",
		"minecraft:parrot_spawn_egg",
		"minecraft:pig_spawn_egg",
		"minecraft:polar_bear_spawn_egg",
		"minecraft:rabbit_spawn_egg",
		"minecraft:sheep_spawn_egg",
		"minecraft:shulker_spawn_egg",
		"minecraft:silverfish_spawn_egg",
		"minecraft:skeleton_spawn_egg",
		"minecraft:skeleton_horse_spawn_egg",
		"minecraft:slime_spawn_egg",
		"minecraft:spider_spawn_egg",
		"minecraft:squid_spawn_egg",
		"minecraft:stray_spawn_egg",
		"minecraft:vex_spawn_egg",
		"minecraft:villager_spawn_egg",
		"minecraft:vindication_illager_spawn_egg",
		"minecraft:witch_spawn_egg",
		"minecraft:wither_skeleton_spawn_egg",
		"minecraft:wolf_spawn_egg",
		"minecraft:zombie_spawn_egg",
		"minecraft:zombie_horse_spawn_egg",
		"minecraft:zombie_pigman_spawn_egg",
		"minecraft:zombie_villager_spawn_egg",
		"minecraft:experience_bottle",
		"minecraft:fire_charge",
		"minecraft:emerald",
		"minecraft:item_frame",
		"minecraft:carrot",
		"minecraft:potato",
		"minecraft:baked_potato",
		"minecraft:poisonous_potato",
		"minecraft:map",
		"minecraft:golden_carrot",
		"minecraft:nether_star",
		"minecraft:pumpkin_pie",
		"minecraft:enchanted_book",
		"minecraft:nether_brick",
		"minecraft:quartz",
		"minecraft:tnt_minecart",
		"minecraft:hopper_minecart",
		"minecraft:prismarine_shard",
		"minecraft:prismarine_crystals",
		"minecraft:rabbit",
		"minecraft:cooked_rabbit",
		"minecraft:rabbit_stew",
		"minecraft:rabbit_foot",
		"minecraft:rabbit_hide",
		"minecraft:armor_stand",
		"minecraft:iron_horse_armor",
		"minecraft:golden_horse_armor",
		"minecraft:diamond_horse_armor",
		"minecraft:lead",
		"minecraft:name_tag",
		"minecraft:command_block_minecart",
		"minecraft:mutton",
		"minecraft:cooked_mutton",
		"minecraft:end_crystal",
		"minecraft:chorus_fruit",
		"minecraft:chorus_fruit_popped",
		"minecraft:beetroot",
		"minecraft:beetroot_seeds",
		"minecraft:beetroot_soup",
		"minecraft:dragon_breath",
		"minecraft:spectral_arrow",
		"minecraft:shield",
		"minecraft:elytra",
		"minecraft:spruce_boat",
		"minecraft:birch_boat",
		"minecraft:jungle_boat",
		"minecraft:acacia_boat",
		"minecraft:dark_oak_boat",
		"minecraft:totem_of_undying",
		"minecraft:shulker_shell",
		"minecraft:iron_nugget",
		"minecraft:knowledge_book",
		"minecraft:debug_stick",
		"minecraft:music_disc_13",
		"minecraft:music_disc_cat",
		"minecraft:music_disc_blocks",
		"minecraft:music_disc_chirp",
		"minecraft:music_disc_far",
		"minecraft:music_disc_mall",
		"minecraft:music_disc_mellohi",
		"minecraft:music_disc_stal",
		"minecraft:music_disc_strad",
		"minecraft:music_disc_ward",
		"minecraft:music_disc_11",
		"minecraft:music_disc_wait"
	],
	"item/group/potion.json": [
		"minecraft:potion",
		"minecraft:splash_potion",
		"minecraft:lingering_potion",
		"minecraft:tipped_arrow"
	],
	"item/map.json": {
		"type": "compound",
		"child_ref": [
			"../ref/item_tag.json"
		],
		"children": {
			"map_scale_direction": {
				"type": "int"
			},
			"map_tracking_position": {
				"type": "byte"
			},
			"display": {
				"type": "compound",
				"children": {
					"MapColor": {
						"type": "int",
						"description": "Color of the map"
					}
				}
			},
			"Decorations": {
				"description": "List of map decorations",
				"type": "list",
				"item": {
					"type": "compound",
					"children": {
						"id": {
							"description": "Arbitrary name of decoration",
							"type": "string"
						},
						"type": {
							"type": "byte",
							"description": "Type of decoration",
							"suggestions": [
								{
									"value": "0",
									"description": "White arrow"
								},
								{
									"value": "1",
									"description": "Green arrow"
								},
								{
									"value": "2",
									"description": "Red arrow"
								},
								{
									"value": "3",
									"description": "Blue arrow"
								},
								{
									"value": "4",
									"description": "White X"
								},
								{
									"value": "5",
									"description": "Red triangle"
								},
								{
									"value": "6",
									"description": "Large white dot"
								},
								{
									"value": "7",
									"description": "Small white dot"
								},
								{
									"value": "8",
									"description": "Woodland Mansion"
								},
								{
									"value": "9",
									"description": "Ocean Monument"
								}
							]
						},
						"x": {
							"description": "X position of decoration",
							"type": "double"
						},
						"z": {
							"description": "Z position of decoration",
							"type": "double"
						},
						"rot": {
							"description": "Rotation of decoration",
							"type": "double"
						}
					}
				}
			}
		}
	},
	"item/player_head.json": {
		"type": "compound",
		"child_ref": [
			"./block_item.json"
		],
		"children": {
			"SkullOwner": {
				"description": "The player whose head this is",
				"type": "compound",
				"children": {
					"Id": {
						"description": "UUID of the player",
						"type": "string"
					},
					"Name": {
						"description": "Name of the player",
						"type": "string"
					},
					"Properties": {
						"description": "Properties of the head",
						"type": "compound",
						"children": {
							"textures": {
								"description": "A list of textures",
								"type": "list",
								"item": {
									"description": "A texture",
									"type": "compound",
									"children": {
										"Signiature": {
											"description": "Signiature of the texture",
											"type": "string"
										},
										"Value": {
											"description": "Base64 encdoed JSON object",
											"type": "string"
										}
									}
								}
							}
						}
					}
				}
			}
		}
	},
	"item/potion_base.json": {
		"type": "compound",
		"child_ref": [
			"../ref/item_tag.json",
			"../ref/potion_effect.json"
		]
	},
	"item/spawn_item.json": {
		"type": "compound",
		"child_ref": [
			"../ref/item_tag.json"
		],
		"children": {
			"EntityTag": {
				"description": "The NBT of the spawned entity",
				"ref": "../ref/mob.json"
			}
		}
	},
	"item/writable_book.json": {
		"type": "compound",
		"child_ref": [
			"../ref/item_tag.json"
		],
		"children": {
			"pages": {
				"description": "A list of pages",
				"type": "list",
				"item": {
					"description": "The text on a page",
					"type": "string"
				}
			}
		}
	},
	"item/written_book.json": {
		"type": "compound",
		"child_ref": [
			"../ref/item_tag.json",
			"./writable_book.json"
		],
		"children": {
			"author": {
				"type": "string",
				"description": "The displayed author of the book"
			},
			"title": {
				"type": "string",
				"description": "The displayed title of the book"
			},
			"generation": {
				"type": "int",
				"description": "The copy-generation of the book",
				"suggestions": [
					{
						"value": "0",
						"description": "original"
					},
					{
						"value": "1",
						"description": "copy of original"
					},
					{
						"value": "2",
						"description": "copy of copy"
					},
					{
						"value": "3",
						"description": "tattered"
					}
				]
			},
			"resolved": {
				"type": "byte",
				"description": "If the book has been opened and the json selectors have been solidified"
			}
		}
	},
	"misc_group/effect_id.json": [
		{
			"value": "1",
			"description": "Speed"
		},
		{
			"value": "2",
			"description": "Slowness"
		},
		{
			"value": "3",
			"description": "Haste"
		},
		{
			"value": "4",
			"description": "Mining Fatigue"
		},
		{
			"value": "5",
			"description": "Strength"
		},
		{
			"value": "6",
			"description": "Instant Health"
		},
		{
			"value": "7",
			"description": "Instand Damage"
		},
		{
			"value": "8",
			"description": "Jump Boost"
		},
		{
			"value": "9",
			"description": "Nausea"
		},
		{
			"value": "10",
			"description": "Regeneration"
		},
		{
			"value": "11",
			"description": "Resistance"
		},
		{
			"value": "12",
			"description": "Fire Resistance"
		},
		{
			"value": "13",
			"description": "Water Breathing"
		},
		{
			"value": "14",
			"description": "Invisibility"
		},
		{
			"value": "15",
			"description": "Blindness"
		},
		{
			"value": "16",
			"description": "Night Vision"
		},
		{
			"value": "17",
			"description": "Hunger"
		},
		{
			"value": "18",
			"description": "Weakness"
		},
		{
			"value": "19",
			"description": "Poison"
		},
		{
			"value": "20",
			"description": "Wither"
		},
		{
			"value": "21",
			"description": "Health Boost"
		},
		{
			"value": "22",
			"description": "Absorbtion"
		},
		{
			"value": "23",
			"description": "Saturation"
		},
		{
			"value": "24",
			"description": "Glowing"
		},
		{
			"value": "25",
			"description": "Levitation"
		},
		{
			"value": "26",
			"description": "Luck"
		},
		{
			"value": "27",
			"description": "Bad Luck"
		}
	],
	"misc_group/enchant.json": [
		{
			"value": "minecraft:protection",
			"description": "Protection"
		},
		{
			"value": "minecraft:fire_protection",
			"description": "Fire Protection"
		},
		{
			"value": "minecraft:feather_falling",
			"description": "Feather Falling"
		},
		{
			"value": "minecraft:blast_protection",
			"description": "Blast Protection"
		},
		{
			"value": "minecraft:projectile_protection",
			"description": "Projectile Protection"
		},
		{
			"value": "minecraft:respiration",
			"description": "Respiration"
		},
		{
			"value": "minecraft:aqua_affinity",
			"description": "Aqua Affinity"
		},
		{
			"value": "minecraft:thorns",
			"description": "Thorns"
		},
		{
			"value": "minecraft:depth_strider",
			"description": "Depth Strider"
		},
		{
			"value": "minecraft:frost_walker",
			"description": "Frost Walker"
		},
		{
			"value": "minecraft:binding_curse",
			"description": "Curse of Binding"
		},
		{
			"value": "minecraft:sharpness",
			"description": "Sharpness"
		},
		{
			"value": "minecraft:smite",
			"description": "Smite"
		},
		{
			"value": "minecraft:bane_of_arthropods",
			"description": "Bane of Arthropods"
		},
		{
			"value": "minecraft:knockback",
			"description": "Knockback"
		},
		{
			"value": "minecraft:fire_aspect",
			"description": "Fire Aspect"
		},
		{
			"value": "minecraft:looting",
			"description": "Looting"
		},
		{
			"value": "minecraft:sweeping_edge",
			"description": "Sweeping Edge"
		},
		{
			"value": "minecraft:efficiency",
			"description": "Efficiency"
		},
		{
			"value": "minecraft:silk_touch",
			"description": "Silk Touch"
		},
		{
			"value": "minecraft:unbreaking",
			"description": "Unbreaking"
		},
		{
			"value": "minecraft:fortune",
			"description": "Fortune"
		},
		{
			"value": "minecraft:power",
			"description": "Power"
		},
		{
			"value": "minecraft:punch",
			"description": "Punch"
		},
		{
			"value": "minecraft:flame",
			"description": "Flame"
		},
		{
			"value": "minecraft:infinity",
			"description": "Infinity"
		},
		{
			"value": "minecraft:luck_of_the_sea",
			"description": "Luck of the Sea"
		},
		{
			"value": "minecraft:lure",
			"description": "Lure"
		},
		{
			"value": "minecraft:loyalty",
			"description": "Loyalty"
		},
		{
			"value": "minecraft:impaling",
			"description": "Impaling"
		},
		{
			"value": "minecraft:riptide",
			"description": "Riptide"
		},
		{
			"value": "minecraft:channeling",
			"description": "Channeling"
		},
		{
			"value": "minecraft:multishot",
			"description": "Multishot"
		},
		{
			"value": "minecraft:quick_charge",
			"description": "Quick Charge"
		},
		{
			"value": "minecraft:piercing",
			"description": "Piercing"
		},
		{
			"value": "minecraft:mending",
			"description": "Mending"
		},
		{
			"value": "minecraft:vanishing_curse",
			"description": "Curse of Vanishing"
		}
	],
	"ref/block_entity.json": {
		"type": "compound",
		"children": {
			"id": {
				"type": "string",
				"description": "The id of this block entity",
				"suggestions": [
					{
						"parser": "NamespacedID",
						"params": [
							"minecraft:block"
						]
					}
				]
			},
			"x": {
				"type": "int",
				"description": "The x coordiate of this block entity"
			},
			"y": {
				"type": "int",
				"description": "The y coordiate of this block entity"
			},
			"z": {
				"type": "int",
				"description": "The z coordiate of this block entity"
			}
		}
	},
	"ref/breedable.json": {
		"type": "compound",
		"child_ref": [
			"./mob.json"
		],
		"children": {
			"InLove": {
				"type": "int",
				"description": "If the animal has just been fed"
			},
			"Age": {
				"type": "int",
				"description": "The age of the animal"
			},
			"ForcedAge": {
				"type": "int",
				"description": "The age of the animal. Will not increment"
			},
			"LoveCauseLeast": {
				"type": "long",
				"description": "The UUIDLeast of the player you fed the animal"
			},
			"LoveCauseMost": {
				"type": "long",
				"description": "The UUIDMost of the player you fed the animal"
			}
		}
	},
	"ref/entity.json": {
		"type": "compound",
		"child_ref": [
			"./nameable.json"
		],
		"children": {
			"id": {
				"type": "string",
				"description": "ID of the entity",
				"suggestions": [
					{
						"parser": "NamespacedID",
						"params": [
							"minecraft:entity_type"
						]
					}
				]
			},
			"Pos": {
				"type": "list",
				"description": "X, Y, and Z coordinates of the entity",
				"item": {
					"type": "double"
				}
			},
			"Motion": {
				"description": "X, Y, and Z motion of the entity",
				"type": "list",
				"item": {
					"type": "double"
				}
			},
			"Rotation": {
				"description": "Pitch and Yaw of the entity",
				"type": "list",
				"item": {
					"type": "float"
				}
			},
			"FallDistance": {
				"description": "How many blocks the entity has fallen",
				"type": "float"
			},
			"Fire": {
				"description": "How many ticks the entity is on fire until it isn't",
				"type": "short"
			},
			"Air": {
				"description": "How much air the entity has left before it starts to drown",
				"type": "short"
			},
			"OnGround": {
				"description": "If the entity is on the ground",
				"type": "byte"
			},
			"NoGravity": {
				"description": "If the entity should not fall",
				"type": "byte"
			},
			"Dimension": {
				"description": "The dimension the entity is in",
				"type": "int",
				"suggestions": [
					{
						"value": "-1",
						"description": "The Nether"
					},
					{
						"value": "0",
						"description": "Overworld"
					},
					{
						"value": "1",
						"description": "The End"
					}
				]
			},
			"Invulnerable": {
				"description": "If the entity should not take damage from non creative and void damage",
				"type": "byte"
			},
			"PortalCooldown": {
				"description": "How long until the entity can teleport through a nether portal",
				"type": "int"
			},
			"UUIDLeast": {
				"description": "UUIDLeast of the entity",
				"type": "long"
			},
			"UUIDMost": {
				"description": "UUIDMost of the entity",
				"type": "long"
			},
			"CustomNameVisible": {
				"description": "Is the name visible",
				"type": "byte"
			},
			"Silent": {
				"description": "Is the entity silent",
				"type": "byte"
			},
			"Passengers": {
				"description": "A list of entities riding this entity",
				"type": "list",
				"item": {
					"ref": "./mob.json"
				}
			},
			"Glowing": {
				"description": "Is this entity glowing",
				"type": "byte"
			},
			"Tags": {
				"description": "A list of tags",
				"type": "list",
				"item": {
					"type": "string",
					"suggestions": [
						{
							"parser": "Tag"
						}
					]
				}
			}
		}
	},
	"ref/fireball_base.json": {
		"type": "compound",
		"child_ref": [
			"../ref/entity.json"
		],
		"children": {
			"direction": {
				"type": "list",
				"item": {
					"type": "double"
				},
				"description": "Direction and magnitude of motion. Does not slow down"
			},
			"life": {
				"type": "int",
				"description": "How long has this been alive"
			},
			"power": {
				"type": "list",
				"item": {
					"type": "double"
				},
				"description": "Same as direction but without resistance"
			}
		}
	},
	"ref/firework_explosion.json": {
		"type": "compound",
		"children": {
			"Flicker": {
				"type": "byte",
				"description": "Should the explosion flicker"
			},
			"Trail": {
				"type": "byte",
				"description": "Should the explosion leave a trail"
			},
			"Type": {
				"type": "byte",
				"description": "Type of pattern",
				"suggestions": [
					{
						"value": "0",
						"description": "Small ball"
					},
					{
						"value": "1",
						"description": "Large ball"
					},
					{
						"value": "2",
						"description": "Star"
					},
					{
						"value": "3",
						"description": "Creeper"
					},
					{
						"value": "4",
						"description": "Burst"
					}
				]
			},
			"Colors": {
				"type": "int_array",
				"description": "Array of colors the explosion shows."
			},
			"FadeColors": {
				"type": "int_array",
				"description": "Array of colors the explosion shows when fading."
			}
		}
	},
	"ref/horse.json": {
		"type": "compound",
		"child_ref": [
			"./breedable.json"
		],
		"children": {
			"Bred": {
				"type": "byte",
				"description": "Was this bred by a player"
			},
			"EatingHaystack": {
				"type": "byte",
				"description": "Is it eating a haystack"
			},
			"Tame": {
				"type": "byte",
				"description": "Has a player tamed it"
			},
			"Temper": {
				"type": "int",
				"description": "How hard it is to tame. Higher values are easier"
			},
			"OwnerUUID": {
				"type": "string",
				"description": "UUID of the owner"
			},
			"ArmorItem": {
				"ref": "./inventory_item.json",
				"description": "Horse armor item"
			},
			"SaddleItem": {
				"ref": "./inventory_item.json",
				"description": "Saddle item"
			}
		}
	},
	"ref/inventory_holder.json": {
		"type": "compound",
		"children": {
			"Items": {
				"type": "list",
				"item": {
					"ref": "./inventory_item.json"
				},
				"description": "Items in this container"
			},
			"LootTable": {
				"type": "string",
				"description": "Loot table that generates the contents"
			},
			"LootTableSeed": {
				"type": "long",
				"description": "Seed for random numbers in the loot table"
			}
		}
	},
	"ref/inventory_item.json": {
		"type": "compound",
		"child_ref": [
			"./item.json"
		],
		"children": {
			"Slot": {
				"type": "byte",
				"description": "The inventory slot this item is in"
			}
		}
	},
	"ref/item.json": {
		"type": "compound",
		"child_ref": [
			"./item_ntt.json"
		],
		"children": {
			"tag": {
				"ref": "./item_tag.json",
				"description": "The NBT of the item"
			}
		}
	},
	"ref/item_ntt.json": {
		"type": "compound",
		"children": {
			"Count": {
				"type": "byte",
				"description": "How many items does this item stack have"
			},
			"id": {
				"type": "string",
				"description": "ID of the item",
				"suggestions": [
					{
						"parser": "NamespacedID",
						"params": [
							"minecraft:item"
						]
					}
				]
			}
		}
	},
	"ref/item_tag.json": {
		"type": "compound",
		"additionalChildren": true,
		"children": {
			"AttributeModifiers": {
				"description": "List of modifiers to an entities attributes",
				"type": "list",
				"item": {
					"description": "An individual modifier",
					"type": "compound",
					"children": {
						"AttributeName": {
							"description": "The name of the attribute",
							"type": "string",
							"suggestions": [
								"generic.maxHealth",
								"generic.followRange",
								"generic.knockbackResistance",
								"generic.movementSpeed",
								"generic.attackDamage",
								"generic.armor",
								"generic.armorToughness",
								"generic.attackSpeed",
								"generic.luck",
								"horse.jumpStrength",
								"generic.flyingSpeed",
								"zombie.spawnReinforcements"
							]
						},
						"Name": {
							"description": "An arbitrary name",
							"type": "string"
						},
						"Slot": {
							"description": "The slot that this modifier takes effect in",
							"type": "string",
							"suggestions": [
								"mainhand",
								"offhand",
								"feet",
								"legs",
								"chest",
								"head"
							]
						},
						"Amount": {
							"description": "The amount of this modifier",
							"type": "double"
						},
						"Operation": {
							"description": "The operation this modifier does to the base amount",
							"type": "int",
							"suggestions": [
								{
									"value": "0",
									"description": "Adds \"Amount\" to the attribute"
								},
								{
									"value": "1",
									"description": "Multiplies the attribute by \"Amount\""
								},
								{
									"value": "2",
									"description": "Multiplies each modifier by \"Amount\""
								}
							]
						},
						"UUIDLeast": {
							"description": "UUIDLeast of this modifier",
							"type": "long"
						},
						"UUIDMost": {
							"description": "UUIDMost of this modifier",
							"type": "long"
						}
					}
				}
			},
			"display": {
				"description": "Dsiplay properties for the item",
				"type": "compound",
				"children": {
					"Name": {
						"description": "A JSON text component for the items name",
						"type": "string"
					},
					"color": {
						"description": "The color of leather armor. Still exists on other items",
						"type": "int"
					},
					"Lore": {
						"description": "Lines of lore. Each line is a JSON text component",
						"type": "list",
						"item": {
							"type": "string"
						}
					}
				}
			},
			"Enchantments": {
				"description": "A list of enchantments",
				"type": "list",
				"item": {
					"type": "compound",
					"children": {
						"id": {
							"description": "The ID of the enchantment",
							"type": "string",
							"suggestions": [
								{
									"parser": "NamespacedID",
									"params": [
										"minecraft:enchantment"
									]
								}
							]
						},
						"lvl": {
							"type": "short",
							"description": "Level of the enchantment"
						}
					}
				}
			},
			"CanDestroy": {
				"description": "A list of blocks that can be destroyed with this item in adventure mode",
				"type": "list",
				"item": {
					"type": "string"
				}
			},
			"CanPlaceOn": {
				"description": "A list of blocks this block can be placed on in adventure mode",
				"type": "list",
				"item": {
					"type": "string"
				}
			},
			"HideFlags": {
				"type": "int"
			},
			"CustomModelData": {
				"description": "A model override predicate",
				"type": "int"
			}
		}
	},
	"ref/lockable.json": {
		"type": "compound",
		"children": {
			"Lock": {
				"type": "string",
				"description": "The name of the item a player has to be holding to open this container"
			}
		}
	},
	"ref/mob.json": {
		"type": "compound",
		"child_ref": [
			"./entity.json"
		],
		"children": {
			"Health": {
				"type": "float",
				"description": "The health of the mob"
			},
			"AbsorptionAmount": {
				"type": "float",
				"description": "How many absorbtion health the mob has"
			},
			"HurtTime": {
				"type": "short",
				"description": "How may ticks since the mob was hurt"
			},
			"HurtByTimestamp": {
				"type": "int",
				"description": "When was the mob last hurt"
			},
			"DeathTime": {
				"type": "short",
				"description": "Number of ticks the mob has been dead for"
			},
			"FallFlying": {
				"type": "byte",
				"description": "If the mob should fly if wearing elytra"
			},
			"Attributes": {
				"type": "list",
				"item": {
					"type": "compound",
					"children": {
						"Name": {
							"type": "string",
							"description": "Name of the attribute",
							"suggestions": [
								"generic.maxHealth",
								"generic.followRange",
								"generic.knockbackResistance",
								"generic.movementSpeed",
								"generic.attackDamage",
								"generic.armor",
								"generic.armorToughness",
								"generic.attackSpeed",
								"generic.luck",
								"horse.jumpStrength",
								"generic.flyingSpeed",
								"zombie.spawnReinforcements"
							]
						},
						"Base": {
							"type": "double",
							"description": "Base value"
						},
						"Modifiers": {
							"description": "A list of modifiers",
							"type": "list",
							"item": {
								"type": "compound",
								"children": {
									"Name": {
										"description": "An arbitrary name",
										"type": "string"
									},
									"Amount": {
										"description": "The amount of this modifier",
										"type": "double"
									},
									"Operation": {
										"description": "The operation this modifier does to the base amount",
										"type": "int",
										"suggestions": [
											{
												"value": "0",
												"description": "Adds \"Amount\" to the attribute"
											},
											{
												"value": "1",
												"description": "Multiplies the attribute by \"Amount\""
											},
											{
												"value": "2",
												"description": "Multiplies each modifier by \"Amount\""
											}
										]
									},
									"UUIDLeast": {
										"description": "UUIDLeast of this modifier",
										"type": "long"
									},
									"UUIDMost": {
										"description": "UUIDMost of this modifier",
										"type": "long"
									}
								}
							}
						}
					}
				}
			},
			"ActiveEffects": {
				"type": "list",
				"item": {
					"ref": "./potion_effect.json"
				},
				"description": "A list of effects on the mob"
			},
			"HandItems": {
				"type": "list",
				"item": {
					"ref": "./inventory_item.json"
				},
				"description": "Items in the main and off hand"
			},
			"ArmorItems": {
				"type": "list",
				"item": {
					"ref": "./inventory_item.json"
				},
				"description": "Armor items"
			},
			"HandDropChances": {
				"type": "list",
				"item": {
					"type": "float"
				},
				"description": "Chance for item in hands to drop"
			},
			"ArmorDropChances": {
				"type": "list",
				"item": {
					"type": "float"
				},
				"description": "Chance for item in armor slots to drop"
			},
			"DeathLootTable": {
				"type": "string",
				"description": "Loot table to drop upon death"
			},
			"DeathLootTableSeed": {
				"type": "long",
				"description": "Seed for random numbers in death loot table"
			},
			"CanPickUpLoot": {
				"type": "byte",
				"description": "If the mob can pick up items"
			},
			"NoAI": {
				"type": "byte",
				"description": "Should the mob not do any"
			},
			"PersistenceRequired": {
				"type": "byte",
				"description": "Should the mob be forced to never despawn"
			},
			"LeftHanded": {
				"type": "byte",
				"description": "Is the mob left handed"
			},
			"Team": {
				"type": "string",
				"description": "The team to put the mob on when it spawns"
			},
			"Leashed": {
				"type": "byte",
				"description": "Is the mob leashed"
			},
			"Leash": {
				"description": "The Leash destination",
				"type": "compound",
				"children": {
					"UUIDMost": {
						"description": "UUIDMost of the leash holder",
						"type": "long"
					},
					"UUIDLeast": {
						"description": "UUIDLeast of the leash holder",
						"type": "long"
					},
					"X": {
						"type": "int",
						"description": "X position of leash knot"
					},
					"Y": {
						"type": "int",
						"description": "Y position of leash knot"
					},
					"Z": {
						"type": "int",
						"description": "Z position of leash knot"
					}
				}
			}
		}
	},
	"ref/nameable.json": {
		"type": "compound",
		"children": {
			"CustomName": {
				"type": "string",
				"description": "A JSON text component custom name"
			}
		}
	},
	"ref/potion_effect.json": {
		"type": "compound",
		"children": {
			"Id": {
				"type": "byte",
				"description": "The ID of the effect",
				"suggestions": [
					{
						"parser": "NumericID",
						"params": [
							"minecraft:mob_effect"
						]
					}
				]
			},
			"Amplifier": {
				"type": "byte",
				"description": "The amplifier of the effect"
			},
			"Duration": {
				"type": "int",
				"description": "How many ticks the effect will last"
			},
			"Ambient": {
				"type": "byte",
				"description": "If the effect particles shouyld be more translucent"
			},
			"ShowParticles": {
				"type": "byte",
				"description": "Should the particles be displayed"
			}
		}
	},
	"ref/projectile.json": {
		"type": "compound",
		"child_ref": [
			"./entity.json"
		],
		"children": {
			"xTile": {
				"type": "int",
				"description": "The x positions of the tile the projectile is in"
			},
			"yTile": {
				"type": "int",
				"description": "The y positions of the tile the projectile is in"
			},
			"zTile": {
				"type": "int",
				"description": "The z positions of the tile the projectile is in"
			},
			"inBlockState": {
				"description": "The block that the projectile is in",
				"type": "compound",
				"children": {
					"Name": {
						"type": "string",
						"description": "ID of the block"
					},
					"Properties": {
						"type": "compound",
						"description": "Block state name value pairs"
					}
				}
			},
			"shake": {
				"type": "byte"
			}
		}
	},
	"ref/spawner.json": {
		"type": "compound",
		"children": {
			"SpawnPotentials": {
				"description": "List of potential entities to spawn",
				"type": "list",
				"item": {
					"type": "compound",
					"children": {
						"Entity": {
							"ref": "./mob.json"
						},
						"Weight": {
							"type": "int",
							"description": "Chance for the entity to be spawned"
						}
					}
				}
			},
			"SpawnCount": {
				"type": "short",
				"description": "How many entities to spawn"
			},
			"SpawnRange": {
				"type": "short",
				"description": "Radius to spawn mobs"
			},
			"Delay": {
				"type": "short",
				"description": "Delay between spawning mobs"
			},
			"MinSpawnDelay": {
				"type": "short",
				"description": "Minimum random delay"
			},
			"MaxSpawnDelay": {
				"type": "short",
				"description": "Maximum random delay"
			},
			"MaxNearbyEntities": {
				"type": "short",
				"description": "Maximum nearby entites"
			},
			"RequiredPlayerRange": {
				"type": "short",
				"description": "Range a player has to be in"
			}
		}
	},
	"ref/tameable.json": {
		"type": "compound",
		"child_ref": [
			"./mob.json"
		],
		"children": {
			"OwnerUUID": {
				"type": "string",
				"description": "UUID of the owner"
			},
			"Sitting": {
				"type": "byte",
				"description": "If the mob is sitting"
			}
		}
	},
	"ref/throwable.json": {
		"type": "compound",
		"child_ref": [
			"./projectile.json"
		],
		"children": {
			"owner": {
				"description": "UUID of the thrower",
				"type": "compound",
				"children": {
					"M": {
						"type": "long",
						"description": "UUIDMost of the thrower"
					},
					"L": {
						"type": "long",
						"description": "UUIDLeast of the thrower"
					}
				}
			}
		}
	},
	"ref/zombie.json": {
		"type": "compound",
		"child_ref": [
			"./mob.json"
		],
		"children": {
			"IsBaby": {
				"type": "byte",
				"description": "If the zombie is a baby zombie"
			},
			"CanBreakDoors": {
				"type": "byte",
				"description": "If the zombie can break doors"
			}
		}
	},
	"root.json": {
		"type": "root",
		"children": {
			"entity": {
				"ref": "./roots/entities.json"
			},
			"block": {
				"ref": "./roots/blocks.json"
			},
			"item": {
				"ref": "./roots/items.json"
			}
		}
	},
	"roots/blocks.json": {
		"type": "root",
		"children": {
			"any": {
				"ref": "../block/any.json"
			},
			"none": {
				"type": "no-nbt"
			},
			"$../block/group/shulker_box.json": {
				"ref": "../block/chest.json"
			},
			"$../block/group/command_block.json": {
				"ref": "../block/command_block.json"
			},
			"minecraft:banner": {
				"ref": "../block/banner.json"
			},
			"minecraft:beacon": {
				"ref": "../block/beacon.json"
			},
			"minecraft:bed": {
				"ref": "../ref/block_entity.json"
			},
			"minecraft:beehive": {
				"ref": "../block/beehive.json"
			},
			"minecraft:brewing_stand": {
				"ref": "../block/brewing_stand.json"
			},
			"minecraft:chest": {
				"ref": "../block/chest.json"
			},
			"minecraft:comparator": {
				"ref": "../block/comparator.json"
			},
			"minecraft:daylight_detector": {
				"ref": "../ref/block_entity.json"
			},
			"minecraft:dispenser": {
				"ref": "../block/chest.json"
			},
			"minecraft:dropper": {
				"ref": "../block/chest.json"
			},
			"minecraft:enchanting_table": {
				"ref": "../block/enchanting_table.json"
			},
			"minecraft:end_gateway": {
				"ref": "../block/end_gateway.json"
			},
			"minecraft:end_portal": {
				"ref": "../ref/block_entity.json"
			},
			"minecraft:ender_chest": {
				"ref": "../ref/block_entity.json"
			},
			"minecraft:furnace": {
				"ref": "../block/furnace.json"
			},
			"minecraft:hopper": {
				"ref": "../block/hopper.json"
			},
			"minecraft:jukebox": {
				"ref": "../block/jukebox.json"
			},
			"minecraft:mob_spawner": {
				"ref": "../block/mob_spawner.json"
			},
			"minecraft:player_head": {
				"ref": "../block/player_head.json"
			},
			"minecraft:sign": {
				"ref": "../block/sign.json"
			},
			"minecraft:structure_block": {
				"ref": "../block/structure_block.json"
			},
			"minecraft:trapped_chest": {
				"ref": "../block/chest.json"
			}
		}
	},
	"roots/entities.json": {
		"type": "root",
		"children": {
			"any": {
				"ref": "../entity/any.json"
			},
			"none": {
				"ref": "../ref/entity.json"
			},
			"$../entity/group/mob.json": {
				"ref": "../ref/mob.json"
			},
			"$../entity/group/breedable.json": {
				"ref": "../ref/breedable.json"
			},
			"$../entity/group/fireball.json": {
				"ref": "../ref/fireball_base.json"
			},
			"$../entity/group/throwable.json": {
				"ref": "../ref/throwable.json"
			},
			"minecraft:area_effect_cloud": {
				"ref": "../entity/area_effect_cloud.json"
			},
			"minecraft:armor_stand": {
				"ref": "../entity/armor_stand.json"
			},
			"minecraft:bat": {
				"ref": "../entity/bat.json"
			},
			"minecraft:bee": {
				"ref": "../entity/bee.json"
			},
			"minecraft:boat": {
				"ref": "../entity/boat.json"
			},
			"minecraft:creeper": {
				"ref": "../entity/creeper.json"
			},
			"minecraft:donkey": {
				"ref": "../entity/chest_horse.json"
			},
			"minecraft:ender_dragon": {
				"ref": "../entity/ender_dragon.json"
			},
			"minecraft:enderman": {
				"ref": "../entity/enderman.json"
			},
			"minecraft:endermite": {
				"ref": "../entity/endermite.json"
			},
			"minecraft:evocation_illager": {
				"ref": "../entity/spell_illager.json"
			},
			"minecraft:horse": {
				"ref": "../entity/horse.json"
			},
			"minecraft:husk": {
				"type": "compound",
				"child_ref": [
					"../ref/zombie.json"
				]
			},
			"minecraft:illusion_illager": {
				"ref": "../entity/spell_illager.json"
			},
			"minecraft:llama": {
				"ref": "../entity/llama.json"
			},
			"minecraft:magma_cube": {
				"ref": "../entity/slime.json"
			},
			"minecraft:mule": {
				"ref": "../entity/chest_horse.json"
			},
			"minecraft:ocelot": {
				"ref": "../entity/ocelot.json"
			},
			"minecraft:parrot": {
				"ref": "../entity/parrot.json"
			},
			"minecraft:pig": {
				"ref": "../entity/pig.json"
			},
			"minecraft:rabbit": {
				"ref": "../entity/rabbit.json"
			},
			"minecraft:sheep": {
				"ref": "../entity/sheep.json"
			},
			"minecraft:shulker": {
				"ref": "../entity/shulker.json"
			},
			"minecraft:skeleton_horse": {
				"ref": "../entity/skeleton_horse.json"
			},
			"minecraft:slime": {
				"ref": "../entity/slime.json"
			},
			"minecraft:snowman": {
				"ref": "../entity/snowman.json"
			},
			"minecraft:vex": {
				"ref": "../entity/vex.json"
			},
			"minecraft:villager": {
				"ref": "../entity/villager.json"
			},
			"minecraft:villager_golem": {
				"ref": "../entity/villager_golem.json"
			},
			"minecraft:vindication_illager": {
				"ref": "../entity/vindication_illager.json"
			},
			"minecraft:wither": {
				"ref": "../entity/wither.json"
			},
			"minecraft:wolf": {
				"ref": "../entity/wolf.json"
			},
			"minecraft:zombie": {
				"type": "compound",
				"child_ref": [
					"../ref/zombie.json"
				]
			},
			"minecraft:zombie_horse": {
				"ref": "../entity/horse.json"
			},
			"minecraft:zombie_pigman": {
				"ref": "../entity/zombie_pigman.json"
			},
			"minecraft:zombie_villager": {
				"ref": "../entity/zombie_villager.json"
			},
			"minecraft:item": {
				"ref": "../entity/item.json"
			},
			"minecraft:xp_orb": {
				"ref": "../entity/xp_orb.json"
			},
			"minecraft:fireball": {
				"ref": "../entity/fireball.json"
			},
			"minecraft:arrow": {
				"ref": "../entity/arrow.json"
			},
			"minecraft:potion": {
				"ref": "../entity/potion.json"
			},
			"minecraft:spectral_arrow": {
				"ref": "../entity/spectral_arrow.json"
			},
			"minecraft:minecart": {
				"ref": "../entity/minecart.json"
			},
			"minecraft:commandblock_minecart": {
				"ref": "../entity/commandblock_minecart.json"
			},
			"minecraft:furnace_minecart": {
				"ref": "../entity/furnace_minecart.json"
			},
			"minecraft:hopper_minecart": {
				"ref": "../entity/hopper_minecart.json"
			},
			"minecraft:spawner_minecart": {
				"ref": "../entity/spawner_minecart.json"
			},
			"minecraft:tnt_minecart": {
				"ref": "../entity/tnt_minecart.json"
			},
			"minecraft:falling_block": {
				"ref": "../entity/falling_block.json"
			},
			"minecraft:tnt": {
				"ref": "../entity/tnt.json"
			},
			"minecraft:ender_crystal": {
				"ref": "../entity/ender_crystal.json"
			},
			"minecraft:evocation_fangs": {
				"ref": "../entity/evocation_fangs.json"
			},
			"minecraft:eye_of_ender_signal": {
				"ref": "../ref/entity.json"
			},
			"minecraft:fireworks_rocket": {
				"ref": "../entity/fireworks_rocket.json"
			},
			"minecraft:item_frame": {
				"ref": "../entity/item_frame.json"
			},
			"minecraft:leash_knot": {
				"ref": "../ref/entity.json"
			},
			"minecraft:llama_spit": {
				"ref": "../entity/llama_spit.json"
			},
			"minecraft:painting": {
				"ref": "../entity/painting.json"
			},
			"minecraft:shulker_bullet": {
				"ref": "../entity/shulker_bullet.json"
			},
			"minecraft:turtle": {
				"ref": "../entity/turtle.json"
			},
			"minecraft:phantom": {
				"ref": "../entity/phantom.json"
			},
			"minecraft:trident": {
				"ref": "../entity/trident.json"
			},
			"minecraft:cod_fish": {
				"ref": "../entity/fish.json"
			},
			"minecraft:salmon_fish": {
				"ref": "../entity/fish.json"
			}
		}
	},
	"roots/items.json": {
		"type": "root",
		"children": {
			"any": {
				"ref": "../item/any.json"
			},
			"none": {
				"ref": "../ref/item_tag.json"
			},
			"$../item/group/generic.json": {
				"ref": "../ref/item_tag.json"
			},
			"$../item/group/breakable.json": {
				"ref": "../item/breakable.json"
			},
			"$../item/group/block_item.json": {
				"ref": "../item/block_item.json"
			},
			"$../item/group/potion.json": {
				"ref": "../item/potion_base.json"
			},
			"minecraft:writable_book": {
				"ref": "../item/writable_book.json"
			},
			"minecraft:written_book": {
				"ref": "../item/written_book.json"
			},
			"minecraft:player_head": {
				"ref": "../item/player_head.json"
			},
			"minecraft:firework_rocket": {
				"ref": "../item/firework_rocket.json"
			},
			"minecraft:firework_star": {
				"ref": "../item/firework_star.json"
			},
			"minecraft:armor_stand": {
				"ref": "../item/spawn_item.json"
			},
			"minecraft:spawn_egg": {
				"ref": "../item/spawn_item.json"
			},
			"minecraft:map": {
				"ref": "../item/map.json"
			}
		}
	}
}
