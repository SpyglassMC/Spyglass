import {
  Case,
  StringNode as RawStringNode,
  NumberNode,
  ObjectNode,
  Reference as RawReference,
  Switch,
  NodeChildren,
  SchemaRegistry,
  CollectionRegistry,
} from '@mcschema/core'
import { UniformInt } from '../Common'

export function initDecoratorSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
  const Reference = RawReference.bind(undefined, schemas)
  const StringNode = RawStringNode.bind(undefined, collections)

  const RangeConfig: NodeChildren = {
    maximum: NumberNode({ integer: true }),
    bottom_offset: NumberNode({ integer: true }),
    top_offset: NumberNode({ integer: true })
  }

  const ChanceConfig: NodeChildren = {
    chance: NumberNode({ integer: true, min: 0 })
  }

  const CountConfig: NodeChildren = {
    count: UniformInt({ min: -10, max: 128, maxSpread: 128 })
  }

  schemas.register('configured_decorator', ObjectNode({
    type: StringNode({ validator: 'resource', params: { pool: 'worldgen/decorator' } }),
    config: ObjectNode({
      [Switch]: path => path.pop().push('type'),
      [Case]: {
        'minecraft:carving_mask': {
          step: StringNode({ enum: 'generation_step' }),
          probability: NumberNode({ min: 0, max: 1 })
        },
        'minecraft:chance': ChanceConfig,
        'minecraft:count': CountConfig,
        'minecraft:count_extra': {
          count: NumberNode({ integer: true, min: 0 }),
          extra_count: NumberNode({ integer: true, min: 0 }),
          extra_chance: NumberNode({ min: 0, max: 1 })
        },
        'minecraft:count_multilayer': CountConfig,
        'minecraft:count_noise': {
          noise_level: NumberNode(),
          below_noise: NumberNode({ integer: true }),
          above_noise: NumberNode({ integer: true })
        },
        'minecraft:count_noise_biased': {
          noise_to_count_ratio: NumberNode({ integer: true }),
          noise_factor: NumberNode(),
          noise_offset: NumberNode()
        },
        'minecraft:decorated': {
          outer: Reference('configured_decorator'),
          inner: Reference('configured_decorator')
        },
        'minecraft:depth_average': {
          baseline: NumberNode({ integer: true }),
          spread: NumberNode({ integer: true })
        },
        'minecraft:fire': CountConfig,
        'minecraft:glowstone': CountConfig,
        'minecraft:lava_lake': ChanceConfig,
        'minecraft:range': RangeConfig,
        'minecraft:range_biased': RangeConfig,
        'minecraft:range_very_biased': RangeConfig,
        'minecraft:water_lake': ChanceConfig
      }
    }, { context: 'decorator', category: 'predicate' })
  }, { context: 'decorator', category: 'predicate' }))
}
