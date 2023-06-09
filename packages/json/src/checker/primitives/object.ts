import type { ItemNode, PairNode } from '@spyglassmc/core'
import { ErrorSeverity, Range, ResourceLocation } from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type {
	JsonNode,
	JsonObjectExpectation,
	JsonStringNode,
} from '../../node/index.js'
import { JsonObjectNode, JsonStringExpectation } from '../../node/index.js'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker.js'
import { any, expectation } from './util.js'

type JsonValue =
	| string
	| number
	| boolean
	// eslint-disable-next-line no-restricted-syntax
	| null
	| JsonValue[]
	| { [key: string]: JsonValue }

type ComplexProperty = {
	checker: JsonChecker
	opt?: boolean
	def?: JsonValue
	deprecated?: boolean
	context?: string
}

type CheckerProperty = JsonChecker | ComplexProperty

type CheckerRecord = Record<string, CheckerProperty | undefined>

type ObjectCheckerOptions = {
	allowUnknownProperties?: boolean
}

function isComplex(checker: CheckerProperty): checker is ComplexProperty {
	return (checker as ComplexProperty)?.checker !== undefined
}

export function object(): JsonChecker
export function object(
	keys: string[],
	values: (
		key: string,
		ctx: JsonCheckerContext,
	) => CheckerProperty | undefined,
	options?: ObjectCheckerOptions,
): JsonChecker
export function object(
	keys: JsonChecker,
	values: (
		key: string,
		ctx: JsonCheckerContext,
	) => CheckerProperty | undefined,
	options?: ObjectCheckerOptions,
): JsonChecker
export function object(
	keys?: string[] | JsonChecker,
	values?: (
		key: string,
		ctx: JsonCheckerContext,
	) => CheckerProperty | undefined,
	options: ObjectCheckerOptions = {},
): JsonChecker {
	return (node, ctx) => {
		node.expectation = [{ type: 'json:object', typedoc: 'Object' }]
		if (!ctx.depth || ctx.depth <= 0) {
			if (Array.isArray(keys) && values) {
				const fields = keys
					.map<[string, CheckerProperty]>((
						key,
					) => [key, values(key, ctx)!])
					.filter(([_, v]) => v !== undefined)
				;(node.expectation![0] as JsonObjectExpectation).fields = fields
					.map(
						([key, prop]) => {
							return {
								key,
								value: expectation(
									isComplex(prop) ? prop.checker : prop,
									ctx,
								),
								...(isComplex(prop) && (prop.opt || prop.deprecated)
									? { opt: true }
									: {}),
								...(isComplex(prop) && prop.deprecated
									? { deprecated: true }
									: {}),
							}
						},
					)
			} else if (typeof keys === 'function' && values) {
				;(node.expectation![0] as JsonObjectExpectation).keys = expectation(
					keys,
					ctx,
				)?.filter(JsonStringExpectation.is)
			}
		}

		if (!JsonObjectNode.is(node)) {
			ctx.err.report(localize('expected', localize('object')), node)
		} else if (Array.isArray(keys) && values) {
			const givenKeys = node.children.map((n) => n.key?.value)
			keys.forEach((k) => {
				const value = values(k, ctx)
				if (
					!value || (isComplex(value) && (value.opt || value.deprecated))
				) {
					return
				}
				if (!givenKeys.includes(k)) {
					ctx.err.report(
						localize('json.checker.property.missing', localeQuote(k)),
						Range.create(node.range.start, node.range.start + 1),
					)
				}
			})
			node.children
				.filter((p) => p.key)
				.forEach((prop) => {
					const key = prop.key!.value
					const value = values(key, ctx)
					if (!value || !keys.includes(key)) {
						if (!options.allowUnknownProperties) {
							ctx.err.report(
								localize(
									'json.checker.property.unknown',
									localeQuote(key),
								),
								prop.key!,
								ErrorSeverity.Warning,
							)
						}
						return
					}
					if (isComplex(value) && value.deprecated) {
						ctx.err.report(
							localize(
								'json.checker.property.deprecated',
								localeQuote(key),
							),
							prop.key!,
							ErrorSeverity.Hint,
							{ deprecated: true },
						)
					}
					const context = ctx.context +
						(isComplex(value) && value.context ? `.${value.context}` : '')
					const doc = localize(`json.doc.${context}`)
					const propNode: JsonNode = prop.value !== undefined
						? prop.value
						: { type: 'json:null', range: Range.create(0) }
					const checker = isComplex(value) ? value.checker : value
					try {
						checker(propNode, { ...ctx, context: `${context}.${key}` })
					} catch (e) {
						const pos = ctx.doc.positionAt(prop.range.start)
						ctx.logger.error(
							`Checking "${key}" at ${pos.line}:${pos.character} in "${ctx.doc.uri}"`,
							e,
						)
					}
					const defaultValue = isComplex(value) ? value.def : undefined
					const typedoc = propNode.expectation
						?.map((e) => e.typedoc)
						.join(' | ')
					prop.key!.hover =
						`\`\`\`typescript\n${context}.${key}: ${typedoc}\n\`\`\`${
							doc || defaultValue !== undefined ? '\n******\n ' : ''
						}${doc}${
							defaultValue !== undefined
								? `\n\`@default\` ${JSON.stringify(defaultValue)}`
								: ''
						}`
				})
		} else if (typeof keys === 'function' && values) {
			node.children
				.filter((p) => p.key)
				.forEach((prop) => {
					keys(prop.key!, ctx)
					if (prop.value !== undefined) {
						const value = values(prop.key!.value, ctx)
						if (value) {
							const checker = isComplex(value) ? value.checker : value
							checker(prop.value, ctx)
						}
					}
				})
		}
	}
}

export function record(
	properties: CheckerRecord,
	options?: ObjectCheckerOptions,
): JsonChecker {
	return object(Object.keys(properties), (key) => properties[key], options)
}

export function opt(
	checker?: JsonChecker | ComplexProperty,
	defaultValue?: JsonValue,
): ComplexProperty | undefined {
	if (checker === undefined) return undefined
	return isComplex(checker)
		? { ...checker, opt: true, def: defaultValue }
		: { checker, opt: true, def: defaultValue }
}

export function deprecate(
	checker?: JsonChecker | ComplexProperty,
): ComplexProperty | undefined {
	if (checker === undefined) return undefined
	return isComplex(checker)
		? { ...checker, deprecated: true }
		: { checker, deprecated: true }
}

export function dispatch(
	values: (
		children: PairNode<JsonStringNode, JsonNode>[],
		ctx: JsonCheckerContext,
	) => JsonChecker,
): JsonChecker
export function dispatch(
	keyName: string,
	values: (
		value: string | undefined,
		children: PairNode<JsonStringNode, JsonNode>[],
		ctx: JsonCheckerContext,
	) => JsonChecker,
): JsonChecker
export function dispatch(
	arg1:
		| string
		| ((
			children: PairNode<JsonStringNode, JsonNode>[],
			ctx: JsonCheckerContext,
		) => JsonChecker),
	arg2?: (
		value: string | undefined,
		children: PairNode<JsonStringNode, JsonNode>[],
		ctx: JsonCheckerContext,
	) => JsonChecker,
): JsonChecker {
	return (node, ctx) => {
		if (!JsonObjectNode.is(node)) {
			ctx.err.report(localize('expected', localize('object')), node)
		} else if (arg2) {
			const dispatcherIndex = node.children.findIndex(
				(p) => p.key?.value === arg1,
			)
			const dispatcher = node.children[dispatcherIndex]
			const value = dispatcher?.value?.type === 'json:string'
				? dispatcher.value.value
				: undefined
			arg2(value, node.children, ctx)(node, ctx)
		} else {
			;(arg1 as Function)(node.children, ctx)(node, ctx)
		}
	}
}

export function pick(
	value: string | undefined,
	cases: Record<string, CheckerRecord>,
): CheckerRecord {
	if (value === undefined) {
		return {}
	}
	const properties = cases[ResourceLocation.shorten(value)]
	if (properties === undefined) {
		return {}
	}
	Object.keys(properties).forEach((key) => {
		const p = properties[key]
		if (p === undefined) return
		properties[key] = {
			checker: isComplex(p) ? p.checker : p,
			opt: isComplex(p) ? p.opt : undefined,
			deprecated: isComplex(p) ? p.deprecated : undefined,
			context: ResourceLocation.shorten(value),
		}
	})
	return properties
}

export function when(
	value: string | undefined,
	values: string[],
	properties: CheckerRecord,
	notProperties: CheckerRecord = {},
): CheckerRecord {
	if (value === undefined) {
		return {}
	}
	if (!values.includes(ResourceLocation.shorten(value))) {
		return notProperties
	}
	return properties
}

export function extract(
	value: string,
	children: PairNode<JsonStringNode, JsonNode>[] | undefined,
) {
	const node = children?.find((p) => p.key?.value === value)
	return node?.value?.type === 'json:string' ? node.value.value : undefined
}

export function extractNested(
	wrap: string,
	value: string,
	children: PairNode<JsonStringNode, JsonNode>[] | undefined,
) {
	const wrapper = children?.find((p) => p.key?.value === wrap)
	if (wrapper?.value?.type !== 'json:object') return undefined
	const node = wrapper.children?.find(
		(p) =>
			(p as unknown as PairNode<JsonStringNode, JsonNode>).key?.value ===
				value,
	)
	return node?.type === 'json:string' ? node.value : undefined
}

export function extractStringArray(
	value: string,
	children?: PairNode<JsonStringNode, JsonNode>[] | undefined,
): readonly string[] | undefined {
	const node = children?.find((p) => p.key?.value === value)
	return node?.value?.type === 'json:array' &&
			node.value.children?.every(
				(n): n is ItemNode<JsonStringNode> =>
					n.value?.type === 'json:string',
			)
		? node.value.children.map((n) => n.value!.value)
		: undefined
}

export function having(
	node: JsonNode,
	ctx: JsonCheckerContext,
	cases: Record<string, CheckerRecord | (() => CheckerRecord)>,
): CheckerRecord {
	const givenKeys = new Set(
		JsonObjectNode.is(node) ? node.children.map((n) => n.key?.value) : [],
	)
	const key = Object.keys(cases).find((c) => givenKeys.has(c))

	if (key === undefined) {
		ctx.err.report(
			localize('json.checker.property.missing', Object.keys(cases)),
			Range.create(node.range.start, node.range.start + 1),
		)
		return Object.fromEntries(
			Object.entries(cases).map(([k, v]) => [
				k,
				opt(typeof v === 'function' ? any() : v[k] ?? any()),
			]),
		)
	}
	const c = cases[key]
	return typeof c === 'function' ? c() : c
}
