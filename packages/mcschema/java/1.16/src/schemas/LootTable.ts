import {
  BooleanNode,
  Case,
  StringNode as RawStringNode,
  ListNode,
  Mod,
  NumberNode,
  ObjectNode,
  Reference as RawReference,
  StringOrList,
  Switch,
  SwitchNode,
  INode,
  Path,
  ModelPath,
  NestedNodeChildren,
  MapNode,
  SchemaRegistry,
  CollectionRegistry,
  Opt,
} from '@mcschema/core'
import {
  LootTableTypes,
  LootContext,
  LootFunctions,
  LootConditions,
  LootEntitySources,
  LootCopySources
} from '../LootContext'
import { ConditionCases, Range } from './Common'

export function initLootTableSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
  const Reference = RawReference.bind(undefined, schemas)
  const StringNode = RawStringNode.bind(undefined, collections)

  const conditions: NestedNodeChildren = {
    conditions: Opt(ListNode(
      Reference('loot_condition')
    ))
  }

  const functionsAndConditions: NestedNodeChildren = {
    functions: Opt(ListNode(
      Reference('loot_function')
    )),
    ...conditions
  }

  function compileSwitchNode(contextMap: Map<string, LootContext[]>, collectionID: string, getNode: (type: string | string[]) => INode): INode {
    const cases: { match: (path: ModelPath) => boolean, node: INode }[] = []
    const getAvailableOptions = (providedContext: LootContext[]) => collections
      .get(collectionID)
      .filter(t => {
        const requiredContext = contextMap.get(t) ?? []
        return requiredContext.every(c => providedContext.includes(c))
      })
    for (const [tableType, { allows, requires }] of LootTableTypes) {
      const providedContext = [...allows, ...requires]
      cases.push({
        match: path => path.getModel().get(new Path(['type'])) === tableType,
        node: getNode(getAvailableOptions(providedContext))
      })
    }
    cases.push({ match: _ => true, node: getNode(collectionID) })
    return SwitchNode(cases)
  }

  const conditionSwtichNode = compileSwitchNode(LootConditions, 'loot_condition_type', type => StringNode({ validator: 'resource', params: { pool: type instanceof Array ? type : `loot_condition_type` } }))
  const functionSwtichNode = compileSwitchNode(LootFunctions, 'loot_function_type', type => StringNode({ validator: 'resource', params: { pool: type instanceof Array ? type : `loot_function_type` } }))
  const entitySourceSwtichNode = compileSwitchNode(LootEntitySources, 'entity_source', type => StringNode({ enum: type }))
  const copySourceSwtichNode = compileSwitchNode(LootCopySources, 'copy_source', type => StringNode({ enum: type}))

  schemas.register('loot_table', Mod(ObjectNode({
    type: Opt(StringNode({ validator: "resource", params: { pool: collections.get('loot_context_type') } })),
    pools: Opt(ListNode(
      Mod(ObjectNode({
        rolls: Range({ allowBinomial: true, integer: true }),
        bonus_rolls: Opt(Range({ integer: true })),
        entries: ListNode(
          Reference('loot_entry')
        ),
        ...functionsAndConditions
      }, { category: 'pool', context: 'loot_pool' }), {
        default: () => ({
          rolls: 1,
          entries: [{
            type: 'minecraft:item',
            name: 'minecraft:stone'
          }]
        })
      })
    )),
    functions: Opt(ListNode(
      Reference('loot_function')
    ))
  }, { context: 'loot_table' }), {
    default: () => ({
      pools: [{
        rolls: 1,
        entries: [{
          type: 'minecraft:item',
          name: 'minecraft:stone'
        }]
      }]
    })
  }))

  const weightMod: Partial<INode> = {
    enabled: path => path.pop().get()?.length > 1
      && !['minecraft:alternatives', 'minecraft:group', 'minecraft:sequence'].includes(path.push('type').get())
  }

  schemas.register('loot_entry', Mod(ObjectNode({
    type: StringNode({ validator: 'resource', params: { pool: 'loot_pool_entry_type' } }),
    weight: Opt(Mod(NumberNode({ integer: true, min: 1 }), weightMod)),
    quality: Opt(Mod(NumberNode({ integer: true }), weightMod)),
    [Switch]: path => path.push('type'),
    [Case]: {
      'minecraft:alternatives': {
        children: ListNode(
          Reference('loot_entry')
        ),
        ...functionsAndConditions
      },
      'minecraft:dynamic': {
        name: StringNode(),
        ...functionsAndConditions
      },
      'minecraft:group': {
        children: ListNode(
          Reference('loot_entry')
        ),
        ...functionsAndConditions
      },
      'minecraft:item': {
        name: StringNode({ validator: 'resource', params: { pool: 'item' } }),
        ...functionsAndConditions
      },
      'minecraft:loot_table': {
        name: StringNode({ validator: 'resource', params: { pool: '$loot_table' } }),
        ...functionsAndConditions
      },
      'minecraft:sequence': {
        children: ListNode(
          Reference('loot_entry')
        ),
        ...functionsAndConditions
      },
      'minecraft:tag': {
        name: StringNode({ validator: 'resource', params: { pool: '$tag/item' } }),
        expand: Opt(BooleanNode()),
        ...functionsAndConditions
      }
    }
  }, { context: 'loot_entry' }), {
    default: () => ({
      type: 'minecraft:item',
      name: 'minecraft:stone'
    })
  }))

  schemas.register('loot_function', Mod(ObjectNode({
    function: functionSwtichNode,
    [Switch]: path => path.push('function'),
    [Case]: {
      'minecraft:apply_bonus': {
        enchantment: StringNode({ validator: 'resource', params: { pool: 'enchantment' } }),
        formula: StringNode({ validator: 'resource', params: { pool: collections.get('loot_table_apply_bonus_formula') } }),
        parameters: Mod(ObjectNode({
          bonusMultiplier: Mod(NumberNode(), {
            enabled: path => path.pop().push('formula').get() === 'minecraft:uniform_bonus_count'
          }),
          extra: Mod(NumberNode(), {
            enabled: path => path.pop().push('formula').get() === 'minecraft:binomial_with_bonus_count'
          }),
          probability: Mod(NumberNode(), {
            enabled: path => path.pop().push('formula').get() === 'minecraft:binomial_with_bonus_count'
          })
        }), {
          enabled: path => path.push('formula').get() !== 'minecraft:ore_drops'
        }),
        ...conditions
      },
      'minecraft:copy_name': {
        source: copySourceSwtichNode,
        ...conditions
      },
      'minecraft:copy_nbt': {
        source: copySourceSwtichNode,
        ops: ListNode(
          ObjectNode({
            source: StringNode({ validator: 'nbt_path', params: { category: { getter: 'copy_source', path: ['pop', 'pop', 'pop', { push: 'source' }] } } }),
            target: StringNode({ validator: 'nbt_path', params: { category: 'minecraft:item' } }),
            op: StringNode({ enum: ['replace', 'append', 'merge'] })
          }, { context: 'nbt_operation' })
        ),
        ...conditions
      },
      'minecraft:copy_state': {
        block: StringNode({ validator: 'resource', params: { pool: 'block' } }),
        properties: ListNode(
          StringNode({ validator: 'block_state_key', params: { id: ['pop', 'pop', { push: 'block' }] } })
        ),
        ...conditions
      },
      'minecraft:enchant_randomly': {
        enchantments: Opt(ListNode(
          StringNode({ validator: 'resource', params: { pool: 'enchantment' } })
        )),
        ...conditions
      },
      'minecraft:enchant_with_levels': {
        levels: Range({ allowBinomial: true }),
        treasure: Opt(BooleanNode()),
        ...conditions
      },
      'minecraft:exploration_map': {
        destination: Opt(StringNode({ validator: 'resource', params: { pool: 'worldgen/structure_feature' } })),
        decoration: Opt(StringNode({ enum: 'map_decoration' })),
        zoom: Opt(NumberNode({ integer: true })),
        search_radius: Opt(NumberNode({ integer: true })),
        skip_existing_chunks: Opt(BooleanNode()),
        ...conditions
      },
      'minecraft:fill_player_head': {
        entity: entitySourceSwtichNode,
        ...conditions
      },
      'minecraft:limit_count': {
        limit: Range({ bounds: true }),
        ...conditions
      },
      'minecraft:looting_enchant': {
        count: Range({ bounds: true }),
        limit: Opt(NumberNode({ integer: true })),
        ...conditions
      },
      'minecraft:set_attributes': {
        modifiers: ListNode(
          Reference('attribute_modifier')
        ),
        ...conditions
      },
      'minecraft:set_contents': {
        entries: ListNode(
          Reference('loot_entry')
        ),
        ...conditions
      },
      'minecraft:set_count': {
        count: Range({ allowBinomial: true }),
        ...conditions
      },
      'minecraft:set_damage': {
        damage: Range({ forceRange: true }),
        ...conditions
      },
      'minecraft:set_loot_table': {
        name: StringNode({ validator: 'resource', params: { pool: '$loot_table' } }),
        seed: Opt(NumberNode({ integer: true }))
      },
      'minecraft:set_lore': {
        entity: Opt(entitySourceSwtichNode),
        lore: ListNode(
          Reference('text_component')
        ),
        replace: Opt(BooleanNode()),
        ...conditions
      },
      'minecraft:set_name': {
        entity: Opt(entitySourceSwtichNode),
        name: Opt(Reference('text_component')),
        ...conditions
      },
      'minecraft:set_nbt': {
        tag: StringNode({ validator: 'nbt', params: { registry: { category: 'minecraft:item' } } }),
        ...conditions
      },
      'minecraft:set_stew_effect': {
        effects: Opt(ListNode(
          ObjectNode({
            type: StringNode({ validator: 'resource', params: { pool: 'mob_effect' } }),
            duration: Range()
          })
        )),
        ...conditions
      }
    }
  }, { category: 'function', context: 'function' }), {
    default: () => ({
      function: 'minecraft:set_count',
      count: 1
    })
  }))

  schemas.register('loot_condition', Mod(ObjectNode({
    condition: conditionSwtichNode,
    [Switch]: path => path.push('condition'),
    [Case]: {
      ...ConditionCases,
      'minecraft:entity_properties': {
        entity: entitySourceSwtichNode,
        predicate: Reference('entity_predicate')
      },
      'minecraft:entity_scores': {
        entity: entitySourceSwtichNode,
        scores: MapNode(
          StringNode({ validator: 'objective' }),
          Range({ bounds: true })
        )
      }
    }
  }, { category: 'predicate', context: 'condition' }), {
    default: () => ({
      condition: 'minecraft:random_chance',
      chance: 0.5
    })
  }))

  schemas.register('attribute_modifier', Mod(ObjectNode({
    attribute: StringNode({ validator: 'resource', params: { pool: 'attribute' } }),
    name: StringNode(),
    amount: Range({ bounds: true }),
    operation: StringNode({ enum: ['addition', 'multiply_base', 'multiply_total'] }),
    slot: StringOrList(
      StringNode({ enum: 'slot' })
    )
  }, { context: 'attribute_modifier' }), {
    default: () => ({
      attribute: 'minecraft:generic.max_health',
      name: '',
      amount: 1,
      operation: 'addition',
      slot: 'mainhand'
    })
  }))
}
