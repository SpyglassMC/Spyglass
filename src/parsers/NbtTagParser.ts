import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import { CompletionItemKind } from 'vscode-languageserver'
import { arrayToMessage } from '../utils/utils'
import NbtTag, { NbtTagName, NbtCompoundTag } from '../types/NbtTag'
import NbtStringReader from '../utils/NbtStringReader'

export default class NbtTagArgumentParser extends ArgumentParser<NbtTag> {
    private readonly type: NbtTagName[]
    identity: string

    constructor(type: NbtTagName | NbtTagName[]) {
        super()
        if (type instanceof Array) {
            this.type = type
        } else {
            this.type = [type]
        }
    } 

    parse(reader: StringReader): ArgumentParserResult<NbtTag> {
        const nbtReader = new NbtStringReader(reader)

        throw ''
    }

    parseCompound(reader: NbtStringReader): ArgumentParserResult<NbtCompoundTag> {
        throw ''
    }

    parseSimple(reader: NbtStringReader): ArgumentParserResult<NbtTag> {
        throw ''
    }

    getExamples(): string[] {
        throw ''
    }
}
