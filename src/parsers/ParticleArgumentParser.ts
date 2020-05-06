import { NodeRange } from '../types/nodes/ArgumentNode'
import { BlockNode } from '../types/nodes/BlockNode'
import { IdentityNode } from '../types/nodes/IdentityNode'
import { ItemNode } from '../types/nodes/ItemNode'
import { NumberNode } from '../types/nodes/NumberNode'
import { ParticleNode } from '../types/nodes/ParticleNode'
import { VectorElementNode, VectorElementType, VectorNode } from '../types/nodes/VectorNode'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class ParticleArgumentParser extends ArgumentParser<ParticleNode<any>> {
    static identity = 'Particle'
    readonly identity = 'particle'

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<ParticleNode<any>> {
        const ans: ArgumentParserResult<ParticleNode<any>> = {
            data: new ParticleNode(new IdentityNode()),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor

        const typeResult = ctx.parsers.get('Identity', ['minecraft:particle_type']).parse(reader, ctx)
        const type = typeResult.data as IdentityNode
        combineArgumentParserResult(ans, typeResult)
        ans.data.id = type

        try {
            switch (type.toString()) {
                case 'minecraft:dust':
                    reader
                        .expect(' ')
                        .skip()
                    const colorResult: ArgumentParserResult<VectorNode> = ctx.parsers.get('Vector', [
                        3, false, false,
                        [0, 0, 0],
                        [1, 1, 1]
                    ]).parse(reader, ctx)
                    const color = colorResult.data
                    combineArgumentParserResult(ans, colorResult)
                    /* istanbul ignore else */
                    if (ans.errors.length === 0) {
                        const key = `${color[0].value} ${color[1].value} ${color[2].value}`
                        ans.cache = {
                            colors: {
                                [key]: {
                                    def: [],
                                    ref: [{ start, end: reader.cursor }]
                                }
                            }
                        }
                    }
                    reader
                        .expect(' ')
                        .skip()
                    const sizeStart = reader.cursor
                    const sizeResult: ArgumentParserResult<NumberNode> = ctx.parsers.get('Number', ['float']).parse(reader, ctx)
                    const sizeNode = new VectorElementNode(VectorElementType.Absolute, sizeResult.data.valueOf(), sizeResult.data.toString())
                    sizeNode[NodeRange] = { start: sizeStart, end: reader.cursor }
                    combineArgumentParserResult(ans, colorResult)
                    color.push(sizeNode)
                    color[NodeRange].end = reader.cursor
                    ans.data.param = color
                    break
                case 'minecraft:block':
                case 'minecraft:falling_dust':
                    reader
                        .expect(' ')
                        .skip()
                    const blockResult = ctx.parsers.get('Block').parse(reader, ctx)
                    const block = blockResult.data as BlockNode
                    combineArgumentParserResult(ans, blockResult)
                    ans.data.param = block
                    break
                case 'minecraft:item':
                    reader
                        .expect(' ')
                        .skip()
                    const itemResult = ctx.parsers.get('Item').parse(reader, ctx)
                    const item = itemResult.data as ItemNode
                    combineArgumentParserResult(ans, itemResult)
                    ans.data.param = item
                    break
                default:
                    break
            }
        } catch (p) {
            ans.errors.push(p)
        }

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    getExamples(): string[] {
        return ['minecraft:cloud', 'minecraft:dust 1.0 1.0 1.0 1.0']
    }
}
