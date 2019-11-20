import VanillaNbtSchema from '../data/JE1.15/nbt_schema'
import { NbtTagTypeName } from './NbtTag'

export type NbtSchema = { [key: string]: NbtSchemaNode | ValueList }

export interface NodeBase {
    readonly description?: string
    readonly references?: { [key: string]: any }
    readonly suggestions?: Array<
        | string
        | { description?: string; value?: string }
        | { parser: string; params?: any[] }
    >
}

export interface NbtNoPropertySchemaNode extends NodeBase {
    readonly type:
    | 'no-nbt'
    | 'byte'
    | 'short'
    | 'int'
    | 'long'
    | 'float'
    | 'double'
    | 'byte_array'
    | 'string'
    | 'int_array'
    | 'long_array'
}

export interface NbtRefSchemaNode extends NodeBase {
    readonly ref: string
}

export interface NbtListSchemaNode extends NodeBase {
    readonly item: NbtSchemaNode
    readonly type: 'list'
}

export interface NbtCompoundSchemaNode extends NodeBase {
    readonly child_ref?: string[]
    readonly children?: { [key: string]: NbtSchemaNode }
    readonly type: 'compound'
    readonly additionalChildren?: boolean
}

export interface NbtRootSchemaNode extends NodeBase {
    readonly children: { [key: string]: NbtSchemaNode }
    readonly type: 'root'
}

export type ValueList = Array<string | { description: string; value: string }>

export type NbtSchemaNode =
    | NbtNoPropertySchemaNode
    | NbtCompoundSchemaNode
    | NbtRootSchemaNode
    | NbtListSchemaNode
    | NbtRefSchemaNode

export type NbtSchemaNodeWithType = NbtSchemaNode & { type: 'no-nbt' | NbtTagTypeName }

export default VanillaNbtSchema as NbtSchema
