import {
  BooleanNode,
  StringNode as RawStringNode,
  Mod,
  NumberNode,
  ObjectNode,
  SchemaRegistry,
  CollectionRegistry,
  Opt,
} from '@mcschema/core'
import { DefaultDimensionType } from './Common'

export function initDimensionTypeSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
  const StringNode = RawStringNode.bind(undefined, collections)

  schemas.register('dimension_type', Mod(ObjectNode({
    name: Mod(StringNode({ validator: 'resource', params: { pool: '$dimension_type', isDefinition: true }}), {
      enabled: (path) => path.getArray().length > 0
    }),
    ultrawarm: BooleanNode(),
    natural: BooleanNode(),
    piglin_safe: BooleanNode(),
    respawn_anchor_works: BooleanNode(),
    bed_works: BooleanNode(),
    has_raids: BooleanNode(),
    has_skylight: BooleanNode(),
    has_ceiling: BooleanNode(),
    coordinate_scale: NumberNode({ min: 0.00001, max: 30000000 }),
    ambient_light: NumberNode(),
    fixed_time: Opt(NumberNode({ integer: true })),
    logical_height: NumberNode({ integer: true, min: 0, max: 4096 }),
    effects: Opt(StringNode({ enum: ['minecraft:overworld', 'minecraft:the_nether', 'minecraft:the_end'] })),
    infiniburn: StringNode({ validator: 'resource', params: { pool: '$tag/block' } }),
    min_y: NumberNode({ integer: true, min: -2048, max: 2047 }),
    height: NumberNode({ integer: true, min: 0, max: 4096 })
  }, { context: 'dimension_type' }), node => ({
    default: () => DefaultDimensionType,
    validate: (path, value, errors, options) => {
      value = node.validate(path, value, errors, options)
      if (value?.min_y + value?.height > 2047) {
        errors.add(path.push('height'), 'error.min_y_plus_height', 2047)
      }
      if (value?.logical_height > value?.height) {
        errors.add(path.push('logical_height'), 'error.logical_height')
      }
      if (value?.height % 16 !== 0) {
        errors.add(path.push('height'), 'error.height_multiple', 16)
      }
      if (value?.min_y % 16 !== 0) {
        errors.add(path.push('min_y'), 'error.min_y_multiple', 16)
      }
      return value
    }
  })))
}
