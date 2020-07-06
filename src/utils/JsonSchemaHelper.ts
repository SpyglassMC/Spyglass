import { ParsingContext, ValidateResult } from '../types'
import { ASTNode } from 'vscode-json-languageservice'
import { INode } from '@mcschema/core'

export class JsonSchemaHelper {
    static validate(ans: ValidateResult, node: ASTNode, schema: INode, ctx: JsonSchemaHelperContext) {

    }
}

export interface JsonSchemaHelperContext {
    ctx: ParsingContext

}
