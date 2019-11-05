import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import Manager from '../types/Manager'
import { VanillaConfig } from '../types/Config'
import { GlobalCache } from '../types/Cache'
import Message from '../types/Message'

export default class MessageArgumentParser extends ArgumentParser<Message> {
    readonly identity = 'message'

    constructor() {
        super()
    }

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>, config = VanillaConfig, cache: GlobalCache = {}): ArgumentParserResult<Message> {
        const ans: ArgumentParserResult<Message> = {
            data: new Message([]),
            errors: [],
            cache: {},
            completions: []
        }
        const value = ans.data.value

        while (reader.canRead()) {
            if (reader.peek() === '@' &&
                (reader.peek(1) === 'p' || reader.peek(1) === 'a' || reader.peek(1) === 'r' || reader.peek(1) === 's' || reader.peek(1) === 'e')
            ) {
                const entityResult = manager.get('Entity').parse(reader, cursor, manager, config, cache)
                value.push(entityResult.data)
                combineArgumentParserResult(ans, entityResult)
            } else {
                if (typeof value[value.length - 1] === 'string') {
                    value[value.length - 1] += reader.read()
                } else {
                    value.push(reader.read())
                }
            }
        }

        return ans
    }

    getExamples(): string[] {
        return ['Hello world!', 'foo', '@e', 'Hello @p :)']
    }
}
