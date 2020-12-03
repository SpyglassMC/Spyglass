import { CollectionRegistry, SchemaRegistry } from '@mcschema/core'
import { initBiomeSchemas } from './Biome'
import { initCarverSchemas } from './Carver'
import { initDecoratorSchemas } from './Decorator'
import { initFeatureSchemas } from './Feature'
import { initNoiseSettingsSchemas } from './NoiseSettings'
import { initProcessorListSchemas } from './ProcessorList'
import { initStructureFeatureSchemas } from './StructureFeature'
import { initSurfaceBuilderSchemas } from './SurfaceBuilder'
import { initTemplatePoolSchemas } from './TemplatePool'

export function initWorldgenSchemas(schemas: SchemaRegistry, collections: CollectionRegistry) {
    initBiomeSchemas(schemas, collections)
    initCarverSchemas(schemas, collections)
    initDecoratorSchemas(schemas, collections)
    initFeatureSchemas(schemas, collections)
    initNoiseSettingsSchemas(schemas, collections)
    initProcessorListSchemas(schemas, collections)
    initStructureFeatureSchemas(schemas, collections)
    initSurfaceBuilderSchemas(schemas, collections)
    initTemplatePoolSchemas(schemas, collections)
}
