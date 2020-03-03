import { CompletionItem, DiagnosticSeverity } from 'vscode-languageserver'
import { ClientCache, offsetCachePosition } from '../types/ClientCache'
import { nbtdoc } from '../types/nbtdoc'
import { NbtTagTypeName, NbtTag, NbtEnclosingCompound, isNbtCompoundTag, NbtCompoundTag } from '../types/NbtTag'
import clone = require('clone')
import LineParser from '../parsers/LineParser'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from './StringReader'

type SuggestionNode =
    | string
    | DocedSuggestionNode
    | ParserSuggestionNode
type DocedSuggestionNode = { description?: string, value?: string }
type ParserSuggestionNode = { parser: string, params?: any }
type Variables = { isPredicate: boolean }

type RegistryType = 'minecraft:block' | 'minecraft:entity' | 'minecraft:item'

export default class NbtdocHelper {
    private compoundIndex: nbtdoc.Index<nbtdoc.CompoundTag> | null
    private enumIndex: nbtdoc.Index<nbtdoc.EnumItem>
    private moduleIndex: nbtdoc.Index<nbtdoc.Module>

    constructor(private readonly doc: nbtdoc.Root) { }

    clone() {
        return new NbtdocHelper(this.doc)
            .setCompoundIndex(this.compoundIndex)
            .setEnumIndex(this.enumIndex)
            .setModuleIndex(this.moduleIndex)
    }

    setCompoundIndex(index: nbtdoc.Index<nbtdoc.CompoundTag> | null) {
        this.compoundIndex = index
        return this
    }

    setEnumIndex(index: nbtdoc.Index<nbtdoc.EnumItem>) {
        this.enumIndex = index
        return this
    }

    setModuleIndex(index: nbtdoc.Index<nbtdoc.Module>) {
        this.moduleIndex = index
        return this
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

    goCompound(key: string) {

    }

    readCompound(): nbtdoc.CompoundTag {
        if (this.compoundIndex === null) {
            return { description: '', fields: {}, supers: null }
        }
        return this.doc.compound_arena[this.compoundIndex]
    }

    readCompoundSupers(supers: (
        { Compound: nbtdoc.Index<nbtdoc.CompoundTag> } |
        { Registry: { target: string, path: nbtdoc.FieldPath[] } } | null
    ), tag: NbtTag | null): nbtdoc.CompoundTag | null {
        if (supers === null) {
            return supers
        } else if ((supers as any).Registry) {
            const registry: { target: string, path: nbtdoc.FieldPath[] } = (supers as any).Registry
            const id = this.resolveFieldPath(registry.path, tag)
            return this
                .goRegistryCompound(registry.target as RegistryType, id ? id.toString() : null)
                .readCompound()
        } else {
            const index: nbtdoc.Index<nbtdoc.CompoundTag> = (supers as any).Command
            return this
                .setCompoundIndex(index)
                .readCompound()
        }
    }

    resolveFieldPath(paths: nbtdoc.FieldPath[], tag: NbtTag | null): null | NbtTag {
        while (paths.length) {
            if (!tag) {
                break
            }
            const path = paths.shift()!
            if (path === 'Super') {
                tag = tag[NbtEnclosingCompound]
            } else {
                const key = path.Child
                if (isNbtCompoundTag(tag)) {
                    return tag[key]
                } else {
                    break
                }
            }
        }
        return null
    }

    readCompoundKeys(tag: NbtTag | null): string[] {
        const doc = this.readCompound()
        return [
            ...Object.keys(doc),
            ...this.clone().readCompoundSupers(doc.supers, tag).readCompoundKeys()
        ]
    }

    readEnum(): nbtdoc.EnumItem {
        return this.doc.enum_arena[this.enumIndex]
    }

    readModule(): nbtdoc.Module {
        return this.doc.module_arena[this.moduleIndex]
    }

    getParserResult(reader: StringReader, ctx: ParsingContext, variables: Variables = { isPredicate: false }): { completions: CompletionItem[], errors: ParsingError[], cache: ClientCache } {
        const isParserNode =
            (value: any): value is ParserSuggestionNode => typeof value.parser === 'string'
        const ans: { completions: CompletionItem[], errors: ParsingError[], cache: ClientCache } = { completions: [], errors: [], cache: {} }
        const suggestions: SuggestionNode[] = this.read().suggestions ? this.read().suggestions as SuggestionNode[] : []
        suggestions.forEach(
            v => {
                if (typeof v === 'string') {
                    if (reader.cursor === ctx.cursor) {
                        ans.completions.push({ label: v })
                    }
                } else if (isParserNode(v)) {
                    const out = { cursor: ctx.cursor }
                    const subReader = new StringReader(reader.readString(out))
                    const offset = ctx.cursor - out.cursor

                    // Replace variables in v.params.
                    /* istanbul ignore next */
                    if (v.params) {
                        const bakParams = [...v.params]
                        v.params = []
                        for (const variable in variables) {
                            /* istanbul ignore next */
                            if (variables.hasOwnProperty(variable)) {
                                for (const param of bakParams) {
                                    if (param === `%${variable}%`) {
                                        v.params.push(variables[variable as keyof Variables])
                                    } else {
                                        v.params.push(param)
                                    }
                                }
                            }
                        }
                    }

                    if (v.parser === '#') {
                        // LineParser
                        const parser = new LineParser(...v.params)
                        const { completions, errors, cache } = parser.parse(subReader, { ...ctx, cursor: out.cursor }).data
                        if (completions) {
                            ans.completions.push(...completions)
                        }
                        /* istanbul ignore next */
                        if (errors) {
                            ans.errors.push(...errors.map(
                                v => new ParsingError({
                                    start: v.range.start + offset,
                                    end: v.range.end + offset
                                }, v.message, true, DiagnosticSeverity.Hint)
                            ))
                        }
                        /* istanbul ignore next */
                        if (cache) {
                            offsetCachePosition(cache, offset)
                            ans.cache = cache
                        }
                    } else {
                        // Regular ArgumentParser
                        const parser = ctx.parsers.get(v.parser, v.params)
                        const { completions, errors, cache: resultCache } = parser.parse(subReader, { ...ctx, cursor: out.cursor })
                        ans.completions.push(...completions)
                        ans.errors.push(...errors.map(
                            v => new ParsingError({
                                start: v.range.start + offset,
                                end: v.range.end + offset
                            }, v.message, true, DiagnosticSeverity.Hint)
                        ))
                        offsetCachePosition(resultCache, offset)
                        ans.cache = resultCache
                    }
                } else {
                    if (reader.cursor === ctx.cursor) {
                        ans.completions.push({ label: v.value as string, documentation: v.description })
                    }
                }
            }
        )
        return ans
    }
}
