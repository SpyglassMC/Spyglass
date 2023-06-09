import type { DeepReadonly } from '../../../common/index.js'
import { Arrayable, ResourceLocation } from '../../../common/index.js'
import type { AstNode } from '../../../node/index.js'
import type { LinterContext } from '../../../service/index.js'
import { SymbolLinterConfig as Config } from '../../../service/index.js'
import type { Symbol } from '../../../symbol/index.js'
import { SymbolVisibility } from '../../../symbol/index.js'
import type { Linter } from '../Linter.js'

// import { localeQuote, localize } from '@spyglassmc/locales'
// import type { DeepReadonly } from '../../../common/index.js'
// import { Arrayable, ResourceLocation } from '../../../common/index.js'
// import type { AstNode } from '../../../node/index.js'
// import type { LinterContext } from '../../../service/index.js'
// import { LinterSeverity, SymbolLinterConfig as Config } from '../../../service/index.js'
// import type { Symbol } from '../../../symbol/index.js'
// import { SymbolUtil, SymbolVisibility } from '../../../symbol/index.js'
// import type { Linter } from '../Linter.js'

export const undeclaredSymbol: Linter<AstNode> = (node, ctx) => {
	// if (!node.symbol || SymbolUtil.isDeclared(node.symbol)) {
	// 	return
	// }
	// const action = getAction(ctx.ruleValue as Config, node.symbol, ctx)
	// if (Config.Action.isDeclare(action)) {
	// 	ctx.symbols
	// 		.query({ doc: ctx.doc, node }, node.symbol.category, ...node.symbol.path)
	// 		.amend({
	// 			data: { visibility: getVisibility(action.declare) },
	// 			usage: { type: 'declaration', node },
	// 		})
	// }
	// if (Config.Action.isReport(action)) {
	// 	const severityOverride = action.report === 'inherit' ? undefined : LinterSeverity.toErrorSeverity(action.report)
	// 	ctx.err.lint(
	// 		localize('linter.undeclared-symbol.message',
	// 			node.symbol.category,
	// 			localeQuote(node.symbol.identifier)
	// 		),
	// 		node, undefined, severityOverride
	// 	)
	// }
}

function getAction(
	config: Config,
	symbol: DeepReadonly<Symbol>,
	ctx: LinterContext,
): Config.Action | undefined {
	if (Config.Action.is(config)) {
		return config
	}

	function test(conditions: Arrayable<Config.Condition>): boolean {
		function testSingleCondition(condition: Config.Condition): boolean {
			const resourceLocation = ResourceLocation.lengthen(symbol.identifier)
			const namespace = resourceLocation.slice(
				0,
				resourceLocation.indexOf(ResourceLocation.NamespacePathSep),
			)
			return (
				(condition.category
					? Arrayable.toArray(condition.category).includes(symbol.category)
					: true) &&
				(condition.namespace
					? Arrayable.toArray(condition.namespace).includes(namespace)
					: true) &&
				(condition.excludeNamespace
					? !Arrayable.toArray(condition.excludeNamespace).includes(
						namespace,
					)
					: true) &&
				(condition.pattern
					? Arrayable.toArray(condition.pattern).some((p) =>
						new RegExp(p).test(symbol.identifier)
					)
					: true) &&
				(condition.excludePattern
					? !Arrayable.toArray(condition.excludePattern).some((p) =>
						new RegExp(p).test(symbol.identifier)
					)
					: true)
			)
		}
		try {
			return Arrayable.toArray(conditions).some(testSingleCondition)
		} catch (e) {
			// Illegal RegExp.
			ctx.logger.error(
				'[undeclaredSymbol#getAction] Likely encountered an illegal regular expression in the config',
				e,
			)
			return false
		}
	}

	function evaluateComplexes(
		complexes: Arrayable<Config.Complex>,
	): Config.Action | undefined {
		for (const complex of Arrayable.toArray(complexes)) {
			if (complex.if && !test(complex.if)) {
				continue
			}

			return complex.override
				? evaluateComplexes(complex.override) ?? complex.then
				: complex.then
		}
		return undefined
	}

	return evaluateComplexes(config)
}

function getVisibility(
	input: Exclude<Config.DeclareAction['declare'], undefined>,
): SymbolVisibility {
	switch (input) {
		case 'block':
			return SymbolVisibility.Block
		case 'file':
			return SymbolVisibility.File
		case 'public':
			return SymbolVisibility.Public
	}
}
