import { CollectionRegistry, SchemaRegistry } from '@mcschema/core'
import { initCollections } from './Collections'
import { initSchemas } from './schemas'

export * as lootContext from './LootContext'

export function getCollections() {
    const collections = new CollectionRegistry()
    initCollections(collections)
    return collections
}

/**
 * @param collections The CollectionRegistry for this version. Note that apart from
 * the built-in collections, the client of this module is responsible for futhermore
 * adding the vanilla registries to it: the collection IDs shouldn't contain the
 * namespace (`minecraft:`) part, while the values within the collections should. 
 * 
 * @example
 * for (const key in VANILLA_REGISTRIES>) {
 *   collections.register(
 *     key.replace(/^minecraft:/, ''), 
 *     Object.keys(VANILLA_REGISTRIES[key].entries)
 *   )
 * }
 */
export function getSchemas(collections: CollectionRegistry) {
    const schemas = new SchemaRegistry()
    initSchemas(schemas, collections)
    return schemas
}
