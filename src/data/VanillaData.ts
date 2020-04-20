/* istanbul ignore file */

import fs from 'fs-extra'
import path from 'path'
import { nbtdoc } from '../types/nbtdoc'
import BlockDefinition from '../types/BlockDefinition'
import { VanillaReportOptions } from '../types/ParsingContext'
import Registry from '../types/Registry'
import { requestText } from '../utils/utils'
import NamespaceSummary from '../types/NamespaceSummary'

const BlockDefinitions: {
    [version: string]: BlockDefinition | undefined
} = {}

const NamespaceSummaries: {
    [version: string]: NamespaceSummary | undefined
} = {}

const Nbtdocs: {
    [version: string]: nbtdoc.Root | undefined
} = {}

const Registries: {
    [version: string]: Registry | undefined
} = {}

type DataType = 'BlockDefinition' | 'NamespaceSummary' | 'Nbtdoc' | 'Registry'

let faildTimes = 0
const MaxFaildTimes = 5

function getCache(type: DataType) {
    switch (type) {
        case 'BlockDefinition':
            return BlockDefinitions
        case 'NamespaceSummary':
            return NamespaceSummaries
        case 'Nbtdoc':
            return Nbtdocs
        case 'Registry':
        default:
            return Registries
    }
}

function getDefault(type: DataType) {
    return require(`./${type}.json`)
}

function getVersion(version: string, options: VanillaReportOptions) {
    if (version.toLowerCase() === 'latest release') {
        return options.latestRelease
    } else if (version.toLowerCase() === 'latest snapshot') {
        return options.latestSnapshot
    } else {
        return version
    }
}

function getReportUri(type: DataType, version: string, processedVersions: string[]) {
    switch (type) {
        case 'BlockDefinition':
            if (processedVersions.includes(version)) {
                return `https://raw.githubusercontent.com/Arcensoth/mcdata/${version}/processed/reports/blocks/blocks.min.json`
            } else {
                return `https://raw.githubusercontent.com/Arcensoth/mcdata/${version}/generated/reports/blocks.json`
            }
        case 'NamespaceSummary':
            if (processedVersions.includes(version)) {
                return `https://raw.githubusercontent.com/Arcensoth/mcdata/${version}/processed/data/minecraft/minecraft.min.json`
            } else {
                throw new Error(`No namespace summary for version ${version}.`)
            }
        case 'Nbtdoc':
            return `https://raw.githubusercontent.com/Yurihaia/mc-nbtdoc/${version}-gen/build/generated.json`
        case 'Registry':
        default:
            if (processedVersions.includes(version)) {
                return `https://raw.githubusercontent.com/Arcensoth/mcdata/${version}/processed/reports/registries/registries.min.json`
            } else {
                return `https://raw.githubusercontent.com/Arcensoth/mcdata/${version}/generated/reports/registries.json`
            }
    }
}

export async function getReport(type: DataType, versionOrLiteral: string, options?: VanillaReportOptions) {
    const cache = getCache(type)
    if (!cache[versionOrLiteral]) {
        if (options && faildTimes < MaxFaildTimes) {
            const version = getVersion(versionOrLiteral, options)
            const versionPath = path.join(options.globalStoragePath, version)
            const jsonPath = path.join(versionPath, `${type}.json`)
            console.info(`[${type}] Geting ${version} (${versionOrLiteral})...`)
            try {
                if (await fs.pathExists(jsonPath)) {
                    console.info(`[${type}] Loading ${version} (${versionOrLiteral}) from local file ‘${jsonPath}’...`)
                    const json = await fs.readJson(jsonPath, { encoding: 'utf8' })
                    console.info(`[${type}] Loaded ${version} (${versionOrLiteral}) from local file.`)
                    cache[versionOrLiteral] = json
                } else {
                    const uri = getReportUri(type, version, options.processedVersions)
                    console.info(`[${type}] Fetching ${version} (${versionOrLiteral}) from GitHub ‘${uri}’...`)
                    const json = JSON.parse(await requestText(uri))
                    await fs.mkdirp(versionPath)
                    fs.writeJson(jsonPath, json, { encoding: 'utf8' })
                    console.info(`[${type}] Fetched ${version} (${versionOrLiteral}) from GitHub and saved at ‘${jsonPath}’.`)
                    cache[versionOrLiteral] = json
                }
            } catch (e) {
                console.warn(`[${type}] Error occurred: ${e} (${++faildTimes}/${MaxFaildTimes})`)
                const ans = getDefault(type)
                console.info(`[${type}] Used the default one for ${versionOrLiteral}.`)
                return ans
            }
        } else {
            const ans = getDefault(type)
            return ans
        }
    }
    return cache[versionOrLiteral]
}
