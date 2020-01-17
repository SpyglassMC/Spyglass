import ArgumentParser from './ArgumentParser'
import ParsingContext from '../types/ParsingContext'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { Registry } from '../types/Registries'

export default class NumericIDArgumentParser extends ArgumentParser<number> {
    private registry: Registry
    readonly identity = 'numericID'

    constructor(private readonly type: string) { super() }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<number> {
        this.registry = ctx.registries[this.type]
        const ans: ArgumentParserResult<number> = {
            data: NaN,
            errors: [],
            cache: {},
            completions: []
        }

        //#region Completions
        if (reader.cursor === ctx.cursor) {
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

        return ans
    }

    getExamples(): string[] {
        return ['0']
    }
}
