import clone from 'clone'
import { CompletionItem, CompletionItemKind, DiagnosticSeverity, InsertTextFormat } from 'vscode-languageserver'
import { arrayToCompletions, arrayToMessage, handleCompletionText, quoteString, remapCompletionItem, removeDupliateCompletions, validateStringQuote } from '.'
import { locale } from '../locales'
import { NodeDescription, NodeRange } from '../nodes/ArgumentNode'
import { IdentityNode } from '../nodes/IdentityNode'
import { GetFormattedClose, GetFormattedOpen, Keys } from '../nodes/MapNode'
import { NbtArrayNode } from '../nodes/NbtArrayNode'
import { NbtByteArrayNode } from '../nodes/NbtByteArrayNode'
import { NbtByteNode } from '../nodes/NbtByteNode'
import { NbtCollectionNode } from '../nodes/NbtCollectionNode'
import { NbtCompoundNode } from '../nodes/NbtCompoundNode'
import { NbtDoubleNode } from '../nodes/NbtDoubleNode'
import { NbtFloatNode } from '../nodes/NbtFloatNode'
import { NbtIntArrayNode } from '../nodes/NbtIntArrayNode'
import { NbtIntNode } from '../nodes/NbtIntNode'
import { NbtListNode } from '../nodes/NbtListNode'
import { NbtLongArrayNode } from '../nodes/NbtLongArrayNode'
import { NbtLongNode } from '../nodes/NbtLongNode'
import { isNbtNodeTypeLooselyMatched, isNbtNodeTypeStrictlyMatched, NbtNode, NbtNodeType, NbtNodeTypeName, SuperNode } from '../nodes/NbtNode'
import { NbtNumberNode } from '../nodes/NbtNumberNode'
import { NbtPrimitiveNode } from '../nodes/NbtPrimitiveNode'
import { NbtShortNode } from '../nodes/NbtShortNode'
import { NbtStringNode } from '../nodes/NbtStringNode'
import { LineParser } from '../parsers/LineParser'
import { ArgumentParserResult, LegacyValidateResult, remapTokens, Token } from '../types'
import { ClientCache, combineCache, remapCachePosition } from '../types/ClientCache'
import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { getInnerIndex } from '../types/IndexMapping'
import { nbtdoc } from '../types/nbtdoc'
import { ParsingContext } from '../types/ParsingContext'
import { downgradeParsingError, ErrorCode, ParsingError, remapParsingErrors } from '../types/ParsingError'
import { QuoteTypeConfig } from '../types/QuoteTypeConfig'
import { DiagnosticConfig, getDiagnosticSeverity } from '../types/StylisticConfig'
import { StringReader } from './StringReader'

type CompoundSupers = { Compound: nbtdoc.Index<nbtdoc.CompoundTag> }
type RegistrySupers = { Registry: { target: string, path: nbtdoc.FieldPath[] } }
type Supers = CompoundSupers | RegistrySupers | null

type BooleanDoc = 'Boolean'

type ByteDoc = { Byte: nbtdoc.NumberTag }

type ShortDoc = { Short: nbtdoc.NumberTag }

type IntDoc = { Int: nbtdoc.NumberTag }

type LongDoc = { Long: nbtdoc.NumberTag }

type FloatDoc = { Float: nbtdoc.NumberTag }

type DoubleDoc = { Double: nbtdoc.NumberTag }

type StringDoc = 'String'

type ByteArrayDoc = { ByteArray: nbtdoc.NumberArrayTag }

type IntArrayDoc = { IntArray: nbtdoc.NumberArrayTag }

type LongArrayDoc = { LongArray: nbtdoc.NumberArrayTag }

export type CompoundDoc = { Compound: nbtdoc.Index<nbtdoc.CompoundTag> }

type EnumDoc = { Enum: nbtdoc.Index<nbtdoc.EnumItem> }

export type ListDoc = { List: { length_range: [number, number] | null, value_type: nbtdoc.NbtValue } }

export type IndexDoc = { Index: { target: string, path: nbtdoc.FieldPath[] } }

type IdDoc = { Id: string }

export type OrDoc = { Or: nbtdoc.NbtValue[] }

type NbtdocHelperOptions = {
    description: string | null,
    doc: nbtdoc.NbtValue,
    tag: NbtCompoundNode | null
}

export class NbtdocHelper {
    constructor(private readonly doc: nbtdoc.Root) { }

    static readonly CompiledFallbacks: { [type: string]: nbtdoc.CompoundTag | undefined } = {}

    private readonly mockCompoundArena: { [index: number]: nbtdoc.CompoundTag | null | undefined } = {}
    private mockCompoundIndexNext: nbtdoc.Index<nbtdoc.CompoundTag> = -1

    private readonly mockEnumArena: { [index: number]: nbtdoc.EnumItem } = {}
    private mockEnumIndexNext: nbtdoc.Index<nbtdoc.EnumItem> = -1

    private mockCompoundDoc(compoundDoc: nbtdoc.CompoundTag | null) {
        const mockIndex = this.mockCompoundIndexNext--
        this.mockCompoundArena[mockIndex] = compoundDoc
        return mockIndex
    }

    readCompound(index: nbtdoc.Index<nbtdoc.CompoundTag> | null): nbtdoc.CompoundTag | null {
        if (index === null) {
            return null
        } else if (index < 0) {
            return this.mockCompoundArena[index] || null
        } else {
            return this.doc.compound_arena[index] || null
        }
    }

    readEnum(index: nbtdoc.Index<nbtdoc.EnumItem>) {
        if (index < 0) {
            return this.mockEnumArena[index]
        } else {
            return this.doc.enum_arena[index]
        }
    }

    resolveRegistryCompound(type: string, id: string | null) {
        const registry = this.doc.registries[type]
        if (registry) {
            const reg = registry[0]
            if (id && reg[id] !== undefined) {
                return { Compound: reg[id] }
            } else {
                const compiledFallback = NbtdocHelper.getCompiledFallback(this.doc, type)
                const mockIndex = this.mockCompoundDoc(compiledFallback)
                return { Compound: mockIndex }
            }
        }
        return null
    }

    /**
     * Get the supers of this compound tag doc.
     * @param supers An index or a compound.
     * @param node The super tag node.
     */
    private getSupers(supers: Supers, node: NbtCompoundNode | null) {
        if (supers === null) {
            return { Compound: null }
        } else if (NbtdocHelper.isRegistrySupers(supers)) {
            const id = this.followFieldPath(supers.Registry.path, node)
            return this.resolveRegistryCompound(
                supers.Registry.target,
                /* istanbul ignore next */
                id ? IdentityNode.fromString(id.valueOf()).toString() : null
            )
        }
        return { Compound: supers.Compound }
    }

    private followFieldPath(paths: nbtdoc.FieldPath[], node: NbtCompoundNode | null): NbtStringNode | null {
        paths = JSON.parse(JSON.stringify(paths))
        let ansNode: NbtNode | null = node
        while (paths.length > 0 && ansNode && ansNode instanceof NbtCompoundNode) {
            const path = paths.shift()!
            if (path === 'Super') {
                ansNode = ansNode[SuperNode]
            } else {
                const key = path.Child
                ansNode = ansNode[key]
            }
            if (paths.length === 0) {
                if (ansNode && ansNode instanceof NbtStringNode) {
                    return ansNode
                } else {
                    return null
                }
            }
        }
        return null
    }

    readCompoundKeys(doc: nbtdoc.CompoundTag | null, node: NbtCompoundNode | null): string[] {
        if (doc) {
            const superDoc = this.getSupers(doc.supers, node)
            return [
                ...Object.keys(doc.fields),
                ...this.readCompoundKeys(
                    this.readCompound(superDoc ? superDoc.Compound : null),
                    node
                )
            ].filter((v, i, a) => a.indexOf(v) === i)
        }
        return []
    }

    /**
     * @param node The node which is at the same level as the `doc`
     */
    readField(doc: nbtdoc.CompoundTag | null, key: string, node: NbtCompoundNode | null): nbtdoc.Field | null {
        if (doc) {
            const field: nbtdoc.Field | undefined = doc.fields[key]
            if (field) {
                return field
            } else {
                const superDoc = this.getSupers(doc.supers, node)
                return this.readField(
                    this.readCompound(superDoc ? superDoc.Compound : null),
                    key,
                    node
                )
            }
        }
        return null
    }

    completeField(ans: LegacyValidateResult, ctx: ParsingContext, doc: nbtdoc.NbtValue | null, isPredicate: boolean, description: string) {
        /* istanbul ignore else */
        if (doc) {
            /* istanbul ignore else */
            if (NbtdocHelper.isBooleanDoc(doc)) {
                this.completeBooleanField(ans, ctx, doc)
            } else if (NbtdocHelper.isByteArrayDoc(doc)) {
                this.completeByteArrayField(ans, ctx, doc)
            } else if (NbtdocHelper.isCompoundDoc(doc)) {
                this.completeCompoundField(ans, ctx, doc)
            } else if (NbtdocHelper.isEnumDoc(doc)) {
                this.completeEnumField(ans, ctx, doc)
            } else if (NbtdocHelper.isIdDoc(doc)) {
                this.completeIdField(ans, ctx, doc, isPredicate)
            } else if (NbtdocHelper.isIntArrayDoc(doc)) {
                this.completeIntArrayField(ans, ctx, doc)
            } else if (NbtdocHelper.isListDoc(doc)) {
                this.completeListField(ans, ctx, doc)
            } else if (NbtdocHelper.isLongArrayDoc(doc)) {
                this.completeLongArrayField(ans, ctx, doc)
            } else if (NbtdocHelper.isStringDoc(doc)) {
                this.completeStringField(ans, ctx, doc, isPredicate, description)
            }
            // TODO: completions for OR
            // TODO: completions for compound keys in OR
            // TODO: completions for inner strings in Enum
        }
    }

    private completeOpenCloseField(ans: LegacyValidateResult, lint: LintConfig, node: NbtCollectionNode<NbtNode> | NbtCompoundNode) {
        const open = node[GetFormattedOpen](lint)
        const close = node[GetFormattedClose](lint)
        ans.completions.push({
            label: `${open}${close}`,
            insertText: `${open}$1${close}`,
            insertTextFormat: InsertTextFormat.Snippet
        })
    }
    private completeByteArrayField(ans: LegacyValidateResult, { config: { lint } }: ParsingContext, _doc: ByteArrayDoc) {
        this.completeOpenCloseField(ans, lint, new NbtByteArrayNode(null))
    }
    private completeCompoundField(ans: LegacyValidateResult, { config: { lint } }: ParsingContext, _doc: CompoundDoc) {
        this.completeOpenCloseField(ans, lint, new NbtCompoundNode(null))
    }
    private completeIntArrayField(ans: LegacyValidateResult, { config: { lint } }: ParsingContext, _doc: IntArrayDoc) {
        this.completeOpenCloseField(ans, lint, new NbtIntArrayNode(null))
    }
    private completeListField(ans: LegacyValidateResult, { config: { lint } }: ParsingContext, _doc: ListDoc) {
        this.completeOpenCloseField(ans, lint, new NbtListNode(null))
    }
    private completeLongArrayField(ans: LegacyValidateResult, { config: { lint } }: ParsingContext, _doc: LongArrayDoc) {
        this.completeOpenCloseField(ans, lint, new NbtLongArrayNode(null))
    }
    private completeBooleanField(ans: LegacyValidateResult, ctx: ParsingContext, _doc: BooleanDoc) {
        if (!ctx.config.lint.nbtBoolean || ctx.config.lint.nbtBoolean[1]) {
            ans.completions.push(...arrayToCompletions(['false', 'true']))
        }
        if (!ctx.config.lint.nbtBoolean || !ctx.config.lint.nbtBoolean[1]) {
            ans.completions.push(...arrayToCompletions([
                NbtdocHelper.getFormattedString(ctx.config.lint, 'Byte', 0),
                NbtdocHelper.getFormattedString(ctx.config.lint, 'Byte', 1)
            ]))
        }
    }
    private static handleDescription(str: string) {
        return str.trim().replace(/\n\s/g, '\n')
    }
    completeCompoundKeys(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtCompoundNode, doc: CompoundDoc | IndexDoc | null, currentType: 'always double' | 'always single' | null) {
        const existingKeys = Object.keys(tag)
        const compoundDoc = this.readCompound(
            this.resolveCompoundOrIndexDoc(doc, tag[SuperNode], ctx)
        )
        const pool = this
            .readCompoundKeys(
                compoundDoc,
                tag
            )
            .filter(v => !existingKeys.includes(v))
        for (const key of pool) {
            const field = this.readField(compoundDoc, key, tag)!
            const description = NbtdocHelper.handleDescription(field.description)
            ans.completions.push(
                NbtdocHelper.escapeCompletion(
                    {
                        label: key, insertText: key,
                        kind: CompletionItemKind.Property,
                        detail: NbtdocHelper.localeType(NbtdocHelper.getValueType(field.nbttype)),
                        /* istanbul ignore next */
                        ...description ? { documentation: description } : {}
                    },
                    ctx.config.lint.nbtCompoundKeyQuote,
                    ctx.config.lint.nbtCompoundKeyQuoteType,
                    currentType
                )
            )
        }
    }
    private completeEnumField(ans: LegacyValidateResult, ctx: ParsingContext, doc: EnumDoc) {
        const { et } = this.readEnum(doc.Enum)
        const type: 'Byte' | 'Short' | 'Int' | 'Long' | 'Float' | 'Double' | 'String' = NbtdocHelper.getValueType(et) as any
        const options: { [key: string]: nbtdoc.EnumOption<number | string> } = (et as any)[type]
        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                const { description, value } = options[key]
                const handledDescription = NbtdocHelper.handleDescription(description)
                ans.completions.push({
                    label: NbtdocHelper.getFormattedString(ctx.config.lint, type, value),
                    detail: NbtdocHelper.localeType(type),
                    documentation: handledDescription ? `${key}  \n${handledDescription}` : key,
                    kind: CompletionItemKind.EnumMember
                })
            }
        }
    }
    private completeIdField(ans: LegacyValidateResult, ctx: ParsingContext, doc: IdDoc, isPredicate: boolean) {
        const subCtx = { ...ctx, cursor: 0 }
        const reader = new StringReader('')
        const result = ctx.parsers.get('Identity', [
            NbtdocHelper.getIdentityTypeFromRegistry(doc.Id), false, isPredicate
        ]).parse(reader, subCtx)
        for (const com of result.completions) {
            ans.completions.push(
                NbtdocHelper.escapeCompletion(
                    { ...com, insertText: com.insertText || com.label },
                    ctx.config.lint.nbtStringQuote, ctx.config.lint.nbtStringQuoteType, null
                )
            )
        }
    }
    private completeStringField(ans: LegacyValidateResult, ctx: ParsingContext, _doc: StringDoc, _isPredicate: boolean, description: string) {
        const subCtx = { ...ctx, cursor: 0 }
        const reader = new StringReader('')
        const result = this.validateInnerString(reader, subCtx, description)
        if (result && result.completions) {
            for (const com of result.completions) {
                ans.completions.push(
                    NbtdocHelper.escapeCompletion(
                        { ...com, insertText: com.insertText || com.label },
                        ctx.config.lint.nbtStringQuote, ctx.config.lint.nbtStringQuoteType, null
                    )
                )
            }
        }
    }

    validateField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: nbtdoc.NbtValue | null, isPredicate: boolean, description: string) {
        if (doc) {
            if (NbtdocHelper.isBooleanDoc(doc)) {
                this.validateBooleanField(ans, ctx, tag, doc, isPredicate)
            } else if (NbtdocHelper.isByteArrayDoc(doc)) {
                this.validateByteArrayField(ans, ctx, tag, doc, isPredicate)
            } else if (NbtdocHelper.isByteDoc(doc)) {
                this.validateByteField(ans, ctx, tag, doc, isPredicate)
            } else if (NbtdocHelper.isCompoundDoc(doc)) {
                this.validateCompoundField(ans, ctx, tag, doc, isPredicate)
            } else if (NbtdocHelper.isDoubleDoc(doc)) {
                this.validateDoubleField(ans, ctx, tag, doc, isPredicate)
            } else if (NbtdocHelper.isEnumDoc(doc)) {
                this.validateEnumField(ans, ctx, tag, doc, isPredicate)
            } else if (NbtdocHelper.isFloatDoc(doc)) {
                this.validateFloatField(ans, ctx, tag, doc, isPredicate)
            } else if (NbtdocHelper.isIdDoc(doc)) {
                this.validateIdField(ans, ctx, tag, doc, isPredicate)
            } else if (NbtdocHelper.isIndexDoc(doc)) {
                this.validateIndexField(ans, ctx, tag, doc, isPredicate)
            } else if (NbtdocHelper.isIntArrayDoc(doc)) {
                this.validateIntArrayField(ans, ctx, tag, doc, isPredicate, description)
            } else if (NbtdocHelper.isIntDoc(doc)) {
                this.validateIntField(ans, ctx, tag, doc, isPredicate, description)
            } else if (NbtdocHelper.isListDoc(doc)) {
                this.validateListField(ans, ctx, tag, doc, isPredicate, description)
            } else if (NbtdocHelper.isLongArrayDoc(doc)) {
                this.validateLongArrayField(ans, ctx, tag, doc, isPredicate)
            } else if (NbtdocHelper.isLongDoc(doc)) {
                this.validateLongField(ans, ctx, tag, doc, isPredicate)
            } else if (NbtdocHelper.isOrDoc(doc)) {
                this.validateOrField(ans, ctx, tag, doc, isPredicate, description)
            } else if (NbtdocHelper.isShortDoc(doc)) {
                this.validateShortField(ans, ctx, tag, doc, isPredicate)
            } else {
                this.validateStringField(ans, ctx, tag, isPredicate, description)
            }
        }
    }

    /**
     * @returns If it matches loosely; whether or not should be furthermore validated.
     */
    private validateNbtNodeType(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, expected: NbtNodeTypeName, isPredicate: boolean) {
        const config = ctx.config.lint.nbtTypeCheck
        const actual = tag[NbtNodeType]
        const isLooselyMatched = isNbtNodeTypeLooselyMatched(actual, expected)
        if (
            !isLooselyMatched ||
            ((isPredicate || (config && config[1] === 'strictly')) && !isNbtNodeTypeStrictlyMatched(actual, expected))
        ) {
            //#region Action codes of converting to similar types
            let code: ErrorCode | undefined = undefined
            if (actual === 'Byte' || actual === 'Short' || actual === 'Int' || actual === 'Long' || actual === 'Float' || actual === 'Double') {
                if (expected === 'Byte') code = ErrorCode.NbtTypeToByte
                else if (expected === 'Short') code = ErrorCode.NbtTypeToShort
                else if (expected === 'Int') code = ErrorCode.NbtTypeToInt
                else if (expected === 'Long') code = ErrorCode.NbtTypeToLong
                else if (expected === 'Float') code = ErrorCode.NbtTypeToFloat
                else if (expected === 'Double') code = ErrorCode.NbtTypeToDouble
            } else if (actual === 'ByteArray' || actual === 'IntArray' || actual === 'LongArray' || actual === 'List') {
                if (expected === 'ByteArray') code = ErrorCode.NbtTypeToByteArray
                else if (expected === 'IntArray') code = ErrorCode.NbtTypeToIntArray
                else if (expected === 'LongArray') code = ErrorCode.NbtTypeToLongArray
                else if (expected === 'List') code = ErrorCode.NbtTypeToList
            }
            //#endregion
            //#region UUID datafix: #377
            if (expected === 'IntArray' && actual === 'String') {
                code = ErrorCode.NbtUuidDatafixString
            } else if (expected === 'IntArray' && actual === 'Compound') {
                code = ErrorCode.NbtUuidDatafixCompound
            }
            //#endregion
            ans.errors.push(new ParsingError(
                tag[NodeRange],
                locale('diagnostic-rule',
                    locale('expected-got', locale(`nbt-tag.${expected}`), locale(`nbt-tag.${actual}`)),
                    locale('punc.quote', 'nbtTypeCheck')
                ),
                true, getDiagnosticSeverity(config ? config[0] : 'warning'), code
            ))
        }
        return isLooselyMatched
    }

    private validateCollectionLength(ans: LegacyValidateResult, _ctx: ParsingContext, tag: NbtCollectionNode<any>, [min, max]: [number, number], _isPredicate: boolean) {
        if (!(min <= tag.length && tag.length <= max)) {
            ans.errors.push(new ParsingError(
                tag[NodeRange],
                locale('expected',
                    min === max ? locale('collection-length.exact', min) : locale('collection-length.between', min, max)
                ),
                true, DiagnosticSeverity.Warning
            ))
        }
    }

    private validateNumberArrayField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtArrayNode<NbtNumberNode<number | bigint>>, { length_range: lengthRange, value_range: valueRange }: nbtdoc.NumberArrayTag, isPredicate: boolean, description: string) {
        if (lengthRange) {
            this.validateCollectionLength(ans, ctx, tag, lengthRange, isPredicate)
        }
        for (const item of tag) {
            this.validateNumberField(ans, ctx, item, valueRange, isPredicate, description)
        }
    }

    private validateNumberField(ans: LegacyValidateResult, _ctx: ParsingContext, tag: NbtNumberNode<number | bigint>, range: [number, number] | null, _isPredicate: boolean, description: string) {
        // Cache.
        /// Color information.
        if (description.match(/RED << 16 \| GREEN << 8 \| BLUE/i)) {
            const num = Number(tag.valueOf())
            const r = ((num >> 16) & 255) / 255
            const g = ((num >> 8) & 255) / 255
            const b = (num & 255) / 255
            combineCache(ans.cache, {
                colors: {
                    [`${r} ${g} ${b} 1`]: {
                        def: [], ref: [tag[NodeRange]]
                    }
                }
            })
        }
        // Errors.
        if (range) {
            const [min, max] = range
            if (!(min <= tag.valueOf() && tag.valueOf() <= max)) {
                ans.errors.push(new ParsingError(
                    tag[NodeRange],
                    locale('expected-got', locale('number.between', min, max), tag.valueOf()),
                    true, DiagnosticSeverity.Warning
                ))
            }
        }
    }

    /**
     * @param node The node which is at the same level as the `doc`
     */
    isInheritFromItemBase(doc: nbtdoc.CompoundTag | null, node: NbtCompoundNode | null): boolean {
        if (!doc) {
            return false
        }
        if (doc.fields.hasOwnProperty('CustomModelData')) {
            return true
        }
        const superDoc = this.getSupers(doc.supers, node)
        return this.isInheritFromItemBase(
            this.readCompound(superDoc ? superDoc.Compound : null),
            node ? node[SuperNode] : null
        )
    }

    private validateCompoundDoc(ans: LegacyValidateResult, ctx: ParsingContext, node: NbtCompoundNode, doc: nbtdoc.CompoundTag | null, isPredicate: boolean) {
        if (doc) {
            for (const key in node) {
                /* istanbul ignore else */
                if (node.hasOwnProperty(key)) {
                    const childNode = node[key]
                    const field = this.readField(doc, key, node)
                    if (field) {
                        // Hover information.
                        node[Keys][key][NodeDescription] = NbtdocHelper.getKeyDescription(field.nbttype, field.description)
                        this.validateField(ans, ctx, childNode, field.nbttype, isPredicate, NbtdocHelper.handleDescription(field.description))
                    } else {
                        // Errors.
                        if (!this.isInheritFromItemBase(doc, node/* [SuperNode] */)) {
                            let code: ErrorCode | undefined
                            //#region UUID datafix: #377
                            if (['ConversionPlayerLeast', 'ConversionPlayerMost', 'UUIDLeast', 'UUIDMost', 'LoveCauseLeast', 'LoveCauseMost', 'OwnerUUID', 'OwnerUUIDLeast', 'OwnerUUIDMost', 'target_uuid', 'TrustedUUIDs'].includes(key)) {
                                code = ErrorCode.NbtUuidDatafixUnknownKey
                            }
                            //#endregion
                            ans.errors.push(new ParsingError(
                                node[Keys][key][NodeRange],
                                locale('unknown-key', locale('punc.quote', key)),
                                true, DiagnosticSeverity.Warning, code
                            ))
                        }
                    }
                }
            }
        }
    }

    private static getFormattedString(lint: LintConfig, type: 'Byte' | 'Short' | 'Int' | 'Long' | 'Float' | 'Double' | 'String', value: string | number) {
        let tag: NbtPrimitiveNode<string | number | bigint>
        switch (type) {
            case 'Byte':
                tag = new NbtByteNode(null, value as number, value.toString())
                break
            case 'Short':
                tag = new NbtShortNode(null, value as number, value.toString())
                break
            case 'Int':
                tag = new NbtIntNode(null, value as number, value.toString())
                break
            case 'Long':
                tag = new NbtLongNode(null, BigInt(value as number), value.toString())
                break
            case 'Float':
                tag = new NbtFloatNode(null, value as number, value.toString())
                break
            case 'Double':
                tag = new NbtDoubleNode(null, value as number, value.toString())
                break
            case 'String':
            default:
                return NbtdocHelper.quoteCompletionText(value.toString(), lint.nbtStringQuote, lint.nbtStringQuoteType, null)
        }
        return tag[GetFormattedString](lint)
    }

    private static quoteCompletionText(text: string, quoteConfig: DiagnosticConfig<boolean>, quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig>, currentType: 'always double' | 'always single' | null) {
        if (currentType) {
            return quoteString(text, currentType, true).slice(1, -1)
        } else {
            const quote = quoteConfig ? quoteConfig[1] : false
            const quoteType = quoteTypeConfig ? quoteTypeConfig[1] : 'prefer double'
            return quoteString(text, quoteType, quote)
        }
    }
    private static getQuoteType(raw: string): 'always double' | 'always single' | null {
        if (raw.charAt(0) === '"') {
            return 'always double'
        } else if (raw.charAt(0) === "'") {
            return 'always single'
        } else {
            return null
        }
    }

    /* istanbul ignore next */
    private static escapeCompletion(origin: CompletionItem, quoteConfig: DiagnosticConfig<boolean>, quoteTypeConfig: DiagnosticConfig<QuoteTypeConfig>, currentType: 'always double' | 'always single' | null) {
        return handleCompletionText(origin, str => NbtdocHelper.quoteCompletionText(str, quoteConfig, quoteTypeConfig, currentType))
    }

    private static getValueType(value: nbtdoc.NbtValue | nbtdoc.EnumType) {
        if (typeof value === 'string') {
            return value
        } else {
            return Object.keys(value)[0]
        }
    }

    private static localeType(type: string) {
        return locale('nbtdoc.type', locale(`nbtdoc.type.${type}`))
    }

    private validateBooleanField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, _doc: BooleanDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Byte', isPredicate)
        // Errors.
        if (shouldValidate) {
            const config = ctx.config.lint.nbtBoolean
            if (config) {
                const actualString = tag.toString()
                const isBooleanLiteral = /^true|false$/i.test(actualString)
                const [severity, expectedLiteral] = config
                const message = expectedLiteral ?
                    locale('expected', arrayToMessage(['false', 'true'], true, 'or')) :
                    locale('expected-got', locale('nbt-tag.Byte'), locale('punc.quote', actualString))
                const code = expectedLiteral ? ErrorCode.NbtByteToLiteral : ErrorCode.NbtByteToNumber
                if (isBooleanLiteral !== expectedLiteral) {
                    ans.errors.push(new ParsingError(
                        tag[NodeRange], message, undefined,
                        getDiagnosticSeverity(severity), code
                    ))
                }
            }
        }
    }
    private validateByteArrayField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: ByteArrayDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'ByteArray', isPredicate)
        if (shouldValidate) {
            this.validateNumberArrayField(ans, ctx, tag as NbtByteArrayNode, doc.ByteArray, isPredicate, '')
        }
    }
    private validateByteField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: ByteDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Byte', isPredicate)
        if (shouldValidate) {
            this.validateNumberField(ans, ctx, tag as NbtByteNode, doc.Byte.range, isPredicate, '')
        }
    }
    private validateCompoundField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: CompoundDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Compound', isPredicate)
        if (shouldValidate) {
            const compoundNode: NbtCompoundNode = tag as any
            const compoundDoc = this.readCompound(doc.Compound)
            this.validateCompoundDoc(ans, ctx, compoundNode, compoundDoc, isPredicate)
        }
    }
    private validateDoubleField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: DoubleDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Double', isPredicate)
        if (shouldValidate) {
            this.validateNumberField(ans, ctx, tag as NbtDoubleNode, doc.Double.range, isPredicate, '')
        }
    }
    private validateEnumField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: EnumDoc, isPredicate: boolean): void {
        const { description, et } = this.readEnum(doc.Enum)
        const handledDescription = NbtdocHelper.handleDescription(description)
        const type: 'Byte' | 'Short' | 'Int' | 'Long' | 'Float' | 'Double' | 'String' = NbtdocHelper.getValueType(et) as any
        tag[NodeDescription] = `${NbtdocHelper.localeType(type)}\n* * * * * *\n${handledDescription}`
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, type, isPredicate)
        if (shouldValidate) {
            const options: { [key: string]: nbtdoc.EnumOption<number | string> } = (et as any)[type]
            const optionValues: string[] = []
            for (const key in options) {
                /* istanbul ignore else */
                if (options.hasOwnProperty(key)) {
                    const { description, value } = options[key]
                    optionValues.push(value.toString())
                    // Hover information.
                    const handledDescription = NbtdocHelper.handleDescription(description)
                    if (tag.valueOf() == value) {
                        const hoverText = handledDescription ? `${key} - ${handledDescription}` : key
                        tag[NodeDescription] += `\n\n${hoverText}`
                    }
                }
            }
            // Errors.
            if (!optionValues.includes(tag.valueOf().toString())) {
                ans.errors.push(new ParsingError(
                    tag[NodeRange],
                    locale('expected-got',
                        arrayToMessage(optionValues, true, 'or'),
                        locale('punc.quote', tag.valueOf().toString())
                    ), undefined, DiagnosticSeverity.Warning
                ))
            }
        }
    }
    private validateFloatField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: FloatDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Float', isPredicate)
        if (shouldValidate) {
            this.validateNumberField(ans, ctx, tag as NbtFloatNode, doc.Float.range, isPredicate, '')
        }
    }
    // https://github.com/SPGoding/datapack-language-server/issues/332#issuecomment-590168655
    /* istanbul ignore next */
    private static getIdentityTypeFromRegistry(registry: string) {
        switch (registry) {
            case 'minecraft:attribute':
            case 'minecraft:block':
            case 'minecraft:enchantment':
            case 'minecraft:item':
            case 'minecraft:motive':
            case 'minecraft:potion':
            case 'minecraft:villager_profession':
            case 'minecraft:villager_type':
                return registry
            case 'minecraft:block_entity':
                return 'minecraft:block_entity_type'
            case 'minecraft:dimension':
                return 'minecraft:dimension_type'
            case 'minecraft:entity':
                return 'minecraft:entity_type'
            case 'minecraft:loot_table':
                return '$loot_tables'
            case 'minecraft:recipe':
                return '$recipes'
            case 'minecraft:structure':
                return 'minecraft:structure_feature'
            default:
                throw new Error(`Unknown nbtdoc ID registry: ${registry}`)
        }
    }
    private validateIdField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: IdDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'String', isPredicate)
        if (shouldValidate) {
            const strTag = tag as NbtStringNode
            /// Identity.
            const subCtx = { ...ctx, cursor: getInnerIndex(strTag.mapping, ctx.cursor) }
            const reader = new StringReader(strTag.valueOf())
            const result = ctx.parsers.get('Identity', [
                NbtdocHelper.getIdentityTypeFromRegistry(doc.Id), false, isPredicate
            ]).parse(reader, subCtx)
            //#region Attribute name datafix: #381
            if (doc.Id === 'minecraft:attribute') {
                for (const error of result.errors) {
                    if (error.code === undefined) {
                        error.code = ErrorCode.NbtStringAttributeDatafix
                    }
                }
            }
            //#endregion
            this.combineResult(ans, result, strTag)
            /// Quotes.
            ans.errors.push(...validateStringQuote(
                strTag.toString(), strTag.valueOf(), tag[NodeRange],
                ctx.config.lint.nbtStringQuote, ctx.config.lint.nbtStringQuoteType,
                'nbtStringQuote', 'nbtStringQuoteType'
            ))
        }
    }
    private validateIndexField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: IndexDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Compound', isPredicate)
        if (shouldValidate) {
            var compoundTag = tag as NbtCompoundNode
            var compoundDocIndex = this.resolveIndexDoc(doc, compoundTag[SuperNode], ctx)
            /* istanbul ignore else */
            if (compoundDocIndex) {
                this.validateCompoundDoc(ans, ctx, compoundTag, this.readCompound(compoundDocIndex), isPredicate)
            }
        }
    }

    private validateIntArrayField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: IntArrayDoc, isPredicate: boolean, description: string): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'IntArray', isPredicate)
        if (shouldValidate) {
            this.validateNumberArrayField(ans, ctx, tag as NbtIntArrayNode, doc.IntArray, isPredicate, description)
        }
    }
    private validateIntField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: IntDoc, isPredicate: boolean, description: string): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Int', isPredicate)
        if (shouldValidate) {
            this.validateNumberField(ans, ctx, tag as NbtIntNode, doc.Int.range, isPredicate, description)
        }
    }
    private validateListField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: ListDoc, isPredicate: boolean, description: string): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'List', isPredicate)
        if (shouldValidate) {
            const listTag = tag as NbtListNode<NbtNode>
            const { length_range: lengthRange, value_type: childDoc } = doc.List
            if (lengthRange) {
                this.validateCollectionLength(ans, ctx, listTag, lengthRange, isPredicate)
            }
            for (const item of listTag) {
                this.validateField(ans, ctx, item, childDoc, isPredicate, description)
            }
        }
    }
    private validateLongArrayField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: LongArrayDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'LongArray', isPredicate)
        if (shouldValidate) {
            this.validateNumberArrayField(ans, ctx, tag as NbtLongArrayNode, doc.LongArray, isPredicate, '')
        }
    }
    private validateLongField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: LongDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Long', isPredicate)
        if (shouldValidate) {
            this.validateNumberField(ans, ctx, tag as NbtLongNode, doc.Long.range, isPredicate, '')
        }
    }
    private validateOrField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: OrDoc, isPredicate: boolean, description: string): void {
        for (let i = 0; i < doc.Or.length; i++) {
            const childDoc = doc.Or[i]
            const childAns: LegacyValidateResult = { cache: {}, completions: [], errors: [], tokens: [] }
            this.validateField(childAns, ctx, tag, childDoc, isPredicate, description)
            if (childAns.errors.length === 0 || i === doc.Or.length - 1) {
                combineCache(ans.cache, childAns.cache)
                ans.completions.push(...childAns.completions)
                ans.errors.push(...childAns.errors)
                break
            }
        }
        if (doc.Or.length === 0) {
            ans.errors.push(new ParsingError(tag[NodeRange], locale('unexpected-nbt'), true, DiagnosticSeverity.Warning))
        }
    }
    private validateShortField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, doc: ShortDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Short', isPredicate)
        if (shouldValidate) {
            this.validateNumberField(ans, ctx, tag as NbtShortNode, doc.Short.range, isPredicate, '')
        }
    }
    private validateStringField(ans: LegacyValidateResult, ctx: ParsingContext, tag: NbtNode, isPredicate: boolean, description: string): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'String', isPredicate)
        if (shouldValidate) {
            // Errors.
            /// Special cases: https://github.com/SPGoding/datapack-language-server/issues/332#issuecomment-590167678.
            const strTag = tag as NbtStringNode
            const quoteType = NbtdocHelper.getQuoteType(strTag.toString())
            if (quoteType) {
                const subCtx = { ...ctx, cursor: getInnerIndex(strTag.mapping, ctx.cursor) }
                const reader = new StringReader(strTag.valueOf())
                const result = this.validateInnerString(reader, subCtx, description)
                if (result && result.completions) {
                    result.completions = result.completions.map(
                        v => NbtdocHelper.escapeCompletion(
                            v,
                            ctx.config.lint.nbtStringQuote,
                            ctx.config.lint.nbtStringQuoteType,
                            quoteType
                        )
                    )
                }
                this.combineResult(ans, result, strTag)
                /// Quotes.
                ans.errors.push(...validateStringQuote(
                    strTag.toString(), strTag.valueOf(), tag[NodeRange],
                    ctx.config.lint.nbtStringQuote, ctx.config.lint.nbtStringQuoteType,
                    'nbtStringQuote', 'nbtStringQuoteType'
                ))
            }
        }
    }

    /* istanbul ignore next */
    private validateInnerString(reader: StringReader, ctx: ParsingContext, description: string) {
        let result: Partial<LegacyValidateResult> | undefined = undefined
        if (description.match(/command stored/i)) {
            result = new LineParser(null, 'commands').parse(reader, ctx).data
        } else if (description.match(/particle the area effect cloud/i)) {
            result = ctx.parsers.get('Particle').parse(reader, ctx)
        } else if (description.match(/tags on the entity/i)) {
            result = ctx.parsers.get('Tag').parse(reader, ctx)
        } else if (description.match(/team to join/i)) {
            result = ctx.parsers.get('Team').parse(reader, ctx)
        } else if (description.match(/line of text/i) ||
            description.match(/name of th(?:e|is) (?:banner|brewing stand|command block|container|enchanting table|furance)/i) ||
            description.match(/JSON text component/i) ||
            description.match(/lore of an item/i)) {
            result = ctx.parsers.get('TextComponent').parse(reader, ctx)
        } else if (description.match(/can be placed on/i) || description.match(/can be destroyed/i)) {
            result = ctx.parsers.get('Block', [true, true]).parse(reader, ctx)
        }
        return result
    }

    private combineResult(ans: LegacyValidateResult, result: { cache?: ClientCache | undefined, errors?: ParsingError[] | undefined, completions?: CompletionItem[], tokens?: Token[] } | undefined, tag: NbtStringNode) {
        if (result) {
            if (result.cache) {
                remapCachePosition(result.cache, tag.mapping)
                combineCache(ans.cache, result.cache)
            }
            if (result.errors) {
                const downgradedErrors = downgradeParsingError(result.errors)
                remapParsingErrors(downgradedErrors, tag.mapping)
                ans.errors.push(...downgradedErrors)
            }
            if (result.completions) {
                ans.completions.push(...result.completions.map(v => remapCompletionItem(v, tag.mapping)))
            }
            if (result.tokens) {
                ans.tokens.push(...remapTokens(result.tokens, tag.mapping))
            }
        }
    }

    /**
     * @param tag The compound tag which encloses the tag corresponding to `doc`.
     */
    /* istanbul ignore next */
    private resolveIndexDoc(indexDoc: IndexDoc, tag: NbtCompoundNode | null, ctx: ParsingContext) {
        const idTag = this.followFieldPath(indexDoc.Index.path, tag)
        const id = idTag ? IdentityNode.fromString(idTag.valueOf()).toString() : null
        if (indexDoc.Index.target.startsWith('custom:')) {
            return this.resolveCustomIndexDoc(indexDoc, id, ctx)
        } else {
            return this.resolveRegistryCompound(indexDoc.Index.target, id)?.Compound ?? null
        }
    }

    /* istanbul ignore next */
    private resolveCustomIndexDoc(indexDoc: IndexDoc, id: string | null, ctx: ParsingContext) {
        let compoundDoc: nbtdoc.CompoundTag | null = null
        if (id) {
            switch (indexDoc.Index.target) {
                case 'custom:blockitemstates':
                    compoundDoc = this.getCustomBlockItemStatesIndexDoc(id, ctx)
                    break
                case 'custom:blockstates':
                    compoundDoc = this.getCustomBlockStatesIndexDoc(id, ctx)
                    break
                case 'custom:spawnitemtag':
                case 'custom:spawnitementag':
                    return this.resolveCustomSpawnItemIndexDoc(id)
                default:
                    console.error(`Unknown nbtdoc target registry ${indexDoc.Index.target}`)
                    break
            }
        }
        return this.mockCompoundDoc(compoundDoc)
    }

    /* istanbul ignore next */
    private getCustomBlockItemStatesIndexDoc(id: string, ctx: ParsingContext) {
        do {
            const result = this.getCustomBlockStatesIndexDoc(id, ctx)
            if (result) {
                return result
            }
        } while (id.includes('_') && (id = `minecraft:${id.slice(id.indexOf('_') + 1)}`, true))
        return null
    }

    /* istanbul ignore next */
    private getCustomBlockStatesIndexDoc(id: string, ctx: ParsingContext) {
        const ans: nbtdoc.CompoundTag = { description: '', fields: {}, supers: null }
        const properties = ctx.blockDefinition[id]?.properties
        if (!properties) {
            return null
        }
        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                const mockEnumIndex = this.mockEnumIndexNext--
                const mockEnum: any = this.mockEnumArena[mockEnumIndex] = {
                    description: '',
                    et: { String: {} }
                }

                const values = properties[key]
                for (const value of values) {
                    mockEnum.et.String[value] = {
                        description: '',
                        value
                    }
                }

                ans.fields[key] = {
                    description: '',
                    nbttype: {
                        Enum: mockEnumIndex
                    }
                }
            }
        }
        return ans
    }

    /* istanbul ignore next */
    private resolveCustomSpawnItemIndexDoc(id: string) {
        const entityId = id.endsWith('_spawn_egg') ? id.slice(0, -10) : id
        return this.resolveRegistryCompound('minecraft:entity', entityId)?.Compound ?? null
    }

    /**
     * @param tag The compound tag which encloses the tag corresponding to `doc`.
     * @returns An index of a compound doc
     */
    resolveCompoundOrIndexDoc(doc: CompoundDoc | IndexDoc | null, tag: NbtCompoundNode | null, ctx: ParsingContext) {
        if (!doc) {
            return null
        } else if (NbtdocHelper.isCompoundDoc(doc)) {
            return doc.Compound
        } else {
            return this.resolveIndexDoc(doc, tag, ctx)
        }
    }

    static getCompiledFallback(root: nbtdoc.Root, type: string): nbtdoc.CompoundTag {
        let ans: nbtdoc.CompoundTag | undefined = this.CompiledFallbacks[type]

        if (!ans) {
            ans = { description: '', fields: {}, supers: null }
            const mergedDocs: Set<nbtdoc.Index<nbtdoc.CompoundTag>> = new Set()
            const merge = (index: nbtdoc.Index<nbtdoc.CompoundTag> | null) => {
                if (index !== null && !mergedDocs.has(index)) {
                    mergedDocs.add(index)
                    const doc = root.compound_arena[index]
                    for (const key in doc.fields) {
                        /* istanbul ignore else */
                        if (Object.prototype.hasOwnProperty.call(doc.fields, key)) {
                            const ansField = ans!.fields[key]
                            const field = doc.fields[key]
                            if (this.isOrDoc(field.nbttype) && field.nbttype.Or.length === 0) {
                                break
                            }
                            if (ansField) {
                                if (this.isOrDoc(ansField.nbttype)) {
                                    ansField.nbttype.Or.push(field.nbttype)
                                } else {
                                    ans!.fields[key] = {
                                        description: ansField.description,
                                        nbttype: { Or: [ansField.nbttype, field.nbttype] }
                                    }
                                }
                            } else {
                                ans!.fields[key] = field
                            }
                        }
                    }
                    merge(doc.supers && !NbtdocHelper.isRegistrySupers(doc.supers) ? doc.supers.Compound : null)
                }
            }

            const registry = root.registries[type][0]
            for (const key in registry) {
                if (Object.prototype.hasOwnProperty.call(registry, key)) {
                    const index = registry[key]
                    merge(index)
                }
            }
        }

        return ans
    }

    static isRegistrySupers(supers: Supers): supers is RegistrySupers {
        return (supers as RegistrySupers).Registry !== undefined
    }
    static isBooleanDoc(doc: any): doc is BooleanDoc {
        return doc === 'Boolean'
    }
    static isByteDoc(doc: any): doc is ByteDoc {
        return !!doc && doc.Byte !== undefined
    }
    static isShortDoc(doc: any): doc is ShortDoc {
        return !!doc && doc.Short !== undefined
    }
    static isIntDoc(doc: any): doc is IntDoc {
        return !!doc && doc.Int !== undefined
    }
    static isLongDoc(doc: any): doc is LongDoc {
        return !!doc && doc.Long !== undefined
    }
    static isFloatDoc(doc: any): doc is FloatDoc {
        return !!doc && doc.Float !== undefined
    }
    static isDoubleDoc(doc: any): doc is DoubleDoc {
        return !!doc && doc.Double !== undefined
    }
    static isStringDoc(doc: any): doc is StringDoc {
        return doc === 'String'
    }
    static isByteArrayDoc(doc: any): doc is ByteArrayDoc {
        return !!doc && doc.ByteArray !== undefined
    }
    static isIntArrayDoc(doc: any): doc is IntArrayDoc {
        return !!doc && doc.IntArray !== undefined
    }
    static isLongArrayDoc(doc: any): doc is LongArrayDoc {
        return !!doc && doc.LongArray !== undefined
    }
    static isCompoundDoc(doc: any): doc is CompoundDoc {
        return !!doc && doc.Compound !== undefined
    }
    static isEnumDoc(doc: any): doc is EnumDoc {
        return !!doc && doc.Enum !== undefined
    }
    static isListDoc(doc: any): doc is ListDoc {
        return !!doc && doc.List !== undefined
    }
    static isIndexDoc(doc: any): doc is IndexDoc {
        return !!doc && doc.Index !== undefined
    }
    static isIdDoc(doc: any): doc is IdDoc {
        return !!doc && doc.Id !== undefined
    }
    static isOrDoc(doc: any): doc is OrDoc {
        return !!doc && doc.Or !== undefined
    }
    static isCompoundOrIndexDoc(doc: any): doc is CompoundDoc | IndexDoc {
        return this.isCompoundDoc(doc) || this.isIndexDoc(doc)
    }

    static getKeyDescription(value: nbtdoc.NbtValue, description: string) {
        return `${NbtdocHelper.localeType(NbtdocHelper.getValueType(value))
            }\n* * * * * *\n${
            NbtdocHelper.handleDescription(description)}`
    }

    static forEachOrDoc<T>(ans: ArgumentParserResult<T>, reader: StringReader, doc: OrDoc, cb: (ans: ArgumentParserResult<T>, reader: StringReader, doc: nbtdoc.NbtValue) => any): void {
        for (const [i, childDoc] of doc.Or.entries()) {
            const childAns = clone(ans)
            const clonedReader = reader.clone()
            cb(childAns, clonedReader, childDoc)
            ans.completions = removeDupliateCompletions(childAns.completions)
            if (childAns.errors.length === ans.errors.length || i === doc.Or.length - 1) {
                ans.cache = childAns.cache
                ans.data = childAns.data
                ans.errors = childAns.errors
                ans.tokens = childAns.tokens
                reader.cursor = clonedReader.cursor
                return
            }
        }
    }
}
