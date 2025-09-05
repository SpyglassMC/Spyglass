import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import * as mcdoc from '@spyglassmc/mcdoc'
import * as nbt from '@spyglassmc/nbt'
import { jsonUriPredicate, registerUriBuilders, uriBinder } from './binder/index.js'
import type { McmetaSummary, PackInfo } from './dependency/index.js'
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
	const { config, externals, logger, meta, projectRoots } = ctx

	async function readPackFormat(uri: string): Promise<number | undefined> {
		try {
			const data = await core.fileUtil.readJson(externals, uri)
			return PackMcmeta.readPackFormat(data)
		} catch (e) {
			if (!externals.error.isKind(e, 'ENOENT')) {
				// `pack.mcmeta` exists but broken. Log an error.
				logger.error(`[je.initialize] Failed loading pack.mcmeta ${uri}`, e)
			}
		}
		return undefined
	}

	async function findPackMcmetas(): Promise<PackInfo[]> {
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
					const [format, type] = await Promise.all([
						readPackFormat(uri),
						PackMcmeta.getType(packRoot, externals),
					])
					if (format !== undefined) {
						packs.push({ type, packRoot, format })
					}
				}
			}
		}
		return packs
	}

	meta.registerUriBinder(uriBinder)
	registerUriBuilders(meta)

	const [versions, packs] = await Promise.all([
		getVersions(externals, logger),
		findPackMcmetas(),
	])
	if (!versions) {
		ctx.logger.error(
			'[je-initialize] Failed loading game version list. Expect everything to be broken.',
		)
		return
	}

	const version = resolveConfiguredVersion(config.env.gameVersion, versions, packs, logger)
	const release = version.release

	meta.registerDependencyProvider(
		'@vanilla-datapack',
		() => getVanillaDatapack(externals, logger, version.id),
	)

	meta.registerDependencyProvider(
		'@vanilla-resourcepack',
		() => getVanillaResourcepack(externals, logger, version.id),
	)

	meta.registerDependencyProvider('@vanilla-mcdoc', () => getVanillaMcdoc(externals, logger))

	const summary = await getMcmetaSummary(
		ctx.externals,
		logger,
		version.id,
		config.env.mcmetaSummaryOverrides,
	)
	if (!summary.blocks || !summary.commands || !summary.fluids || !summary.registries) {
		ctx.logger.error(
			'[je-initialize] Failed loading mcmeta summaries. Expect everything to be broken.',
		)
		return
	}

	meta.registerSymbolRegistrar('mcmeta-summary', {
		checksum: `${summary.checksum}-v4`,
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
	registerPackFormatAttribute(meta, versions, packs)

	meta.registerLanguage('zip', { extensions: ['.zip'] })
	meta.registerLanguage('png', { extensions: ['.png'] })
	meta.registerLanguage('ogg', { extensions: ['.ogg'] })
	meta.registerLanguage('ttf', { extensions: ['.ttf'] })
	meta.registerLanguage('otf', { extensions: ['.otf'] })
	meta.registerLanguage('fsh', { extensions: ['.fsh'] })
	meta.registerLanguage('vsh', { extensions: ['.vsh'] })

	json.getInitializer(jsonUriPredicate)(ctx)
	jeJson.initialize(ctx)
	jeMcf.initialize(ctx, summary.commands, release)
	nbt.initialize(ctx)

	return { loadedVersion: release, errorSource: release }
}
