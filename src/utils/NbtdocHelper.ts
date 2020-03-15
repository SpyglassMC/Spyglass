import { CompletionItem, DiagnosticSeverity } from 'vscode-languageserver'
import { ClientCache, offsetCachePosition } from '../types/ClientCache'
import { nbtdoc } from '../types/nbtdoc'
import LineParser from '../parsers/LineParser'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from './StringReader'
import NbtNode, { SuperNbt, NbtNodeTypeName, NbtNodeType } from '../types/nodes/nbt/NbtNode'
import NbtCompoundNode from '../types/nodes/map/NbtCompoundNode'
import NbtPrimitiveNode from '../types/nodes/nbt/NbtPrimitiveNode'
import TextRange from '../types/TextRange'
import NbtStringNode from '../types/nodes/nbt/NbtStringNode'
import Identity from '../types/Identity'

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

type LongDoc = {
    Long: nbtdoc.NumberTag
}
function isLongDoc(doc: nbtdoc.NbtValue): doc is LongDoc {
    return (doc as any).Long !== undefined
}

type FloatDoc = {
    Float: nbtdoc.NumberTag
}
function isFloatDoc(doc: nbtdoc.NbtValue): doc is FloatDoc {
    return (doc as any).Float !== undefined
}

type DoubleDoc = {
    Double: nbtdoc.NumberTag
}
function isDoubleDoc(doc: nbtdoc.NbtValue): doc is DoubleDoc {
    return (doc as any).Double !== undefined
}

type StringDoc = 'String'
function isStringDoc(doc: nbtdoc.NbtValue): doc is StringDoc {
    return doc === 'String'
}

type ByteArrayDoc = {
    ByteArray: nbtdoc.NumberArrayTag
}
function isByteArrayDoc(doc: nbtdoc.NbtValue): doc is ByteArrayDoc {
    return (doc as any).ByteArray !== undefined
}

type IntArrayDoc = {
    IntArray: nbtdoc.NumberArrayTag
}
function isIntArrayDoc(doc: nbtdoc.NbtValue): doc is IntArrayDoc {
    return (doc as any).IntArray !== undefined
}

type LongArrayDoc = {
    LongArray: nbtdoc.NumberArrayTag
}
function isLongArrayDoc(doc: nbtdoc.NbtValue): doc is LongArrayDoc {
    return (doc as any).LongArray !== undefined
}

type CompoundDoc = {
    Compound: nbtdoc.Index<nbtdoc.CompoundTag>
}
function isCompoundDoc(doc: nbtdoc.NbtValue): doc is CompoundDoc {
    return (doc as any).Compound !== undefined
}

type EnumDoc = {
    Enum: nbtdoc.Index<nbtdoc.EnumItem>
}
function isEnumDoc(doc: nbtdoc.NbtValue): doc is EnumDoc {
    return (doc as any).Enum !== undefined
}

type ListDoc = {
    List: {
        length_range: [number, number] | null,
        value_type: nbtdoc.NbtValue
    }
}
function isListDoc(doc: nbtdoc.NbtValue): doc is ListDoc {
    return (doc as any).List !== undefined
}

type IndexDoc = {
    Index: {
        target: string,
        path: nbtdoc.FieldPath[]
    }
}
function isIndexDoc(doc: nbtdoc.NbtValue): doc is IndexDoc {
    return (doc as any).Index !== undefined
}

type IdDoc = {
    Id: string
}
function isIdDoc(doc: nbtdoc.NbtValue): doc is IdDoc {
    return (doc as any).Id !== undefined
}

type OrDoc = {
    Or: nbtdoc.NbtValue[]
}
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

    validateField(range: TextRange, ctx: ParsingContext, tag: NbtNode, fieldDoc: nbtdoc.Field | null): ValidateResult {
        let ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        if (fieldDoc) {
            const doc = fieldDoc.nbttype
            if (isBooleanDoc(doc)) {
                ans = this.validateBooleanField(range, ctx, tag, doc)
            } else if (isByteArrayDoc(doc)) {
                ans = this.validateByteArrayField(range, ctx, tag, doc)
            } else if (isByteDoc(doc)) {
                ans = this.validateByteField(range, ctx, tag, doc)
            } else if (isCompoundDoc(doc)) {
                ans = this.validateCompoundField(range, ctx, tag, doc)
            } else if (isDoubleDoc(doc)) {
                ans = this.validateDoubleField(range, ctx, tag, doc)
            } else if (isEnumDoc(doc)) {
                ans = this.validateEnumField(range, ctx, tag, doc)
            } else if (isFloatDoc(doc)) {
                ans = this.validateFloatField(range, ctx, tag, doc)
            } else if (isIdDoc(doc)) {
                ans = this.validateIdField(range, ctx, tag, doc)
            } else if (isIndexDoc(doc)) {
                ans = this.validateIndexField(range, ctx, tag, doc)
            } else if (isIntArrayDoc(doc)) {
                ans = this.validateIntArrayField(range, ctx, tag, doc)
            } else if (isIntDoc(doc)) {
                ans = this.validateIntField(range, ctx, tag, doc)
            } else if (isListDoc(doc)) {
                ans = this.validateListField(range, ctx, tag, doc)
            } else if (isLongArrayDoc(doc)) {
                ans = this.validateLongArrayField(range, ctx, tag, doc)
            } else if (isLongDoc(doc)) {
                ans = this.validateLongField(range, ctx, tag, doc)
            } else if (isOrDoc(doc)) {
                ans = this.validateOrField(range, ctx, tag, doc)
            } else if (isShortDoc(doc)) {
                ans = this.validateShortField(range, ctx, tag, doc)
            } else {
                ans = this.validateStringField(range, ctx, tag, doc)
            }
        }
        return ans
    }

    private validateNbtNodeType(ans: ValidateResult, range: TextRange, _ctx: ParsingContext, tag: NbtNode, expected: NbtNodeTypeName) {
        const actual = tag[NbtNodeType]
        if (actual !== expected) {
            
        }
    }

    private validateBooleanField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: BooleanDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }



        return ans
    }
    private validateByteArrayField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: ByteArrayDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateByteField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: ByteDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateCompoundField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: CompoundDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateDoubleField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: DoubleDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateEnumField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: EnumDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateFloatField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: FloatDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateIdField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: IdDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateIndexField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: IndexDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateIntArrayField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: IntArrayDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateIntField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: IntDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateListField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: ListDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateLongArrayField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: LongArrayDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateLongField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: LongDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateOrField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: OrDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateShortField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: ShortDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
        return ans
    }
    private validateStringField(range: TextRange, ctx: ParsingContext, tag: NbtNode, doc: StringDoc): ValidateResult {
        const ans: ValidateResult = { cache: {}, completions: [], errors: [] }
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
