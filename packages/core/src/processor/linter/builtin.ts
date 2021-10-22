import { localeQuote, localize } from '@spyglassmc/locales'
import type { AstNode } from '../../node'
import type { Logger, MetaRegistry } from '../../service'
import type { Linter } from './Linter'

export const noop: Linter<AstNode> = () => { }

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

export namespace configValidator {
	function getDocLink(name: string): string {
		return `https://spyglassmc.com/doc/linter/${name}`
	}

	function wrapError(source: string, msg: string): string {
		return `[Invalid Linter Config] [${source}] ${localize('linter-config-validator.wrapper', msg, getDocLink(source))}`
	}

	export function nameConvention(val: unknown, logger: Logger): boolean {
		if (typeof val !== 'string') {
			logger.error(wrapError('name-convention',
				localize('linter-config-validator.name-convention.type')
			))
			return false
		}

		try {
			// SECURITY: ReDoS attack. The risk is acceptable at the moment.
			new RegExp(val)
		} catch (e) {
			logger.error(
				wrapError('name-convention',
					localize('')
				),
				e
			)
			return false
		}

		return true
	}
}

export function registerLinters(meta: MetaRegistry) {
	meta.registerLinter('nameOfNbtKey', {
		configValidator: configValidator.nameConvention,
		linter: nameConvention('value'),
		nodePredicate: n => n.type === 'string' && n.parent?.type === 'pair' && n.parent.parent?.type === 'nbt:compound',
	})
	meta.registerLinter('nameOfObjective', {
		configValidator: configValidator.nameConvention,
		linter: nameConvention('value'),
		nodePredicate: n => n.type === 'mcfunction:argument/minecraft:objective',
	})
	meta.registerLinter('nameOfScoreHolder', {
		configValidator: configValidator.nameConvention,
		linter: nameConvention('value'),
		nodePredicate: n => n.type === 'mcfunction:argument/minecraft:score_holder',
	})
	meta.registerLinter('nameOfTag', {
		configValidator: configValidator.nameConvention,
		linter: nameConvention('value'),
		nodePredicate: n => n.type === 'mcfunction:argument/spyglassmc:tag',
	})
	meta.registerLinter('nameOfTeam', {
		configValidator: configValidator.nameConvention,
		linter: nameConvention('value'),
		nodePredicate: n => n.type === 'mcfunction:argument/minecraft:team',
	})
}
