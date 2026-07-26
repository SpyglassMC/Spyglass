import type { McdocType } from './index.js'

const TypeReferences = {
	'pack_meta': '::java::pack::Pack',
	'tag': '::java::data::tag::Tag',
	'text_component': '::java::util::text::Text',
	'text_style': '::java::util::text::TextStyle',
} as const satisfies Record<string, string>
export type TypeReferenceKey = keyof typeof TypeReferences

export function typeRefPath(key: TypeReferenceKey): `::${string}::${string}` {
	return TypeReferences[key]
}

export function typeRef(key: TypeReferenceKey): McdocType {
	return { kind: 'reference', path: TypeReferences[key] }
}
