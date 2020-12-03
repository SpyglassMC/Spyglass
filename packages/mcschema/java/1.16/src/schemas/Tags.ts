import {
  BooleanNode,
  StringNode as RawStringNode,
  ListNode,
  Mod,
  ObjectNode,
  StringNode,
  ResourceType,
  ChoiceNode,
  SchemaRegistry,
  CollectionRegistry,
  Opt,
} from '@mcschema/core'

export function initTagsSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
  const StringNode = RawStringNode.bind(undefined, collections)

  const TagBase = (type: ResourceType) => Mod(ObjectNode({
    replace: Opt(BooleanNode()),
    values: ListNode(
      ChoiceNode([
        {
          type: 'string',
          node: StringNode({ validator: 'resource', params: { pool: type, allowTag: true } }),
          change: v => v.id
        },
        {
          type: 'object',
          node: ObjectNode({
            id: StringNode({ validator: 'resource', params: { pool: type, allowTag: true, allowUnknown: true } }),
            required: BooleanNode()
          }),
          change: v => ({ id: v })
        }
      ])
    ),
  }, { context: 'tag' }), {
    default: () => ({
      values: []
    })
  })

  schemas.register('block_tag', TagBase('block'))
  schemas.register('entity_type_tag', TagBase('entity_type'))
  schemas.register('fluid_tag', TagBase('fluid'))
  schemas.register('function_tag', TagBase('$function'))
  schemas.register('item_tag', TagBase('item'))
}
