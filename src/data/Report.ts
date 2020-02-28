/* istanbul ignore file */

import fs from 'fs-extra'
import path from 'path'
import BlockDefinition from '../types/BlockDefinition'
import { VanillaReportOptions } from '../types/ParsingContext'
import Registry from '../types/Registry'
import { requestText } from '../utils/utils'

const BlockDefinitions: {
    [version: string]: BlockDefinition | undefined
} = {}

const Registries: {
    [version: string]: Registry | undefined
} = {}

const MaxFaildTimes = 5
let faildTimes = 0

type ReportType = 'BlockDefinition' | 'Registry'

function getCache(type: ReportType) {
    if (type === 'BlockDefinition') {
        return BlockDefinitions
    } else {
        return Registries
    }
}

function getDefault(type: ReportType) {
    return import(`./${type}.json`)
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

function getReportUri(type: ReportType, version: string, processedVersions: string[]) {
    const name = type === 'BlockDefinition' ? 'blocks' : 'registries'
    if (processedVersions.includes(version)) {
        return `https://raw.githubusercontent.com/Arcensoth/mcdata/${version}/processed/reports/${name}/${name}.min.json`
    } else {
        return `https://raw.githubusercontent.com/Arcensoth/mcdata/${version}/generated/reports/${name}.json`
    }
}

export async function getReport(type: ReportType, versionOrLiteral: string, options?: VanillaReportOptions) {
    const cache = getCache(type)
    if (!cache[versionOrLiteral]) {
        if (faildTimes >= MaxFaildTimes) {
            const ans = await getDefault(type)
            cache[versionOrLiteral] = ans
            return ans
        }
        if (options) {
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
                console.warn(`[${type}] Error occurred: ${e} (${faildTimes}/${MaxFaildTimes})`)
                faildTimes++
                const ans = await getDefault(type)
                console.info(`[${type}] Used the default one for ${versionOrLiteral}.`)
                return ans
            }
        } else {
            const ans = await getDefault(type)
            console.info(`[${type}] Used the default one for ${versionOrLiteral}.`)
            return ans
        }
    }
    return cache[versionOrLiteral]!
}
