import * as core from '@spyglassmc/core/lib/index.js'
import { mockProjectData } from '@spyglassmc/core/test-out/utils.js'
import { localeQuote } from '@spyglassmc/locales'
import type {
	McdocCheckerError,
	McdocCheckerOptions,
} from '@spyglassmc/mcdoc/lib/runtime/checker/index.js'
import { typeDefinition } from '@spyglassmc/mcdoc/lib/runtime/checker/index.js'
import type { McdocType, UnionType } from '@spyglassmc/mcdoc/lib/type/index.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'

describe('mcdoc runtime checker', () => {
	type JsValue = boolean | number | string | JsValue[] | {
		[key: string]: JsValue
	}
	const suites: { name: string; type: McdocType; values: JsValue[] }[] = [
		{
			name: 'struct { test: double }',
			type: {
				kind: 'struct',
				fields: [
					{ kind: 'pair', key: 'test', type: { kind: 'double' } },
				],
			},
			values: [
				{ test: 1 },
				{ test: 'hello' },
			],
		},
		{
			name: 'struct { test: string }',
			type: {
				kind: 'struct',
				fields: [
					{ kind: 'pair', key: 'test', type: { kind: 'string' } },
				],
			},
			values: [
				{ test: 1 },
			],
		},
	]

	function inferType(value: JsValue): Exclude<McdocType, UnionType> {
		if (typeof value === 'boolean') {
			return { kind: 'boolean' }
		} else if (typeof value === 'number') {
			return {
				kind: 'literal',
				value: { kind: 'double', value: Number(value) },
			}
		} else if (typeof value === 'string') {
			return { kind: 'literal', value: { kind: 'string', value: value } }
		} else if (Array.isArray(value)) {
			return { kind: 'list', item: { kind: 'any' } }
		} else if (typeof value === 'object') {
			return { kind: 'struct', fields: [] }
		} else {
			return { kind: 'any' }
		}
	}

	for (const { name, type, values } of suites) {
		describe(`typeDefinition ${localeQuote(name)}`, () => {
			for (const value of values) {
				it(`with value ${JSON.stringify(value)}`, () => {
					const errors: McdocCheckerError<JsValue>[] = []
					const options: McdocCheckerOptions<JsValue> = {
						context: core.CheckerContext.create(mockProjectData(), {
							doc: TextDocument.create('', '', 0, ''),
						}),
						getChildren: (value) => {
							if (Array.isArray(value)) {
								return value.map((e) => [{
									originalNode: e,
									inferredType: inferType(e),
								}])
							} else if (typeof value === 'object') {
								return Object.entries(value).map(([k, v]) => ({
									key: { originalNode: k, inferredType: inferType(k) },
									possibleValues: [{
										originalNode: v,
										inferredType: inferType(v),
									}],
								}))
							}
							return []
						},
						reportError: (error) => {
							errors.push(error)
						},
						isEquivalent: () => false,
						attachTypeInfo: () => {},
					}
					typeDefinition(
						[{ originalNode: value, inferredType: inferType(value) }],
						type,
						options,
					)
					snapshot(errors)
				})
			}
		})
	}
})
