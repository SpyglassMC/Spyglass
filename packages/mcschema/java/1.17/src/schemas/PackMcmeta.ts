import {
  Mod,
  NumberNode,
  ObjectNode,
  Reference,
  SchemaRegistry,
  CollectionRegistry,
} from '@mcschema/core'

const CURRENT_PACK_FORMAT = 7

export function initPackMcmetaSchemas(schemas: SchemaRegistry, _: CollectionRegistry) {
  const getSimpleString = (jsonText: any): string => jsonText instanceof Array ? getSimpleString(jsonText[0]) : jsonText?.text ?? jsonText?.toString() ?? ''

  schemas.register('pack_mcmeta', Mod(ObjectNode({
    pack: Mod(ObjectNode({
      pack_format: Mod(NumberNode({ integer: true, min: CURRENT_PACK_FORMAT, max: CURRENT_PACK_FORMAT }), { 
        default: () => CURRENT_PACK_FORMAT,
        canUpdate: (_p, v) => v !== CURRENT_PACK_FORMAT,
        update: () => [{ name: 'pack_format', params: [CURRENT_PACK_FORMAT],  newValue: CURRENT_PACK_FORMAT }]
      }),
      description: Reference(schemas, 'text_component')
    }), {
      default: () => ({
        pack_format: CURRENT_PACK_FORMAT,
        description: ''
      })
    })
  }), {
    default: () => ({
      pack: {
        pack_format: CURRENT_PACK_FORMAT,
        description: ''
      }
    })
  }))
}
