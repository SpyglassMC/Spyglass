import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import VanillaRegistries, { Registry } from '../types/VanillaRegistries'
import { ArgumentParserResult } from '../types/Parser'
import { GlobalCache } from '../types/Cache'
import { VanillaConfig } from '../types/Config'

export default class NumericIDArgumentParser extends ArgumentParser<number> {
    private readonly registry: Registry
    readonly identity = 'numericID'

    constructor(type: string, registries = VanillaRegistries) {
        super()
        this.registry = registries[type]
    }

    parse(reader: StringReader, cursor = -1, config = VanillaConfig, cache: GlobalCache = {}): ArgumentParserResult<number> {
        const ans: ArgumentParserResult<number> = {
            data: NaN,
            errors: [],
            cache: {},
            completions: []
        }
        //#region Completions
        if (reader.cursor === cursor) {
            const getCompletions = (registry: Registry) => Object
                .keys(registry.entries)
                .map(v => ({ label: registry.entries[v].protocol_id.toString(), detail: v }))
            ans.completions.push(...getCompletions(this.registry))
        }
        //#endregion

        //#region Data
        let value: undefined | number
        try {
             value = reader.readInt()
             ans.data = value
        } catch (p) {
            ans.errors.push(p)
        }
        //#endregion

        //#region Errors
        //#endregion

        //#region Cache
        //#endregion
        return ans
    }

    getExamples(): string[] {
        return ['0']
    }
}
