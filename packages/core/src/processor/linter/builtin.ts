import { localeQuote, localize } from '@spyglassmc/locales'
import type { Logger } from '../../common/index.js'
import type { AstNode, StringBaseNode } from '../../node/index.js'
import { isAllowedCharacter } from '../../parser/index.js'
import type { MetaRegistry, QuoteConfig } from '../../service/index.js'
import { SymbolLinterConfig } from '../../service/index.js'
import { McdocCategories } from '../../symbol/index.js'
import { undeclaredSymbol } from './builtin/undeclaredSymbol.js'
import type { Linter } from './Linter.js'

export const noop: Linter<AstNode> = () => {}

/**
 * @param key The name of the key on the {@link AstNode} that contains the value to be validated.
 */
export function nameConvention(key: string): Linter<AstNode> {
	return (node, ctx) => {
		if (typeof (node as any)[key] !== 'string') {
			throw new Error(
				`Trying to access property "${key}" of node type "${node.type}"`,
			)
		}
		const name: string = (node as any)[key]

		try {
			// SECURITY: ReDoS attack. The risk is acceptable at the moment.
			const regex = new RegExp(ctx.ruleValue as string)
			if (!name.match(regex)) {
				ctx.err.lint(
					localize(
						'linter.name-convention.illegal',
						localeQuote(name),
						localeQuote(ctx.ruleValue as string),
					),
					node,
				)
			}
		} catch (e) {
			ctx.logger.error(
				`[nameConvention linter] The value “${ctx.ruleValue}” set for rule “${ctx.ruleName}” is not a valid regular expression.`,
				e,
			)
		}
	}
}

export const quote: Linter<StringBaseNode> = (node, ctx) => {
	const config = ctx.ruleValue as QuoteConfig
	const mustValueBeQuoted = node.options.unquotable
		? [...node.value].some(
				(c) => !isAllowedCharacter(c, node.options.unquotable as any),
		  )
		: true
	const isQuoteRequired = config.always || mustValueBeQuoted
	const isQuoteProhibited = config.always === false && !mustValueBeQuoted
	const firstChar = ctx.src.slice(node.range.start, node.range.start + 1)
	const isFirstCharQuote = !!node.options.quotes?.includes(firstChar as any)
	if (isQuoteRequired) {
		if (isFirstCharQuote) {
			// TODO: Check type
			config.avoidEscape
			config.type
		} else {
			// TODO: Error quote expected
		}
	} else if (isQuoteProhibited && isFirstCharQuote) {
		// TODO: Error no quote expected
	}
}

export namespace configValidator {
	function getDocLink(name: string): string {
		return `https://spyglassmc.com/user/lint/${name}`
	}

	function wrapError(name: string, msg: string): string {
		return `[Invalid Linter Config] [${name}] ${localize(
			'linter-config-validator.wrapper',
			msg,
			getDocLink(name),
		)}`
	}

	export function nameConvention(
		name: string,
		val: unknown,
		logger: Logger,
	): boolean {
		if (typeof val !== 'string') {
			logger.error(
				wrapError(
					name,
					localize('linter-config-validator.name-convention.type'),
				),
			)
			return false
		}

		try {
			// SECURITY: ReDoS attack. The risk is acceptable at the moment.
			new RegExp(val)
		} catch (e) {
			logger.error(
				wrapError(
					name,
					localize(''), // FIXME
				),
				e,
			)
			return false
		}

		return true
	}

	export function symbolLinterConfig(
		_name: string,
		value: unknown,
		_logger: Logger,
	): boolean {
		return SymbolLinterConfig.is(value)
	}
}

export function registerLinters(meta: MetaRegistry) {
	meta.registerLinter('nameOfObjective', {
		configValidator: configValidator.nameConvention,
		linter: nameConvention('value'),
		nodePredicate: (n) => n.symbol && n.symbol.category === 'objective',
	})
	meta.registerLinter('nameOfScoreHolder', {
		configValidator: configValidator.nameConvention,
		linter: nameConvention('value'),
		nodePredicate: (n) => n.symbol && n.symbol.category === 'score_holder',
	})
	meta.registerLinter('nameOfTag', {
		configValidator: configValidator.nameConvention,
		linter: nameConvention('value'),
		nodePredicate: (n) => n.symbol && n.symbol.category === 'tag',
	})
	meta.registerLinter('nameOfTeam', {
		configValidator: configValidator.nameConvention,
		linter: nameConvention('value'),
		nodePredicate: (n) => n.symbol && n.symbol.category === 'team',
	})
	meta.registerLinter('undeclaredSymbol', {
		configValidator: configValidator.symbolLinterConfig,
		linter: undeclaredSymbol,
		nodePredicate: (n) =>
			n.symbol && !McdocCategories.includes(n.symbol.category as any),
	})
}
