import ArgumentParser from './ArgumentParser'
import BlockArgumentParser from './BlockArgumentParser'
import DefinitionDescriptionArgumentParser from './DefinitionDescriptionArgumentParser'
import DefinitionIDArgumentParser from './DefinitionIDArgumentParser'
import EntityArgumentParser from './EntityArgumentParser'
import ItemArgumentParser from './ItemArgumentParser'
import ItemSlotArgumentParser from './ItemSlotArgumentParser'
import LiteralArgumentParser from './LiteralArgumentParser'
import Manager from '../types/Manager'
import MessageArgumentParser from './MessageArgumentParser'
import NamespacedIDArgumentParser from './NamespacedIDArgumentParser'
import NbtPathArgumentParser from './NbtPathArgumentParser'
import NbtTagArgumentParser from './NbtTagArgumentParser'
import NumberArgumentParser from './NumberArgumentParser'
import NumberRangeArgumentParser from './NumberRangeArgumentParser'
import NumericIDArgumentParser from './NumericIDArgumentParser'
import ObjectiveArgumentParser from './ObjectiveArgumentParser'
import ObjectiveCriterionArgumentParser from './ObjectiveCriterionArgumentParser'
import ParticleArgumentParser from './ParticleArgumentParser'
import QuotableLiteralArgumentParser from './QuotableLiteralArgumentParser'
import ScoreboardSlotArgumentParser from './ScoreboardSlotArgumentParser'
import StringArgumentParser from './StringArgumentParser'
import TagArgumentParser from './TagArgumentParser'
import TeamArgumentParser from './TeamArgumentParser'
import TextComponentArgumentParser from './TextComponentArgumentParser'
import TimeArgumentParser from './TimeArgumentParser'
import VectorArgumentParser from './VectorArgumentParser'

export default class ArgumentParserManager implements Manager<ArgumentParser<any>> {
    static readonly ArgumentParsers: (new (...params: any) => ArgumentParser<any>)[] = [
        BlockArgumentParser,
        DefinitionDescriptionArgumentParser,
        DefinitionIDArgumentParser,
        EntityArgumentParser,
        ItemArgumentParser,
        ItemSlotArgumentParser,
        LiteralArgumentParser,
        MessageArgumentParser,
        NamespacedIDArgumentParser,
        NbtPathArgumentParser,
        NbtTagArgumentParser,
        NumberArgumentParser,
        NumberRangeArgumentParser,
        NumericIDArgumentParser,
        ObjectiveArgumentParser,
        ObjectiveCriterionArgumentParser,
        ParticleArgumentParser,
        QuotableLiteralArgumentParser,
        ScoreboardSlotArgumentParser,
        StringArgumentParser,
        TagArgumentParser,
        TeamArgumentParser,
        TextComponentArgumentParser,
        TimeArgumentParser,
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
            /* istanbul ignore next */
            throw new Error(`error occurred when getting parser from {id: ‘${id}’, params: ‘${params}’}: ${e.message}`)
        }
        throw new Error(`unknown argument parser ID: ‘${id}’`)
    }
}
