import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import * as mcf from '@spyglassmc/mcfunction'
import * as parser from './parser/index.js'

export function registerMcdocAttributes(
	meta: core.MetaRegistry,
	rootTreeNode: mcf.RootTreeNode,
) {
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
				parser.jsonParser('::java::server::util::text::Text'),
				localize('text-component'),
			),
	})
	mcdoc.runtime.registerAttribute(meta, 'objective', () => undefined, {
		stringParser: () => parser.objective('reference'),
	})
	mcdoc.runtime.registerAttribute(meta, 'objective', () => undefined, {
		stringParser: () => parser.objective('reference'),
	})
	mcdoc.runtime.registerAttribute(meta, 'team', () => undefined, {
		stringParser: () => parser.team('reference'),
	})
	mcdoc.runtime.registerAttribute(meta, 'score_holder', () => undefined, {
		stringParser: () =>
			makeInfallible(
				parser.scoreHolder('multiple'),
				localize('score-holder'),
			),
	})
	mcdoc.runtime.registerAttribute(meta, 'selector', () => undefined, {
		stringParser: () =>
			makeInfallible(parser.selector(), localize('selector')),
	})
	mcdoc.runtime.registerAttribute(meta, 'item_slots', () => undefined, {
		stringParser: () => parser.itemSlots,
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
