import type { Checker, FileCategory } from '@spyglassmc/core'
import type { JsonAstNode } from '../../node'
import { advancement } from './advancement'
import { item_modifier_extended } from './item_modifier'
import { loot_table } from './loot_table'
import { predicate_extended } from './predicate'

export const Checkers = new Map<FileCategory, Checker<JsonAstNode>>([
	['advancement', advancement],
	['item_modifier', item_modifier_extended],
	['loot_table', loot_table],
	['predicate', predicate_extended],
])
