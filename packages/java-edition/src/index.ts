import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import { localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import * as nbt from '@spyglassmc/nbt'
import { uriBinder } from './binder/index.js'
import type { McmetaSummary, McmetaVersion, McmetaVersions, PackInfo } from './dependency/index.js'
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
	const { config, downloader, externals, logger, meta, projectRoots } = ctx

	async function readPackMcmeta(uri: string): Promise<PackMcmeta | undefined> {
		try {
			const data = await core.fileUtil.readJson(externals, uri)
			PackMcmeta.assert(data)
			return data
		} catch (e) {
			if (!externals.error.isKind(e, 'ENOENT')) {
				// `pack.mcmeta` exists but broken. Log an error.
				logger.error(`[je.initialize] Failed loading pack.mcmeta ${uri}`, e)
			}
		}
		return undefined
	}

	async function findPackMcmetas(versions: McmetaVersions): Promise<PackInfo[]> {
		const searchedUris = new Set<string>()
		const packs: PackInfo[] = []
		for (let depth = 0; depth <= 2; depth += 1) {
			for (const projectRoot of projectRoots) {
				const files = await core.fileUtil.getAllFiles(externals, projectRoot, depth + 1)
				for (const uri of files.filter(uri => uri.endsWith('/pack.mcmeta'))) {
					if (searchedUris.has(uri)) {
						continue
					}
					searchedUris.add(uri)
					const [packMcmeta, type] = await Promise.all([
						readPackMcmeta(uri),
						PackMcmeta.getType(uri, externals),
					])
					const versionInfo = resolveConfiguredVersion(
						config.env.gameVersion,
						versions,
						packMcmeta,
					)
					packs.push({ type, uri, packMcmeta, versionInfo })
				}
			}
		}
		return packs
	}

	meta.registerUriBinder(uriBinder)

	const versions = await getVersions(ctx.externals, ctx.downloader)
	if (!versions) {
		ctx.logger.error(
			'[je-initialize] Failed loading game version list. Expect everything to be broken.',
		)
		return
	}

	const packInfos = await findPackMcmetas(versions)

	function selectVersionInfo(packs: PackInfo[], versions: McmetaVersions) {
		// Selecting the first valid data pack.mcmeta
		const pack = packs.find(p => p.packMcmeta !== undefined && p.type === 'data')
		const version = pack === undefined
			? resolveConfiguredVersion(config.env.gameVersion, versions, undefined)
			: pack.versionInfo
		const packMessage = pack === undefined
			? 'Failed finding a valid pack.mcmeta'
			: `Found a pack.mcmeta ${pack.uri}`
		const reasonMessage = pack && version.reason === 'auto'
			? `using pack format ${pack.packMcmeta?.pack.pack_format} to select`
			: version.reason === 'config'
			? `but using config override "${config.env.gameVersion}" to select`
			: version.reason === 'fallback'
			? 'using fallback'
			: 'loading' // should never occur
		const versionMessage = `version ${version.release}${
			version.id === version.release ? '' : ` (${version.id})`
		}`
		ctx.logger.info(`[je.initialize] ${packMessage}, ${reasonMessage} ${versionMessage}`)
		return version
	}
	const version = selectVersionInfo(packInfos, versions)
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
	const packFormats = new Map<number, McmetaVersion>()
	for (const version of versions) {
		if (version.type === 'release' && !packFormats.has(version.data_pack_version)) {
			packFormats.set(version.data_pack_version, version)
		}
	}
	mcdoc.runtime.registerAttribute(meta, 'pack_format', () => undefined, {
		checker: (_, typeDef) => {
			if (typeDef.kind !== 'literal' || typeof typeDef.value.value !== 'number') {
				return undefined
			}
			const target = typeDef.value.value
			return (node, ctx) => {
				const targetVersion = packFormats.get(target)
				if (!targetVersion) {
					ctx.err.report(
						localize('java-edition.pack-format.unsupported', target),
						node,
						core.ErrorSeverity.Warning,
					)
				} else if (targetVersion.id !== release) {
					ctx.err.report(
						localize('java-edition.pack-format.not-loaded', target, release),
						node,
						core.ErrorSeverity.Warning,
					)
				}
			}
		},
		numericCompleter: (_, ctx) => {
			return [...packFormats.values()].map((v, i) => ({
				range: core.Range.create(ctx.offset),
				label: `${v.data_pack_version}`,
				labelSuffix: ` (${v.id})`,
				sortText: `${i}`.padStart(4, '0'),
			} satisfies core.CompletionItem))
		},
	})

	json.initialize(ctx)
	jeJson.initialize(ctx)
	jeMcf.initialize(ctx, summary.commands, release)
	nbt.initialize(ctx)

	return { loadedVersion: release, errorSource: release }
}
