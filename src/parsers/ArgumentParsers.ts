import ArgumentParser from './ArgumentParser'
import BlockArgumentParser from './BlockArgumentParser'
import BossbarArgumentParser from './BossbarArgumentParser'
import DefinitionDescriptionArgumentParser from './DefinitionDescriptionArgumentParser'
import DefinitionIDArgumentParser from './DefinitionIDArgumentParser'
import EntityArgumentParser from './EntityArgumentParser'
import IPArgumentParser from './IPArgumentParser'
import ItemArgumentParser from './ItemArgumentParser'
import LiteralArgumentParser from './LiteralArgumentParser'
import MessageArgumentParser from './MessageArgumentParser'
import NumberArgumentParser from './NumberArgumentParser'
import TextComponentArgumentParser from './TextComponentArgumentParser'
import VectorArgumentParser from './VectorArgumentParser'

export const ArgumentParsers: (new (...params: any) => ArgumentParser<any>)[] = [
    BlockArgumentParser,
    BossbarArgumentParser,
    DefinitionDescriptionArgumentParser,
    DefinitionIDArgumentParser,
    EntityArgumentParser,
    IPArgumentParser,
    ItemArgumentParser,
    LiteralArgumentParser,
    MessageArgumentParser,
    NumberArgumentParser,
    TextComponentArgumentParser,
    VectorArgumentParser
]

export default ArgumentParsers

/**
 * Get an argument parser from specific ID and params.
 * @param id The name of the class without the suffix (`ArgumentParser`). e.g. `Block`, `NamespacedID`, etc.
 * @param params Optional params for the constructor.
 */
export function getArgumentParser(id: string, params: any[] = []) {
    try {
        for (const parser of ArgumentParsers) {
            if (parser.name === `${id}ArgumentParser`) {
                return new parser(...params)
            }
        }
    } catch (e) {
        throw new Error(`error occurred when getting parser from {id: ‘${id}’, params: ‘${params}’}: ${e.message}`)
    }
    throw new Error(`unknown argument parser ID: ‘${id}’`)
}
