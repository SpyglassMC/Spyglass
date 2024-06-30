import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import * as mcdoc from '@spyglassmc/mcdoc'
import * as nbt from '@spyglassmc/nbt'
import { uriBinder } from './binder/index.js'
import type { McmetaSummary } from './dependency/index.js'
import {
	getMcmetaSummary,
	getVanillaDatapack,
	getVanillaMcdoc,
	getVersions,
	PackMcmeta,
	ReleaseVersion,
	resolveConfiguredVersion,
	symbolRegistrar,
} from './dependency/index.js'
import * as jeJson from './json/index.js'
import * as jeMcf from './mcfunction/index.js'

export * as binder from './binder/index.js'
export * as dependency from './dependency/index.js'
export * as json from './json/index.js'
export * as mcf from './mcfunction/index.js'

export const initialize: core.ProjectInitializer = async (ctx) => {
	const { config, downloader, externals, logger, meta, projectRoot } = ctx

	async function readPackMcmeta(uri: string): Promise<PackMcmeta | undefined> {
		try {
			const data = await core.fileUtil.readJson(externals, uri)
			PackMcmeta.assert(data)
			return data
		} catch (e) {
			if (!externals.error.isKind(e, 'ENOENT')) {
				// `pack.mcmeta` exists but broken. Log an error.
				logger.error(`[je.initialize] Failed loading pack.mcmeta “${uri}”`, e)
			}
		}
		return undefined
	}

	async function findPackMcmeta(): Promise<PackMcmeta | undefined> {
		const searched = new Set<string>()
		for (let depth = 0; depth <= 2; depth += 1) {
			const files = await externals.fs.getAllFiles(projectRoot, depth + 1)
			for (const uri of files.filter(uri => uri.endsWith('/pack.mcmeta'))) {
				if (searched.has(uri)) {
					continue
				}
				searched.add(uri)
				const data = await readPackMcmeta(uri)
				if (data) {
					logger.info(
						`[je.initialize] Found a valid pack.mcmeta “${uri}” with pack_format “${data.pack.pack_format}”`,
					)
					return data
				}
			}
		}
		logger.warn('[je.initialize] Failed finding a valid pack.mcmeta')
		return undefined
	}

	meta.registerUriBinder(uriBinder)

	const versions = await getVersions(ctx.externals, ctx.downloader)
	if (!versions) {
		ctx.logger.error(
			'[je-initialize] Failed loading game version list. Expect everything to be broken.',
		)
		return
	}

	const version = await resolveConfiguredVersion(config.env.gameVersion, versions, findPackMcmeta)
	const release = version.release

	meta.registerDependencyProvider(
		'@vanilla-datapack',
		() => getVanillaDatapack(downloader, version.id, version.isLatest),
	)

	meta.registerDependencyProvider('@vanilla-mcdoc', () => getVanillaMcdoc(downloader))

	const summary = await getMcmetaSummary(
		ctx.externals,
		downloader,
		logger,
		version.id,
		version.isLatest,
		config.env.dataSource,
		config.env.mcmetaSummaryOverrides,
	)
	if (!summary.blocks || !summary.commands || !summary.fluids || !summary.registries) {
		ctx.logger.error(
			'[je-initialize] Failed loading mcmeta summaries. Expect everything to be broken.',
		)
		return
	}

	meta.registerSymbolRegistrar('mcmeta-summary', {
		checksum: summary.checksum,
		registrar: symbolRegistrar(summary as McmetaSummary),
	})

	meta.registerLinter('nameOfNbtKey', {
		configValidator: core.linter.configValidator.nameConvention,
		linter: core.linter.nameConvention('value'),
		nodePredicate: (n) =>
			// nbt compound keys without mcdoc definition.
			(!n.symbol
				&& n.parent?.parent?.type === 'nbt:compound'
				&& core.PairNode.is(n.parent)
				&& n.type === 'string'
				&& n.parent.key === n) // nbt path keys without mcdoc definition.
			|| (!n.symbol && n.parent?.type === 'nbt:path' && n.type === 'string') // mcdoc compound key definition outside of `::minecraft` modules.
			|| (mcdoc.StructFieldNode.is(n.parent)
				&& mcdoc.StructKeyNode.is(n)
				&& !n.symbol?.path[0]?.startsWith('::minecraft')),
	})

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

	json.initialize(ctx)
	jeJson.initialize(ctx)
	jeMcf.initialize(ctx, summary.commands, release)
	nbt.initialize(ctx)

	return { loadedVersion: release }
}
