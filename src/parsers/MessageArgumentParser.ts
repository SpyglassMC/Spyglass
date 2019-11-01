import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { CompletionItemKind } from 'vscode-languageserver'
import Manager from '../types/Manager'
import { VanillaConfig } from '../types/Config'
import { GlobalCache } from '../types/Cache'
import Entity from '../types/Entity'

export default class MessageArgumentParser extends ArgumentParser<Array<string | Entity>> {
    readonly identity = 'message'

    constructor() {
        super()
    }

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>, config = VanillaConfig, cache: GlobalCache = {}): ArgumentParserResult<Array<string | Entity>> {
        const ans: ArgumentParserResult<Array<string | Entity>> = {
            data: [],
            errors: [],
            cache: {},
            completions: []
        }

        while (reader.canRead()) {
            if (reader.peek() === '@' &&
                (reader.peek(1) === 'p' || reader.peek(1) === 'a' || reader.peek(1) === 'r' || reader.peek(1) === 's' || reader.peek(1) === 'e')
            ) {
                const entityResult = manager.get('Entity').parse(reader, cursor, manager, config, cache)
                ans.data.push(entityResult.data)
                combineArgumentParserResult(ans, entityResult)
            } else {
                const last = ans.data[ans.data.length - 1]
                if (typeof last === 'string') {
                    ans.data[ans.data.length - 1] += reader.read()
                } else {
                    ans.data.push(reader.read())
                }
            }
        }

        return ans
    }

    getExamples(): string[] {
        return ['Hello world!', 'foo', '@e', 'Hello @p :)']
    }
}
