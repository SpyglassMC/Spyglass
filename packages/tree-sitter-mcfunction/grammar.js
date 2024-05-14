// @ts-check

/// <reference types="tree-sitter-cli/dsl" />

const fs = require('fs')

/**
 * Float pattern created from a combination of:
 * - https://github.com/Mojang/brigadier/blob/cf754c4ef654160dca946889c11941634c5db3d5/src/main/java/com/mojang/brigadier/StringReader.java#L137
 * - https://docs.oracle.com/javase/7/docs/api/java/lang/Double.html#valueOf%28java.lang.String%29
 *
 * i.e. Only `[0-9\.\-]` is allowed in the number, and its format must
 * follow the Java Language Specification.
 *
 * i.e.
 *
 * ```
 * [NegativeSign] Digits [`.`] [Digits] |
 * [NegativeSign] `.` Digits
 * ```
 */
const BrigadierFloatPattern = /-?(\d+\.?\d*|\.\d+)/
const BrigadierIntPattern = /-?\d+/
const BrigadierUnquotedPattern = /[0-9A-Za-z_.+-]+/
const BrigadierQuotedPattern = /"([^"\\]|\\[\\"])*"|'([^'\\]|\\[\\'])*'/

const CommandDataPath = './commands.json'

/**
 * @typedef {{
 *    type: 'root',
 *    children: Record<string, LiteralNode>,
 * }} RootNode
 *
 * @typedef {{
 *    type: 'literal',
 *    children: Record<string, LiteralNode | ArgumentNode>,
 *    executable?: boolean,
 *    redirect?: [string],
 * }} LiteralNode
 *
 * @typedef {{
 *    type: 'argument',
 *    parser: string,
 *    properties?: Record<string, any>,
 *    children?: Record<string, LiteralNode | ArgumentNode>,
 *    executable?: boolean,
 *    redirect?: [string],
 * }} ArgumentNode
 */

/** @type {RootNode} */
const root = JSON.parse(fs.readFileSync(CommandDataPath, 'utf-8'))

/**
 * @type {RuleBuilders<string, never>}
 */
const ArgumentRules = {
	// Brigadier argument types
	'bool_argument': _ => choice('false', 'true'),
	'double_argument': $ => $._brigadier_float,
	'float_argument': $ => $._brigadier_float,
	'integer_argument': $ => $._brigadier_int,
	'long_argument': $ => $._brigadier_int,
	'word_argument': $ => $._brigadier_quoted,
	'phrase_argument': $ => token(choice(
		$._brigadier_unquoted,
		$._brigadier_quoted,
	)),
	'greedy_argument': $ => $._greedy,

	// Minecraft argument types
	'angle_argument': $ => $._coordinate,
	'block_pos_argument': $ => $._vec_xyz,
	'block_predicate_argument': $ => $._block,
	'block_state_argument': $ => $._block,
	'color_argument': _ => token(choice(
		'reset',
		'aqua',
		'black',
		'blue',
		'dark_aqua',
		'dark_blue',
		'dark_gray',
		'dark_green',
		'dark_purple',
		'dark_red',
		'gold',
		'gray',
		'green',
		'light_purple',
		'red',
		'white',
		'yellow',
	)),
	'column_pos_argument': $ => $._vec_xz,
	'component_argument': $ => $._greedy, // TODO
	'dimension_argument': $ => $._resource_location,
	'entity_argument': $ => $._greedy, // TODO
	'entity_anchor_argument': _ => token(choice(
		'eyes',
		'feet',
	)),
	'entity_summon_argument': $ => $._resource_location,
	'float_range_argument': $ => choice(
		seq(
			field('min', $._brigadier_float),
			optional(seq(
				field('sep', '..'),
				optional(field('max', $._brigadier_float)),
			)),
		),
		seq(
			field('sep', '..'),
			field('max', $._brigadier_float),
		),
	),
	'function_argument': $ => $._resource_location_or_tag,
	'game_profile_argument': $ => $._greedy, // TODO
	'gamemode_argument': _ => token(choice(
		'adventure',
		'creative',
		'spectator',
		'survival',
	)),
	'heightmap_argument': _ => token(choice(
		'motion_blocking',
		'motion_blocking_no_leaves',
		'ocean_floor',
		'world_surface',
	)),
	'int_range_argument': $ => choice(
		seq(
			field('min', $._brigadier_int),
			optional(seq(
				field('sep', '..'),
				optional(field('max', $._brigadier_int)),
			)),
		),
		seq(
			field('sep', '..'),
			field('max', $._brigadier_int),
		),
	),
	'item_predicate_argument': $ => $._greedy, // TODO
	'item_slot_argument': $ => $._greedy, // TODO
	'item_stack_argument': $ => $._greedy, // TODO
	'message_argument': $ => $._greedy, // TODO
	'nbt_compound_tag_argument': $ => $._greedy, // TODO
	'nbt_path_argument': $ => $._greedy, // TODO
	'nbt_tag_argument': $ => $._greedy, // TODO
	'objective_argument': $ => $._brigadier_unquoted,
	'objective_criteria_argument': $ => $._greedy, // TODO
	'operation_argument': _ => token(choice(
		'=', '+=', '-=', '*=', '/=', '%=', '<', '>', '><',
	)),
	'particle_argument': $ => $._greedy, // TODO
	'resource_argument': $ => $._resource_location,
	'resource_key_argument': $ => $._resource_location,
	'resource_location_argument': $ => $._resource_location,
	'resource_or_tag_argument': $ => $._resource_location_or_tag,
	'resource_or_tag_key_argument': $ => $._resource_location_or_tag,
	'rotation_argument': $ => $._vec_yawpitch,
	'score_holder_argument': $ => $._greedy, // TODO
	'scoreboard_slot_argument': $ => $._greedy, // TODO
	'style_argument': $ => $._greedy, // TODO
	'swizzle_argument': _ => token(choice(
		'x', 'xy', 'xz', 'xyz', 'xzy',
		'y', 'yx', 'yz', 'yxz', 'yzx',
		'z', 'zx', 'zy', 'zxy', 'zyx',
	)),
	'team_argument': $ => $._brigadier_unquoted,
	'template_mirror_argument': _ => token(choice(
		'none', 'front_back', 'left_right',
	)),
	'template_rotation_argument': _ => token(choice(
		'none', 'clockwise_90', 'counterclockwise_90', '180',
	)),
	'time_argument': $ => seq(
		field('value', $._brigadier_float),
		optional(field('unit', /[dst]/)),
	),
	'uuid_argument': _ => /[0-9a-f]+-[0-9a-f]+-[0-9a-f]+-[0-9a-f]+-[0-9a-f]+/i,
	'vec2_argument': $ => $._vec_xy,
	'vec3_argument': $ => $._vec_xyz,
}

module.exports = grammar({
	name: 'mcfunction',

	extras: $ => [
		$.line_continuation,
	],

	inline: $ => [
		$.command,
	],

	supertypes: $ => [
		$.command,
	],

	word: $ => $._literal,

	rules: {
		document: $ => repeat(seq(
			optional($._whitespace),
			optional(choice($.command, $.comment, $.macro_line)),
			optional($._whitespace),
			$._eol,
		)),

		...generateCommandRules(root),
		comment: _ => /#.*/,
		macro_line: $ => prec.left(seq('$', repeat(choice(
			$.macro_variable,
			...Object.keys(ArgumentRules).map((r) => $[r]),
			$._whitespace,
			$._greedy,
		)))),

		...ArgumentRules,
		macro_variable: $ => seq(
			'$(',
			field('name', $._literal),
			')',
		),

		_literal: _ => BrigadierUnquotedPattern,

		_eol: _ => /\r?\n|\x00/,
		line_continuation: _ => /\\(\r?\n|\x00)/,
		_whitespace: _ => /[ \t]/,

		_block: $ => $._greedy,
		_brigadier_float: _ => BrigadierFloatPattern,
		_brigadier_int: _ => BrigadierIntPattern,
		_brigadier_unquoted: _ => BrigadierUnquotedPattern,
		_brigadier_quoted: _ => BrigadierQuotedPattern,
		_coordinate: $ => seq(
			field('notation', optional(/[~^]/)),
			field('value', $._brigadier_float),
		),
		_resource_location: _ => /([a-z0-9_.-]*:)?[a-z0-9_.-\/]+/,
		_resource_location_or_tag: $ => token(seq(
			optional(field('tag', '#')),
			field('location', $._resource_location),
		)),
		_vec_xy: $ => seq(
			field('x', $._coordinate),
			' ',
			field('y', $._coordinate),
		),
		_vec_xz: $ => seq(
			field('x', $._coordinate),
			' ',
			field('z', $._coordinate),
		),
		_vec_yawpitch: $ => seq(
			field('yaw', $._coordinate),
			' ',
			field('pitch', $._coordinate),
		),
		_vec_xyz: $ => seq(
			field('x', $._coordinate),
			' ',
			field('y', $._coordinate),
			' ',
			field('z', $._coordinate),
		),
		_greedy: _ => prec(-1, /.+/),
	}
})

/**
 * Generates rules to parse commands.
 *
 * @param {RootNode} root
 *
 * @return {RuleBuilders<string, never>}
 */
function generateCommandRules(root) {
	/**
	 * Generates a rule to parse an alternatives of children and all their
	 * subsequent children and redirects.
	 *
	 * @param {GrammarSymbols<string>} $
	 * @param {Record<string, ArgumentNode | LiteralNode>} children
	 *
	 * @return {RuleOrLiteral}
	 */
	 function convertChildren($, children) {
		// Each key-value pair in the children contributes to a subrule in the choice
		// rule for the entire children.
		/** @type {RuleOrLiteral[]} */
		const choices = Object.entries(children).map(
			(pair) => convertKeyValuePair($, pair),
		)

		return choices.length === 1
			? choices[0]
			: choice(...choices)
	 }

	/**
	 * Generates a rule to parse a key-value pair and all its subsequent
	 * children and redirect.
	 *
	 * @param {GrammarSymbols<string>} $
	 * @param {[name: string, node: ArgumentNode | LiteralNode]}
	 *
	 * @return {RuleOrLiteral}
	 */
	function convertKeyValuePair($, [name, node]) {
		// Generate rule to parse the subsequent children of the node
		// recursively.
		const childrenRule = node.children
			? convertChildren($, node.children)
			: undefined
		// Generate rule to parse the subsequent redirected child of the node
		// by referencing the existing grammar symbol created for that commad.
		const redirectRule = node.redirect
			? $[`${node.redirect[0]}_command`]
			: undefined
		// Return rule to parse the current child and all its subsequent
		// children. Only wraps in argumentSeq() if there are multiple rules.
		return childrenRule || redirectRule
			? argumentSeq(
				convertNode($, name, node),
				...childrenRule
					? [wrapOptionalIfExecutable(childrenRule, node.executable)]
					: [],
				...redirectRule
					? [wrapOptionalIfExecutable(redirectRule, node.executable)]
					: []
			)
			: convertNode($, name, node)
	}

	/**
	 * Generates a rule to parse a child node itself without regards to its
	 * children or redirect.
	 *
	 * @param {GrammarSymbols<string>} $
	 * @param {string} name
	 * @param {ArgumentNode | LiteralNode} node
	 *
	 * @return {RuleOrLiteral}
	 */
	function convertNode($, name, node) {
		if (node.type === 'argument') {
			return field(name, getRuleForArgumentParser($, node))
		} else if (node.type === 'literal') {
			return name
		} else {
			throw new Error(`Unsupported node ${JSON.parse(node)}`)
		}
	}

	/**
	 * Wraps a rule in optional() if the node is executable.
	 *
	 * @param {RuleOrLiteral} rule
	 * @param {boolean | undefined} executable
	 *
	 * @return {RuleOrLiteral}
	 */
	function wrapOptionalIfExecutable(rule, executable) {
		return executable ? optional(rule) : rule
	}

	/**
	 * Returns a grammar rule that parses a command argument type.
	 *
	 * @param {GrammarSymbols<string>} $
	 * @param {ArgumentNode}
	 *
	 * @return {RuleOrLiteral}
	 */
	function getRuleForArgumentParser($, { parser, properties }) {
		/**
		 * @type {Record<string, keyof typeof ArgumentRules>}
		 */
		const Mapping = {
			'brigadier':
		}

		// Set the rule name to be the path part of the parser ID appended with
		// '_argument'.
		//
		// @example 'minecraft:resource_key' => 'resource_key_argument'
		/** @type {string} */
		let ruleName = `${parser.slice(parser.indexOf(':') + 1)}_argument`

		if (ruleName == 'string_argument') {
			// brigadier:string is the only parser whose properties affect
			// the lexical process. We have a separate rule for each of the three
			// different types of strings.
			ruleName = `${properties?.type}_argument`
		}

		return ruleName in ArgumentRules
			? $[ruleName]
			: $._whatever
	}

	return {
		// Define 'command' rule to be alternatives between all command symbols.
		command: $ => choice(
			...Object.keys(root.children).map((k) => $[`${k}_command`]),
		),
		// Register a symbol for each command rule.
		...Object.fromEntries(Object.entries(root.children).map(
			([name, node]) => {
				/** @type {RuleBuilder<string>} */
				const ruleBuilder = $ => convertKeyValuePair($, [name, node])
				return [`${name}_command`, ruleBuilder]
			}
		)),
	}
}

/**
 * Creates a rule to match the subrules separated by a space character
 *
 * @param {readonly RuleOrLiteral[]} subrules
 *
 * @returns {SeqRule}
 */
function argumentSeq(...subrules) {
	/** @type {RuleOrLiteral[]} */
	const newRules = []
	for (const [i, rule] of subrules.entries()) {
		if (i !== 0) {
			newRules.push(' ')
		}
		newRules.push(rule)
	}
	return seq(...newRules)
}
