import { arrayToMessage, localize } from '@spyglassmc/locales'
import { ResourceLocation } from '../common/index.js'
import type { Mutable, ResourceLocationNode, ResourceLocationOptions } from '../node/index.js'
import type { ParserContext } from '../service/index.js'
import type { Source } from '../source/index.js'
import { Range } from '../source/index.js'
import type { InfallibleParser } from './Parser.js'

const Terminators = new Set([' ', '\r', '\n', '=', ',', '"', "'", '{', '}', '[', ']', '(', ')', ';'])
const LegalCharacters = new Set([
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
	'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
	'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '_', '-', '.',
])

export function resourceLocation(options: ResourceLocationOptions): InfallibleParser<ResourceLocationNode> {
	return (src: Source, ctx: ParserContext): ResourceLocationNode => {
		const ans: Mutable<ResourceLocationNode> = {
			type: 'resource_location',
			range: Range.create(src),
			options,
		}

		if (src.trySkip(ResourceLocation.TagPrefix)) {
			ans.isTag = true
		}

		const start = src.cursor
		while (src.canReadInLine() && !Terminators.has(src.peek())) {
			src.skip()
		}
		const raw = src.sliceToCursor(start)
		ans.range.end = src.cursor

		if (raw.length === 0) {
			ctx.err.report(localize('expected', localize('resource-location')), ans)
		} else {
			const sepIndex = raw.indexOf(options.namespacePathSep ?? ResourceLocation.NamespacePathSep)
			if (sepIndex >= 0) {
				ans.namespace = raw.slice(0, sepIndex)
			}
			const rawPath = raw.slice(sepIndex + 1)
			ans.path = rawPath.split(ResourceLocation.PathSep)

			// Check characters.
			/* istanbul ignore next */
			const illegalChars = [...new Set([
				...[...ans.namespace ?? []].filter(c => !LegalCharacters.has(c)),
				...[...rawPath].filter(c => c !== '/' && !LegalCharacters.has(c)),
			])]
			if (illegalChars.length) {
				ctx.err.report(localize('parser.resource-location.illegal', arrayToMessage(illegalChars, true, 'and')), ans)
			}

			if (ans.isTag && !options.allowTag) {
				ctx.err.report(localize('parser.resource-location.tag-diallowed'), ans)
			}

			if (!ans.namespace && options.isPredicate) {
				ctx.err.report(localize('parser.resource-location.namespace-expected'), ans)
			}

			if (options.category) {
				const fullRaw = ResourceLocation.lengthen(options.namespacePathSep === '.'
					? raw.replace('.', ResourceLocation.NamespacePathSep)
					: raw
				)
				ctx.symbols
					.query(ctx.doc, ans.isTag ? `tag/${options.category}` : options.category, fullRaw)
					.enter({ usage: { type: options.usageType, node: ans, accessType: options.accessType } })
			}
		}

		return ans
	}
}
