import { DataModel, INode, LOCALES as JsonLocales, PathElement, PathError, SchemaRegistry, Path, ValidationOption } from '@mcschema/core'
import { ArrayASTNode, ASTNode, DiagnosticSeverity, ObjectASTNode } from 'vscode-json-languageservice'
import { resolveLocalePlaceholders } from '../locales'
import { ParsingContext, ParsingError, TextRange, ValidateResult } from '../types'

// TODO: JSON

export class JsonSchemaHelper {
    static validate(ans: ValidateResult, node: ASTNode, schema: INode, options: JsonSchemaHelperOptions) {
        const { ctx } = options
        const model = new DataModel(schema, { historyMax: 1 })
        model.reset(JSON.parse(ctx.document.getText()))

        for (const err of model.errors) {
            ans.errors.push(this.convertSchemaError(err, node))
        }

        const path = new Path([], [], model)
        this.walkAstNode(node, path, schema, (node, schema) => {
            const selectedSchema = schema.navigate(path, -1)
            const validationOption = selectedSchema?.validationOption()
            if (validationOption) {
                this.doDetailedValidate(ans, node, validationOption, options)
            }
        })
    }

    /**
     * @param cb A callback that is called on every node.
     */
    private static walkAstNode(node: ASTNode, path: Path, schema: INode, cb: (node: ASTNode, schema: INode) => any) {
        cb(node, schema)
        if (node.type === 'object') {
            for (const { keyNode, valueNode } of node.properties) {
                if (valueNode) {
                    const childPath = path.push(keyNode.value)
                    this.walkAstNode(valueNode, childPath, schema, cb)
                }
            }
        } else if (node.type === 'array') {
            for (const [i, childNode] of node.items.entries()) {
                const childPath = path.push(i)
                this.walkAstNode(childNode, childPath, schema, cb)
            }
        }
    }

    private static doDetailedValidate(ans: ValidateResult, node: ASTNode, { validator, params }: ValidationOption, { ctx }: JsonSchemaHelperOptions) {
        // TODO: JSON
        switch (validator) {
            case 'block_state_map':
                break
            case 'command':
                break
            case 'entity':
                break
            case 'nbt':
                break
            case 'nbt_path':
                break
            case 'objective':
                break
            case 'resource':
                break
            case 'uuid':
                break
            case 'vector':
                break
            default:
                console.error('doDetailedValidate', new Error(`Unknown validator ${validator}`))
                break
        }
    }

    private static convertSchemaError({ path, params, error }: PathError, node: ASTNode) {
        const pathElements = path.getArray()
        const targetedNode = this.navigateNodes(node, pathElements)
        const range = this.getNodeRange(targetedNode)
        let message = resolveLocalePlaceholders(JsonLocales.getLocale(error), params)
        if (pathElements.length > 0) {
            message = `${pathElements.join('.')} - ${message}`
        }
        return new ParsingError(range, message, undefined, DiagnosticSeverity.Warning)
    }

    private static navigateNodes(node: ASTNode, path: PathElement[]): ASTNode {
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
            return this.navigateNodes(childNode, (path.shift(), path))
        } else {
            return node
        }
    }

    private static getNodeRange(node: ASTNode): TextRange {
        return { start: node.offset, end: node.offset + node.length }
    }
}

export interface JsonSchemaHelperOptions {
    ctx: ParsingContext,
    schemas: SchemaRegistry
}
