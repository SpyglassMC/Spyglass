import { arrayToMessage, localize } from '@spyglassmc/locales'
import { ResourceLocation } from '../common'
import type { Mutable, ResourceLocationNode, ResourceLocationOptions } from '../node'
import type { ParserContext } from '../service'
import type { Source } from '../source'
import { Range } from '../source'
import type { InfallibleParser } from './Parser'

const AcceptableCharacter = /^[_\-a-z0-9:/.]$/i
const Pattern = /^(?:[_\-a-z0-9.]*:)?[_\-a-z0-9/.]*$/g
const IllegalNamespacePattern = /[^_\-a-z0-9.]/g
const IllegalPathPattern = /[^_\-a-z0-9/.]/g

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

		const start = src.innerCursor
		while (src.canReadInLine() && src.peek().match(AcceptableCharacter)) {
			src.skip()
		}
		const raw = src.string.slice(start, src.innerCursor)
		ans.range.end = src.cursor

		if (raw.length === 0) {
			ctx.err.report(localize('expected', localize('resource-location')), ans)
		} else {
			const sepIndex = raw.indexOf(ResourceLocation.NamespacePathSep)
			if (sepIndex >= 0) {
				ans.namespace = raw.slice(0, sepIndex)
			}
			const rawPath = raw.slice(sepIndex + 1)
			ans.path = rawPath.split(ResourceLocation.PathSep)

			// Check characters.
			if (!raw.match(Pattern)) {
				/* istanbul ignore next */
				const chars = [...new Set([
					...ans.namespace?.matchAll(IllegalNamespacePattern) ?? [],
					...rawPath.matchAll(IllegalPathPattern),
				].map(v => v[0]))]
				ctx.err.report(localize('parser.resource-location.illegal', arrayToMessage(chars, true, 'and')), ans)
			}

			if (ans.isTag && !options.allowTag) {
				ctx.err.report(localize('parser.resource-location.tag-diallowed'), ans)
			}

			if (!ans.namespace && options.isPredicate) {
				ctx.err.report(localize('parser.resource-location.namespace-expected'), ans)
			}

			// TODO: SymbolTable
		}

		return ans
	}
}
