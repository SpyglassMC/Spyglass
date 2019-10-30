import ArgumentParser from './ArgumentParser'
import BlockArgumentParser from './BlockArgumentParser'
import DefinitionDescriptionArgumentParser from './DefinitionDescriptionArgumentParser'
import DefinitionIDArgumentParser from './DefinitionIDArgumentParser'
import EntityArgumentParser from './EntityArgumentParser'
import IPArgumentParser from './IPArgumentParser'
import ItemArgumentParser from './ItemArgumentParser'
import LiteralArgumentParser from './LiteralArgumentParser'
import Manager from '../types/Manager'
import MessageArgumentParser from './MessageArgumentParser'
import NamespacedIDArgumentParser from './NamespacedIDArgumentParser'
import NbtTagArgumentParser from './NbtTagArgumentParser'
import NumberArgumentParser from './NumberArgumentParser'
import NumericIDArgumentParser from './NumericIDArgumentParser'
import ObjectiveArgumentParser from './ObjectiveArgumentParser'
import StringArgumentParser from './StringArgumentParser'
import TagArgumentParser from './TagArgumentParser'
import TeamArgumentParser from './TeamArgumentParser'
import TextComponentArgumentParser from './TextComponentArgumentParser'
import VectorArgumentParser from './VectorArgumentParser'

export default class ArgumentParserManager implements Manager<ArgumentParser<any>> {
    static readonly ArgumentParsers: (new (...params: any) => ArgumentParser<any>)[] = [
        BlockArgumentParser,
        DefinitionDescriptionArgumentParser,
        DefinitionIDArgumentParser,
        EntityArgumentParser,
        IPArgumentParser,
        ItemArgumentParser,
        LiteralArgumentParser,
        MessageArgumentParser,
        NamespacedIDArgumentParser,
        NbtTagArgumentParser,
        NumberArgumentParser,
        NumericIDArgumentParser,
        ObjectiveArgumentParser,
        StringArgumentParser,
        TagArgumentParser,
        TeamArgumentParser,
        TextComponentArgumentParser,
        VectorArgumentParser
    ]

    /**
     * Get an argument parser from specific ID and params.
     * @param id The name of the class without the suffix (`ArgumentParser`). e.g. `Block`, `NamespacedID`, etc.
     * @param params Optional params for the constructor.
     */
    get(id: string, params: any[] = []) {
        try {
            for (const parser of ArgumentParserManager.ArgumentParsers) {
                if (parser.name === `${id}ArgumentParser`) {
                    return new parser(...params)
                }
            }
        } catch (e) {
            throw new Error(`error occurred when getting parser from {id: ‘${id}’, params: ‘${params}’}: ${e.message}`)
        }
        throw new Error(`unknown argument parser ID: ‘${id}’`)
    }
}
