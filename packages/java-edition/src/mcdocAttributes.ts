import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import { NEXT_RELEASE_VERSION, ReleaseVersion } from './dependency/index.js'
import type { McmetaCommands, McmetaVersions, PackInfo } from './dependency/index.js'

const validator = mcdoc.runtime.attribute.validator

const gameRuleValidator = validator.tree({
	type: validator.options('boolean', 'int'),
})

export function registerMcdocAttributes(
	meta: core.MetaRegistry,
	commands: McmetaCommands,
	release: ReleaseVersion,
) {
	mcdoc.runtime.registerAttribute(meta, 'since', validator.string, {
		filterElement: (config, ctx) => {
			if (!config.startsWith('1.')) {
				ctx.logger.warn(`Invalid mcdoc attribute for "since": ${config}`)
				return true
			}
			return ReleaseVersion.cmp(release, config as ReleaseVersion) >= 0
		},
	})
	mcdoc.runtime.registerAttribute(meta, 'until', validator.string, {
		filterElement: (config, ctx) => {
			if (!config.startsWith('1.')) {
				ctx.logger.warn(`Invalid mcdoc attribute for "until": ${config}`)
				return true
			}
			return ReleaseVersion.cmp(release, config as ReleaseVersion) < 0
		},
	})
	mcdoc.runtime.registerAttribute(meta, 'only', validator.string, {
		filterElement: (config, ctx) => {
			if (!config.startsWith('1.')) {
				ctx.logger.warn(`Invalid mcdoc attribute for "until": ${config}`)
				return true
			}
			return ReleaseVersion.cmp(release, config as ReleaseVersion) == 0
		},
	})
	mcdoc.runtime.registerAttribute(meta, 'except', validator.string, {
		filterElement: (config, ctx) => {
			const range = config.split("-")
			if (range.length != 2 || !range[0].startsWith('1.')|| !range[1].startsWith('1.')) {
				ctx.logger.warn(`Invalid mcdoc attribute for "until": ${config}`)
				return true
			}
			return ReleaseVersion.cmp(release, range[0] as ReleaseVersion) <= 0
				|| ReleaseVersion.cmp(release, range[1] as ReleaseVersion) >= 0
		},
	})
	mcdoc.runtime.registerAttribute(meta, 'deprecated', validator.optional(validator.string), {
		mapField: (config, field, ctx) => {
			if (config === undefined) {
				return { ...field, deprecated: true }
			}
			if (!config.startsWith('1.')) {
				ctx.logger.warn(`Invalid mcdoc attribute for "deprecated": ${config}`)
				return field
			}
			if (ReleaseVersion.cmp(release, config as ReleaseVersion) >= 0) {
				return { ...field, deprecated: true }
			}
			return field
		},
	})
	const gameRuleNode = commands.children.gamerule?.children
	if (gameRuleNode) {
		const [boolGameRules, intGameRules] = ['brigadier:bool', 'brigadier:integer'].map((type) =>
			Object.entries(gameRuleNode).flatMap(([key, node]) =>
				node.children?.value?.type === 'argument' && node.children.value.parser === type
					? [key]
					: []
			)
		)
		mcdoc.runtime.registerAttribute(meta, 'game_rule', gameRuleValidator, {
			stringParser: (config, _, ctx) => {
				return core.literal({
					pool: config.type === 'boolean' ? boolGameRules : intGameRules,
					colorTokenType: 'string',
				})
			},
			stringMocker: (config, _, ctx) => {
				return core.LiteralNode.mock(ctx.offset, {
					pool: config.type === 'boolean' ? boolGameRules : intGameRules,
				})
			},
		})
	}
}

export function registerPackFormatAttribute(
	meta: core.MetaRegistry,
	release: ReleaseVersion,
	versions: McmetaVersions,
	packs: PackInfo[],
) {
	const dataFormats = new Map<number, string[]>()
	const assetsFormats = new Map<number, string[]>()
	if (versions[0]?.type !== 'release') {
		dataFormats.set(versions[0].data_pack_version, [NEXT_RELEASE_VERSION])
		assetsFormats.set(versions[0].resource_pack_version, [NEXT_RELEASE_VERSION])
	}
	for (const version of versions) {
		if (version.type === 'release') {
			dataFormats.set(version.data_pack_version, [
				...dataFormats.get(version.data_pack_version) ?? [],
				version.id,
			])
			assetsFormats.set(version.resource_pack_version, [
				...assetsFormats.get(version.resource_pack_version) ?? [],
				version.id,
			])
		}
	}
	function getFormats(packMcmetaUri: string) {
		const thisPack = packs.find(p => core.fileUtil.isSubUriOf(packMcmetaUri, p.packRoot))
		return thisPack?.type === 'assets' ? assetsFormats : dataFormats
	}
	mcdoc.runtime.registerAttribute(meta, 'pack_format', () => undefined, {
		checker: (_, typeDef) => {
			if (typeDef.kind !== 'literal' || typeof typeDef.value.value !== 'number') {
				return undefined
			}
			const target = typeDef.value.value
			return (node, ctx) => {
				const targetVersions = getFormats(ctx.doc.uri).get(target)
				if (!targetVersions) {
					ctx.err.report(
						localize('java-edition.pack-format.unsupported', target),
						node,
						core.ErrorSeverity.Warning,
					)
				} else if (!targetVersions.some(v => v === release)) {
					ctx.err.report(
						localize('java-edition.pack-format.not-loaded', target, release),
						node,
						core.ErrorSeverity.Warning,
					)
				}
			}
		},
		numericCompleter: (_, ctx) => {
			return [...getFormats(ctx.doc.uri).entries()].map(([k, v], i) => ({
				range: core.Range.create(ctx.offset),
				label: `${k}`,
				labelSuffix: ` (${v[0]})`,
				sortText: `${i}`.padStart(4, '0'),
			} satisfies core.CompletionItem))
		},
	})
}
