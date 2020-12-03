import {
  StringNode as RawStringNode,
  Mod,
  NumberNode,
  ObjectNode,
  SchemaRegistry,
  CollectionRegistry,
} from '@mcschema/core'

export function initCarverSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
  const StringNode = RawStringNode.bind(undefined, collections)

  schemas.register('configured_carver', Mod(ObjectNode({
    type: StringNode({ validator: 'resource', params: { pool: 'worldgen/carver' } }),
    config: ObjectNode({
      probability: NumberNode({ min: 0, max: 1 })
    })
  }, { context: 'carver' }), {
    default: () => ({
      type: 'minecraft:cave',
      config: {
        probability: 0.1
      }
    })
  }))
}
