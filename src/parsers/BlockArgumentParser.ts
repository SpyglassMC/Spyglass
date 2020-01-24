import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { NbtCompoundTag } from '../types/NbtTag'
import ArgumentParser from './ArgumentParser'
import Block from '../types/Block'
import Identity from '../types/Identity'
import StringReader from '../utils/StringReader'
import MapAbstractParser from './MapAbstractParser'
import ParsingError from '../types/ParsingError'
import ParsingContext from '../types/ParsingContext'
import { locale } from '../locales/Locales'

export default class BlockArgumentParser extends ArgumentParser<Block> {
    static identity = 'Block'
    readonly identity = 'block'

    /* istanbul ignore next */
    constructor(
        private readonly allowTag = false,
        private readonly isPredicate = false
    ) {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<Block> {
        const ans: ArgumentParserResult<Block> = {
            data: new Block(new Identity()),
            errors: [],
            cache: {},
            completions: []
        }

        const idResult = ctx.parsers.get('NamespacedID', ['minecraft:block', this.allowTag]).parse(reader, ctx)
        const id = idResult.data as Identity
        combineArgumentParserResult(ans, idResult)
        ans.data.id = id

        this.parseStates(reader, ctx, ans, id)
        this.parseTag(reader, ctx, ans, id)

        return ans
    }

    private parseStates(reader: StringReader, ctx: ParsingContext, ans: ArgumentParserResult<Block>, id: Identity): void {
        if (reader.peek() === Block.StatesBeginSymbol) {
            const definition = !id.isTag ? ctx.blocks[id.toString()] : undefined
            const properties = definition ? (definition.properties || {}) : {}

            new MapAbstractParser<string, Block>(
                Block.StatesBeginSymbol, '=', ',', Block.StatesEndSymbol,
                // '','','','',
                (ans, reader, ctx) => {
                    const existingKeys = Object.keys(ans.data.states)
                    const keys = Object.keys(properties).filter(v => !existingKeys.includes(v))
                    const result = ctx.parsers
                        .get('Literal', keys)
                        .parse(reader, ctx)
                    if (id.isTag) {
                        result.errors = []
                    }
                    return result
                },
                (ans, reader, ctx, key, range) => {
                    if (Object.keys(ans.data.states).filter(v => v === key).length > 0) {
                        ans.errors.push(new ParsingError(
                            range,
                            locale('duplicate-key', locale('punc.quote', key))
                        ))
                    }
                    const result = ctx.parsers.get('Literal', properties[key]).parse(reader, ctx)
                    ans.data.states[key] = result.data
                    if (id.isTag) {
                        result.errors = []
                    }
                    combineArgumentParserResult(ans, result)
                }
            ).parse(ans, reader, ctx)
        }
    }

    private parseTag(reader: StringReader, ctx: ParsingContext, ans: ArgumentParserResult<Block>, id: Identity): void {
        if (reader.peek() === '{') {
            // FIXME: NBT schema for block tags.
            const tagResult = ctx.parsers.get('NbtTag', ['compound', 'blocks', id.toString(), this.isPredicate]).parse(reader, ctx)
            const tag = tagResult.data as NbtCompoundTag
            combineArgumentParserResult(ans, tagResult)
            ans.data.nbt = tag
        }
    }

    getExamples(): string[] {
        return ['stone', 'minecraft:stone', 'stone[foo=bar]', 'stone{bar:baz}']
    }
}
