/* istanbul ignore file */

import clone from 'clone'
import { promises as fsp } from 'fs'
import path from 'path'
import { isFileType } from '../types'
import { BlockDefinition } from '../types/BlockDefinition'
import { NamespaceSummary } from '../types/NamespaceSummary'
import { nbtdoc } from '../types/nbtdoc'
import { Registry } from '../types/Registry'
import { VersionInformation } from '../types/VersionInformation'
import { pathAccessible, readFile, requestText } from '../utils'

let failedTimes = 0
const MaxFailedTimes = 3

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

export function getVanillaDataCache(): {
    BlockDefinition: { [version: string]: Promise<BlockDefinition> },
    NamespaceSummary: { [version: string]: Promise<NamespaceSummary> },
    Nbtdoc: { [version: string]: Promise<nbtdoc.Root> },
    Registry: { [version: string]: Promise<Registry> }
} {
    return clone({
        BlockDefinition: { '1.19.4': Promise.resolve(FallbackBlockDefinition) },
        NamespaceSummary: { '1.19.4': Promise.resolve(FallbackNamespaceSummary) },
        Nbtdoc: { '1.19.4': Promise.resolve(FallbackNbtdoc) },
        Registry: { '1.19.4': Promise.resolve(FallbackRegistry) }
    })
}

export const VanillaDataCache = getVanillaDataCache()

export type DataType = 'BlockDefinition' | 'NamespaceSummary' | 'Nbtdoc' | 'Registry'

export type DataSource = 'GitHub' | '码云'

function getUri(_source: DataSource, maintainer: string, name: string, path: string) {
    return `https://raw.githubusercontent.com/${maintainer}/${name}/${path}`
}

function getReportUri(type: DataType, source: DataSource, version: string, processedVersions: string[], isLatestSnapshot: boolean) {
    switch (type) {
        case 'BlockDefinition':
            if (processedVersions.includes(version)) {
                return getUri(source, 'Ersatz77', 'mcdata', `${isLatestSnapshot ? 'master' : version}/processed/reports/blocks/data.min.json`)
            } else {
                return getUri(source, 'Ersatz77', 'mcdata', `${version}/generated/reports/blocks.json`)
            }
        case 'NamespaceSummary':
            return getUri(source, 'misode', 'mcmeta', `${isLatestSnapshot ? 'summary' : `${version}-summary`}/registries/data.min.json`)
        case 'Nbtdoc':
            return getUri(source, 'Yurihaia', 'mc-nbtdoc', `${isLatestSnapshot ? 'generated' : `${version}-gen`}/build/generated.json`)
        case 'Registry':
        default:
            if (processedVersions.includes(version)) {
                return getUri(source, 'Ersatz77', 'mcdata', `${isLatestSnapshot ? 'master' : version}/processed/reports/registries/data.min.json`)
            } else {
                return getUri(source, 'Ersatz77', 'mcdata', `${version}/generated/reports/registries.json`)
            }
    }
}

async function getSingleVanillaData(type: DataType, source: DataSource, version: string, globalStoragePath: string | undefined, processedVersions: string[], latestSnapshot: string) {
    const cache = VanillaDataCache[type]
    cache[version] = cache[version] ?? new Promise(async (resolve) => {
        if (failedTimes < MaxFailedTimes) {
            let ans: any
            const versionPath = globalStoragePath ? path.join(globalStoragePath, version) : undefined
            const filePath = versionPath ? path.join(versionPath, `${type}.json`) : undefined
            try {
                if (filePath && await pathAccessible(filePath)) {
                    console.info(`[VanillaData: ${type} for ${version}] Loading from local file ${filePath.replace(globalStoragePath!, '${globalStoragePath}')}...`)
                    const json = JSON.parse(await readFile(filePath))
                    console.info(`[VanillaData: ${type} for ${version}] Loaded from local file.`)
                    ans = json
                } else {
                    const isLatestSnapshot = version === latestSnapshot
                    const uri = getReportUri(type, source, version, processedVersions, isLatestSnapshot)
                    console.info(`[VanillaData: ${type} for ${version}] Fetching from ${source} ${uri}...`)
                    const str = await Promise.race([
                        requestText(uri),
                        new Promise<string>((_, reject) => {
                            setTimeout(() => { reject(new Error('Time out!')) }, 7_000)
                        })
                    ])
                    const json = JSON.parse(str)
                    console.info(`[VanillaData: ${type} for ${version}] Fetched from ${source}.`)
                    if (versionPath && filePath) {
                        await fsp.mkdir(versionPath, { recursive: true })
                        fsp.writeFile(filePath, str, { encoding: 'utf8' })
                        console.info(`[VanillaData: ${type} for ${version}] Saved at ${filePath.replace(globalStoragePath!, '${globalStoragePath}')}.`)
                    }
                    ans = json
                }
                if (type === 'NamespaceSummary') {
                    // Transform misode/mcmeta summaries to SPGoding/vanilla-datapack summaries:
                    // 1. Remove all non-ClientCache-type keys.
                    // 2. Add the `minecraft:` namespace.
                    for (const key of Object.keys(ans)) {
                        if (!isFileType(key)) {
                            delete ans[key]
                        }
                    }
                    for (const [key, values] of Object.entries(ans as Record<string, string[]>)) {
                        ans[key] = values.map(s => s.includes(':') ? s : `minecraft:${s}`)
                    }
                }
                resolve(ans)
            } catch (e) {
                console.warn(`[VanillaData: ${type} for ${version}] ${e} (${++failedTimes}/${MaxFailedTimes})`)
                console.info(`[VanillaData: ${type} for ${version}] Used the fallback.`)
                resolve(FallbackVanillaData[type])
            }
        } else {
            resolve(FallbackVanillaData[type])
        }
    })
    return cache[version]
}

export async function getVanillaData(versionOrLiteral: string | null, source: DataSource, versionInformation: VersionInformation | undefined, globalStoragePath: string | undefined) {
    if (!versionInformation || !versionOrLiteral) {
        return FallbackVanillaData
    }
    const ans: VanillaData = { ...FallbackVanillaData }
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
            type, source, version, globalStoragePath, versionInformation.processedVersions, versionInformation.latestSnapshot
        ) as any
    }
    return ans
}
