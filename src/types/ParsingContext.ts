import ArgumentParser from '../parsers/ArgumentParser'
import ArgumentParserManager from '../parsers/ArgumentParserManager'
import BlockDefinitions from './BlockDefinition'
import CommandTree from './CommandTree'
import Config, { VanillaConfig } from './Config'
import Manager from './Manager'
import NbtSchema from './NbtSchema'
import Registry from './Registry'
import { ClientCache } from './ClientCache'
import { getReport } from '../data/Report'
import { getCommandTree } from '../data/CommandTree'
import { getNbtSchema } from '../data/NbtSchema'

export default interface ParsingContext {
    blocks: BlockDefinitions,
    cache: ClientCache,
    config: Config,
    cursor: number,
    nbt: NbtSchema,
    parsers: Manager<ArgumentParser<any>>,
    registries: Registry,
    tree: CommandTree
}

interface ParsingContextLike {
    blocks?: BlockDefinitions,
    cache?: ClientCache,
    config?: Config,
    cursor?: number,
    nbt?: NbtSchema,
    parsers?: Manager<ArgumentParser<any>>,
    registries?: Registry,
    tree?: CommandTree
}

export type VanillaReportOptions = { globalStoragePath: string, latestRelease: string, latestSnapshot: string, processedVersions: string[] }

/**
 * Construct a `ParsingContext`.
 */
/* istanbul ignore next */
export async function constructContext(custom: ParsingContextLike, options?: VanillaReportOptions): Promise<ParsingContext> {
    const ans = {
        cache: {},
        config: VanillaConfig,
        cursor: -1,
        parsers: new ArgumentParserManager(),
        ...custom
    } as ParsingContext

    ans.blocks = ans.blocks || await getReport('BlockDefinition', ans.config.env.dataVersion, options)
    ans.registries = ans.registries || await getReport('Registry', ans.config.env.dataVersion, options)
    ans.nbt = ans.nbt || await getNbtSchema(ans.config.env.version)
    ans.tree = ans.tree || await getCommandTree(ans.config.env.version)

    return ans
}
