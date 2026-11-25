import type { ArgumentTreeNode } from '../../../dependency/index.js'
import type { NodeMigrationRule } from './index.js'

interface LegacyArgumentTreeNode extends ArgumentTreeNode {
	parser?: string
	properties?: Record<string, any>
}

const RenamedParsers: Record<string, string> = {
	'brigadier:bool': 'minecraft:bool',
	'brigadier:double': 'minecraft:double',
	'brigadier:float': 'minecraft:float',
	'brigadier:integer': 'minecraft:integer',
	'minecraft:resource_key': 'minecraft:resource',
	'minecraft:resource_or_tag_key': 'minecraft:resource_or_tag',
}

const StringParserSplit: Record<string, string> = {
	word: 'minecraft:word',
	phrase: 'minecraft:quoted_string',
	greedy: 'minecraft:greedy_string',
}

export const ARGUMENT_26_4: NodeMigrationRule = {
	until: '26.4',
	apply: (node) => {
		if (node.type === 'argument') {
			const { parser, properties } = node as LegacyArgumentTreeNode
			// `parser` exists -> is real legacy node
			if (parser !== undefined) {
				// General data structure change
				node.argument = {
					...properties,
					// this will overwrite 'type' in properties
					type: RenamedParsers[parser] ?? parser,
				}
				delete (node as LegacyArgumentTreeNode).parser
				delete (node as LegacyArgumentTreeNode).properties

				// Parser data format change
				switch (parser) {
					case 'brigadier:string':
						const stringType: string = properties!['type']
						node.argument.type = StringParserSplit[stringType]
						break
					case 'minecraft:entity':
						node.argument['players_only'] = properties!['type'] === 'players'
						node.argument['single_result'] = properties!['amount'] === 'single'
						delete node.argument['amount']
						break
					case 'minecraft:score_holder':
						node.argument['multiple'] = properties!['amount'] === 'multiple'
						delete node.argument['amount']
						break
				}
			}
		}
	},
}
