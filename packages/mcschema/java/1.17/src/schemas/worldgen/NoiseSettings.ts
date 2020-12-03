import {
  BooleanNode,
  StringNode as RawStringNode,
  Mod,
  NumberNode,
  ObjectNode,
  Reference as RawReference,
  MapNode,
  SchemaRegistry,
  CollectionRegistry,
  Opt,
  INode,
  ModelPath,
  Errors,
  NodeOptions,
} from '@mcschema/core'
import { DefaultNoiseSettings } from '../Common'

export function initNoiseSettingsSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
  const Reference = RawReference.bind(undefined, schemas)
  const StringNode = RawStringNode.bind(undefined, collections)

  schemas.register('noise_settings', Mod(ObjectNode({
    name: Mod(StringNode({ validator: 'resource', params: { pool: '$worldgen/noise_settings', isDefinition: true } }), {
      enabled: (path) => path.getArray().length > 0
    }),
    bedrock_roof_position: NumberNode({ integer: true }),
    bedrock_floor_position: NumberNode({ integer: true }),
    sea_level: NumberNode({ integer: true }),
    disable_mob_generation: BooleanNode(),
    default_block: Reference('block_state'),
    default_fluid: Reference('block_state'),
    noise: ObjectNode({
      min_y: NumberNode({ integer: true, min: -2048, max: 2047 }),
      height: NumberNode({ integer: true, min: 0, max: 4096 }),
      density_factor: NumberNode(),
      density_offset: NumberNode(),
      size_horizontal: NumberNode({ integer: true }),
      size_vertical: NumberNode({ integer: true }),
      simplex_surface_noise: BooleanNode(),
      random_density_offset: Opt(BooleanNode()),
      island_noise_override: Opt(BooleanNode()),
      amplified: Opt(BooleanNode()),
      sampling: ObjectNode({
        xz_scale: NumberNode(),
        y_scale: NumberNode(),
        xz_factor: NumberNode(),
        y_factor: NumberNode()
      }),
      bottom_slide: ObjectNode({
        target: NumberNode({ integer: true }),
        size: NumberNode({ integer: true }),
        offset: NumberNode({ integer: true })
      }),
      top_slide: ObjectNode({
        target: NumberNode({ integer: true }),
        size: NumberNode({ integer: true }),
        offset: NumberNode({ integer: true })
      })
    }),
    structures: Reference('generator_structures')
  }, { context: 'noise_settings' }), node => ({
    default: () => DefaultNoiseSettings,
    validate: (path, value, errors, options) => {
      value = node.validate(path, value, errors, options)
      if (value?.noise?.min_y + value?.noise?.height > 2047) {
        errors.add(path.push('noise').push('height'), 'error.min_y_plus_height', 2047)
      }
      if (value?.noise?.height % 16 !== 0) {
        errors.add(path.push('noise').push('height'), 'error.height_multiple', 16)
      }
      if (value?.noide?.min_y % 16 !== 0) {
        errors.add(path.push('noise').push('min_y'), 'error.min_y_multiple', 16)
      }
      return value
    }
  })))

  schemas.register('generator_structures', ObjectNode({
    stronghold: Opt(ObjectNode({
      distance: NumberNode({ integer: true, min: 0, max: 1023 }),
      spread: NumberNode({ integer: true, min: 0, max: 1023 }),
      count: NumberNode({ integer: true, min: 1, max: 4095 })
    })),
    structures: MapNode(
      StringNode({ validator: 'resource', params: { pool: 'worldgen/structure_feature' } }),
      Mod(ObjectNode({
        spacing: NumberNode({ integer: true, min: 0, max: 4096 }),
        separation: Mod(NumberNode({ integer: true, min: 0, max: 4096 }), (node: INode) => ({
          validate: (path: ModelPath, value: any, errors: Errors, options: NodeOptions) => {
            if (path.pop().push('spacing').get() <= value) {
              errors.add(path, 'error.separation_smaller_spacing')
            }
            return node.validate(path, value, errors, options)
          }
        })),
        salt: NumberNode({ integer: true, min: 0 })
      }, { context: 'generator_structure' }), {
        default: () => ({
          spacing: 10,
          separation: 5,
          salt: 0
        })
      })
    )
  }))

  schemas.register('generator_layer', Mod(ObjectNode({
    block: StringNode({ validator: 'resource', params: { pool: 'block' } }),
    height: NumberNode({ integer: true, min: 1 })
  }), {
    default: () => ({
      block: 'minecraft:stone',
      height: 1
    })
  }))
}
