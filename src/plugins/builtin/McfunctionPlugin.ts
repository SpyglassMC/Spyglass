import { Position } from 'vscode-languageserver'
import { plugins } from '../..'
import { CommandParser } from '../../parsers/CommandParser'
import { CommandComponent, CommandComponentData, ParsingContext } from '../../types'
import { StringReader } from '../../utils/StringReader'

export class McfunctionPlugin implements plugins.Plugin {
    [plugins.PluginID] = 'spgoding:mcfunction'

    contributeLanguages(contributor: plugins.Contributor<plugins.LanguageDefinition>) {
        contributor.add('mcfunction', { extensions: ['.mcfunction'] })
    }

    contributeSyntaxComponentParsers(contributor: plugins.Contributor<plugins.SyntaxComponentParser>) {
        contributor.add('spgoding:mcfunction/command', new CommandSyntaxComponentParser())
    }

    configureLanguages(factory: plugins.LanguageConfigBuilderFactory) {
        factory
            .configure('mcfunction')
            .syntaxComponent('spgoding:mcfunction/command')
    }
}

class CommandSyntaxComponentParser implements plugins.SyntaxComponentParser<CommandComponentData> {
    identity = 'spgoding:mcfunction/command'

    test(): [boolean, number] {
        return [true, 0]
    }

    parse(reader: StringReader, ctx: ParsingContext): plugins.SyntaxComponent<CommandComponentData> {
        const start = reader.cursor
        const end = ctx.textDoc.offsetAt(Position.create(ctx.textDoc.positionAt(start).line, Infinity))
        const commandReader = new StringReader(reader.string, start, end)
        commandReader.skipSpace()
        while (true) {
            const lastChar = commandReader.string.charAt(commandReader.end - 1)
            if (StringReader.isLineSeparator(lastChar) && commandReader.end > start) {
                commandReader.end--
            } else {
                break
            }
        }
        
        const parser = new CommandParser()
        const { data } = parser.parse(commandReader, ctx)
        reader.cursor = commandReader.cursor
        return data
    }
}
