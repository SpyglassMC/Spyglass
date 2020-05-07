import { ArgumentNode, NodeRange } from '../nodes/ArgumentNode'
import { TextRange } from '../types/TextRange'

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
