import { CompletionItemKind, DiagnosticSeverity, Position } from 'vscode-languageserver/node'
import { plugins } from '../..'
import { CommandParser } from '../../parsers/CommandParser'
import { CommandComponentData, MacroData, ParserSuggestion, ParsingContext, ParsingError } from '../../types'
import { StringReader } from '../../utils/StringReader'
import { locale } from '../../locales'

export class McfunctionPlugin implements plugins.Plugin {
    [plugins.PluginID] = 'spgoding:mcfunction'

    contributeLanguages(contributor: plugins.Contributor<plugins.LanguageDefinition>) {
        contributor.add('mcfunction', { extensions: ['.mcfunction'] })
    }

    contributeSyntaxComponentParsers(contributor: plugins.Contributor<plugins.SyntaxComponentParser>) {
        contributor.add('spgoding:mcfunction/macro', new MacroSyntaxComponentParser())
        contributor.add('spgoding:mcfunction/command', new CommandSyntaxComponentParser())
    }

    configureLanguages(factory: plugins.LanguageConfigBuilderFactory) {
        factory
            .configure('mcfunction')
            .syntaxComponent('spgoding:mcfunction/macro')
            .syntaxComponent('spgoding:mcfunction/command')
    }
}

export class CommandSyntaxComponentParser implements plugins.SyntaxComponentParser<CommandComponentData> {
    identity = 'spgoding:mcfunction/command'

    test(reader: StringReader, ctx: ParsingContext): [boolean, number] {
        return [reader.skipSpace().peek() !== '$', 0]
    }

    parse(reader: StringReader, ctx: ParsingContext): plugins.SyntaxComponent<CommandComponentData> {
        const commandReader = prepareLineReader(reader, ctx)
        const parser = new CommandParser()
        const { data } = parser.parse(commandReader, ctx)
        reader.cursor = commandReader.cursor
        return data
    }
}

export class MacroSyntaxComponentParser implements plugins.SyntaxComponentParser<MacroData> {
    identity = 'spgoding:mcfunction/macro'

    test(reader: StringReader, ctx: ParsingContext): [boolean, number] {
        return [reader.skipSpace().peek() === '$', 0]
    }

    parse(reader: StringReader, ctx: ParsingContext): plugins.SyntaxComponent<MacroData> {
        const macroReader = prepareLineReader(reader, ctx)
        const ans = plugins.SyntaxComponent.create<MacroData>(this.identity, MacroData.unfinished())
        ans.range.start = macroReader.cursor
        let hasVariables = false

        try {
            macroReader
                .expect('$')
                .skip()

            while (macroReader.canRead()) {
                const char = macroReader.read()

                if (char == '$') {
                    if (macroReader.peek() == '(') {
                        macroReader.cursor--
                        hasVariables = true // even if the variable fails parsing, consider it to be there
                        this.parseMacroVariable(ans, macroReader, ctx)
                    }
                }
            }

            ans.range.end = macroReader.cursor
        }
        catch (p) {
            ans.errors.push(p)
        }

        if (!hasVariables) {
            ans.errors.push(new ParsingError(
                { start: ans.range.start, end: ans.range.end },
                locale('no-macro-variables'),
                undefined, DiagnosticSeverity.Error,
            ))
        }

        ans.data.template = reader.string.substring(ans.range.start, ans.range.end)

        return ans
    }

    parseMacroVariable(ans: plugins.SyntaxComponent<MacroData>, reader: StringReader, ctx: ParsingContext): void {
        try {
            reader
                .expect('$')
                .skip()
                .expect('(')
                .skip()

            const start = reader.cursor
            let end = reader.cursor
            this.getMacroCompletions(ans, reader.cursor)

            while (reader.canRead() && reader.peek() != ')') {
                const char = reader.peek()

                if (char.match(/[a-zA-Z0-9_]/i)) {
                    reader.skip()
                    end = reader.cursor
                } else {
                    ans.errors.push(new ParsingError(
                        { start, end },
                        'Invalid macro variable name',
                        false
                    ))

                    break
                }
            }

            reader
                .expect(')')
                .skip()

            ans.data.placeholders.add(reader.string.substring(start, end))
        }
        catch (p) {
            ans.errors.push(p)
        }
    }

    getMacroCompletions(ans: plugins.SyntaxComponent<MacroData>, cursor: number) {
        for (const placeholder of ans.data.placeholders) {
            const completion: ParserSuggestion = {
                start: cursor,
                end: cursor,
                label: placeholder,
                kind: CompletionItemKind.Variable
            }

            ans.completions.push(completion)
        }
    }
}

function prepareLineReader(reader: StringReader, ctx: ParsingContext): StringReader {
    const start = reader.cursor
    const end = ctx.textDoc.offsetAt(Position.create(ctx.textDoc.positionAt(start).line, Infinity))
    const lineReader = new StringReader(reader.string, start, end)

    lineReader.skipSpace()

    while (true) {
        const lastChar = lineReader.string.charAt(lineReader.end - 1)
        if (StringReader.isLineSeparator(lastChar) && lineReader.end > start) {
            lineReader.end--
        } else {
            break
        }
    }

    return lineReader
}
