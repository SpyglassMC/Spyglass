import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import type * as mcdoc from '@spyglassmc/mcdoc'
import { dissectUri, reportDissectError } from '../../binder/index.js'
import type { PackInfo } from '../../dependency/common.js'

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
			const path = thisPack?.type === 'assets'
				? '::java::pack::ResourcePack'
				: '::java::pack::DataPack'
			const type: mcdoc.McdocType = { kind: 'reference', path }
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
