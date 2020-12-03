import {
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

export function initRecipeSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
  const Reference = RawReference.bind(undefined, schemas)
  const StringNode = RawStringNode.bind(undefined, collections)

  schemas.register('recipe', Mod(ObjectNode({
    type: StringNode({ validator: 'resource', params: { pool: 'recipe_serializer' } }),
    [Switch]: path => path.push('type'),
    [Case]: {
      'minecraft:crafting_shaped': {
        group: Opt(StringNode({ enum: 'recipe_group', additional: true })),
        pattern: ListNode(StringNode()), // TODO: add validation
        key: MapNode(
          StringNode(), // TODO: add validation
          Reference('recipe_ingredient')
        ),
        result: Reference('recipe_result')
      },
      'minecraft:crafting_shapeless': {
        group: Opt(StringNode()),
        ingredients: ListNode(Reference('recipe_ingredient')),
        result: Reference('recipe_result')
      },
      'minecraft:smelting': {
        group: Opt(StringNode()),
        ingredient: Reference('recipe_ingredient'),
        result: StringNode({ validator: 'resource', params: { pool: 'item' } }),
        experience: Opt(NumberNode()),
        cookingtime: Opt(Mod(NumberNode({ integer: true }), { default: () => 200 }))
      },
      'minecraft:blasting': {
        group: Opt(StringNode()),
        ingredient: Reference('recipe_ingredient'),
        result: StringNode({ validator: 'resource', params: { pool: 'item' } }),
        experience: Opt(NumberNode()),
        cookingtime: Opt(Mod(NumberNode({ integer: true }), { default: () => 100 }))
      },
      'minecraft:smoking': {
        group: Opt(StringNode()),
        ingredient: Reference('recipe_ingredient'),
        result: StringNode({ validator: 'resource', params: { pool: 'item' } }),
        experience: Opt(NumberNode()),
        cookingtime: Opt(Mod(NumberNode({ integer: true }), { default: () => 100 }))
      },
      'minecraft:campfire_cooking': {
        group: Opt(StringNode()),
        ingredient: Reference('recipe_ingredient'),
        result: StringNode({ validator: 'resource', params: { pool: 'item' } }),
        experience: Opt(NumberNode()),
        cookingtime: Opt(Mod(NumberNode({ integer: true }), { default: () => 100 }))
      },
      'minecraft:stonecutting': {
        group: Opt(StringNode()),
        ingredient: Reference('recipe_ingredient'),
        result: StringNode({ validator: 'resource', params: { pool: 'item' } }),
        count: NumberNode({ integer: true })
      },
      'minecraft:smithing': {
        group: Opt(StringNode()),
        base: Reference('recipe_ingredient_object'),
        addition: Reference('recipe_ingredient_object'),
        result: Reference('recipe_result')
      }
    }
  }, { context: 'recipe' }), {
    default: () => ({
      type: 'minecraft:crafting_shaped'
    })
  }))

  schemas.register('recipe_ingredient', Mod(ChoiceNode([
    {
      type: 'object',
      node: Reference('recipe_ingredient_object'),
      change: v => v[0]
    },
    {
      type: 'list',
      node: ListNode(Reference('recipe_ingredient_object')),
      change: v => [v]
    }
  ]), {
    default: () => ({
      item: 'minecraft:stone'
    })
  }))

  schemas.register('recipe_ingredient_object', Mod(ObjectNode({
    item: Opt(StringNode({ validator: 'resource', params: { pool: 'item' } })),
    tag: Opt(StringNode({ validator: 'resource', params: { pool: '$tag/item' } }))
  }), {
    default: () => ({
      item: 'minecraft:stone'
    })
  }))

  schemas.register('recipe_result', Mod(ObjectNode({
    item: StringNode({ validator: 'resource', params: { pool: 'item' } }),
    count: Opt(Mod(NumberNode({ integer: true }), { default: () => 1 }))
  }), {
    default: () => ({
      item: 'minecraft:stone'
    })
  }))
}
