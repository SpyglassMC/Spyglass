import { INode } from "./nodes/Node"
import { BooleanHookParams } from "./nodes/BooleanNode"
import { ChoiceHookParams } from "./nodes/ChoiceNode"
import { ListHookParams } from "./nodes/ListNode"
import { MapHookParams } from "./nodes/MapNode"
import { NumberHookParams } from "./nodes/NumberNode"
import { ObjectHookParams } from "./nodes/ObjectNode"
import { StringHookParams } from "./nodes/StringNode"
import { ModelPath } from "./model/Path"

export type Hook<U extends any[], V> = {
  base: (params: {node: INode}, path: ModelPath, ...t: U) => V
  boolean: (params: {node: INode} & BooleanHookParams, path: ModelPath, ...t: U) => V
  choice: (params: {node: INode} & ChoiceHookParams, path: ModelPath, ...t: U) => V
  list: (params: {node: INode} & ListHookParams, path: ModelPath, ...t: U) => V
  map: (params: {node: INode} & MapHookParams, path: ModelPath, ...t: U) => V
  number: (params: {node: INode} & NumberHookParams, path: ModelPath, ...t: U) => V
  object: (params: {node: INode} & ObjectHookParams, path: ModelPath, ...t: U) => V
  string: (params: {node: INode} & StringHookParams, path: ModelPath, ...t: U) => V
}
