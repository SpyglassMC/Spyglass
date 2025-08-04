import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import type * as mcdoc from '@spyglassmc/mcdoc'
import { dissectUri, reportDissectError } from '../../binder/index.js'
import type { PackInfo } from '../../dependency/common.js'

const NEW_RESOURCEPACK_PACK_FORMAT = 65
const NEW_DATAPACK_PACK_FORMAT = 82

function createTagDefinition(registry: string): mcdoc.McdocType {
	const id: mcdoc.AttributeValue = {
		kind: 'tree',
		values: {
			registry: { kind: 'literal', value: { kind: 'string', value: registry } },
			tags: { kind: 'literal', value: { kind: 'string', value: 'allowed' } },
		},
	}
	return {
		kind: 'concrete',
		child: { kind: 'reference', path: '::java::data::tag::Tag' },
		typeArgs: [{ kind: 'string', attributes: [{ name: 'id', value: id }] }],
	}
}

export function file(packs: PackInfo[]): core.Checker<json.JsonFileNode> {
	return (node, ctx) => {
		const child = node.children[0]
		if (ctx.doc.uri.endsWith('/pack.mcmeta')) {
			const thisPack = packs.find(p => core.fileUtil.isSubUriOf(ctx.doc.uri, p.packRoot))

			const newPackFormat = thisPack?.type === 'assets'
				? NEW_RESOURCEPACK_PACK_FORMAT
				: NEW_DATAPACK_PACK_FORMAT

			const { min_format, max_format } = getPackFormatRangeFromPackMcMeta(child, newPackFormat)
			let type: mcdoc.McdocType

			const oldRange = { kind: 0b01, max: newPackFormat } satisfies mcdoc.NumericRange
			const newRange = { kind: 0, min: newPackFormat } satisfies mcdoc.NumericRange

			// This is not done in mcdoc to give better error messages by essentially muting all
			// irrelevant fields. Maybe there is a way mcdoc runtime could be improved in the future
			// to show better error messages for complex types.
			if (min_format && max_format) {
				if (max_format < newPackFormat) {
					type = createConcreteType('OldPack', oldRange)
				} else if (min_format < newPackFormat) {
					type = createConcreteType('IntermediatePack', oldRange, newRange)
				} else {
					type = createConcreteType('NewPack', oldRange, newRange)
				}
			} else {
				type = createConcreteType('Pack', oldRange, newRange)
			}

			return json.checker.index(type)(child, ctx)
		}
		const parts = dissectUri(ctx.doc.uri, ctx)
		if (parts?.ok) {
			if (parts.category.startsWith('tag/')) {
				const type = createTagDefinition(parts.category.slice(4))
				return json.checker.index(type)(child, ctx)
			}
			const type: mcdoc.McdocType = {
				kind: 'dispatcher',
				registry: 'minecraft:resource',
				parallelIndices: [{ kind: 'static', value: parts.category }],
			}
			return json.checker.index(type, { discardDuplicateKeyErrors: true })(child, ctx)
		} else if (parts?.ok === false) {
			reportDissectError(parts.path, parts.expected, ctx)
		}
	}
}

export function register(meta: core.MetaRegistry, packs: PackInfo[]) {
	meta.registerChecker<json.JsonFileNode>('json:file', file(packs))
}

function getPackFormatRangeFromPackMcMeta(packFormat: json.JsonNode, newPackFormat: number) {
	const pack = getJsonField(packFormat, 'pack')

	let min_format: number | bigint | undefined = undefined
	let max_format: number | bigint | undefined = undefined

	if (pack) {
		max_format = getMinorVersionSupportedFormat(pack, 'max_format')
		min_format = getMinorVersionSupportedFormat(pack, 'min_format')

		const supported_formats = getJsonField(pack, 'supported_formats')
		if (supported_formats) {
			if (json.JsonArrayNode.is(supported_formats)) {
				const min_supported = supported_formats.children.length >= 1
					? supported_formats.children[0].value
					: undefined
				const max_supported = supported_formats.children.length === 2
					? supported_formats.children[1].value
					: undefined

				if (!min_format && min_supported && json.JsonNumberNode.is(min_supported)) {
					min_format = min_supported.value.value
				}

				if (!max_format && max_supported && json.JsonNumberNode.is(max_supported)) {
					max_format = max_supported.value.value
				}
			} else if (json.JsonObjectNode.is(supported_formats)) {
				min_format ??= getJsonNumber(supported_formats, 'min_inclusive')
				max_format ??= getJsonNumber(supported_formats, 'max_inclusive')
			}
		}

		const pack_format = getJsonNumber(pack, 'pack_format')
		min_format ??= pack_format
		max_format ??= pack_format

		min_format ??= max_format
		max_format ??= (min_format && min_format > newPackFormat) ? min_format : newPackFormat
	}

	return { min_format, max_format }

	function getJsonField(jsonNode: json.JsonNode | undefined, key: string) {
		return (jsonNode?.children?.find((c): c is json.JsonPairNode =>
			json.JsonPairNode.is(c)
			&& c.key?.value === key
		) as json.JsonPairNode | undefined)
			?.value
	}

	function getJsonNumber(jsonNode: json.JsonNode | undefined, key: string) {
		const field = getJsonField(jsonNode, key)
		if (field !== undefined && json.JsonNumberNode.is(field)) {
			return field.value.value
		}
		return undefined
	}
	function getMinorVersionSupportedFormat(jsonNode: json.JsonNode | undefined, key: string) {
		const field = getJsonField(jsonNode, key)
		if (field !== undefined) {
			if (json.JsonNumberNode.is(field)) {
				return field.value.value
			} else if (json.JsonArrayNode.is(field) && field.children.length >= 1) {
				const value = field.children[0].value
				if (value && json.JsonNumberNode.is(value)) {
					return value.value.value
				}
			}
		}
		return undefined
	}
}

function createConcreteType(
	structName: string,
	firstRange: mcdoc.NumericRange,
	secondRange?: mcdoc.NumericRange,
) {
	const type = {
		kind: 'concrete',
		child: { kind: 'reference', path: `::java::pack::${structName}` },
		typeArgs: [{ kind: 'int', valueRange: firstRange }],
	} satisfies mcdoc.ConcreteType

	if (secondRange) {
		type.typeArgs.push({ kind: 'int', valueRange: secondRange })
	}

	return type
}
