import { DataModel, INode, LOCALES as JsonLocales, Path, PathElement, PathError, RelativePath, SchemaRegistry, ValidationOption } from '@mcschema/core'
import { ArrayASTNode, ASTNode, CompletionItem, ObjectASTNode } from 'vscode-json-languageservice'
import { handleCompletionText, quoteString, remapCompletionItem } from '.'
import { resolveLocalePlaceholders } from '../locales'
import { LineParser, Parsers } from '../parsers'
import { combineCache, downgradeParsingError, getInnerIndex, IndexMapping, isInRange, LegacyValidateResult, ParsingContext, ParsingError, remapCachePosition, remapParsingErrors, remapTokens, TextRange, ValidateResult } from '../types'
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

    static suggest(ans: CompletionItem[], node: ASTNode, schema: INode, options: JsonSchemaHelperOptions) {
        const { ctx } = options
        const model = new DataModel(schema, { historyMax: 1 })
        const path = new Path([], [], model)

        const { node: selectedNode, path: selectedPath, type: selectedType } = this.selectNode(node, ctx.cursor, path)
        if (selectedNode) {
            let result: Partial<LegacyValidateResult> | undefined = undefined
            const out: { mapping: IndexMapping } = { mapping: {} }
            const selectedRange = { start: selectedNode.offset, end: selectedNode.offset + selectedNode.length }
            if (selectedType === 'value') {
                const selectedSchema = schema.navigate(selectedPath, -1)
                const validationOption = selectedSchema?.validationOption()
                if (validationOption) {
                    const rawReader = new StringReader(ctx.document.getText(), selectedRange.start, selectedRange.end)
                    const value = rawReader.readString(out)
                    const valueReader = new StringReader(value)
                    result = this.getDetailedValidateResult(
                        valueReader, { ...ctx, cursor: getInnerIndex(out.mapping, ctx.cursor) }, node, validationOption
                    )
                    // this.combineResult(ans, result, out.mapping)
                }
            } else {
                // TODO
            }
            if (result?.completions) {
                ans.push(...result.completions.map(v => remapCompletionItem(this.escapeCompletion(v), out.mapping)))
            }
        }
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
        const valueRange = this.getNodeRange(node)
        if (option.validator === 'block_state_map') {
            // TODO: JSON block_state_map validation
        } else {
            const out: { mapping: IndexMapping } = { mapping: {} }
            const rawReader = new StringReader(ctx.document.getText(), valueRange.start, valueRange.end)
            const value = rawReader.readString(out)
            const valueReader = new StringReader(value)
            const result = this.getDetailedValidateResult(valueReader, ctx, node, option)
            this.combineResult(ans, result, out.mapping)
        }
    }

    private static getDetailedValidateResult(reader: StringReader, ctx: ParsingContext, node: ASTNode, option: ValidationOption): Partial<LegacyValidateResult> {
        switch (option.validator) {
            case 'block_state_key': {
                const id = this.navigateRelativePath(node, option.params.id)?.value?.toString() ?? ''
                const keys = Object.keys(ctx.blockDefinition[id]?.properties ?? {})
                return new Parsers.Literal(...keys).parse(reader, ctx)
            }
            case 'command':
                return new LineParser(
                    option.params.leadingSlash, 'commands', option.params.allowPartial
                ).parse(reader, ctx).data
            case 'entity':
                return new Parsers.Entity(
                    option.params.amount, option.params.type, option.params.isScoreHolder
                ).parse(reader, ctx)
            case 'nbt':
                if (option.params.registry) {
                    const id = this.navigateRelativePath(node, option.params.registry.id)?.value?.toString() ?? null
                    return new Parsers.Nbt(
                        'Compound', option.params.registry.category, id, option.params.isPredicate
                    ).parse(reader, ctx)
                } else if (option.params.module) {
                    return new Parsers.Nbt(
                        'Compound', 'minecraft:block', undefined, option.params.isPredicate, null, option.params.module
                    ).parse(reader, ctx)
                }
                break
            case 'nbt_path':
                return new Parsers.NbtPath(
                    option.params?.category ?? 'minecraft:block', option.params?.category ? (option.params.id ?? null) : undefined
                ).parse(reader, ctx)
            case 'objective':
                return new Parsers.Objective().parse(reader, ctx)
            case 'resource':
                return new Parsers.Identity(
                    option.params.pool, option.params.allowTag, undefined, option.params.allowUnknown
                ).parse(reader, ctx)
            case 'team':
                return new Parsers.Team().parse(reader, ctx)
            case 'uuid':
                return new Parsers.Uuid().parse(reader, ctx)
            case 'vector':
                return new Parsers.Vector(
                    option.params.dimension, option.params.isInteger ? 'integer' : 'float', !option.params.disableLocal, !option.params.disableRelative, option.params.min, option.params.max
                ).parse(reader, ctx)
            default:
                /* istanbul ignore next */
                console.error('doDetailedValidate', new Error(`Unknown validator ${(option as any).validator}`))
                break
        }
        return {}
    }

    private static escapeCompletion(origin: CompletionItem) {
        return handleCompletionText(origin, str => quoteString(str, 'always double', true).slice(1, -1))
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
     * This function won't work if the path contains any `pop` after `push`, which should be fine.
     * @param path Won't be changed.
     */
    private static navigateRelativePath(node: ASTNode | undefined, path: RelativePath | undefined): ASTNode | undefined {
        if (!path) {
            return undefined
        }
        if (path.length === 0) {
            return node
        }
        let nextNode: ASTNode | undefined
        const ele = path[0]
        if (ele === 'pop') {
            nextNode = node?.parent
            if (nextNode?.type === 'property') {
                nextNode = nextNode.parent
            }
        } else {
            nextNode = node?.type === 'object' ? node.properties.find(prop => prop.keyNode.value === ele.push)?.valueNode : undefined
        }
        return this.navigateRelativePath(nextNode, path.slice(1))
    }

    private static selectNode(node: ASTNode, cursor: number, path: Path, type: 'key' | 'value' = 'value'): SelectNodeResult {
        let ans: SelectNodeResult = { node: undefined, path, type }
        if (!isInRange(cursor, this.getNodeRange(node))) {
            return ans
        }
        const set = (result: SelectNodeResult) => {
            if (result.node) {
                ans = result
            }
        }
        switch (node.type) {
            case 'array':
                for (const [i, item] of node.items.entries()) {
                    set(this.selectNode(item, cursor, path.push(i), 'value'))
                }
                break
            case 'object':
                for (const property of node.properties) {
                    set(this.selectNode(property, cursor, path, 'value'))
                }
                break
            case 'property':
                set(this.selectNode(node.keyNode, cursor, path.push(node.keyNode.value), 'key'))
                if (node.valueNode) {
                    set(this.selectNode(node.valueNode, cursor, path.push(node.keyNode.value), 'value'))
                }
                break
            default:
                break
        }
        if (!ans.node) {
            ans = { node, path, type }
        }
        return ans
    }

    private static getNodeRange(node: ASTNode): TextRange {
        return { start: node.offset, end: node.offset + node.length }
    }
}

type SelectNodeResult = {
    node: ASTNode | undefined,
    path: Path,
    type: 'key' | 'value'
}

export interface JsonSchemaHelperOptions {
    ctx: ParsingContext,
    schemas: SchemaRegistry
}
