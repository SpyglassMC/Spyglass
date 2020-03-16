import { CompletionItem, DiagnosticSeverity } from 'vscode-languageserver'
import { ClientCache, offsetCachePosition } from '../types/ClientCache'
import { nbtdoc } from '../types/nbtdoc'
import LineParser from '../parsers/LineParser'
import ParsingContext from '../types/ParsingContext'
import ParsingError, { ActionCode } from '../types/ParsingError'
import StringReader from './StringReader'
import NbtNode, { SuperNbt, NbtNodeTypeName, NbtNodeType, isNbtNodeTypeStrictlyMatched, isNbtNodeTypeLooselyMatched } from '../types/nodes/nbt/NbtNode'
import NbtCompoundNode from '../types/nodes/map/NbtCompoundNode'
import NbtPrimitiveNode from '../types/nodes/nbt/NbtPrimitiveNode'
import TextRange from '../types/TextRange'
import NbtStringNode from '../types/nodes/nbt/NbtStringNode'
import Identity from '../types/Identity'
import { getDiagnosticSeverity } from '../types/StylisticConfig'
import { locale } from '../locales/Locales'
import { arrayToMessage, arrayToCompletions, validateStringQuote } from './utils'
import { NodeRange } from '../types/nodes/ArgumentNode'
import NbtArrayNode from '../types/nodes/nbt/NbtArrayNode'
import NbtCollectionNode from '../types/nodes/nbt/NbtCollectionNode'
import NbtNumberNode from '../types/nodes/nbt/NbtNumberNode'
import NbtByteArrayNode from '../types/nodes/nbt/NbtByteArrayNode'
import NbtIntArrayNode from '../types/nodes/nbt/NbtIntArrayNode'
import NbtLongArrayNode from '../types/nodes/nbt/NbtLongArrayNode'
import NbtByteNode from '../types/nodes/nbt/NbtByteNode'
import NbtShortNode from '../types/nodes/nbt/NbtShortNode'
import NbtLongNode from '../types/nodes/nbt/NbtLongNode'
import NbtDoubleNode from '../types/nodes/nbt/NbtDoubleNode'
import NbtFloatNode from '../types/nodes/nbt/NbtFloatNode'
import NbtIntNode from '../types/nodes/nbt/NbtIntNode'
import NbtListNode from '../types/nodes/nbt/NbtListNode'
import { Keys } from '../types/nodes/map/MapNode'

// type SuggestionNode =
//     | string
//     | DocedSuggestionNode
//     | ParserSuggestionNode
// type DocedSuggestionNode = { description?: string, value?: string }
// type ParserSuggestionNode = { parser: string, params?: any }
type Variables = { isPredicate: boolean }

type RegistryType = 'minecraft:block' | 'minecraft:entity' | 'minecraft:item'

type CompoundSupers = { Compound: nbtdoc.Index<nbtdoc.CompoundTag> }
type RegistrySupers = { Registry: { target: string, path: nbtdoc.FieldPath[] } }
type Supers = CompoundSupers | RegistrySupers | null

type ValidateResult = { completions: CompletionItem[], errors: ParsingError[], cache: ClientCache }

function isRegistrySupers(supers: Supers): supers is RegistrySupers {
    return (supers as RegistrySupers).Registry !== undefined
}

type BooleanDoc = 'Boolean'
function isBooleanDoc(doc: nbtdoc.NbtValue): doc is BooleanDoc {
    return doc === 'Boolean'
}

type ByteDoc = { Byte: nbtdoc.NumberTag }
function isByteDoc(doc: nbtdoc.NbtValue): doc is ByteDoc {
    return (doc as any).Byte !== undefined
}

type ShortDoc = { Short: nbtdoc.NumberTag }
function isShortDoc(doc: nbtdoc.NbtValue): doc is ShortDoc {
    return (doc as any).Short !== undefined
}

type IntDoc = { Int: nbtdoc.NumberTag }
function isIntDoc(doc: nbtdoc.NbtValue): doc is IntDoc {
    return (doc as any).Int !== undefined
}

type LongDoc = { Long: nbtdoc.NumberTag }
function isLongDoc(doc: nbtdoc.NbtValue): doc is LongDoc {
    return (doc as any).Long !== undefined
}

type FloatDoc = { Float: nbtdoc.NumberTag }
function isFloatDoc(doc: nbtdoc.NbtValue): doc is FloatDoc {
    return (doc as any).Float !== undefined
}

type DoubleDoc = { Double: nbtdoc.NumberTag }
function isDoubleDoc(doc: nbtdoc.NbtValue): doc is DoubleDoc {
    return (doc as any).Double !== undefined
}

type StringDoc = 'String'
function isStringDoc(doc: nbtdoc.NbtValue): doc is StringDoc {
    return doc === 'String'
}

type ByteArrayDoc = { ByteArray: nbtdoc.NumberArrayTag }
function isByteArrayDoc(doc: nbtdoc.NbtValue): doc is ByteArrayDoc {
    return (doc as any).ByteArray !== undefined
}

type IntArrayDoc = { IntArray: nbtdoc.NumberArrayTag }
function isIntArrayDoc(doc: nbtdoc.NbtValue): doc is IntArrayDoc {
    return (doc as any).IntArray !== undefined
}

type LongArrayDoc = { LongArray: nbtdoc.NumberArrayTag }
function isLongArrayDoc(doc: nbtdoc.NbtValue): doc is LongArrayDoc {
    return (doc as any).LongArray !== undefined
}

type CompoundDoc = { Compound: nbtdoc.Index<nbtdoc.CompoundTag> }
function isCompoundDoc(doc: nbtdoc.NbtValue): doc is CompoundDoc {
    return (doc as any).Compound !== undefined
}

type EnumDoc = { Enum: nbtdoc.Index<nbtdoc.EnumItem> }
function isEnumDoc(doc: nbtdoc.NbtValue): doc is EnumDoc {
    return (doc as any).Enum !== undefined
}

type ListDoc = { List: { length_range: [number, number] | null, value_type: nbtdoc.NbtValue } }
function isListDoc(doc: nbtdoc.NbtValue): doc is ListDoc {
    return (doc as any).List !== undefined
}

type IndexDoc = { Index: { target: string, path: nbtdoc.FieldPath[] } }
function isIndexDoc(doc: nbtdoc.NbtValue): doc is IndexDoc {
    return (doc as any).Index !== undefined
}

type IdDoc = { Id: string }
function isIdDoc(doc: nbtdoc.NbtValue): doc is IdDoc {
    return (doc as any).Id !== undefined
}

type OrDoc = { Or: nbtdoc.NbtValue[] }
function isOrDoc(doc: nbtdoc.NbtValue): doc is OrDoc {
    return (doc as any).Or !== undefined
}

export default class NbtdocHelper {
    private compoundIndex: nbtdoc.Index<nbtdoc.CompoundTag> | null
    private enumIndex: nbtdoc.Index<nbtdoc.EnumItem>
    private moduleIndex: nbtdoc.Index<nbtdoc.Module>
    private tag: NbtCompoundNode | null

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
        return this.doc.enum_arena[this.enumIndex]
    }

    readModule(): nbtdoc.Module {
        return this.doc.module_arena[this.moduleIndex]
    }

    goRegistryCompound(type: RegistryType, id: string | null) {
        const [registry, fallback] = this.doc.registries[type]
        if (id && registry[id] !== undefined) {
            this.compoundIndex = registry[id]
        } else {
            this.compoundIndex = fallback
        }
        return this
    }

    goSupers(supers: Supers) {
        if (supers === null) {
            this.goCompound(null)
        } else if (isRegistrySupers(supers)) {
            const id = this.resolveFieldPath(supers.Registry.path)
            this.goRegistryCompound(
                supers.Registry.target as RegistryType,
                id ? Identity.fromString(id.valueOf().toString()).toString() : null
            )
        } else {
            this.goCompound(supers.Compound)
        }
        return this
    }

    resolveFieldPath(paths: nbtdoc.FieldPath[]): NbtStringNode | null {
        let tag: NbtNode | null = this.tag
        while (paths.length > 0 && tag && tag instanceof NbtCompoundNode) {
            const path = paths.shift()!
            if (path === 'Super') {
                tag = tag[SuperNbt]
            } else {
                const key = path.Child
                tag = tag[key]
            }
            if (paths.length === 0) {
                if (tag && tag instanceof NbtStringNode) {
                    this.tag = tag[SuperNbt]
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
            ]
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

    validateField(ans: ValidateResult = { cache: {}, completions: [], errors: [] }, ctx: ParsingContext, tag: NbtNode, doc: nbtdoc.NbtValue | null, isPredicate: boolean): ValidateResult {
        if (doc) {
            if (isBooleanDoc(doc)) {
                ans = this.validateBooleanField(ctx, tag, doc, isPredicate)
            } else if (isByteArrayDoc(doc)) {
                ans = this.validateByteArrayField(ctx, tag, doc, isPredicate)
            } else if (isByteDoc(doc)) {
                ans = this.validateByteField(ctx, tag, doc, isPredicate)
            } else if (isCompoundDoc(doc)) {
                ans = this.validateCompoundField(ctx, tag, doc, isPredicate)
            } else if (isDoubleDoc(doc)) {
                ans = this.validateDoubleField(ctx, tag, doc, isPredicate)
            } else if (isEnumDoc(doc)) {
                ans = this.validateEnumField(ctx, tag, doc, isPredicate)
            } else if (isFloatDoc(doc)) {
                ans = this.validateFloatField(ctx, tag, doc, isPredicate)
            } else if (isIdDoc(doc)) {
                ans = this.validateIdField(ctx, tag, doc, isPredicate)
            } else if (isIndexDoc(doc)) {
                ans = this.validateIndexField(ctx, tag, doc, isPredicate)
            } else if (isIntArrayDoc(doc)) {
                ans = this.validateIntArrayField(ctx, tag, doc, isPredicate)
            } else if (isIntDoc(doc)) {
                ans = this.validateIntField(ctx, tag, doc, isPredicate)
            } else if (isListDoc(doc)) {
                ans = this.validateListField(ctx, tag, doc, isPredicate)
            } else if (isLongArrayDoc(doc)) {
                ans = this.validateLongArrayField(ctx, tag, doc, isPredicate)
            } else if (isLongDoc(doc)) {
                ans = this.validateLongField(ctx, tag, doc, isPredicate)
            } else if (isOrDoc(doc)) {
                ans = this.validateOrField(ctx, tag, doc, isPredicate)
            } else if (isShortDoc(doc)) {
                ans = this.validateShortField(ctx, tag, doc, isPredicate)
            } else {
                ans = this.validateStringField(ctx, tag, doc, isPredicate)
            }
        }
        return ans
    }

    /**
     * @returns If it matches loosely; whether or not should be furthermore validated.
     */
    private validateNbtNodeType(ans: ValidateResult, ctx: ParsingContext, tag: NbtNode, expected: NbtNodeTypeName, isPredicate: boolean) {
        const config = ctx.config.lint.nbtTypeCheck
        const actual = tag[NbtNodeType]
        const isLooselyMatched = isNbtNodeTypeLooselyMatched(actual, expected)
        if (config) {
            const [severity, value] = config
            if (
                !isLooselyMatched ||
                ((isPredicate || value === 'stirctly') && !isNbtNodeTypeStrictlyMatched(actual, expected))
            ) {
                let errorCode: ActionCode | undefined = undefined
                if (expected === 'Byte') errorCode = ActionCode.NbtTypeToByte
                else if (expected === 'Short') errorCode = ActionCode.NbtTypeToShort
                else if (expected === 'Int') errorCode = ActionCode.NbtTypeToInt
                else if (expected === 'Long') errorCode = ActionCode.NbtTypeToLong
                else if (expected === 'Float') errorCode = ActionCode.NbtTypeToFloat
                else if (expected === 'Double') errorCode = ActionCode.NbtTypeToDouble
                ans.errors.push(new ParsingError(
                    tag[NodeRange],
                    locale('expected-got', locale(`nbt-tag.${expected}`), locale(`nbt-tag.${actual}`)),
                    true, getDiagnosticSeverity(severity), errorCode
                ))
            }
        }
        return isLooselyMatched
    }

    private validateCollectionLength(ans: ValidateResult, _ctx: ParsingContext, tag: NbtCollectionNode<any>, [min, max]: [number, number], _isPredicate: boolean) {
        if (tag.length < min) {
            ans.errors.push(new ParsingError(
                tag[NodeRange],
                locale('expected', locale('collection-length.>=', min)),
                true, DiagnosticSeverity.Warning
            ))
        } else if (tag.length > max) {
            ans.errors.push(new ParsingError(
                tag[NodeRange],
                locale('expected', locale('collection-length.<=', max)),
                true, DiagnosticSeverity.Warning
            ))
        }
    }

    private validateNumberArrayField(ans: ValidateResult, _ctx: ParsingContext, tag: NbtArrayNode<NbtNumberNode<number | bigint>>, { length_range: lengthRange, value_range: valueRange }: nbtdoc.NumberArrayTag, _isPredicate: boolean) {
        if (lengthRange) {
            this.validateCollectionLength(ans, _ctx, tag, lengthRange, _isPredicate)
        }
        if (valueRange) {
            for (const item of tag) {
                this.validateNumberField(ans, _ctx, item, valueRange, _isPredicate)
            }
        }
    }

    private validateNumberField(ans: ValidateResult, _ctx: ParsingContext, tag: NbtNumberNode<number | bigint>, [min, max]: [number, number], _isPredicate: boolean) {
        if (tag.valueOf() < min) {
            ans.errors.push(new ParsingError(
                tag[NodeRange],
                locale('expected-got', locale('number.>=', min), tag.valueOf()),
                true, DiagnosticSeverity.Warning
            ))
        } else if (tag.valueOf() > max) {
            ans.errors.push(new ParsingError(
                tag[NodeRange],
                locale('expected-got', locale('number.<=', max), tag.valueOf()),
                true, DiagnosticSeverity.Warning
            ))
        }
    }

    private validateBooleanField(ctx: ParsingContext, tag: NbtNode, _doc: BooleanDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Byte', isPredicate)
        const config = ctx.config.lint.nbtBoolean
        // Completions.
        if (tag[NodeRange].start === ctx.cursor && (!config || config[1])) {
            ans.completions.push(...arrayToCompletions(['false', 'true']))
        }
        // Errors.
        if (shouldValidate) {
            if (config) {
                const actualString = tag.toString()
                const isBooleanLiteral = /^true|false$/i.test(actualString)
                const [severity, expectedLiteral] = config
                if (isBooleanLiteral !== expectedLiteral) {
                    ans.errors.push(new ParsingError(
                        tag[NodeRange],
                        locale('expected-got', arrayToMessage(['false', 'true'], true, 'or'), locale('punc.quote', actualString)),
                        true, getDiagnosticSeverity(severity), expectedLiteral ? ActionCode.NbtByteToLiteral : ActionCode.NbtByteToNumber
                    ))
                }
            }
        }
        return ans
    }
    private validateByteArrayField(ctx: ParsingContext, tag: NbtNode, doc: ByteArrayDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'ByteArray', isPredicate)
        if (shouldValidate) {
            this.validateNumberArrayField(ans, ctx, tag as NbtByteArrayNode, doc.ByteArray, isPredicate)
        }
        return ans
    }
    private validateByteField(ctx: ParsingContext, tag: NbtNode, doc: ByteDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Byte', isPredicate)
        if (shouldValidate && doc.Byte.range) {
            this.validateNumberField(ans, ctx, tag as NbtByteNode, doc.Byte.range, isPredicate)
        }
        return ans
    }
    private validateCompoundField(ctx: ParsingContext, tag: NbtNode, doc: CompoundDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Compound', isPredicate)
        if (shouldValidate) {
            const compoundTag: NbtCompoundNode = tag as any
            const clonedHelper = this
                .clone()
                .withTag(compoundTag)
                .goCompound(doc.Compound)
            const compoundDoc = clonedHelper.readCompound()
            if (compoundDoc) {
                for (const key in compoundTag) {
                    if (compoundTag.hasOwnProperty(key)) {
                        const childTag = compoundTag[key]
                        const field = clonedHelper.readField(key)
                        if (field) {
                            compoundTag[Keys][key].description = field.description
                            clonedHelper.validateField(ans, ctx, childTag, field.nbttype, isPredicate)
                        } else {
                            if (ctx.config.lint.nbtCompoundCheckKeys) {
                                ans.errors.push(new ParsingError(
                                    tag[NodeRange],
                                    locale('unknown-key', locale('punc.quote', key)),
                                    true, getDiagnosticSeverity(ctx.config.lint.nbtCompoundCheckKeys[0])
                                ))
                            }
                        }
                    }
                }
            }
        }
        return ans
    }
    private validateDoubleField(ctx: ParsingContext, tag: NbtNode, doc: DoubleDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Double', isPredicate)
        if (shouldValidate && doc.Double.range) {
            this.validateNumberField(ans, ctx, tag as NbtDoubleNode, doc.Double.range, isPredicate)
        }
        return ans
    }
    private validateEnumField(ctx: ParsingContext, tag: NbtNode, doc: EnumDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Enum', isPredicate)
        if (shouldValidate) {
            // TODO

        }
        return ans
    }
    private validateFloatField(ctx: ParsingContext, tag: NbtNode, doc: FloatDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Float', isPredicate)
        if (shouldValidate && doc.Float.range) {
            this.validateNumberField(ans, ctx, tag as NbtFloatNode, doc.Float.range, isPredicate)
        }
        return ans
    }
    private validateIdField(ctx: ParsingContext, tag: NbtNode, doc: IdDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Id', isPredicate)
        if (shouldValidate) {
            // TODO

        }
        return ans
    }
    private validateIndexField(ctx: ParsingContext, tag: NbtNode, doc: IndexDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Index', isPredicate)
        if (shouldValidate) {
            // TODO

        }
        return ans
    }
    private validateIntArrayField(ctx: ParsingContext, tag: NbtNode, doc: IntArrayDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'IntArray', isPredicate)
        if (shouldValidate) {
            this.validateNumberArrayField(ans, ctx, tag as NbtIntArrayNode, doc.IntArray, isPredicate)
        }
        return ans
    }
    private validateIntField(ctx: ParsingContext, tag: NbtNode, doc: IntDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Int', isPredicate)
        if (shouldValidate && doc.Int.range) {
            this.validateNumberField(ans, ctx, tag as NbtIntNode, doc.Int.range, isPredicate)
        }
        return ans
    }
    private validateListField(ctx: ParsingContext, tag: NbtNode, doc: ListDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'List', isPredicate)
        if (shouldValidate) {
            const { length_range: lengthRange, value_type: valueType } = doc.List
            if (lengthRange) {
                this.validateCollectionLength(ans, ctx, tag as NbtListNode<NbtNode>, lengthRange, isPredicate)
            }
            for (const item of tag as NbtListNode<NbtNode>) {
                this.validateField(ans, ctx, item, valueType, isPredicate)
            }
        }
        return ans
    }
    private validateLongArrayField(ctx: ParsingContext, tag: NbtNode, doc: LongArrayDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'LongArray', isPredicate)
        if (shouldValidate) {
            this.validateNumberArrayField(ans, ctx, tag as NbtLongArrayNode, doc.LongArray, isPredicate)
        }
        return ans
    }
    private validateLongField(ctx: ParsingContext, tag: NbtNode, doc: LongDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Long', isPredicate)
        if (shouldValidate && doc.Long.range) {
            this.validateNumberField(ans, ctx, tag as NbtLongNode, doc.Long.range, isPredicate)
        }
        return ans
    }
    private validateOrField(ctx: ParsingContext, tag: NbtNode, doc: OrDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Or', isPredicate)
        if (shouldValidate) {
            // TODO

        }
        return ans
    }
    private validateShortField(ctx: ParsingContext, tag: NbtNode, doc: ShortDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'Short', isPredicate)
        if (shouldValidate && doc.Short.range) {
            this.validateNumberField(ans, ctx, tag as NbtShortNode, doc.Short.range, isPredicate)
        }
        return ans
    }
    private validateStringField(ctx: ParsingContext, tag: NbtNode, doc: StringDoc, isPredicate: boolean): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        const shouldValidate = this.validateNbtNodeType(ans, ctx, tag, 'String', isPredicate)
        if (shouldValidate) {
            // Completions.
            // TODO
            // Redirect to argument parser.

            // Errors.
            const strTag = tag as NbtStringNode
            ans.errors = validateStringQuote(strTag.toString(), strTag.valueOf(), tag[NodeRange], ctx.config.lint.nbtStringQuote, ctx.config.lint.nbtStringQuoteType)
        }
        return ans
    }

    // getParserResult(reader: StringReader, ctx: ParsingContext, variables: Variables = { isPredicate: false }): { completions: CompletionItem[], errors: ParsingError[], cache: ClientCache } {
    //     const isParserNode =
    //         (value: any): value is ParserSuggestionNode => typeof value.parser === 'string'
    //     const ans: { completions: CompletionItem[], errors: ParsingError[], cache: ClientCache } = { completions: [], errors: [], cache: {} }
    //     const suggestions: SuggestionNode[] = this.readField().suggestions ? this.readField().suggestions as SuggestionNode[] : []
    //     suggestions.forEach(
    //         v => {
    //             if (typeof v === 'string') {
    //                 if (reader.cursor === ctx.cursor) {
    //                     ans.completions.push({ label: v })
    //                 }
    //             } else if (isParserNode(v)) {
    //                 const out = { cursor: ctx.cursor }
    //                 const subReader = new StringReader(reader.readString(out))
    //                 const offset = ctx.cursor - out.cursor

    //                 // Replace variables in v.params.
    //                 /* istanbul ignore next */
    //                 if (v.params) {
    //                     const bakParams = [...v.params]
    //                     v.params = []
    //                     for (const variable in variables) {
    //                         /* istanbul ignore next */
    //                         if (variables.hasOwnProperty(variable)) {
    //                             for (const param of bakParams) {
    //                                 if (param === `%${variable}%`) {
    //                                     v.params.push(variables[variable as keyof Variables])
    //                                 } else {
    //                                     v.params.push(param)
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }

    //                 if (v.parser === '#') {
    //                     // LineParser
    //                     const parser = new LineParser(...v.params)
    //                     const { completions, errors, cache } = parser.parse(subReader, { ...ctx, cursor: out.cursor }).data
    //                     if (completions) {
    //                         ans.completions.push(...completions)
    //                     }
    //                     /* istanbul ignore next */
    //                     if (errors) {
    //                         ans.errors.push(...errors.map(
    //                             v => new ParsingError({
    //                                 start: v.range.start + offset,
    //                                 end: v.range.end + offset
    //                             }, v.message, true, DiagnosticSeverity.Hint)
    //                         ))
    //                     }
    //                     /* istanbul ignore next */
    //                     if (cache) {
    //                         offsetCachePosition(cache, offset)
    //                         ans.cache = cache
    //                     }
    //                 } else {
    //                     // Regular ArgumentParser
    //                     const parser = ctx.parsers.get(v.parser, v.params)
    //                     const { completions, errors, cache: resultCache } = parser.parse(subReader, { ...ctx, cursor: out.cursor })
    //                     ans.completions.push(...completions)
    //                     ans.errors.push(...errors.map(
    //                         v => new ParsingError({
    //                             start: v.range.start + offset,
    //                             end: v.range.end + offset
    //                         }, v.message, true, DiagnosticSeverity.Hint)
    //                     ))
    //                     offsetCachePosition(resultCache, offset)
    //                     ans.cache = resultCache
    //                 }
    //             } else {
    //                 if (reader.cursor === ctx.cursor) {
    //                     ans.completions.push({ label: v.value as string, documentation: v.description })
    //                 }
    //             }
    //         }
    //     )
    //     return ans
    // }
}
