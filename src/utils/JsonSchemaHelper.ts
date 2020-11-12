import { DataModel, INode, ModelPath, Path, PathElement, PathError, RelativePath, ValidationOption } from '@mcschema/core'
import deepEqual from 'fast-deep-equal'
import { ArrayASTNode, ASTNode, Hover, InsertTextFormat, ObjectASTNode, StringASTNode } from 'vscode-json-languageservice'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { arrayToCompletions, handleCompletionText, quoteString, remapParserSuggestion } from '.'
import { locale, segmentedLocale } from '../locales'
import { IdentityNode } from '../nodes'
import { CommandParser } from '../parsers/CommandParser'
import { combineCache, downgradeParsingError, getInnerIndex, IndexMapping, isInRange, LegacyValidateResult, ParserSuggestion, ParsingContext, ParsingError, remapCachePosition, remapParsingErrors, remapTokens, TextRange, ValidateResult } from '../types'
import { StringReader } from './StringReader'

export class JsonSchemaHelper {
    private static readonly Replacers = {
        EmptyObject: 'a6CJ_fNaoTKc1J7SavcrSMGmQjW6HEuk',
        EmptyList: '09v6na643Rr0jeIcBFRGwXJFUvvB_773',
        StringStart: 'WcfESEXkwL5a0nDMC7ZMib6RftqJyvQP',
        StringEnd: 'NR9lafzlCwHbjOIrzXcpZFgNQVpn7kpY',
        LiteralStart: 'gJK7ZIGIpFJlAal2UduKc93rHAOb5K3z',
        LiteralEnd: '1xs2m6JwQaNtXzexThOAwmpTFCIRftZi'
    }

    static validate(ans: ValidateResult, node: ASTNode | undefined, schema: INode, ctx: ParsingContext) {
        const { model, path } = this.setUp(node, schema)

        for (const err of model.errors) {
            ans.errors.push(this.convertSchemaError(err, node))
        }

        if (!node) {
            return
        }

        this.walkAstNode(
            node, path, schema,
            (node, path, schema) => {
                const selectedSchema = schema.navigate(path, -1)
                const validationOption = selectedSchema?.validationOption(path)
                if (validationOption) {
                    this.validateFromValidator(ans, node, validationOption, ctx)
                }
            }
        )
    }

    static suggest(ans: ParserSuggestion[], node: ASTNode | undefined, schema: INode, ctx: ParsingContext) {
        if (!node) {
            return
        }
        try {
            const { path, restoredValue } = this.setUp(node, schema)
            const { node: selectedNode, schema: selectedSchema, path: selectedPath, type: selectedType } = this.getSelectedNode(node, schema, restoredValue, ctx.cursor, path)
            if (!selectedNode) {
                return
            }
            const selectedRange = this.getNodeRange(selectedNode)
            const validationOption = selectedSchema?.validationOption(path)
            if (selectedType === 'value') {
                if (validationOption && selectedNode.type === 'string') {
                    // Detailed suggestions for the selected string value.
                    ans.push(...this.suggestFromStringValidator(selectedRange, selectedNode, ctx, validationOption))
                } else {
                    // Regular suggestions for selected value.
                    if (selectedNode.type === 'object') {
                        // Regular key suggestions for selected object.
                        if (selectedRange.start < ctx.cursor && ctx.cursor < selectedRange.end) {
                            // The cursor isn't out of the curly braces.
                            ans.push(...this.suggestFromSchema(selectedPath, selectedNode, undefined, schema, ctx))
                        }
                    } else if (selectedNode.type === 'property') {
                        // Regular value suggestions for selected property
                        ans.push(...this.suggestFromSchema(selectedPath, selectedNode, undefined, schema, ctx, true))
                    } else {
                        // Regular value suggestions for selected value
                        ans.push(...this.suggestFromSchema(selectedPath, selectedNode, selectedNode, schema, ctx))
                    }
                }
            } else {
                // Regular key suggestions for selected key.
                const objectPath = this.pathPopAll(selectedPath)
                const keyNode = selectedNode as StringASTNode
                const objectNode = selectedNode.parent!.parent as ObjectASTNode
                ans.push(...this.suggestFromSchema(objectPath, objectNode, keyNode, schema, ctx))
            }
        } catch (e) {
            console.error('[JsonSchemaHelper#suggest]', e)
        }
    }

    static onHover(node: ASTNode | undefined, schema: INode, ctx: ParsingContext, offset: number): Hover | null {
        if (!node) {
            return null
        }
        try {
            const { path, restoredValue } = this.setUp(node, schema)
            const { node: selectedNode, path: selectedPath, type: selectedType } = this.getSelectedNode(node, schema, restoredValue, offset, path)
            if (selectedNode && selectedType === 'key') {
                const selectedRange = this.getNodeRange(selectedNode)
                // Regular key suggestions for selected key.
                const title = segmentedLocale(selectedPath.getContext()) ?? selectedPath.getContext().pop() ?? ''
                const help = segmentedLocale(selectedPath.contextPush('help').getContext(), [], 6, 2)
                return {
                    range: { start: ctx.textDoc.positionAt(selectedRange.start), end: ctx.textDoc.positionAt(selectedRange.end) },
                    contents: {
                        kind: 'markdown',
                        value: help ? `${title}\n* * * * * *\n${help}` : title
                    }
                }
            }
        } catch (e) {
            console.error('[JsonSchemaHelper#onHover]', e)
        }
        return null
    }

    private static setUp(node: ASTNode | undefined, schema: INode) {
        const model = new DataModel(schema, { historyMax: 1 })
        const restoredValue = this.restoreValueFromNode(node)
        model.reset(restoredValue)
        const path = new ModelPath(model)
        return { model, path, restoredValue }
    }

    private static suggestFromSchema(valuePath: ModelPath, valueNode: ASTNode, replacingNode: ASTNode | undefined, schema: INode, ctx: ParsingContext, atEmptyValue = false): ParserSuggestion[] {
        const replacingRange = replacingNode ? this.getNodeRange(replacingNode) : { start: ctx.cursor, end: ctx.cursor }
        const valueSchema = schema.navigate(valuePath, -1)
        const value = this.restoreValueFromNode(valueNode)

        if (valueNode.type === 'object' && typeof replacingNode?.value === 'string') {
            // Delete the current selected key from `value`, so that the selected key can show in the suggestions.
            delete value[replacingNode.value]
        }
        if (atEmptyValue && valueSchema) {
            // Currently at an empty value position; suggest the default value of this schema node.
            const defaultValue = valueSchema.default()
            return [{ ...replacingRange, label: JSON.stringify(defaultValue), insertText: this.getDefaultValueSnippet(defaultValue), insertTextFormat: InsertTextFormat.Snippet }]
        }
        const validationOption = valueSchema?.validationOption(valuePath)
        if (validationOption) {
            // Do suggestions for keys with custom `validationOption`.
            if (replacingNode) {
                // Currently has a selected key.
                return this.suggestFromStringValidator(replacingRange, replacingNode, ctx, validationOption)
            } else {
                // No key is selected; suggest the empty string instead.
                return [{ ...replacingRange, label: '""', insertText: '"$1"', insertTextFormat: InsertTextFormat.Snippet }]
            }
        }
        // Do suggestions provided by the schema node's `suggest` method.
        const suggestions = valueSchema?.suggest(valuePath, value) ?? []

        /* DEBUG */ console.log('valueSchema?.type', require('util').inspect(valueSchema?.type(valuePath), true, null))
        

        return arrayToCompletions(
            suggestions, replacingRange.start, replacingRange.end,
            valueNode.type === 'object' ? c => {
                // Operations to object keys.
                const key = c.label.slice(1, -1)
                const filterText = c.label

                const childValuePath = valuePath.push(key)
                const childValueSchema = schema.navigate(childValuePath, -1)
                const preselect = !childValueSchema?.optional()
                const defaultValueSnippet = this.getDefaultValueSnippet(childValueSchema?.default())
                const detail = segmentedLocale(childValuePath.getContext()) ?? childValuePath.getContext().pop() ?? ''
                const documentation = segmentedLocale(childValuePath.contextPush('help').getContext(), [], 6, 2)
                const insertText = `${c.label}: ${defaultValueSnippet}`
                return { ...c, preselect, detail, documentation, label: key, filterText, insertText, insertTextFormat: InsertTextFormat.Snippet }
            } : c => {
                // Operations to other value suggestions.
                if (c.label.startsWith('"') && c.label.endsWith('"')) {
                    return { ...c, label: c.label.slice(1, -1), filterText: c.label, insertText: c.label }
                }
                return c
            }
        )
    }

    private static suggestFromStringValidator(rangeOfString: TextRange, stringNode: ASTNode, ctx: ParsingContext, validationOption: ValidationOption) {
        const { result, out } = this.legacyValidateFromStringValidator(rangeOfString, stringNode, ctx, validationOption)
        return result?.completions
            ?.map(this.escapeCompletion)
            ?.map(v => remapParserSuggestion(v, out.mapping)) ?? []
    }

    private static getDefaultValueSnippet(defaultValue: any) {
        const defaultValueJson = JSON.stringify(defaultValue, this.jsonSnippetReplacer, 4) ?? ''
        return this.resolveJsonSnippetMagicStrings(defaultValueJson)
    }

    /**
     * Replaces some values that require snippet insert positions with some magic strings.
     */
    private static jsonSnippetReplacer(this: any, _key: string, value: any): any {
        if (deepEqual(value, {})) {
            return JsonSchemaHelper.Replacers.EmptyObject
        } else if (deepEqual(value, [])) {
            return JsonSchemaHelper.Replacers.EmptyList
        } else if (typeof value === 'string') {
            return `${JsonSchemaHelper.Replacers.StringStart} ${value} ${JsonSchemaHelper.Replacers.StringEnd}`
        } else if (typeof value === 'boolean' || typeof value === 'number' || value === null) {
            return `${JsonSchemaHelper.Replacers.LiteralStart} ${value} ${JsonSchemaHelper.Replacers.LiteralEnd}`
        } else {
            return value
        }
    }

    /**
     * Resolve the magic strings provided from `jsonSnippetReplacer` function with the actual TextMate syntax.
     */
    private static resolveJsonSnippetMagicStrings(value: string) {
        let insertIndex = 1
        const replace = (value: string, searchValue: string | RegExp, replaceValue: (i: number) => string) => {
            if (value.match(searchValue)) {
                return value.replace(searchValue, replaceValue(insertIndex++))
            }
            return value
        }
        const replaceOneTurn = (value: string) => replace(replace(replace(replace(value,
            `"${this.Replacers.EmptyObject}"`, i => `{$${i}}`),
            `"${this.Replacers.EmptyList}"`, i => `[$${i}]`),
            new RegExp(`"${this.Replacers.StringStart} (.*?) ${this.Replacers.StringEnd}"`), i => `"$\${${i}:$1}"`),
            new RegExp(`"${this.Replacers.LiteralStart} (.*?) ${this.Replacers.LiteralEnd}"`), i => `$\${${i}:$1}`
        )
        while (true) {
            const newValue = replaceOneTurn(value)
            if (newValue === value) {
                return newValue
            } else {
                value = newValue
            }
        }
    }

    /**
     * @param cb A callback that is called on every node.
     */
    private static walkAstNode(node: ASTNode, path: ModelPath, schema: INode, cb: (node: ASTNode, path: ModelPath, schema: INode) => any) {
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

    private static validateFromValidator(ans: ValidateResult, node: ASTNode, option: ValidationOption, ctx: ParsingContext) {
        const valueRange = this.getNodeRange(node)
        if (option.validator === 'block_state_map') {
            // TODO: JSON block_state_map validation
        } else if (node.type === 'string') {
            // Validate the selected string node.
            const { result, out } = this.legacyValidateFromStringValidator(valueRange, node, ctx, option)
            this.combineResult(ans, result, out.mapping)
        } else if (node.type === 'object') {
            // Validate all the keys of the selected object node.
            for (const { keyNode } of node.properties) {
                const { result, out } = this.legacyValidateFromStringValidator(this.getNodeRange(keyNode), keyNode, ctx, option)
                this.combineResult(ans, result, out.mapping)
            }
        }
    }

    private static legacyValidateFromStringValidator(rangeOfString: TextRange, stringNode: ASTNode, ctx: ParsingContext, validationOption: ValidationOption) {
        const out: { mapping: IndexMapping } = { mapping: {} }
        const rawReader = new StringReader(ctx.textDoc.getText(), rangeOfString.start, rangeOfString.end)
        try {
            const value = rawReader.readString(out, true)
            const valueReader = new StringReader(value)
            const subCtx = {
                ...ctx,
                textDoc: TextDocument.create('dhp:///json_schema_helper.txt', 'plaintext', 0, value),
                cursor: getInnerIndex(out.mapping, ctx.cursor)
            }
            return {
                result: this.executeStringValidator(valueReader, subCtx, stringNode, validationOption),
                out
            }
        } catch (e) {
            const ans = LegacyValidateResult.create()
            ans.errors.push(e)
            return { result: ans, out }
        }
    }

    private static executeStringValidator(reader: StringReader, ctx: ParsingContext, stringNode: ASTNode, option: ValidationOption): LegacyValidateResult {
        let ans = LegacyValidateResult.create()
        switch (option.validator) {
            case 'block_state_key': {
                const id = IdentityNode.fromString(this.navigateRelativePath(stringNode, option.params.id)?.value?.toString() ?? '').toString()
                const keys = Object.keys(ctx.blockDefinition[id]?.properties ?? {})
                ans = new ctx.parsers.Literal(...keys).parse(reader, ctx)
                break
            }
            case 'block_state_map':
                // TODO
                break
            case 'command':
                ans = new CommandParser(
                    option.params.leadingSlash, 'commands', option.params.allowPartial
                ).parse(reader, ctx).data
                break
            case 'entity':
                ans = new ctx.parsers.Entity(
                    option.params.amount, option.params.type, option.params.isScoreHolder
                ).parse(reader, ctx)
                break
            case 'nbt':
                if (option.params.registry) {
                    const id = this.navigateRelativePath(stringNode, option.params.registry.id)?.value?.toString() ?? null
                    ans = new ctx.parsers.Nbt(
                        'Compound', option.params.registry.category, id, option.params.isPredicate
                    ).parse(reader, ctx)
                } else if (option.params.module) {
                    ans = new ctx.parsers.Nbt(
                        'Compound', 'minecraft:block', undefined, option.params.isPredicate, null, option.params.module
                    ).parse(reader, ctx)
                }
                break
            case 'nbt_path': {
                let category = option.params?.category
                if (category && typeof category !== 'string') {
                    switch (category.getter) {
                        case 'copy_source':
                            const copySource = this.navigateRelativePath(stringNode, category.path)?.value?.toString()
                            if (copySource === 'block_entity') {
                                category = 'minecraft:block'
                            } else {
                                category = 'minecraft:entity'
                            }
                            break
                        default:
                            category = undefined
                            break
                    }
                }
                ans = new ctx.parsers.NbtPath(
                    category ?? 'minecraft:block', category ? (option.params!.id ?? null) : undefined
                ).parse(reader, ctx)
                break
            }
            case 'objective':
                ans = new ctx.parsers.Objective().parse(reader, ctx)
                break
            case 'resource':
                ans = new ctx.parsers.Identity(
                    option.params.pool, option.params.allowTag, undefined, option.params.allowUnknown, option.params.isDefinition
                ).parse(reader, ctx)
                break
            case 'team':
                ans = new ctx.parsers.Team().parse(reader, ctx)
                break
            case 'uuid':
                ans = new ctx.parsers.Uuid().parse(reader, ctx)
                break
            case 'vector':
                ans = new ctx.parsers.Vector(
                    option.params.dimension, option.params.isInteger ? 'integer' : 'float', !option.params.disableLocal, !option.params.disableRelative, option.params.min, option.params.max
                ).parse(reader, ctx)
                break
            default:
                /* istanbul ignore next */
                console.error('[doDetailedStringLegacyValidate]', new Error(`Unknown validator ${(option as any).validator}`))
                break
        }
        ans.completions = ans.completions.map(this.escapeCompletion)
        return ans
    }

    private static escapeCompletion(origin: ParserSuggestion) {
        return handleCompletionText(origin, str => quoteString(str, 'always double', true).slice(1, -1))
    }

    private static combineResult(ans: ValidateResult, result: LegacyValidateResult | undefined, mapping: IndexMapping) {
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
                ans.tokens.push(...remapTokens(result.tokens, mapping, false))
            }
        }
    }

    private static convertSchemaError({ path, params, error }: PathError, node: ASTNode | undefined) {
        const pathElements = path.getArray()
        const range = node ? this.getNodeRange(this.navigateNodes(node, pathElements)) : { start: 0, end: 1 }
        let message = locale(error, params) ?? (
            console.error('[convertSchemaError]', new Error(`Unknown JSON schema error “${error}”`)),
            ''
        )
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
        if (!path || !node) {
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

    private static getSelectedNode(node: ASTNode, schema: INode, value: any, cursor: number, path: ModelPath, type: 'key' | 'value' = 'value'): SelectNodeResult {
        let ans: SelectNodeResult = { node: undefined, schema: undefined, path, type }
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
                for (const [i, childNode] of node.items.entries()) {
                    const childValue = value?.[i]
                    const childPath = schema.pathPush(path, i)
                    const childSchema = schema.navigate(childPath, path.getArray().length - 1)!
                    set(this.getSelectedNode(childNode, childSchema, childValue, cursor, childPath, 'value'))
                    if (ans.node) {
                        break
                    }
                }
                break
            case 'object':
                for (const property of node.properties) {
                    set(this.getSelectedNode(property, schema, value, cursor, path, 'value'))
                    if (ans.node) {
                        break
                    }
                }
                break
            case 'property':
                const key = node.keyNode.value
                const childValue = value?.[key]
                const childPath = schema.pathPush(path, key)

                const childSchema = schema.navigate(childPath, path.getArray().length - 1)!
                set(this.getSelectedNode(node.keyNode, childSchema, childValue, cursor, childPath, 'key'))
                if (!ans.node) {
                    // Key isn't selected.
                    if (node.valueNode) {
                        set(this.getSelectedNode(node.valueNode, childSchema, childValue, cursor, childPath, 'value'))
                    } else {
                        set({ node, path: childPath, schema: childSchema, type: 'value' })
                    }
                }
                break
            default:
                break
        }
        if (!ans.node) {
            ans = { node, schema, path, type }
        }
        return ans
    }

    private static restoreValueFromNode(node: ASTNode | undefined): any {
        switch (node?.type) {
            case 'object': {
                const ans: any = {}
                for (const { keyNode, valueNode } of node.properties) {
                    if (valueNode) {
                        ans[JsonSchemaHelper.restoreValueFromNode(keyNode)] = JsonSchemaHelper.restoreValueFromNode(valueNode)
                    }
                }
                return ans
            }
            case 'array':
                return node.items.map(JsonSchemaHelper.restoreValueFromNode)
            case 'boolean':
            case 'null':
            case 'number':
            case 'string':
            default:
                return node?.value
        }
    }

    private static getNodeRange(node: ASTNode): TextRange {
        return { start: node.offset, end: node.offset + node.length }
    }

    private static pathPopAll(model: ModelPath) {
        return new ModelPath(
            model.model,
            new Path(
                model.getArray().slice(0, -1),
                model.getContext().slice(0, -1)
            )
        )
    }
}

type SelectNodeResult = {
    node: ASTNode | undefined,
    schema: INode | undefined,
    path: ModelPath,
    type: 'key' | 'value'
}
