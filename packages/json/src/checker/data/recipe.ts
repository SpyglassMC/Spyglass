import { patternKeys, recipeGroup } from '../common'
import { any, as, dispatch, float, int, intRange, listOf, object, opt, pick, record, resource, simpleString, when } from '../primitives'

const one_recipe_ingredient = any([
	record({
		item: resource('item'),
	}),
	record({
		tag: resource('tag/item'),
	}),
])

const recipe_ingredient = any([
	one_recipe_ingredient,
	listOf(one_recipe_ingredient),
])

const recipe_result = record({
	item: resource('item'),
	count: opt(intRange(1, 64)),
})

export const recipe = as('recipe', dispatch('type',
	(type, props) => record({
		type: resource('recipe_serializer'),
		group: opt(recipeGroup),
		...pick(type, {
			crafting_shaped: {
				pattern: listOf(simpleString),
				key: object(
					patternKeys(props),
					() => recipe_ingredient,
				),
				result: recipe_result,
			},
			crafting_shapeless: {
				ingredients: listOf(recipe_ingredient),
				result: recipe_result,
			},
			stonecutting: {
				ingredient: recipe_ingredient,
				result: resource('item'),
				count: int,
			},
			smithing: {
				base: one_recipe_ingredient,
				addition: one_recipe_ingredient,
				result: recipe_result,
			},
		}),
		...when(type, ['blasting', 'campfire_cooking', 'smelting', 'smoking'], {
			ingredient: recipe_ingredient,
			result: resource('item'),
			experience: opt(float),
			cookingtime: opt(int),
		}),
	})
))
