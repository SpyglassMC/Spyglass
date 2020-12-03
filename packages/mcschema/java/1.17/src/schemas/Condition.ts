import {
  Case,
  StringNode as RawStringNode,
  ObjectNode,
  ObjectOrList,
  Reference as RawReference,
  Switch,
  SchemaRegistry,
  CollectionRegistry,
  Mod,
} from '@mcschema/core'
import { ConditionCases } from './Common'

export function initConditionSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
  const Reference = RawReference.bind(undefined, schemas)
  const StringNode = RawStringNode.bind(undefined, collections)

  schemas.register('predicate', ObjectOrList(
    Reference('condition'), { choiceContext: 'condition' }
  ))

  schemas.register('condition', Mod(ObjectNode({
    condition: StringNode({ validator: 'resource', params: { pool: 'loot_condition_type' } }),
    [Switch]: path => path.push('condition'),
    [Case]: ConditionCases()
  }, { category: 'predicate', context: 'condition' }), {
    default: () => ({
      condition: 'minecraft:entity_properties',
      entity: 'this'
    })
  }))
}
