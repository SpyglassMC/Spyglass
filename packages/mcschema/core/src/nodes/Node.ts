import { ModelPath } from '../model/Path'
import { Errors } from '../model/Errors'
import { ValidationOption } from '../ValidationOption'
import { Hook } from '../Hook'
import { JsonUpdate } from '../JsonUpdate'

export type NodeOptions = {
  loose?: boolean
}

export interface INode<T = any> {

  /**
   * Type of the node
   */
  type: (path: ModelPath) => string

  /**
   * Category of the node. Can be used for coloring
   */
  category: (path: ModelPath) => string | undefined

  /**
   * The default value of this node
   * @param value optional original value
   */
  default: () => T

  /**
   * Determines whether the node should be enabled for this path
   * @param path
   */
  enabled: (path: ModelPath) => boolean

  /**
   * Determines whether the node should be kept when empty
   */
  keep: () => boolean

  /**
   * Whether this node is optional and can be collapsed
   */
  optional: () => boolean

  /**
   * Navigate to the specific child of this node according to the path
   * @param path The path of the target node
   * @param index The index of the path element that the current node is at. 
   * For example, in object `{ foo: { bar: true } }` with path `foo.bar`,
   * the index for the root object is `-1`, 
   * the one for the inner object is `0` (which is the index of `foo` in `foo.bar`),
   * and the one for the boolean value is `1` (which is the index of `bar` in `foo.bar`)
   * @param value The value corresponding to the schema node
   */
  navigate: (path: ModelPath, index: number) => INode | undefined

  /**
   * Get the path to the child node corresponding to the `key`
   * - For `ChoiceNode`: Call the `pathPush` method from the matched node.
   * - For `ListNode`: Returns the path of the specific child.
   * - For `ObjectNode`: Returns the path of the specific child, with the context arrays handled.
   * - For other nodes: Returns the path without changes.
   */
  pathPush: (path: ModelPath, key: string | number) => ModelPath

  /**
   * Provide code suggestions for this node. The result are valid JSON strings that can be used
   * in JSON directly without triggering any syntax errors; e.g. string suggestions, including
   * object key suggestions, have double quotation marks surrounding them, while boolean suggestions
   * and number suggestions don't
   * - For `BooleanNode`: Returns a list containing `false` and `true`.
   * - For `ChoiceNode`: Returns suggestions of the matched choice node.
   * - For `EnumNode`: Returns all the options.
   * - For `MapNode`: Returns all the suggestions provided by the key node, surrounded in double 
   * quotation marks.
   * - For `ObjectNode`: Returns all possible keys that can be used under this object, 
   * surrounded in double quotation marks. 
   * Keys existing in the `value` will be excluded from the suggestion.
   * - For other nodes: Returns an empty list.
   * @param path The path of this node
   * @param value The value corresponding to this node
   */
  suggest: (path: ModelPath, value: T) => string[]

  /**
   * Validates the model using this schema
   * 
   * When encountering an invalid value, it should either silently repair it
   * or add an error and retain the original value
   * @param value value to be validated
   */
  validate: (path: ModelPath, value: any, errors: Errors, options: NodeOptions) => any

  /**
   * Get the validation option of this node. The client of this schema may
   * do more detailed validation according to this option
   * - For `EnumNode` and `StringNode`: Returns the corresponding `validation` in their `options`.
   * - For `MapNode`: Returns the corresponding `validation` in their `options`, or the `validationOption`
   * of their key node if the former is `undefined`.
   * - For `ChoiceNode`: Returns the corresponding `validationOption` of the matched choice's node.
   * - For other nodes: Returns `undefined`.
   */
  validationOption: (path: ModelPath) => ValidationOption | undefined

  /**
   * Allows users of this library to give custom functionality by hooking into each node type.
   */
  hook: <U extends any[], V>(hook: Hook<U, V>, path: ModelPath, ...args: U) => V

  /**
   * Determines if the input `value` can be updated.
   */
  canUpdate: (path: ModelPath, value: any) => boolean

  /**
   * Get the updates for the input `value`.
   */
  update: (path: ModelPath, value: any) => JsonUpdate[]

  [custom: string]: any
}

export const Base: INode = ({
  type: () => 'base',
  category: () => undefined,
  default: () => undefined,
  enabled: () => true,
  keep: () => false,
  optional: () => false,
  navigate() { return this },
  pathPush: (p) => p,
  suggest: () => [],
  validate: (_, v) => v,
  validationOption: () => undefined,
  hook(hook, path, ...args) { return hook.base({ node: this }, path, ...args) },
  canUpdate: () => false,
  update: () => []
})

export const Mod = (node: INode, mods: Partial<INode> | ((node: INode) => Partial<INode>)): INode => ({
  ...node, ...(typeof mods === 'function' ? mods(node): mods)
})

export const Has = (key: string, node: INode<any>) => Mod(node, {
  enabled: (p: ModelPath) => p.push(key).get() !== undefined
})

export function Opt<T>(node: INode<T>): INode {
  return {
    ...node,
    optional: () => true
  }
}

export function Keep<T>(node: INode<T>): INode<T> {
  return {
    ...node,
    keep: () => true
  }
}
