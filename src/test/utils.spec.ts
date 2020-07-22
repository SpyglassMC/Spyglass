import deepEqual from 'deep-equal'
import assert, { fail } from 'power-assert'
import { CompletionItem } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { ArgumentNode, NodeRange } from '../nodes'
import { ClientCache, Config, constructContext, LineArgumentNode, LineNode, ParserSuggestion, ParsingContext, ParsingError, TextRange, Token, VanillaConfig } from '../types'
import { StringReader } from '../utils/StringReader'
import { DatapackLanguageService } from '../services/DatapackLanguageService'

type Range = TextRange | [number, number]
type Object = { [key: string]: any }
type Callback<T> = (e: T) => T

function isTextRange(val: any): val is TextRange {
    return typeof val.start === 'number' && typeof val.end === 'number'
}

export function $<T extends ArgumentNode>(node: T, range: Range): T
export function $<T extends ArgumentNode>(node: T, range: Range, cb: Callback<T>): T
export function $<T extends ArgumentNode>(node: T, range: Range, addition: Object): T
export function $<T extends ArgumentNode>(node: T, range: Range, addition: Object, cb: Callback<T>): T
export function $<T extends ArgumentNode>(node: T, addition: Object): T
export function $<T extends ArgumentNode>(node: T, addition: Object, cb: Callback<T>): T
export function $<T extends ArgumentNode>(node: T, param1: Range | Object, param2?: Object | Callback<T>, param3?: Callback<T>) {
    let range: TextRange | undefined
    let addition: Object | undefined
    let cb: Callback<T> | undefined
    if (isTextRange(param1)) {
        range = param1
    } else if (param1 instanceof Array) {
        range = { start: param1[0], end: param1[1] }
    } else {
        addition = param1
    }
    if (param2 instanceof Function) {
        cb = param2
    } else if (param2) {
        addition = param2
    }
    if (param3 instanceof Function) {
        cb = param3
    }

    if (range) {
        node[NodeRange] = range
    }
    if (addition) {
        Object.assign(node, addition)
    }
    if (cb) {
        node = cb(node)
    }

    return node
}

interface ParsingContextMockOptions {
    config?: Config,
    uri?: string,
    version?: number,
    content?: string
}
export function mockParsingContext(options: ParsingContextMockOptions = {}): ParsingContext {
    return constructContext({
        config: options.config ?? VanillaConfig,
        textDoc: TextDocument.create(
            options.uri ?? 'dhp://document.mcfunction',
            'mcfunction',
            options.version ?? 0,
            options.content ?? '                                                                                                    '
        )
    })
}

interface LineNodeMockOptions {
    range?: TextRange,
    args?: LineArgumentNode<any>[],
    hint?: {
        fix: string[],
        options: [string, string[]][]
    },
    tokens?: Token[],
    cache?: ClientCache,
    errors?: ParsingError[],
    completions?: ParserSuggestion[]
}
export function mockLineNode(node: LineNodeMockOptions = {}): LineNode {
    return {
        [NodeRange]: node.range ?? { start: NaN, end: NaN },
        args: node.args ?? [],
        hint: node.hint ?? { fix: [], options: [] },
        tokens: node.tokens ?? [],
        cache: node.cache,
        errors: node.errors,
        completions: node.completions
    }
}

interface CompletionPredicate extends CompletionItem {
    t: string
}

export function assertCompletions(string: string | StringReader, completions: ParserSuggestion[] | undefined, predicates: CompletionPredicate[] = []) {
    assert(completions?.length === predicates.length)
    if (completions.length === 0) {
        return
    }
    if (string instanceof StringReader) {
        string = string.string
    }
    const getInsertText = (completion: CompletionItem) => completion.insertText ?? completion.label
    const getCompletionItemForAssert = (completion: CompletionItem) => {
        const ans = { ...completion } as any
        delete ans.insertText; delete ans.start; delete ans.end; delete ans.t
        return ans
    }
    for (const [i, completion] of completions?.entries()) {
        const resolvedTexts: string[] = []
        let matched = false
        for (const predicate of predicates.filter(p => p.label === completion.label)) {
            const resolvedText = string.slice(0, completion.start) + getInsertText(completion) + string.slice(completion.end)
            if (resolvedText === predicate.t && deepEqual(getCompletionItemForAssert(completion), getCompletionItemForAssert(predicate))) {
                matched = true
                break
            }
            resolvedTexts.push(resolvedText)
        }
        if (matched) {
            continue
        }
        fail(undefined, undefined, `No matching predicate for [${i}] ( inserting "${getInsertText(completion)}" at [${completion.start}, ${completion.end}) ) ( resolvedTexts = ${JSON.stringify(resolvedTexts)} ). `)
    }
}
