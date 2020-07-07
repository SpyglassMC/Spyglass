import { CompletionItem, ProposedFeatures } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { ArgumentNode, NodeRange } from '../nodes'
import { ClientCache, Config, FunctionInfo, LineArgumentNode, LineNode, ParsingError, TextRange, Token, VanillaConfig } from '../types'

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

interface FunctionInfoMockOptions {
    builder?: ProposedFeatures.SemanticTokensBuilder,
    config?: Config,
    nodes?: LineNode[],
    uri?: string,
    version?: number,
    content?: string
}
export function mockFunctionInfo(info: FunctionInfoMockOptions = {}): FunctionInfo {
    return {
        builder: info.builder,
        config: info.config ?? VanillaConfig,
        nodes: info.nodes ?? [],
        document: TextDocument.create(
            info.uri ?? 'dhp://document.mcfunction',
            'mcfunction',
            info.version ?? 0,
            info.content ?? '                                                                                                    '
        )
    }
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
    completions?: CompletionItem[]
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
