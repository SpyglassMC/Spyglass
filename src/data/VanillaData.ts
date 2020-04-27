/* istanbul ignore file */

import fs from 'fs-extra'
import path from 'path'
import BlockDefinition from '../types/BlockDefinition'
import NamespaceSummary from '../types/NamespaceSummary'
import { nbtdoc } from '../types/nbtdoc'
import Registry from '../types/Registry'
import { requestText } from '../utils/utils'
import VersionInformation from '../types/VersionInformation'

let faildTimes = 0
const MaxFaildTimes = 10

export type VanillaData = {
    BlockDefinition: BlockDefinition,
    Nbtdoc: nbtdoc.Root,
    Registry: Registry,
    NamespaceSummary: NamespaceSummary
}

export const FallbackBlockDefinition: BlockDefinition = require('./BlockDefinition.json') as BlockDefinition
export const FallbackNamespaceSummary: NamespaceSummary = require('./NamespaceSummary.json') as NamespaceSummary
export const FallbackNbtdoc: nbtdoc.Root = require('./Nbtdoc.json') as nbtdoc.Root
export const FallbackRegistry: Registry = require('./Registry.json') as Registry

export const FallbackVanillaData: VanillaData = {
    BlockDefinition: FallbackBlockDefinition,
    NamespaceSummary: FallbackNamespaceSummary,
    Nbtdoc: FallbackNbtdoc,
    Registry: FallbackRegistry
}

export const VanillaDataCache: {
    BlockDefinition: { [version: string]: BlockDefinition },
    NamespaceSummary: { [version: string]: NamespaceSummary },
    Nbtdoc: { [version: string]: nbtdoc.Root },
    Registry: { [version: string]: Registry }
} = {
    BlockDefinition: { '20w17a': FallbackBlockDefinition },
    NamespaceSummary: { '20w17a': FallbackNamespaceSummary },
    Nbtdoc: { '20w16a': FallbackNbtdoc },
    Registry: { '20w17a': FallbackRegistry }
}

export type DataType = 'BlockDefinition' | 'NamespaceSummary' | 'Nbtdoc' | 'Registry'

export type DataSource = 'GitHub' | '码云'

function getUri(source: DataSource, maintainer: string, name: string, path: string) {
    if (source === 'GitHub') {
        return `https://raw.githubusercontent.com/${maintainer}/${name}/${path}`
    } else {
        return `https://gitee.com/SPGoding/${name}/raw/${path}`
    }
}

function getReportUri(type: DataType, source: DataSource, version: string, processedVersions: string[]) {
    switch (type) {
        case 'BlockDefinition':
            if (processedVersions.includes(version)) {
                return getUri(source, 'Arcensoth', 'mcdata', `${version}/processed/reports/blocks/blocks.min.json`)
            } else {
                return getUri(source, 'Arcensoth', 'mcdata', `${version}/generated/reports/blocks.json`)
            }
        case 'NamespaceSummary':
            if (processedVersions.includes(version)) {
                return getUri(source, 'Arcensoth', 'mcdata', `${version}/processed/data/minecraft/minecraft.min.json`)
            } else {
                throw new Error(`No namespace summary for version ${version}.`)
            }
        case 'Nbtdoc':
            return getUri(source, 'Yurihaia', 'mc-nbtdoc', `${version}-gen/build/generated.json`)
        case 'Registry':
        default:
            if (processedVersions.includes(version)) {
                return getUri(source, 'Arcensoth', 'mcdata', `${version}/processed/reports/registries/registries.min.json`)
            } else {
                return getUri(source, 'Arcensoth', 'mcdata', `${version}/generated/reports/registries.json`)
            }
    }
}

async function getSingleVanillaData(type: DataType, source: DataSource, version: string, globalStoragePath: string, processedVersions: string[]) {
    const cache = VanillaDataCache[type]
    if (!cache[version]) {
        if (faildTimes < MaxFaildTimes) {
            const versionPath = path.join(globalStoragePath, version)
            const filePath = path.join(versionPath, `${type}.json`)
            console.info(`[VanillaData] Geting ${type} for ${version}...`)
            try {
                if (await fs.pathExists(filePath)) {
                    console.info(`[VanillaData] Loading ${type} for ${version} from local file ‘${filePath}’...`)
                    const json = await fs.readJson(filePath, { encoding: 'utf8' })
                    console.info(`[VanillaData] Loaded ${type} for ${version} from local file.`)
                    cache[version] = json
                } else {
                    const uri = getReportUri(type, source, version, processedVersions)
                    console.info(`[VanillaData] Fetching ${type} for ${version} from ${source} ‘${uri}’...`)
                    const json = JSON.parse(await requestText(uri))
                    await fs.mkdirp(versionPath)
                    fs.writeJson(filePath, json, { encoding: 'utf8' })
                    console.info(`[VanillaData] Fetched ${type} for ${version} from ${source} and saved at ‘${filePath}’.`)
                    cache[version] = json
                }
            } catch (e) {
                console.warn(`[VanillaData] Error occurred while getting ${type} for ${version}: ${e} (${++faildTimes}/${MaxFaildTimes})`)
                const ans = FallbackVanillaData[type]
                console.info(`[VanillaData] Used the fallback ${type} for ${version}.`)
                return ans
            }
        } else {
            const ans = FallbackVanillaData[type]
            return ans
        }
    }
    return cache[version]
}

export async function getVanillaData(versionOrLiteral: string, source: DataSource, versionInformation: VersionInformation | undefined, globalStoragePath: string) {
    if (!versionInformation) {
        return FallbackVanillaData
    }
    const ans: VanillaData = {} as any
    const types: DataType[] = ['BlockDefinition', 'NamespaceSummary', 'Nbtdoc', 'Registry']
    let version: string
    switch (versionOrLiteral.toLowerCase()) {
        case 'latest snapshot':
            version = versionInformation.latestSnapshot
            break
        case 'latest release':
            version = versionInformation.latestRelease
            break
        default:
            version = versionOrLiteral
            break
    }
    for (const type of types) {
        ans[type] = await getSingleVanillaData(
            type, source, version, globalStoragePath, versionInformation.processedVersions
        ) as any
    }
    return ans
}
