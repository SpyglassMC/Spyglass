import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import * as mcdoc from '@spyglassmc/mcdoc'
import * as nbt from '@spyglassmc/nbt'
import { registerUriBuilders, uriBinder } from './binder/index.js'
import type { McmetaSummary, McmetaVersions, PackInfo } from './dependency/index.js'
import {
	getMcmetaSummary,
	getVanillaDatapack,
	getVanillaMcdoc,
	getVanillaResourcepack,
	getVersions,
	PackMcmeta,
	resolveConfiguredVersion,
	symbolRegistrar,
} from './dependency/index.js'
import * as jeJson from './json/index.js'
import { registerMcdocAttributes, registerPackFormatAttribute } from './mcdocAttributes.js'
import * as jeMcf from './mcfunction/index.js'

export * as binder from './binder/index.js'
export * as dependency from './dependency/index.js'
export * as json from './json/index.js'
export * from './mcdocAttributes.js'
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
					const packRoot = core.fileUtil.dirname(uri)
					const [packMcmeta, type] = await Promise.all([
						readPackMcmeta(uri),
						PackMcmeta.getType(packRoot, externals),
					])
					const versionInfo = resolveConfiguredVersion(
						config.env.gameVersion,
						versions,
						packMcmeta,
						type,
						logger,
					)
					packs.push({ type, packRoot, packMcmeta, versionInfo })
				}
			}
		}
		return packs
	}

	meta.registerUriBinder(uriBinder)
	registerUriBuilders(meta)

	const versions = await getVersions(ctx.externals, ctx.downloader)
	if (!versions) {
		ctx.logger.error(
			'[je-initialize] Failed loading game version list. Expect everything to be broken.',
		)
		return
	}

	const packs = await findPackMcmetas(versions)

	function selectVersionInfo(packs: PackInfo[], versions: McmetaVersions) {
		// Select the first valid pack.mcmeta, prioritizing data packs
		const pack = packs.find(p => p.packMcmeta !== undefined && p.type === 'data')
			?? packs.find(p => p.packMcmeta !== undefined && p.type === 'assets')
		const version = pack === undefined
			? resolveConfiguredVersion(config.env.gameVersion, versions, undefined, undefined, logger)
			: pack.versionInfo
		const packMessage = pack === undefined
			? 'Failed finding a valid pack.mcmeta'
			: `Found a valid pack.mcmeta ${pack.packRoot}/pack.mcmeta`
		const reasonMessage = pack && version.reason === 'auto'
			? `using ${pack.type} pack format ${pack.packMcmeta?.pack.pack_format} to select`
			: version.reason === 'config'
			? `but using config override "${config.env.gameVersion}" to select`
			: version.reason === 'fallback'
			? 'using fallback'
			: 'impossible' // should never occur
		const versionMessage = `version ${version.release}${
			version.id === version.release ? '' : ` (${version.id})`
		}`
		ctx.logger.info(`[je.initialize] ${packMessage}, ${reasonMessage} ${versionMessage}`)
		return version
	}
	const version = selectVersionInfo(packs, versions)
	const release = version.release

	meta.registerDependencyProvider(
		'@vanilla-datapack',
		() => getVanillaDatapack(downloader, version.id, version.isLatest),
	)

	meta.registerDependencyProvider(
		'@vanilla-resourcepack',
		() => getVanillaResourcepack(downloader, version.id, version.isLatest),
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
		checksum: `${summary.checksum}_v3`,
		registrar: symbolRegistrar(summary as McmetaSummary, release),
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

	registerMcdocAttributes(meta, summary.commands, release)
	registerPackFormatAttribute(meta, release, versions, packs)
	registerPackFormatAttribute(meta, release, versions, packs)

	meta.registerLanguage('zip', { extensions: ['.zip'] })
	meta.registerLanguage('png', { extensions: ['.png'] })
	meta.registerLanguage('ogg', { extensions: ['.ogg'] })
	meta.registerLanguage('ttf', { extensions: ['.ttf'] })
	meta.registerLanguage('otf', { extensions: ['.otf'] })
	meta.registerLanguage('fsh', { extensions: ['.fsh'] })
	meta.registerLanguage('vsh', { extensions: ['.vsh'] })

	json.initialize(ctx)
	jeJson.initialize(ctx)
	jeMcf.initialize(ctx, summary.commands, release)
	nbt.initialize(ctx)

	return { loadedVersion: release, errorSource: release }
}
