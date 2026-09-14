import type { ReferenceType } from './index.js'

const TypeReferences = {
	'item_count_predicate': '::java::world::component::predicate::ItemCountPseudoPredicate',
	'item_modifier': '::java::data::item_modifier::ItemModifierArgument',
	'pack_meta': '::java::pack::Pack',
	'slot_source': '::java::data::slot_source::SlotSourceArgument',
	'tag': '::java::data::tag::Tag',
	'text_component': '::java::util::text::Text',
	'text_style': '::java::util::text::TextStyle',
} as const satisfies Record<string, `::${string}::${string}`>
export type TypeReferenceKey = keyof typeof TypeReferences

export function typeRef(key: TypeReferenceKey): ReferenceType {
	return { kind: 'reference', path: TypeReferences[key] }
}
