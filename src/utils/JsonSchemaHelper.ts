import { DataModel, INode, LOCALES as JsonLocales, Path, PathElement, PathError, RelativePath, SchemaRegistry, ValidationOption } from '@mcschema/core'
import { ArrayASTNode, ASTNode, CompletionItem, ObjectASTNode } from 'vscode-json-languageservice'
import { handleCompletionText, quoteString } from '.'
import { resolveLocalePlaceholders } from '../locales'
import { LineParser, Parsers } from '../parsers'
import { combineCache, downgradeParsingError, IndexMapping, LegacyValidateResult, ParsingContext, ParsingError, remapCachePosition, remapParsingErrors, remapTokens, TextRange, ValidateResult } from '../types'
import { StringReader } from './StringReader'

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
        this.walkAstNode(
            node, path, schema,
            (node, path, schema) => {
                const selectedSchema = schema.navigate(path, -1)
                const validationOption = selectedSchema?.validationOption()
                if (validationOption) {
                    this.doDetailedValidate(ans, node, validationOption, options)
                }
            }
        )
    }

    /**
     * @param cb A callback that is called on every node.
     */
    private static walkAstNode(node: ASTNode, path: Path, schema: INode, cb: (node: ASTNode, path: Path, schema: INode) => any) {
        cb(node, path, schema)
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

    private static doDetailedValidate(ans: ValidateResult, node: ASTNode, option: ValidationOption, { ctx }: JsonSchemaHelperOptions) {
        const valueRange = { start: node.offset, end: node.offset + node.length }
        if (option.validator === 'block_state_map') {
            // TODO: JSON block_state_map validation
        } else {
            const out: { mapping: IndexMapping } = { mapping: {} }
            const rawReader = new StringReader(ctx.document.getText(), valueRange.start, valueRange.end)
            const value = rawReader.readString(out)
            const valueReader = new StringReader(value)
            let result: Partial<LegacyValidateResult> | undefined = undefined
            switch (option.validator) {
                case 'command':
                    result = new LineParser(
                        option.params.leadingSlash, 'commands', option.params.allowPartial
                    ).parse(valueReader, ctx).data
                    break
                case 'entity':
                    result = new Parsers.Entity(
                        option.params.amount, option.params.type, option.params.isScoreHolder
                    ).parse(valueReader, ctx)
                    break
                case 'nbt':
                    if (option.params.registry) {
                        const id = this.navigateRelativePath(node, option.params.registry.id)?.value?.toString() ?? null
                        result = new Parsers.Nbt(
                            'Compound', option.params.registry.category, id, option.params.isPredicate
                        ).parse(valueReader, ctx)
                    } else if (option.params.module) {
                        result = new Parsers.Nbt(
                            'Compound', 'minecraft:block', undefined, option.params.isPredicate, null, option.params.module
                        ).parse(valueReader, ctx)
                    }
                    break
                case 'nbt_path':
                    break
                case 'objective':
                    result = new Parsers.Objective().parse(valueReader, ctx)
                    break
                case 'resource':
                    result = new Parsers.Identity(
                        option.params.pool, option.params.allowTag, undefined, option.params.allowUnknown
                    ).parse(valueReader, ctx)
                    break
                case 'uuid':
                    result = new Parsers.Uuid().parse(valueReader, ctx)
                    break
                case 'vector':
                    result = new Parsers.Vector(
                        option.params.dimension, option.params.isInteger ? 'integer' : 'float', !option.params.disableLocal, !option.params.disableRelative, option.params.min, option.params.max
                    ).parse(valueReader, ctx)
                    break
                default:
                    /* istanbul ignore next */
                    console.error('doDetailedValidate', new Error(`Unknown validator ${(option as any).validator}`))
                    break
            }
            this.combineResult(ans, result, out.mapping)
        }
    }

    private static escapeCompletion(origin: CompletionItem) {
        return handleCompletionText(origin, str => quoteString(str, 'always double', true))
    }

    private static combineResult(ans: ValidateResult, result: Partial<LegacyValidateResult> | undefined, mapping: IndexMapping) {
        if (result) {
            if (result.cache) {
                remapCachePosition(result.cache, mapping)
                combineCache(ans.cache, result.cache)
            }
            if (result.errors) {
                const downgradedErrors = downgradeParsingError(result.errors)
                remapParsingErrors(downgradedErrors, mapping)
                ans.errors.push(...downgradedErrors)
            }
            if (result.tokens) {
                ans.tokens.push(...remapTokens(result.tokens, mapping))
            }
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
        return new ParsingError(range, message)
    }

    /**
     * @param path Will be changed with the remaining elements after navigation.
     */
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

    /**
     * This function won't work if the path contains `pop` after `push`, which should be fine.
     * @param path Won't be changed.
     */
    private static navigateRelativePath(node: ASTNode | undefined, path: RelativePath): ASTNode | undefined {
        if (path.length === 0) {
            return node
        }
        let nextNode: ASTNode | undefined
        const ele = path[0]
        if (ele === 'pop') {
            nextNode = node?.parent
        } else {
            nextNode = node?.type === 'object' ? node.properties.find(prop => prop.keyNode.value === ele.push)?.valueNode : undefined
        }
        return this.navigateRelativePath(nextNode, path.slice(1))
    }

    private static getNodeRange(node: ASTNode): TextRange {
        return { start: node.offset, end: node.offset + node.length }
    }
}

export interface JsonSchemaHelperOptions {
    ctx: ParsingContext,
    schemas: SchemaRegistry
}
