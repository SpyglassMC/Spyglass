import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import { localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import * as mcf from '@spyglassmc/mcfunction'
import { getItemSlotsArgumentValues } from './common/index.js'
import { EntitySelectorAtVariable, EntitySelectorNode, ScoreHolderNode } from './node/argument.js'
import * as parser from './parser/index.js'

const validator = mcdoc.runtime.attribute.validator

interface EntityConfig {
	amount: 'multiple' | 'single'
	type: 'entities' | 'players'
}
const entityValidator = validator.alternatives<EntityConfig>(
	validator.tree({
		amount: validator.options('multiple', 'single'),
		type: validator.options('entities', 'players'),
	}),
	() => ({ amount: 'multiple', type: 'entities' }),
)

export function registerMcdocAttributes(meta: core.MetaRegistry, rootTreeNode: mcf.RootTreeNode) {
	mcdoc.runtime.registerAttribute(meta, 'command', () => undefined, {
		// TODO: validate slash
		// TODO: fix completer inside commands
		stringParser: () => {
			return mcf.command(rootTreeNode, parser.argument)
		},
	})
	mcdoc.runtime.registerAttribute(meta, 'text_component', () => undefined, {
		stringParser: () =>
			makeInfallible(
				core.map(json.parser.entry, (res) => ({
					type: 'json:typed',
					range: res.range,
					children: [res],
					targetType: { kind: 'reference', path: '::java::server::util::text::Text' },
				} satisfies json.TypedJsonNode)),
				localize('text-component'),
			),
	})
	mcdoc.runtime.registerAttribute(meta, 'objective', () => undefined, {
		stringParser: () => parser.objective('reference'),
		stringMocker: (_, __, ctx) => core.SymbolNode.mock(ctx.offset, { category: 'objective' }),
	})
	mcdoc.runtime.registerAttribute(meta, 'team', () => undefined, {
		stringParser: () => parser.team('reference'),
		stringMocker: (_, __, ctx) => core.SymbolNode.mock(ctx.offset, { category: 'team' }),
	})
	mcdoc.runtime.registerAttribute(meta, 'score_holder', () => undefined, {
		stringParser: () =>
			makeInfallible(parser.scoreHolder('reference', 'multiple'), localize('score-holder')),
		stringMocker: (_, __, ctx) => ScoreHolderNode.mock(ctx.offset),
	})
	mcdoc.runtime.registerAttribute(meta, 'tag', () => undefined, {
		stringParser: () => parser.tag('definition'), // TODO: make this a config
		stringMocker: (_, __, ctx) => core.SymbolNode.mock(ctx.offset, { category: 'tag' }),
	})
	mcdoc.runtime.registerAttribute(meta, 'entity', entityValidator, {
		stringParser: (config) =>
			makeInfallible(parser.entity(config.amount, config.type), localize('selector')),
		stringMocker: (_, __, ctx) =>
			EntitySelectorNode.mock(ctx.offset, {
				pool: EntitySelectorAtVariable.filterAvailable(ctx),
			}),
	})
	mcdoc.runtime.registerAttribute(meta, 'item_slots', () => undefined, {
		stringParser: () => parser.itemSlots,
		stringMocker: (_, __, ctx) =>
			core.LiteralNode.mock(ctx.offset, { pool: getItemSlotsArgumentValues(ctx) }),
	})
	mcdoc.runtime.registerAttribute(meta, 'uuid', () => undefined, {
		stringParser: () => parser.uuid,
	})
}

function makeInfallible(
	parser: core.Parser,
	message: string,
): core.InfallibleParser<core.AstNode | undefined> {
	return (src, ctx) => {
		const start = src.cursor
		const res = parser(src, ctx)
		if (res === core.Failure) {
			ctx.err.report(
				localize('expected', message),
				core.Range.create(start, src.skipRemaining()),
			)
			return undefined
		}
		return res
	}
}
