import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import type { McmetaVersions, PackInfo } from './dependency'
import { NEXT_RELEASE_VERSION, ReleaseVersion } from './dependency'

export function registerMcdocAttributes(meta: core.MetaRegistry, release: ReleaseVersion) {
	mcdoc.runtime.registerAttribute(meta, 'since', mcdoc.runtime.attribute.validator.string, {
		filterElement: (config, ctx) => {
			if (!config.startsWith('1.')) {
				ctx.logger.warn(`Invalid mcdoc attribute for "since": ${config}`)
				return true
			}
			return ReleaseVersion.cmp(release, config as ReleaseVersion) >= 0
		},
	})
	mcdoc.runtime.registerAttribute(meta, 'until', mcdoc.runtime.attribute.validator.string, {
		filterElement: (config, ctx) => {
			if (!config.startsWith('1.')) {
				ctx.logger.warn(`Invalid mcdoc attribute for "until": ${config}`)
				return true
			}
			return ReleaseVersion.cmp(release, config as ReleaseVersion) < 0
		},
	})
	mcdoc.runtime.registerAttribute(
		meta,
		'deprecated',
		mcdoc.runtime.attribute.validator.optional(mcdoc.runtime.attribute.validator.string),
		{
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
		},
	)
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
