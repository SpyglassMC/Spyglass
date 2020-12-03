import {
  Case,
  ChoiceNode,
  StringNode as RawStringNode,
  ListNode,
  Mod,
  NumberNode,
  ObjectNode,
  Reference as RawReference,
  Switch,
  SchemaRegistry,
  CollectionRegistry,
} from '@mcschema/core'
import './ProcessorList'

export function initTemplatePoolSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
  const Reference = RawReference.bind(undefined, schemas)
  const StringNode = RawStringNode.bind(undefined, collections)

  const Processors = ChoiceNode([
    {
      type: 'string',
      node: StringNode({ validator: 'resource', params: { pool: '$worldgen/processor_list' }}),
      change: v => undefined
    },
    {
      type: 'object',
      node: Reference('processor_list'),
      change: v => ({
        processors: [{
          "processor_type": "minecraft:nop"
        }]
      })
    }
  ])

  schemas.register('template_pool', Mod(ObjectNode({
    name: StringNode(),
    fallback: StringNode(),
    elements: ListNode(
      Reference('template_weighted_element')
    )
  }, { context: 'template_pool' }), {
    default: () => ({
      fallback: 'minecraft:empty',
      elements: [
        {
          weight: 1,
          element: {
            element_type: 'minecraft:single_pool_element',
            projection: 'rigid',
            processors: 'minecraft:empty'
          }
        }
      ]
    })
  }))

  schemas.register('template_weighted_element', Mod(ObjectNode({
    weight: NumberNode({ integer: true, min: 1 }),
    element: Reference('template_element')
  }, { category: 'pool' }), {
    default: () => ({
      weight: 1,
      element: {
        element_type: 'minecraft:single_pool_element',
        projection: 'rigid',
        processors: 'minecraft:empty'
      }
    })
  }))

  schemas.register('template_element', Mod(ObjectNode({
    element_type: StringNode({ validator: 'resource', params: { pool: 'worldgen/structure_pool_element' } }),
    projection: StringNode({ enum: ['rigid', 'terrain_matching'] }),
    [Switch]: path => path.push('element_type'),
    [Case]: {
      'minecraft:feature_pool_element': {
        feature: StringNode({ validator: 'resource', params: { pool: '$worldgen/configured_feature' } }),
        processors: Processors
      },
      'minecraft:legacy_single_pool_element': {
        location: StringNode({ validator: 'resource', params: { pool: '$structure' }}),
        processors: Processors
      },
      'minecraft:list_pool_element': {
        elements: ListNode(
          Reference('template_element')
        )
      },
      'minecraft:single_pool_element': {
        location: StringNode({ validator: 'resource', params: { pool: '$structure' }}),
        processors: Processors
      }
    }
  }, { context: 'template_element', disableSwitchContext: true }), {
    default: () => ({
      element_type: 'minecraft:single_pool_element',
      projection: 'rigid',
      processors: 'minecraft:empty'
    })
  }))
}
