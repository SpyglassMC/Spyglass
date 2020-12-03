import {
  BooleanNode,
  Case,
  ChoiceNode,
  StringNode as RawStringNode,
  ListNode,
  MapNode,
  Mod,
  NumberNode,
  ObjectNode,
  Reference as RawReference,
  Switch,
  SchemaRegistry,
  CollectionRegistry,
  Opt,
} from '@mcschema/core'

export function initAdvancementSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
  const Reference = RawReference.bind(undefined, schemas)
  const StringNode = RawStringNode.bind(undefined, collections)

  const EntityPredicate = ChoiceNode([
      {
        type: 'object',
        node: Opt(Reference('entity_predicate')),
        change: v => v[0]?.predicate ?? ({})
      },
      {
        type: 'list',
        node: ListNode(Reference('condition')),
        change: v => [{
          condition: 'minecraft:entity_properties',
          predicate: v
        }]
      }
    ], { choiceContext: 'conditions' })

  schemas.register('advancement', Mod(ObjectNode({
    display: Opt(Mod(ObjectNode({
      icon: ObjectNode({
        item: StringNode({ validator: 'resource', params: { pool: 'item' } }),
        nbt: Opt(StringNode({ validator: 'nbt', params: { registry: { category: 'minecraft:item', id: ['pop', { push: 'item' }] } } }))
      }),
      title: Reference('text_component'),
      description: Reference('text_component'),
      background: Opt(StringNode()),
      frame: Opt(StringNode({ enum: ['task', 'challenge', 'goal'] })),
      show_toast: Opt(BooleanNode()),
      announce_to_chat: Opt(BooleanNode()),
      hidden: Opt(BooleanNode())
    }), {
      default: () => ({
        icon: {
          item: 'minecraft:stone'
        },
        title: '',
        description: ''
      })
    })),
    parent: Opt(StringNode({ validator: 'resource', params: { pool: '$advancement' } })),
    criteria: MapNode(
      StringNode(),
      Reference('advancement_criteria')
    ),
    requirements: Opt(ListNode(
      ListNode(
        StringNode() // TODO: add validation
      )
    )),
    rewards: Opt(ObjectNode({
      function: Opt(StringNode({ validator: 'resource', params: { pool: '$function' } })),
      loot: Opt(ListNode(
        StringNode({ validator: 'resource', params: { pool: '$loot_table' } })
      )),
      recipes: Opt(ListNode(
        StringNode({ validator: 'resource', params: { pool: '$recipe' } })
      )),
      experience: Opt(NumberNode({ integer: true }))
    })),
  }, { context: 'advancement' }), {
    default: () => ({
      criteria: {
        requirement: {
          trigger: 'minecraft:location'
        }
      }
    })
  }))

  schemas.register('advancement_criteria', ObjectNode({
    trigger: StringNode({ validator: 'resource', params: { pool: collections.get('advancement_trigger') } }),
    conditions: Opt(ObjectNode({
      player: Mod(EntityPredicate, {
        enabled: path => path.pop().push('trigger').get() !== 'minecraft:impossible'
      }),
      [Switch]: path => path.pop().push('trigger'),
      [Case]: {
        'minecraft:bee_nest_destroyed': {
          block: Opt(StringNode({ validator: 'resource', params: { pool: 'block' } })),
          num_bees_inside: Opt(NumberNode({ integer: true })),
          item: Opt(Reference('item_predicate'))
        },
        'minecraft:bred_animals': {
          parent: EntityPredicate,
          partner: EntityPredicate,
          child: EntityPredicate
        },
        'minecraft:brewed_potion': {
          potion: Opt(StringNode({ validator: 'resource', params: { pool: 'potion' } }))
        },
        'minecraft:changed_dimension': {
          from: Opt(StringNode({ validator: 'resource', params: { pool: '$dimension' } })),
          to: Opt(StringNode({ validator: 'resource', params: { pool: '$dimension' } }))
        },
        'minecraft:channeled_lightning': {
          victims: Opt(ListNode(
            EntityPredicate
          ))
        },
        'minecraft:construct_beacon': {
          level: Reference('int_bounds')
        },
        'minecraft:consume_item': {
          item: Opt(Reference('item_predicate'))
        },
        'minecraft:cured_zombie_villager': {
          villager: EntityPredicate,
          zombie: EntityPredicate
        },
        'minecraft:effects_changed': {
          effects: Opt(MapNode(
            StringNode({ validator: 'resource', params: { pool: 'mob_effect' } }),
            ObjectNode({
              amplifier: Reference('int_bounds'),
              duration: Reference('int_bounds')
            })
          ))
        },
        'minecraft:enter_block': {
          block: Opt(StringNode({ validator: 'resource', params: { pool: 'block' } })),
          state: Opt(MapNode(
            StringNode(),
            StringNode(),
            { validation: { validator: 'block_state_map', params: { id: ['pop', { push: 'block' }] } } }
          ))
        },
        'minecraft:enchanted_item': {
          levels: Reference('int_bounds'),
          item: Opt(Reference('item_predicate'))
        },
        'minecraft:entity_hurt_player': {
          damage: Opt(Reference('damage_predicate'))
        },
        'minecraft:entity_killed_player': {
          entity: EntityPredicate,
          killing_blow: Opt(Reference('damage_source_predicate'))
        },
        'minecraft:filled_bucket': {
          item: Opt(Reference('item_predicate'))
        },
        'minecraft:fishing_rod_hooked': {
          entity: EntityPredicate,
          item: Opt(Reference('item_predicate'))
        },
        'minecraft:hero_of_the_village': {
          location: Opt(Reference('location_predicate'))
        },
        'minecraft:inventory_changed': {
          slots: Opt(ObjectNode({
            empty: Reference('int_bounds'),
            occupied: Reference('int_bounds'),
            full: Reference('int_bounds')
          })),
          items: Opt(ListNode(
            Reference('item_predicate')
          ))
        },
        'minecraft:item_durability_changed': {
          delta: Reference('int_bounds'),
          durability: Reference('int_bounds'),
          item: Opt(Reference('item_predicate'))
        },
        'minecraft:item_used_on_block': {
          item: Opt(Reference('item_predicate')),
          location: Opt(Reference('location_predicate'))
        },
        'minecraft:killed_by_crossbow': {
          unique_entity_types: Reference('int_bounds'),
          victims: Opt(ListNode(
            EntityPredicate
          ))
        },
        'minecraft:levitation': {
          distance: Reference('distance_predicate'),
          duration: Reference('int_bounds')
        },
        'minecraft:location': {
          location: Opt(Reference('location_predicate'))
        },
        'minecraft:nether_travel': {
          distance: Reference('distance_predicate'),
          entered: Opt(Reference('location_predicate')),
          exited: Opt(Reference('location_predicate'))
        },
        'minecraft:placed_block': {
          block: Opt(StringNode({ validator: 'resource', params: { pool: 'block' } })),
          state: Opt(MapNode(
            StringNode(),
            StringNode(),
            { validation: { validator: 'block_state_map', params: { id: ['pop', { push: 'block' }] } } }
          )),
          item: Opt(Reference('item_predicate')),
          location: Opt(Reference('location_predicate'))
        },
        'minecraft:player_generates_container_loot': {
          loot_table: StringNode({ validator: 'resource', params: { pool: '$loot_table' } })
        },
        'minecraft:player_hurt_entity': {
          damage: Opt(Reference('damage_predicate')),
          entity: EntityPredicate
        },
        'minecraft:player_interacted_with_entity': {
          item: Opt(Reference('item_predicate')),
          entity: EntityPredicate
        },
        'minecraft:player_killed_entity': {
          entity: EntityPredicate,
          killing_blow: Opt(Reference('damage_source_predicate'))
        },
        'minecraft:recipe_unlocked': {
          recipe: StringNode({ validator: 'resource', params: { pool: '$recipe' } })
        },
        'minecraft:slept_in_bed': {
          location: Opt(Reference('location_predicate'))
        },
        'minecraft:slide_down_block': {
          block: Opt(StringNode({ validator: 'resource', params: { pool: 'block' } }))
        },
        'minecraft:shot_crossbow': {
          item: Opt(Reference('item_predicate'))
        },
        'minecraft:summoned_entity': {
          entity: EntityPredicate
        },
        'minecraft:tame_animal': {
          entity: EntityPredicate
        },
        'minecraft:target_hit': {
          projectile: EntityPredicate,
          shooter: EntityPredicate,
          signal_strength: Reference('int_bounds')
        },
        'minecraft:thrown_item_picked_up_by_entity': {
          entity: Opt(Reference('entity_predicate')),
          item: Opt(Reference('item_predicate'))
        },
        'minecraft:used_ender_eye': {
          distance: Reference('float_bounds')
        },
        'minecraft:used_totem': {
          item: Opt(Reference('item_predicate'))
        },
        'minecraft:villager_trade': {
          villager: Opt(Reference('entity_predicate')),
          item: Opt(Reference('item_predicate'))
        },
        'minecraft:voluntary_exile': {
          location: Reference('location_predicate')
        }
      }
    }, { context: 'criterion' }))
  }, { category: 'predicate', context: 'criterion' }))
}
