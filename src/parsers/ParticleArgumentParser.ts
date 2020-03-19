import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import BlockNode from '../types/nodes/BlockNode'
import IdentityNode from '../types/nodes/IdentityNode'
import ItemNode from '../types/nodes/ItemNode'
import ParsingContext from '../types/ParsingContext'
import Particle from '../types/Particle'
import StringReader from '../utils/StringReader'
import Vector from '../types/Vector'

export default class ParticleArgumentParser extends ArgumentParser<Particle<any>> {
    static identity = 'Particle'
    readonly identity = 'particle'

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<Particle<any>> {
        const ans: ArgumentParserResult<Particle<any>> = {
            data: new Particle(new IdentityNode()),
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
                    const colorResult = ctx.parsers.get('Vector', [
                        3, false, false,
                        [0, 0, 0],
                        [1, 1, 1]
                    ]).parse(reader, ctx)
                    const color = colorResult.data as Vector
                    combineArgumentParserResult(ans, colorResult)
                    /* istanbul ignore else */
                    if (ans.errors.length === 0) {
                        const key = `${
                            parseFloat(color.elements[0].value)} ${
                            parseFloat(color.elements[1].value)} ${
                            parseFloat(color.elements[2].value)}`
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
                    const sizeResult = ctx.parsers.get('Number', ['float']).parse(reader, ctx)
                    const size = sizeResult.data as number
                    combineArgumentParserResult(ans, colorResult)
                    color.elements.push({ type: 'absolute', value: size.toString() })
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

        return ans
    }

    getExamples(): string[] {
        return ['minecraft:cloud', 'minecraft:dust 1.0 1.0 1.0 1.0']
    }
}
