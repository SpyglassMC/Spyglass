import { Position } from 'vscode-languageserver'
import { plugins } from '../..'
import { NodeRange } from '../../nodes'
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
    test(): [boolean, number] {
        return [true, 0]
    }
    parse(reader: StringReader, ctx: ParsingContext): plugins.SyntaxComponent<CommandComponentData> {
        const start = reader.cursor
        const end = ctx.textDoc.offsetAt(Position.create(ctx.textDoc.positionAt(start).line, Infinity))
        const commandReader = new StringReader(reader.string, start, end)
        commandReader.skipWhiteSpace()
        while (true) {
            const lastChar = commandReader.string.charAt(commandReader.end - 1)
            if (StringReader.isWhiteSpace(lastChar) && commandReader.end > start) {
                // Remove the whitespaces at the end of this line
                commandReader.end--
            } else {
                break
            }
        }
        if (commandReader.string.charAt(commandReader.end - 1) === ' ') {
            commandReader.end++
        }
        if (commandReader.remainingString.length === 0) {
            // This empty node will be selected in methods like `onCompletion`.
            if (start !== commandReader.end) {
                return CommandComponent.create([], { [NodeRange]: { start, end: commandReader.end } })
            }
        }
        const parser = new CommandParser()
        const { data } = parser.parse(commandReader, ctx)
        reader.cursor = commandReader.cursor
        return data
    }
}
