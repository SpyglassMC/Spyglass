import {
  Case,
  StringNode as RawStringNode,
  ListNode,
  Mod,
  NumberNode,
  ObjectNode,
  Reference as RawReference,
  Switch,
  SchemaRegistry,
  CollectionRegistry,
  Opt,
} from '@mcschema/core'

export function initProcessorListSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
  const Reference = RawReference.bind(undefined, schemas)
  const StringNode = RawStringNode.bind(undefined, collections)

  schemas.register('processor_list', Mod(ObjectNode({
    processors: ListNode(
      Reference('processor')
    )
  }, { context: 'processor_list' }), {
    default: () => ({
      processors: [{
        processor_type: 'minecraft:rule',
        rules: [{
          location_predicate: {
            predicate_type: 'minecraft:always_true'
          },
          input_predicate: {
            predicate_type: 'minecraft:always_true'
          }
        }]
      }]
    })
  }))

  schemas.register('processor', Mod(ObjectNode({
    processor_type: StringNode({ validator: 'resource', params: { pool: 'worldgen/structure_processor' } }),
    [Switch]: path => path.push('processor_type'),
    [Case]: {
      'minecraft:block_age': {
        mossiness: NumberNode()
      },
      'minecraft:block_ignore': {
        blocks: ListNode(
          Reference('block_state')
        )
      },
      'minecraft:block_rot': {
        integrity: NumberNode({ min: 0, max: 1 })
      },
      'minecraft:gravity': {
        heightmap: StringNode({ enum: 'heightmap_type' }),
        offset: NumberNode({ integer: true })
      },
      'minecraft:rule': {
        rules: ListNode(
          Reference('processor_rule')
        )
      }
    }
  }, { category: 'function', context: 'processor' }), {
    default: () => ({
      processor_type: 'minecraft:rule',
      rules: [{
        location_predicate: {
          predicate_type: 'minecraft:always_true'
        },
        input_predicate: {
          predicate_type: 'minecraft:always_true'
        }
      }]
    })
  }))

  schemas.register('processor_rule', Mod(ObjectNode({
    position_predicate: Opt(Reference('pos_rule_test')),
    location_predicate: Reference('rule_test'),
    input_predicate: Reference('rule_test'),
    output_state: Reference('block_state'),
    output_nbt: Opt(StringNode({ validator: 'nbt', params: { registry: { category: 'minecraft:block' } } }))
  }, { category: 'predicate', context: 'processor_rule' }), {
    default: () => ({
      location_predicate: {
        predicate_type: 'minecraft:always_true'
      },
      input_predicate: {
        predicate_type: 'minecraft:always_true'
      }
    })
  }))

  const posTestFields = {
    min_dist: NumberNode({ min: 0, max: 255, integer: true }),
    max_dist: NumberNode({ min: 0, max: 255, integer: true }),
    min_chance: NumberNode({ min: 0, max: 1 }),
    max_chance: NumberNode({ min: 0, max: 1 })
  }

  schemas.register('pos_rule_test', ObjectNode({
    predicate_type: StringNode({ validator: 'resource', params: { pool: 'pos_rule_test' } }),
    [Switch]: path => path.push('predicate_type'),
    [Case]: {
      'minecraft:axis_aligned_linear_pos': {
        axis: StringNode({ enum: ['x', 'y', 'z'] }),
        ...posTestFields
      },
      'minecraft:linear_pos': posTestFields
    }
  }, { context: 'pos_rule_test', disableSwitchContext: true }))

  schemas.register('rule_test', ObjectNode({
    predicate_type: StringNode({ validator: 'resource', params: { pool: 'rule_test' } }),
    [Switch]: path => path.push('predicate_type'),
    [Case]: {
      'minecraft:block_match': {
        block: StringNode({ validator: 'resource', params: { pool: 'block' } })
      },
      'minecraft:blockstate_match': {
        block_state: Reference('block_state')
      },
      'minecraft:random_block_match': {
        block: StringNode({ validator: 'resource', params: { pool: 'block' } }),
        probability: NumberNode({ min: 0, max: 1 })
      },
      'minecraft:random_blockstate_match': {
        block_state: Reference('block_state'),
        probability: NumberNode({ min: 0, max: 1 })
      },
      'minecraft:tag_match': {
        tag: StringNode({ validator: 'resource', params: { pool: '$tag/block' }})
      }
    }
  }, { context: 'rule_test', disableSwitchContext: true }))
}
