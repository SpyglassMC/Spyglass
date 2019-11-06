import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { nbtDocs } from 'mc-nbt-paths'
import ArgumentParser from './ArgumentParser'
import Block from '../types/Block'
import Identity from '../types/Identity'
import Item from '../types/Item'
import Manager from '../types/Manager'
import Particle from '../types/Particle'
import StringReader from '../utils/StringReader'
import VanillaBlockDefinitions from '../types/VanillaBlockDefinitions'
import VanillaRegistries from '../types/VanillaRegistries'
import Vector from '../types/Vector'
import { VanillaConfig } from '../types/Config'
import { GlobalCache } from '../types/Cache'

export default class ParticleArgumentParser extends ArgumentParser<Particle<any>> {
    readonly identity = 'particle'

    // istanbul ignore next
    constructor(
        private readonly blockDefinitions = VanillaBlockDefinitions,
        private readonly registries = VanillaRegistries,
        private readonly nbtSchema = nbtDocs
    ) {
        super()
    }

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>, config = VanillaConfig, cache: GlobalCache = {}): ArgumentParserResult<Particle<any>> {
        const ans: ArgumentParserResult<Particle<any>> = {
            data: new Particle(new Identity()),
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor

        const typeResult = manager.get('NamespacedID', ['minecraft:particle_type', this.registries]).parse(reader, cursor, manager, config, cache)
        const type = typeResult.data as Identity
        combineArgumentParserResult(ans, typeResult)
        ans.data.id = type

        try {
            switch (type.toString()) {
                case 'minecraft:dust':
                    reader
                        .expect(' ')
                        .skip()
                    const colorResult = manager.get('Vector', [4, false, false, 0, 1]).parse(reader, cursor, manager, config, cache)
                    const color = colorResult.data as Vector
                    combineArgumentParserResult(ans, colorResult)
                    ans.data.param = color
                    /* istanbul ignore else */
                    if (ans.errors.length === 0) {
                        const key = `${parseFloat(color.elements[0].value)} ${parseFloat(color.elements[1].value)} ${parseFloat(color.elements[2].value)} ${parseFloat(color.elements[3].value)}`
                        ans.cache = {
                            'colors/dust': {
                                [key]: {
                                    def: [],
                                    ref: [{ range: { start, end: reader.cursor} }]
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
                    const blockResult = manager.get('Block', [false, this.blockDefinitions, this.registries, this.nbtSchema]).parse(reader, cursor, manager, config, cache)
                    const block = blockResult.data as Block
                    combineArgumentParserResult(ans, blockResult)
                    ans.data.param = block
                    break
                case 'minecraft:item':
                    reader
                        .expect(' ')
                        .skip()
                    const itemResult = manager.get('Item', [false, this.registries, this.nbtSchema]).parse(reader, cursor, manager, config, cache)
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
