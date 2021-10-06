import { localeQuote, localize } from '@spyglassmc/locales'
import type { AstNode } from '../../node'
import type { LinterContext, MetaRegistry } from '../../service'

export type Linter<N extends AstNode> = (node: N, ctx: LinterContext) => void

export const noop: Linter<AstNode> = () => {}

export function nameConvention(key: string): Linter<AstNode> {
	return (node, ctx) => {
		if (typeof (node as any)[key] !== 'string') {
			throw new Error(`Trying to access property ${key} at ${JSON.stringify(node)}`)
		}
		const name: string = (node as any)[key]

		try {
			// SECURITY: ReDoS attack. The risk is acceptable at the moment.
			const regex = new RegExp(ctx.ruleValue as string)
			if (!name.match(regex)) {
				ctx.err.lint(localize('linter.name-convention.illegal', localeQuote(name), localeQuote(ctx.ruleValue as string)), node)
			}
		} catch (e) {
			ctx.logger.error(`[nameConvention linter] The value “${ctx.ruleValue}” set for rule “${ctx.ruleName}” is not a valid regular expression.`, e)
		}
	}
}

export function registerLinters(meta: MetaRegistry) {
	meta.registerLinter('nameOfNbtKey', {
		linter: nameConvention('value'),
		predicate: n => n.type === 'string' && n.parent?.type === 'pair' && n.parent.parent?.type === 'nbt:compound',
	})
	meta.registerLinter('nameOfObjective', {
		linter: nameConvention('value'),
		predicate: n => n.type === 'mcfunction:argument/minecraft:objective',
	})
	meta.registerLinter('nameOfScoreHolder', {
		linter: nameConvention('value'),
		predicate: n => n.type === 'mcfunction:argument/minecraft:score_holder',
	})
	meta.registerLinter('nameOfTag', {
		linter: nameConvention('value'),
		predicate: n => n.type === 'mcfunction:argument/spyglassmc:tag',
	})
	meta.registerLinter('nameOfTeam', {
		linter: nameConvention('value'),
		predicate: n => n.type === 'mcfunction:argument/minecraft:team',
	})
}
