import { NbtTagTypeName } from './NbtTag'

type NbtSchema = { [key: string]: NbtSchemaNode | ValueList }

export default NbtSchema

export interface NodeBase {
    description?: string,
    references?: { [key: string]: any },
    suggestions?: Array<
    | string
    | { description?: string, value?: string }
    | { parser: string, params?: any[] }
    >,
    isColor?: boolean,
    canAlsoBe?: string[]
}

export interface NbtNoPropertySchemaNode extends NodeBase {
    type:
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
    ref: string
}

export interface NbtListSchemaNode extends NodeBase {
    item: NbtSchemaNode,
    type: 'list'
}

export interface NbtCompoundSchemaNode extends NodeBase {
    child_ref?: string[],
    children?: { [key: string]: NbtSchemaNode },
    type: 'compound',
    additionalChildren?: boolean
}

export interface NbtRootSchemaNode extends NodeBase {
    children: { [key: string]: NbtSchemaNode },
    type: 'root'
}

export type ValueList = Array<string | { description: string, value: string }>

export type NbtSchemaNode =
    | NbtNoPropertySchemaNode
    | NbtCompoundSchemaNode
    | NbtRootSchemaNode
    | NbtListSchemaNode
    | NbtRefSchemaNode

export type NbtSchemaNodeWithType = NbtSchemaNode & { type: 'no-nbt' | NbtTagTypeName }
