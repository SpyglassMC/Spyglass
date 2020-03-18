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
import IdentityArgumentParser from './IdentityArgumentParser'
import NbtPathArgumentParser from './NbtPathArgumentParser'
import NbtArgumentParser from './NbtArgumentParser'
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
        IdentityArgumentParser,
        NbtPathArgumentParser,
        NbtArgumentParser,
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

    private static readonly parsers = new Map<string, new (...params: any) => ArgumentParser<any>>()

    /**
     * Get an argument parser from specific ID and params.
     * @param id The name of the class without the suffix (`ArgumentParser`). e.g. `Block`, `Identity`, etc.
     * @param params Optional params for the constructor.
     */
    get(id: string, params: any[] = []) {
        try {
            const parser = ArgumentParserManager.parsers.get(id)
            /* istanbul ignore next */
            if (parser) {
                return new parser(...params)
            }

            for (const parser of ArgumentParserManager.ArgumentParsers) {
                if ((parser as any).identity === id) {
                    ArgumentParserManager.parsers.set(id, parser)
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
