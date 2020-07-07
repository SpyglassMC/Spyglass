import { DataModel, INode, LOCALES as JsonLocales, PathElement, SchemaRegistry } from '@mcschema/core'
import { ArrayASTNode, ASTNode, DiagnosticSeverity, ObjectASTNode } from 'vscode-json-languageservice'
import { locale } from '../locales'
import { ParsingContext, ParsingError, TextRange, ValidateResult } from '../types'

// TODO: JSON

export class JsonSchemaHelper {
    static validate(ans: ValidateResult, node: ASTNode, schema: INode, { ctx, schemas }: JsonSchemaHelperOptions) {
        const model = new DataModel(schema, { historyMax: 1 })
        model.reset(JSON.parse(ctx.document.getText()))

        for (const { path, error } of model.errors) {
            const pathElements = path.getArray()
            const targetedNode = this.navigate(node, pathElements)
            const range = this.getRange(targetedNode)
            let message = JsonLocales.getLocale(error)
            if (pathElements.length > 0) {
                message = locale('json-schema.error-for-path',
                    locale('punc.quote', pathElements.join('.')),
                    message
                )
            }
            ans.errors.push(
                new ParsingError(range, message, undefined, DiagnosticSeverity.Warning)
            )
        }
    }

    private static navigate(node: ASTNode, path: PathElement[]): ASTNode {
        if (path.length === 0) {
            return node
        }
        let childNode: ASTNode | undefined
        const ele = path[0]
        if (typeof ele === 'number') {
            childNode = (node as ArrayASTNode).items[ele]
        } else {
            childNode = (node as ObjectASTNode).properties.find(prop => prop.keyNode.value === ele)?.valueNode
        }
        if (childNode) {
            return this.navigate(childNode, (path.shift(), path))
        } else {
            return node
        }
    }

    private static getRange(node: ASTNode): TextRange {
        return { start: node.offset, end: node.offset + node.length }
    }
}

export interface JsonSchemaHelperOptions {
    ctx: ParsingContext,
    schemas: SchemaRegistry
}
