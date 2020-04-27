import { CompletionItem, CompletionItemKind, DiagnosticSeverity, InsertTextFormat } from 'vscode-languageserver'
import { locale } from '../locales/Locales'
import LineParser from '../parsers/LineParser'
import { ClientCache, combineCache, remapCachePosition } from '../types/ClientCache'
import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { getInnerIndex } from '../types/IndexMapping'
import { nbtdoc } from '../types/nbtdoc'
import { NodeDescription, NodeRange } from '../types/nodes/ArgumentNode'
import IdentityNode from '../types/nodes/IdentityNode'
import { GetFormattedClose, GetFormattedOpen, Keys } from '../types/nodes/map/MapNode'
import NbtCompoundNode from '../types/nodes/map/NbtCompoundNode'
import NbtArrayNode from '../types/nodes/nbt/NbtArrayNode'
import NbtByteArrayNode from '../types/nodes/nbt/NbtByteArrayNode'
import NbtByteNode from '../types/nodes/nbt/NbtByteNode'
import NbtCollectionNode from '../types/nodes/nbt/NbtCollectionNode'
import NbtDoubleNode from '../types/nodes/nbt/NbtDoubleNode'
import NbtFloatNode from '../types/nodes/nbt/NbtFloatNode'
import NbtIntArrayNode from '../types/nodes/nbt/NbtIntArrayNode'
import NbtIntNode from '../types/nodes/nbt/NbtIntNode'
import NbtListNode from '../types/nodes/nbt/NbtListNode'
import NbtLongArrayNode from '../types/nodes/nbt/NbtLongArrayNode'
import NbtLongNode from '../types/nodes/nbt/NbtLongNode'
import NbtNode, { isNbtNodeTypeLooselyMatched, isNbtNodeTypeStrictlyMatched, NbtNodeType, NbtNodeTypeName, SuperNode } from '../types/nodes/nbt/NbtNode'
import NbtNumberNode from '../types/nodes/nbt/NbtNumberNode'
import NbtPrimitiveNode from '../types/nodes/nbt/NbtPrimitiveNode'
import NbtShortNode from '../types/nodes/nbt/NbtShortNode'
import NbtStringNode from '../types/nodes/nbt/NbtStringNode'
import ParsingContext from '../types/ParsingContext'
import ParsingError, { ActionCode, downgradeParsingError, remapParsingErrors } from '../types/ParsingError'
import { getDiagnosticSeverity } from '../types/StylisticConfig'
import StringReader from './StringReader'
import { arrayToCompletions, arrayToMessage, quoteString, remapCompletionItem, validateStringQuote } from './utils'

type CompoundSupers = { Compound: nbtdoc.Index<nbtdoc.CompoundTag> }
type RegistrySupers = { Registry: { target: string, path: nbtdoc.FieldPath[] } }
type Supers = CompoundSupers | RegistrySupers | null

interface ValidateResultLike {
    completions?: CompletionItem[], errors?: ParsingError[], cache?: ClientCache
}
interface ValidateResult extends ValidateResultLike {
    completions: CompletionItem[], errors: ParsingError[], cache: ClientCache
}

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

type IndexDoc = { Index: { target: string, path: nbtdoc.FieldPath[] } }

type IdDoc = { Id: string }

type OrDoc = { Or: nbtdoc.NbtValue[] }

export default class NbtdocHelper {
    // private static readonly MockEnumIndex: nbtdoc.Index<nbtdoc.EnumItem> = 114514

    compoundIndex: nbtdoc.Index<nbtdoc.CompoundTag> | null = null
    enumIndex: nbtdoc.Index<nbtdoc.EnumItem>
    moduleIndex: nbtdoc.Index<nbtdoc.Module>
    tag: NbtCompoundNode | null

    // private mockEnum: nbtdoc.EnumItem

    constructor(private readonly doc: nbtdoc.Root) { }

    clone() {
        return new NbtdocHelper(this.doc)
            .goCompound(this.compoundIndex)
            .goEnum(this.enumIndex)
            .goModule(this.moduleIndex)
            .withTag(this.tag)
    }

    goCompound(index: nbtdoc.Index<nbtdoc.CompoundTag> | null) {
        this.compoundIndex = index
        return this
    }

    goEnum(index: nbtdoc.Index<nbtdoc.EnumItem>) {
        this.enumIndex = index
        return this
    }

    goModule(index: nbtdoc.Index<nbtdoc.Module>) {
        this.moduleIndex = index
        return this
    }

    withTag(tag: NbtCompoundNode | null) {
        this.tag = tag
        return this
    }

    readCompound(): nbtdoc.CompoundTag | null {
        if (this.compoundIndex === null) {
            return null
        }
        return this.doc.compound_arena[this.compoundIndex]
    }

    readEnum(): nbtdoc.EnumItem {
        // if (this.enumIndex === NbtdocHelper.MockEnumIndex) {
        //     return this.mockEnum
        // }
        return this.doc.enum_arena[this.enumIndex]
    }

    readModule(): nbtdoc.Module {
        return this.doc.module_arena[this.moduleIndex]
    }

    goRegistryCompound(type: string, id: string | null) {
        const registry = this.doc.registries[type]
        if (registry) {
            const [reg, fallback] = registry
            if (id && reg[id] !== undefined) {
                this.compoundIndex = reg[id]
            } else {
                this.compoundIndex = fallback
            }
        } else {
            this.compoundIndex = null
        }
        return this
    }

    private goSupers(supers: Supers) {
        if (supers === null) {
            this.goCompound(null)
        } else if (NbtdocHelper.isRegistrySupers(supers)) {
            const id = this.resolveFieldPath(supers.Registry.path)
            this.goRegistryCompound(
                supers.Registry.target,
                /* istanbul ignore next */
                id ? IdentityNode.fromString(id.valueOf().toString()).toString() : null
            )
        } else {
            this.goCompound(supers.Compound)
        }
        return this
    }

    private resolveFieldPath(paths: nbtdoc.FieldPath[]): NbtStringNode | null {
        paths = JSON.parse(JSON.stringify(paths))
        let tag: NbtNode | null = this.tag
        while (paths.length > 0 && tag && tag instanceof NbtCompoundNode) {
            const path = paths.shift()!
            if (path === 'Super') {
                tag = tag[SuperNode]
            } else {
                const key = path.Child
                tag = tag[key]
            }
            if (paths.length === 0) {
                if (tag && tag instanceof NbtStringNode) {
                    this.tag = tag[SuperNode]
                    return tag
                } else {
                    return null
                }
            }
        }
        return null
    }

    readCompoundKeys(): string[] {
        const doc = this.readCompound()
        if (doc) {
            return [
                ...Object
                    .keys(doc.fields),
                ...this
                    .clone()
                    .goSupers(doc.supers)
                    .readCompoundKeys()
            ].filter((v, i, a) => a.indexOf(v) === i)
        }
        return []
    }

    readField(key: string): nbtdoc.Field | null {
        const doc = this.readCompound()
        if (doc) {
            const field: nbtdoc.Field | undefined = doc.fields[key]
            if (field) {
                return field
            } else {
                return this
                    .clone()
                    .goSupers(doc.supers)
                    .readField(key)
            }
        }
        return null
    }

    completeField(ans: ValidateResult, ctx: ParsingContext, doc: nbtdoc.NbtValue | null, isPredicate: boolean, description: string) {
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

    private completeOpenCloseField(ans: ValidateResult, lint: LintConfig, node: NbtCollectionNode<NbtNode> | NbtCompoundNode) {
        const open = node[GetFormattedOpen](lint)
        const close = node[GetFormattedClose](lint)
        ans.completions.push({
            label: `${open}${close}`,
            insertText: `${open}$1${close}`,
            insertTextFormat: InsertTextFormat.Snippet
        })
    }
    private completeByteArrayField(ans: ValidateResult, { config: { lint } }: ParsingContext, _doc: ByteArrayDoc) {
        this.completeOpenCloseField(ans, lint, new NbtByteArrayNode(null))
    }
    private completeCompoundField(ans: ValidateResult, { config: { lint } }: ParsingContext, _doc: CompoundDoc) {
        this.completeOpenCloseField(ans, lint, new NbtCompoundNode(null))
    }
    private completeIntArrayField(ans: ValidateResult, { config: { lint } }: ParsingContext, _doc: IntArrayDoc) {
        this.completeOpenCloseField(ans, lint, new NbtIntArrayNode(null))
    }
    private completeListField(ans: ValidateResult, { config: { lint } }: ParsingContext, _doc: ListDoc) {
        this.completeOpenCloseField(ans, lint, new NbtListNode(null))
    }
    private completeLongArrayField(ans: ValidateResult, { config: { lint } }: ParsingContext, _doc: LongArrayDoc) {
        this.completeOpenCloseField(ans, lint, new NbtLongArrayNode(null))
    }
    private completeBooleanField(ans: ValidateResult, ctx: ParsingContext, _doc: BooleanDoc) {
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
    completeCompoundFieldKeys(ans: ValidateResult, ctx: ParsingContext, tag: NbtCompoundNode, doc: CompoundDoc, currentType: 'always double' | 'always single' | null) {
        const existingKeys = Object.keys(tag)
        const clonedHelper = this.clone()
        const pool = clonedHelper
            .goCompound(doc.Compound)
            .readCompoundKeys()
            .filter(v => !existingKeys.includes(v))
        for (const key of pool) {
            const field = clonedHelper.readField(key)!
            const description = NbtdocHelper.handleDescription(field.description)
            let insertText: string
            if (currentType) {
                insertText = quoteString(key, currentType, true).slice(1, -1)
            } else {
                const quoteType = ctx.config.lint.nbtCompoundKeyQuoteType ? ctx.config.lint.nbtCompoundKeyQuoteType[1] : 'prefer double'
                const quote = ctx.config.lint.nbtCompoundKeyQuote ? ctx.config.lint.nbtCompoundKeyQuote[1] : false
                insertText = quoteString(key, quoteType, quote)
            }
            ans.completions.push({
                label: key, insertText,
                kind: CompletionItemKind.Property,
                detail: NbtdocHelper.localeType(NbtdocHelper.getValueType(field.nbttype)),
                /* istanbul ignore next */
                ...description ? { documentation: description } : {}
            })
        }
    }
    private completeEnumField(ans: ValidateResult, ctx: ParsingContext, doc: EnumDoc) {
        const { et } = this
            .goEnum(doc.Enum)
            .readEnum()
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
    private completeIdField(ans: ValidateResult, ctx: ParsingContext, doc: IdDoc, isPredicate: boolean) {
        const subCtx = { ...ctx, cursor: 0 }
        const reader = new StringReader('')
        const result = ctx.parsers.get('Identity', [
            NbtdocHelper.getIdentityTypeFromRegistry(doc.Id), false, isPredicate
        ]).parse(reader, subCtx)
        for (const com of result.completions) {
            ans.completions.push({
                ...com,
                label: NbtdocHelper.getFormattedString(ctx.config.lint, 'String', com.label)
            })
        }
    }
    private completeStringField(ans: ValidateResult, ctx: ParsingContext, _doc: StringDoc, _isPredicate: boolean, description: string) {
        const subCtx = { ...ctx, cursor: 0 }
        const reader = new StringReader('')
        const result = this.validateInnerString(reader, subCtx, description)
        if (result && result.completions) {
            for (const com of result.completions) {
                ans.completions.push({
                    ...com,
                    label: NbtdocHelper.getFormattedString(ctx.config.lint, 'String', com.label),
                    ...com.insertText ? { insertText: NbtdocHelper.getFormattedString(ctx.config.lint, 'String', com.insertText) } : {}
                })
            }
        }
    }

    validateField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: nbtdoc.NbtValue | null, isPredicate: boolean, description: string) {
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
    private validateNbtNodeType(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, expected: NbtNodeTypeName, isPredicate: boolean) {
        const config = ctx.config.lint.nbtTypeCheck
        const actual = tag[NbtNodeType]
        const isLooselyMatched = isNbtNodeTypeLooselyMatched(actual, expected)
        if (
            !isLooselyMatched ||
            ((isPredicate || (config && config[1] === 'strictly')) && !isNbtNodeTypeStrictlyMatched(actual, expected))
        ) {
            //#region Action codes of converting to similar types
            let code: ActionCode | undefined = undefined
            if (actual === 'Byte' || actual === 'Short' || actual === 'Int' || actual === 'Long' || actual === 'Float' || actual === 'Double') {
                if (expected === 'Byte') code = ActionCode.NbtTypeToByte
                else if (expected === 'Short') code = ActionCode.NbtTypeToShort
                else if (expected === 'Int') code = ActionCode.NbtTypeToInt
                else if (expected === 'Long') code = ActionCode.NbtTypeToLong
                else if (expected === 'Float') code = ActionCode.NbtTypeToFloat
                else if (expected === 'Double') code = ActionCode.NbtTypeToDouble
            } else if (actual === 'ByteArray' || actual === 'IntArray' || actual === 'LongArray' || actual === 'List') {
                if (expected === 'ByteArray') code = ActionCode.NbtTypeToByteArray
                else if (expected === 'IntArray') code = ActionCode.NbtTypeToIntArray
                else if (expected === 'LongArray') code = ActionCode.NbtTypeToLongArray
                else if (expected === 'List') code = ActionCode.NbtTypeToList
            }
            //#endregion
            //#region UUID datafix: #377
            if (expected === 'IntArray' && actual === 'String') {
                code = ActionCode.NbtUuidDatafixString
            } else if (expected === 'IntArray' && actual === 'Compound') {
                code = ActionCode.NbtUuidDatafixCompound
            }
            //#endregion
            ans.errors.push(new ParsingError(
                tag[NodeRange],
                locale('expected-got', locale(`nbt-tag.${expected}`), locale(`nbt-tag.${actual}`)),
                true, getDiagnosticSeverity(config ? config[0] : 'warning'), code
            ))
        }
        return isLooselyMatched
    }

    private validateCollectionLength(ans: ValidateResult, _ctx: ParsingContext, tag: NbtCollectionNode<any>, [min, max]: [number, number], _isPredicate: boolean) {
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

    private validateNumberArrayField(ans: ValidateResult, ctx: ParsingContext, tag: NbtArrayNode<NbtNumberNode<number | bigint>>, { length_range: lengthRange, value_range: valueRange }: nbtdoc.NumberArrayTag, isPredicate: boolean, description: string) {
        if (lengthRange) {
            this.validateCollectionLength(ans, ctx, tag, lengthRange, isPredicate)
        }
        if (valueRange) {
            for (const item of tag) {
                this.validateNumberField(ans, ctx, item, valueRange, isPredicate, description)
            }
        }
    }

    private validateNumberField(ans: ValidateResult, _ctx: ParsingContext, tag: NbtNumberNode<number | bigint>, range: [number, number] | null, _isPredicate: boolean, description: string) {
        // Cache.
        /// Color information.
        if (description.match(/RED << 16 \| GREEN << 8 \| BLUE/i)) {
            const num = Number(tag.valueOf())
            const r = ((num >> 16) & 255) / 255
            const g = ((num >> 8) & 255) / 255
            const b = (num & 255) / 255
            ans.cache.colors = {
                [`${r} ${g} ${b} 1`]: { def: [], ref: [tag[NodeRange]] }
            }
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

    public isInheritFromItemBase(doc: nbtdoc.CompoundTag | null): boolean {
        if (!doc) {
            return false
        }
        if (doc.fields.hasOwnProperty('CustomModelData')) {
            return true
        }
        return this.isInheritFromItemBase(this.clone().goSupers(doc.supers).readCompound())
    }

    private validateCompoundDoc(ans: ValidateResult, ctx: ParsingContext, tag: NbtCompoundNode, doc: nbtdoc.CompoundTag | null, isPredicate: boolean) {
        if (doc) {
            for (const key in tag) {
                /* istanbul ignore else */
                if (tag.hasOwnProperty(key)) {
                    const childTag = tag[key]
                    const field = this.readField(key)
                    if (field) {
                        // Hover information.
                        tag[Keys][key][NodeDescription] = NbtdocHelper.getKeyDescription(field.nbttype, field.description)
                        this.validateField(ans, ctx, childTag, field.nbttype, isPredicate, NbtdocHelper.handleDescription(field.description))
                    } else {
                        // Errors.
                        if (!this.isInheritFromItemBase(doc)) {
                            let code: ActionCode | undefined
                            //#region UUID datafix: #377
                            if (['ConversionPlayerLeast', 'ConversionPlayerMost', 'UUIDLeast', 'UUIDMost', 'LoveCauseLeast', 'LoveCauseMost', 'OwnerUUID', 'OwnerUUIDLeast', 'OwnerUUIDMost', 'target_uuid', 'TrustedUUIDs'].includes(key)) {
                                code = ActionCode.NbtUuidDatafixUnknownKey
                            }
                            //#endregion
                            ans.errors.push(new ParsingError(
                                tag[Keys][key][NodeRange],
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
                const quote = lint.nbtStringQuote ? lint.nbtStringQuote[1] : true
                const quoteType = lint.nbtStringQuoteType ? lint.nbtStringQuoteType[1] : 'prefer double'
                const raw = quoteString(value.toString(), quoteType, quote)
                tag = new NbtStringNode(null, value as string, raw, {})
                break
        }
        return tag[GetFormattedString](lint)
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

    private validateBooleanField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, _doc: BooleanDoc, isPredicate: boolean): void {
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
                const code = expectedLiteral ? ActionCode.NbtByteToLiteral : ActionCode.NbtByteToNumber
                if (isBooleanLiteral !== expectedLiteral) {
                    ans.errors.push(new ParsingError(
                        tag[NodeRange], message, undefined,
                        getDiagnosticSeverity(severity), code
                    ))
                }
            }
        }
    }
    private validateByteArrayField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: ByteArrayDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'ByteArray', isPredicate)
        if (shouldValidate) {
            this.validateNumberArrayField(ans, ctx, tag as NbtByteArrayNode, doc.ByteArray, isPredicate, '')
        }
    }
    private validateByteField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: ByteDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Byte', isPredicate)
        if (shouldValidate) {
            this.validateNumberField(ans, ctx, tag as NbtByteNode, doc.Byte.range, isPredicate, '')
        }
    }
    private validateCompoundField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: CompoundDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Compound', isPredicate)
        if (shouldValidate) {
            const compoundTag: NbtCompoundNode = tag as any
            const clonedHelpler = this.clone()
            const compoundDoc = clonedHelpler
                .goCompound(doc.Compound)
                .readCompound()
            clonedHelpler
                .withTag(compoundTag)
                .validateCompoundDoc(ans, ctx, compoundTag, compoundDoc, isPredicate)
        }
    }
    private validateDoubleField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: DoubleDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Double', isPredicate)
        if (shouldValidate) {
            this.validateNumberField(ans, ctx, tag as NbtDoubleNode, doc.Double.range, isPredicate, '')
        }
    }
    private validateEnumField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: EnumDoc, isPredicate: boolean): void {
        const { description, et } = this
            .goEnum(doc.Enum)
            .readEnum()
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
    private validateFloatField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: FloatDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Float', isPredicate)
        if (shouldValidate) {
            this.validateNumberField(ans, ctx, tag as NbtFloatNode, doc.Float.range, isPredicate, '')
        }
    }
    // https://github.com/SPGoding/datapack-language-server/issues/332#issuecomment-590168655
    /* istanbul ignore next */
    private static getIdentityTypeFromRegistry(registry: string) {
        switch (registry) {
            case 'minecraft:block':
            case 'minecraft:enchantment':
            case 'minecraft:item':
            case 'minecraft:motive':
            case 'minecraft:potion':
            case 'minecraft:villager_profession':
            case 'minecraft:villager_type':
                return registry
            case 'minecraft:attribute':
                return 'minecraft:attributes'
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
    private validateIdField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: IdDoc, isPredicate: boolean): void {
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
                        error.code = ActionCode.NbtStringAttributeDatafix
                    }
                }
            }
            //#endregion
            this.combineResult(ans, result, strTag)
            /// Quotes.
            ans.errors.push(...validateStringQuote(
                strTag.toString(), strTag.valueOf(), tag[NodeRange],
                ctx.config.lint.nbtStringQuote, ctx.config.lint.nbtStringQuoteType
            ))
        }
    }
    private validateIndexField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: IndexDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Compound', isPredicate)
        if (shouldValidate) {
            const compoundTag = tag as NbtCompoundNode
            const clonedHelper = this
                .clone()
                .withTag(compoundTag)
            const idTag = clonedHelper.resolveFieldPath(doc.Index.path)
            /* istanbul ignore next */
            const id = idTag ? IdentityNode.fromString(idTag.valueOf()).toString() : null
            let compoundDoc: nbtdoc.CompoundTag | null = null
            if (doc.Index.target.startsWith('custom:')) {
                /* istanbul ignore else */
                if (id) {
                    // TODO: support custom Index targets.
                    // switch (doc.Index.target) {
                    //     case 'custom:blockitemstates':

                    //         break
                    //     case 'custom:blockstates':
                    //         const blockDef = ctx.blocks[id]
                    //         const properties = blockDef ? blockDef.properties : undefined
                    //         if (properties) {
                    //             compoundDoc = { description: '', fields: {}, supers: null }
                    //             for (const key in properties) {
                    //                 if (properties.hasOwnProperty(key)) {
                    //                     const property = properties[key]
                    //                     compoundDoc.fields[key] = {
                    //                         description: '',
                    //                         nbttype: {
                    //                             Enum: NbtdocHelper.MockEnumIndex
                    //                         }
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //         break
                    //     case 'custom:spawnitemtag':
                    //     case 'custom:spawnitementag':

                    //         break
                    //     default:
                    //         console.error(`Unknown nbtdoc target registry ${doc.Index.target}`)
                    //         break
                    // }
                }
            } else {
                compoundDoc = clonedHelper
                    .goRegistryCompound(doc.Index.target, id)
                    .readCompound()
            }
            /* istanbul ignore else */
            if (compoundDoc) {
                clonedHelper.validateCompoundDoc(ans, ctx, compoundTag, compoundDoc, isPredicate)
            }
        }
    }
    private validateIntArrayField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: IntArrayDoc, isPredicate: boolean, description: string): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'IntArray', isPredicate)
        if (shouldValidate) {
            this.validateNumberArrayField(ans, ctx, tag as NbtIntArrayNode, doc.IntArray, isPredicate, description)
        }
    }
    private validateIntField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: IntDoc, isPredicate: boolean, description: string): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Int', isPredicate)
        if (shouldValidate) {
            this.validateNumberField(ans, ctx, tag as NbtIntNode, doc.Int.range, isPredicate, description)
        }
    }
    private validateListField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: ListDoc, isPredicate: boolean, description: string): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'List', isPredicate)
        if (shouldValidate) {
            const { length_range: lengthRange, value_type: valueType } = doc.List
            if (lengthRange) {
                this.validateCollectionLength(ans, ctx, tag as NbtListNode<NbtNode>, lengthRange, isPredicate)
            }
            for (const item of tag as NbtListNode<NbtNode>) {
                this.validateField(ans, ctx, item, valueType, isPredicate, description)
            }
        }
    }
    private validateLongArrayField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: LongArrayDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'LongArray', isPredicate)
        if (shouldValidate) {
            this.validateNumberArrayField(ans, ctx, tag as NbtLongArrayNode, doc.LongArray, isPredicate, '')
        }
    }
    private validateLongField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: LongDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Long', isPredicate)
        if (shouldValidate) {
            this.validateNumberField(ans, ctx, tag as NbtLongNode, doc.Long.range, isPredicate, '')
        }
    }
    private validateOrField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: OrDoc, isPredicate: boolean, description: string): void {
        for (let i = 0; i < doc.Or.length; i++) {
            const childDoc = doc.Or[i]
            const childAns: ValidateResult = { cache: {}, completions: [], errors: [] }
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
    private validateShortField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, doc: ShortDoc, isPredicate: boolean): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Short', isPredicate)
        if (shouldValidate) {
            this.validateNumberField(ans, ctx, tag as NbtShortNode, doc.Short.range, isPredicate, '')
        }
    }
    private validateStringField(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, isPredicate: boolean, description: string): void {
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'String', isPredicate)
        if (shouldValidate) {
            // Errors.
            /// Special cases: https://github.com/SPGoding/datapack-language-server/issues/332#issuecomment-590167678.
            const strTag = tag as NbtStringNode
            const subCtx = { ...ctx, cursor: getInnerIndex(strTag.mapping, ctx.cursor) }
            const reader = new StringReader(strTag.valueOf())
            const result = this.validateInnerString(reader, subCtx, description)
            this.combineResult(ans, result, strTag)
            /// Quotes.
            ans.errors.push(...validateStringQuote(
                strTag.toString(), strTag.valueOf(), tag[NodeRange],
                ctx.config.lint.nbtStringQuote, ctx.config.lint.nbtStringQuoteType
            ))
        }
    }

    /* istanbul ignore next */
    private validateInnerString(reader: StringReader, ctx: ParsingContext, description: string) {
        let result: ValidateResultLike | undefined = undefined
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

    private combineResult(ans: ValidateResult, result: { cache?: ClientCache | undefined, errors?: ParsingError[] | undefined, completions?: CompletionItem[] } | undefined, tag: NbtStringNode) {
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
        }
    }

    static isRegistrySupers(supers: Supers): supers is RegistrySupers {
        return (supers as RegistrySupers).Registry !== undefined
    }
    static isBooleanDoc(doc: nbtdoc.NbtValue): doc is BooleanDoc {
        return doc === 'Boolean'
    }
    static isByteDoc(doc: nbtdoc.NbtValue): doc is ByteDoc {
        return (doc as any).Byte !== undefined
    }
    static isShortDoc(doc: nbtdoc.NbtValue): doc is ShortDoc {
        return (doc as any).Short !== undefined
    }
    static isIntDoc(doc: nbtdoc.NbtValue): doc is IntDoc {
        return (doc as any).Int !== undefined
    }
    static isLongDoc(doc: nbtdoc.NbtValue): doc is LongDoc {
        return (doc as any).Long !== undefined
    }
    static isFloatDoc(doc: nbtdoc.NbtValue): doc is FloatDoc {
        return (doc as any).Float !== undefined
    }
    static isDoubleDoc(doc: nbtdoc.NbtValue): doc is DoubleDoc {
        return (doc as any).Double !== undefined
    }
    static isStringDoc(doc: nbtdoc.NbtValue): doc is StringDoc {
        return doc === 'String'
    }
    static isByteArrayDoc(doc: nbtdoc.NbtValue): doc is ByteArrayDoc {
        return (doc as any).ByteArray !== undefined
    }
    static isIntArrayDoc(doc: nbtdoc.NbtValue): doc is IntArrayDoc {
        return (doc as any).IntArray !== undefined
    }
    static isLongArrayDoc(doc: nbtdoc.NbtValue): doc is LongArrayDoc {
        return (doc as any).LongArray !== undefined
    }
    static isCompoundDoc(doc: nbtdoc.NbtValue): doc is CompoundDoc {
        return (doc as any).Compound !== undefined
    }
    static isEnumDoc(doc: nbtdoc.NbtValue): doc is EnumDoc {
        return (doc as any).Enum !== undefined
    }
    static isListDoc(doc: nbtdoc.NbtValue): doc is ListDoc {
        return (doc as any).List !== undefined
    }
    static isIndexDoc(doc: nbtdoc.NbtValue): doc is IndexDoc {
        return (doc as any).Index !== undefined
    }
    static isIdDoc(doc: nbtdoc.NbtValue): doc is IdDoc {
        return (doc as any).Id !== undefined
    }
    static isOrDoc(doc: nbtdoc.NbtValue): doc is OrDoc {
        return (doc as any).Or !== undefined
    }

    static moveToChildIfNeeded(helper: NbtdocHelper | undefined, doc: nbtdoc.NbtValue | undefined) {
        if (helper && doc && NbtdocHelper.isCompoundDoc(doc)) {
            return helper.clone().goCompound(doc.Compound)
        }
        return helper
    }

    static getKeyDescription(value: nbtdoc.NbtValue, description: string) {
        return `${NbtdocHelper.localeType(NbtdocHelper.getValueType(value))
            }\n* * * * * *\n${
            NbtdocHelper.handleDescription(description)}`
    }
}
