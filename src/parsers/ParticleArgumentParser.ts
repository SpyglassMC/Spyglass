import { arrayToCompletions } from '../utils/utils'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import Block from '../types/Block'
import Identity from '../types/Identity'
import Manager from '../types/Manager'
import ParsingError from '../types/ParsingError'
import Particle from '../types/Particle'
import StringReader from '../utils/StringReader'
import Time from '../types/Time'
import VanillaBlockDefinitions from '../types/VanillaBlocks'
import VanillaRegistries from '../types/VanillaRegistries'
import Vector from '../types/Vector'

export default class ParticleArgumentParser extends ArgumentParser<Particle<any>> {
    readonly identity = 'particle'

    // istanbul ignore next
    constructor(
        private readonly blockDefinitions = VanillaBlockDefinitions,
        private readonly registries = VanillaRegistries
    ) {
        super()
    }

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>): ArgumentParserResult<Particle<any>> {
        const ans: ArgumentParserResult<Particle<any>> = {
            data: new Particle(new Identity()),
            errors: [],
            cache: {},
            completions: []
        }

        const typeResult = manager.get('NamespacedID', ['minecraft:particle_type', this.registries]).parse(reader, cursor)
        const type = typeResult.data as Identity
        combineArgumentParserResult(ans, typeResult)
        ans.data.id = type

        try {
            switch (type.toString()) {
                case 'minecraft:dust':
                    const colorResult = manager.get('Vector', [4, false, false, false]).parse(reader, cursor)
                    const color = colorResult.data as Vector
                    combineArgumentParserResult(ans, colorResult)
                    ans.data.param = color
                    break
                case 'minecraft:block':
                    const blockResult = manager.get('Block', [this.blockDefinitions]).parse(reader, cursor)
                    const block = blockResult.data as Block
                    combineArgumentParserResult(ans, blockResult)
                    ans.data.param = block
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
        return ['0d', '0s', '0t', '0']
    }
}
