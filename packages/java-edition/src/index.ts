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

export * as dependency from './dependency/index.js'
export * as json from './json/index.js'
export * as mcf from './mcfunction/index.js'

export const initialize: core.ProjectInitializer = async (ctx) => {
	const { config, downloader, externals, logger, meta, projectRoot } = ctx

	async function getPackMcmeta(): Promise<PackMcmeta | undefined> {
		let ans: PackMcmeta | undefined
		const uri = `${projectRoot}pack.mcmeta`
		try {
			const data = await core.fileUtil.readJson(externals, uri)
			PackMcmeta.assert(data)
			ans = data
		} catch (e) {
			if (!externals.error.isKind(e, 'ENOENT')) {
				// `pack.mcmeta` exists but broken. Log an error.
				logger.error(
					`[je.initialize] Failed loading pack.mcmeta “${uri}”`,
					e,
				)
			}
		}
		return ans
	}

	meta.registerUriBinder(uriBinder)

	const versions = await getVersions(ctx.externals, ctx.downloader)
	if (!versions) {
		ctx.logger.error(
			'[je-initialize] Failed loading game version list. Expect everything to be broken.',
		)
		return
	}

	const packMcmeta = await getPackMcmeta()
	const {
		release,
		id: version,
		isLatest,
	} = resolveConfiguredVersion(config.env.gameVersion, {
		packMcmeta,
		versions,
	})

	meta.registerDependencyProvider(
		'@vanilla-datapack',
		() => getVanillaDatapack(downloader, version, isLatest),
	)

	meta.registerDependencyProvider(
		'@vanilla-mcdoc',
		() => getVanillaMcdoc(downloader),
	)

	const summary = await getMcmetaSummary(
		ctx.externals,
		downloader,
		logger,
		version,
		isLatest,
		config.env.dataSource,
		config.env.mcmetaSummaryOverrides,
	)
	if (
		!summary.blocks ||
		!summary.commands ||
		!summary.fluids ||
		!summary.registries
	) {
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
			(!n.symbol &&
				n.parent?.parent?.type === 'nbt:compound' &&
				core.PairNode.is(n.parent) &&
				n.type === 'string' &&
				n.parent.key === n) ||
			// nbt path keys without mcdoc definition.
			(!n.symbol && n.parent?.type === 'nbt:path' && n.type === 'string') ||
			// mcdoc compound key definition outside of `::minecraft` modules.
			(mcdoc.StructFieldNode.is(n.parent) &&
				mcdoc.StructKeyNode.is(n) &&
				!n.symbol?.path[0]?.startsWith('::minecraft')),
	})

	mcdoc.runtime.registerAttribute<string | undefined>(meta, 'since', {
		config: (value) => {
			if (value?.kind === 'literal' && value.value.kind === 'string') {
				return value.value.value
			}
			return undefined
		},
		filterElement: (config, ctx) => {
			if (config === undefined || !config.startsWith('1.')) {
				ctx.logger.warn(`Invalid mcdoc attribute for "since": ${config}`)
				return true
			}
			return ReleaseVersion.cmp(release, config as ReleaseVersion) >= 0
		},
	})
	mcdoc.runtime.registerAttribute<string | undefined>(meta, 'until', {
		config: (value) => {
			if (value?.kind === 'literal' && value.value.kind === 'string') {
				return value.value.value
			}
			return undefined
		},
		filterElement: (config, ctx) => {
			if (config === undefined || !config.startsWith('1.')) {
				ctx.logger.warn(`Invalid mcdoc attribute for "until": ${config}`)
				return true
			}
			return ReleaseVersion.cmp(release, config as ReleaseVersion) < 0
		},
	})
	mcdoc.runtime.registerAttribute<string | undefined>(meta, 'deprecated', {
		config: (value) => {
			if (value?.kind === 'literal' && value.value.kind === 'string') {
				return value.value.value
			}
			return undefined
		},
		mapField: (config, field, ctx) => {
			if (config === undefined || !config.startsWith('1.')) {
				ctx.logger.warn(
					`Invalid mcdoc attribute for "deprecated": ${config}`,
				)
				return field
			}
			if (ReleaseVersion.cmp(release, config as ReleaseVersion) >= 0) {
				return { ...field, deprecated: true }
			}
			return field
		},
	})

	json.initialize(ctx)
	jeJson.initialize(ctx)
	jeMcf.initialize(ctx, summary.commands, release)
	nbt.initialize(ctx)

	return {
		loadedVersion: release,
	}
}
