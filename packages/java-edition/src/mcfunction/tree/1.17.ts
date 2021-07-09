import type { PartialRootTreeNode, PartialTreeNode } from '@spyglassmc/mcfunction'
import { merge } from '@spyglassmc/mcfunction'
import { Tree1_16 } from './1.16'

const ItemOperation: PartialTreeNode = {
	children: {
		modify: {
			children: {
				modifier: {
					properties: {
						category: 'item_modifier',
					},
				},
			},
		},
		copy: {
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
}

/**
 * Patch for Minecraft: Java Edition 1.17.1
 * 
 * The following parsers are patched with new properties:
 * - `minecraft:resource_location`
 * 
 * The following commands are removed:
 * - `replaceitem`
 */
export const Tree1_17: PartialRootTreeNode = merge(Tree1_16, {
	children: {
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
		replaceitem: undefined,
	},
})
