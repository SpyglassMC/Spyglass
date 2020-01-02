import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import Block from '../types/Block'
import Identity from '../types/Identity'
import Item from '../types/Item'
import ParsingContext from '../types/ParsingContext'
import Particle from '../types/Particle'
import StringReader from '../utils/StringReader'
import Vector from '../types/Vector'

export default class ParticleArgumentParser extends ArgumentParser<Particle<any>> {
    readonly identity = 'particle'

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<Particle<any>> {
        const ans: ArgumentParserResult<Particle<any>> = {
            data: new Particle(new Identity()),
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor

        const typeResult = ctx.parsers.get('NamespacedID', ['minecraft:particle_type', ctx.registries]).parse(reader, ctx)
        const type = typeResult.data as Identity
        combineArgumentParserResult(ans, typeResult)
        ans.data.id = type

        try {
            switch (type.toString()) {
                case 'minecraft:dust':
                    reader
                        .expect(' ')
                        .skip()
                    const colorResult = ctx.parsers.get('Vector', [
                        4, false, false,
                        [0, 0, 0, undefined],
                        [1, 1, 1, undefined]
                    ]).parse(reader, ctx)
                    const color = colorResult.data as Vector
                    combineArgumentParserResult(ans, colorResult)
                    ans.data.param = color
                    /* istanbul ignore else */
                    if (ans.errors.length === 0) {
                        const key = `${parseFloat(color.elements[0].value)} ${parseFloat(color.elements[1].value)} ${parseFloat(color.elements[2].value)} ${parseFloat(color.elements[3].value)}`
                        ans.cache = {
                            colors: {
                                [key]: {
                                    def: [],
                                    ref: [{ start, end: reader.cursor }]
                                }
                            }
                        }
                    }
                    break
                case 'minecraft:block':
                case 'minecraft:falling_dust':
                    reader
                        .expect(' ')
                        .skip()
                    const blockResult = ctx.parsers.get('Block').parse(reader, ctx)
                    const block = blockResult.data as Block
                    combineArgumentParserResult(ans, blockResult)
                    ans.data.param = block
                    break
                case 'minecraft:item':
                    reader
                        .expect(' ')
                        .skip()
                    const itemResult = ctx.parsers.get('Item').parse(reader, ctx)
                    const item = itemResult.data as Item
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
