import { locale } from '../locales'
import { NodeRange } from '../nodes/ArgumentNode'
import { BlockNode } from '../nodes/BlockNode'
import { BlockStateNode, BlockStateNodeChars } from '../nodes/BlockStateNode'
import { IdentityNode } from '../nodes/IdentityNode'
import { IsMapSorted } from '../nodes/MapNode'
import { NbtCompoundNode } from '../nodes/NbtCompoundNode'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ErrorCode, ParsingError } from '../types/ParsingError'
import { getDiagnosticSeverity } from '../types/StylisticConfig'
import { Token, TokenType } from '../types/Token'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'
import { MapParser } from './MapParser'

export class BlockArgumentParser extends ArgumentParser<BlockNode> {
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

        const start = reader.offset

        const idResult = ctx.parsers.get('Identity', ['minecraft:block', this.allowTag]).parse(reader, ctx)
        const id = idResult.data as IdentityNode
        combineArgumentParserResult(ans, idResult)
        ans.data.id = id

        this.parseStates(reader, ctx, ans, id)
        this.parseTag(reader, ctx, ans, id)

        ans.data[NodeRange] = { start, end: reader.offset }

        return ans
    }

    private parseStates(reader: StringReader, ctx: ParsingContext, ans: ArgumentParserResult<BlockNode>, id: IdentityNode): void {
        if (reader.peek() === '[') {
            const start = reader.offset
            const definition = id.isTag ? undefined : ctx.blockDefinition[id.toString()]
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

                    const start = reader.offset
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

                    const start = reader.offset
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
            ans.data.states[NodeRange] = { start, end: reader.offset }

            if (ctx.config.lint.blockStateSortKeys && !ans.data.states[IsMapSorted]()) {
                ans.errors.push(new ParsingError(
                    { start, end: reader.offset },
                    locale('diagnostic-rule',
                        locale('unsorted-keys'),
                        locale('punc.quote', 'datapack.lint.blockStateSortKeys')
                    ),
                    undefined, getDiagnosticSeverity(ctx.config.lint.blockStateSortKeys[0]),
                    ErrorCode.BlockStateSortKeys
                ))
            }
        }
    }

    private parseTag(reader: StringReader, ctx: ParsingContext, ans: ArgumentParserResult<BlockNode>, id: IdentityNode): void {
        if (reader.peek() === '{') {
            const tagResult = ctx.parsers.get('Nbt', [
                'Compound', 'minecraft:block', !id.isTag ? id.toString() : null, this.isPredicate
            ]).parse(reader, ctx)
            const tag = tagResult.data as NbtCompoundNode
            combineArgumentParserResult(ans, tagResult)
            ans.data.tag = tag
        }
    }

    getExamples(): string[] {
        return ['stone', 'minecraft:stone', 'stone[foo=bar]', 'stone{bar:baz}']
    }
}
