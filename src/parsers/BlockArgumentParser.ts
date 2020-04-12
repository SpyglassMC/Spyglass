import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import BlockNode from '../types/nodes/BlockNode'
import IdentityNode from '../types/nodes/IdentityNode'
import StringReader from '../utils/StringReader'
import MapParser from './MapParser'
import ParsingError from '../types/ParsingError'
import ParsingContext from '../types/ParsingContext'
import { locale } from '../locales/Locales'
import Token, { TokenType } from '../types/Token'
import BlockStateNode, { BlockStateNodeChars } from '../types/nodes/map/BlockStateMapNode'
import { IsMapNodeSorted } from '../types/nodes/map/MapNode'
import NbtCompoundNode from '../types/nodes/map/NbtCompoundNode'
import { NodeRange } from '../types/nodes/ArgumentNode'

export default class BlockArgumentParser extends ArgumentParser<BlockNode> {
    static identity = 'Block'
    readonly identity = 'block'

    /* istanbul ignore next */
    constructor(
        private readonly allowTag = false,
        private readonly isPredicate = false
    ) {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<BlockNode> {
        const ans: ArgumentParserResult<BlockNode> = {
            data: new BlockNode(),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }

        const start = reader.cursor

        const idResult = ctx.parsers.get('Identity', ['minecraft:block', this.allowTag]).parse(reader, ctx)
        const id = idResult.data as IdentityNode
        combineArgumentParserResult(ans, idResult)
        ans.data.id = id

        this.parseStates(reader, ctx, ans, id)
        this.parseTag(reader, ctx, ans, id)

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    private parseStates(reader: StringReader, ctx: ParsingContext, ans: ArgumentParserResult<BlockNode>, id: IdentityNode): void {
        if (reader.peek() === '[') {
            const start = reader.cursor
            const definition = id.isTag ? undefined : ctx.blocks[id.toString()]
            const properties = definition ? (definition.properties || {}) : {}

            const statesResult: ArgumentParserResult<BlockStateNode> = {
                data: new BlockStateNode(),
                cache: {}, completions: [], errors: [], tokens: []
            }

            new MapParser<BlockStateNode>(
                BlockStateNodeChars,
                (ans, reader, ctx) => {
                    const existingKeys = Object.keys(ans.data)
                    const keys = Object.keys(properties).filter(v => !existingKeys.includes(v))

                    const start = reader.cursor
                    const result = ctx.parsers.get('Literal', keys).parse(reader, ctx)
                    result.tokens = [Token.from(start, reader, TokenType.property)]

                    if (id.isTag) {
                        result.errors = []
                    }
                    return result
                },
                (ans, reader, ctx, key, range) => {
                    if (Object.keys(ans.data).filter(v => v === key).length > 0) {
                        ans.errors.push(new ParsingError(
                            range,
                            locale('duplicate-key', locale('punc.quote', key))
                        ))
                    }

                    const start = reader.cursor
                    const result = ctx.parsers.get('Literal', properties[key]).parse(reader, ctx)
                    result.tokens = [Token.from(start, reader, TokenType.string)]

                    ans.data[key] = result.data
                    if (id.isTag) {
                        result.errors = []
                    }
                    combineArgumentParserResult(ans, result)
                }
            ).parse(statesResult, reader, ctx)
            combineArgumentParserResult(ans, statesResult)
            ans.data.states = statesResult.data
            ans.data.states[NodeRange] = { start, end: reader.cursor }

            if (ctx.config.lint.blockStateSortKeys && !ans.data.states[IsMapNodeSorted]()) {
                ans.errors.push(new ParsingError(
                    { start, end: reader.cursor },
                    locale('unsorted-keys', 'datapack.lint.stateSortKeys')
                ))
            }
        }
    }

    private parseTag(reader: StringReader, ctx: ParsingContext, ans: ArgumentParserResult<BlockNode>, id: IdentityNode): void {
        if (reader.peek() === '{') {
            // FIXME: NBT schema for block tags.
            const tagResult = ctx.parsers.get('Nbt', ['Compound', 'blocks', id.toString(), this.isPredicate]).parse(reader, ctx)
            const tag = tagResult.data as NbtCompoundNode
            combineArgumentParserResult(ans, tagResult)
            ans.data.tag = tag
        }
    }

    getExamples(): string[] {
        return ['stone', 'minecraft:stone', 'stone[foo=bar]', 'stone{bar:baz}']
    }
}
