import { TextDocument } from 'vscode-json-languageservice'
import { NodeRange } from '../nodes/ArgumentNode'
import { TextComponentNode } from '../nodes/TextComponent'
import { parseJsonNode } from '../services/common'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { JsonSchemaHelper } from '../utils/JsonSchemaHelper'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class StyleArgumentParser extends ArgumentParser<TextComponentNode> {
    static identity = 'Style'
    readonly identity = 'style'

    /* istanbul ignore next */
    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<TextComponentNode> {
        const start = reader.cursor
        const raw = reader.readRemaining()
        const end = reader.cursor
        const ans = ArgumentParserResult.create(new TextComponentNode(raw))

        const text = ' '.repeat(start) + raw
        const textDoc = TextDocument.create('dhp:///text_style.json', 'json', 0, text)
        const schema = ctx.jsonSchemas.get('text_style')
        const jsonDocument = parseJsonNode({
            config: ctx.config,
            textDoc,
            commandTree: ctx.commandTree,
            jsonSchemas: ctx.jsonSchemas,
            schema,
            schemaType: 'text_style',
            service: ctx.service,
            uri: ctx.service.parseUri(ctx.textDoc.uri),
            vanillaData: {
                BlockDefinition: ctx.blockDefinition,
                NamespaceSummary: ctx.namespaceSummary,
                Nbtdoc: ctx.nbtdoc,
                Registry: ctx.registry
            }
        })

        //#region Data.
        ans.data.document = textDoc
        // ans.data.jsonDocument = jsonDocument
        ans.data[NodeRange] = { start, end }
        //#endregion

        //#region Errors.
        ctx.service.jsonService.doValidation(textDoc, jsonDocument.json).then(diagnostics => {
            for (const diag of diagnostics) {
                ans.errors.push(new ParsingError(
                    { start: diag.range.start.character, end: diag.range.end.character },
                    diag.message.endsWith('.') ? diag.message.slice(0, -1) : diag.message,
                    undefined,
                    diag.severity
                ))
            }
        })
        combineArgumentParserResult(ans, jsonDocument)
        //#endregion

        //#region Completions.
        JsonSchemaHelper.suggest(ans.completions, jsonDocument.json.root, schema, ctx)
        //#endregion

        return ans
    }

    /* istanbul ignore next */
    getExamples(): string[] {
        return ['{"color":"green"}', '{"bold": true}']
    }
}
