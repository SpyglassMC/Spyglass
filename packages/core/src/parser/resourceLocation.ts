import { arrayToMessage, localize } from '@spyglassmc/locales'
import type { Mutable } from '../node'
import { ResourceLocationNode } from '../node'
import type { ParserContext } from '../service'
import type { Source } from '../source'
import { Range } from '../source'
import type { InfallibleParser } from './Parser'

const IllegalNamespacePattern = /[^_\-a-z0-9.]/g
const IllegalPathPattern = /[^_\-a-z0-9/.]/g

export const resourceLocation: InfallibleParser<ResourceLocationNode> = (src: Source, ctx: ParserContext) => {
	const ans: Mutable<ResourceLocationNode> = {
		type: 'resource_location',
		range: Range.create(src),
	}
	const raw = src.readUntilOrEnd(' ', '\r', '\n')
	ans.range.end = src.cursor

	if (raw.length === 0) {
		ctx.err.report(localize('expected', localize('resource-location')), ans)
	} else {
		const sepIndex = raw.indexOf(ResourceLocationNode.NamespacePathSep)
		if (sepIndex >= 0) {
			ans.namespace = raw.slice(0, sepIndex)
		}
		const rawPath = raw.slice(sepIndex + 1)
		ans.path = rawPath.split(ResourceLocationNode.PathSep)
		if (ans.namespace?.match(IllegalNamespacePattern)) {
			const chars = [...new Set([...ans.namespace.matchAll(IllegalNamespacePattern)].map(v => v[0]))]
			ctx.err.report(localize('parser.resource-location.illegal-namespace', arrayToMessage(chars, true, 'and')), ans)
		}
		if (rawPath.match(IllegalPathPattern)) {
			const chars = [...new Set([...rawPath.matchAll(IllegalPathPattern)].map(v => v[0]))]
			ctx.err.report(localize('parser.resource-location.illegal-path', arrayToMessage(chars, true, 'and')), ans)
		}
	}

	return ans
}
