module.exports = {
	"extends": [
		'prettier',
	],
	"env": {
		"es6": true,
		"node": true
	},
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"tsconfigRootDir": __dirname,
		// Avoid Out of Memory error
		// https://github.com/typescript-eslint/typescript-eslint/issues/1192
		"project": "./packages/tsconfig-eslint.json"
	},
	"plugins": [
		"@typescript-eslint",
		"import"
	],
	"ignorePatterns": [
		"**/*.js",
		"**/*.cjs",
		"**/*.mjs",

		"**/node_modules",

		"**/dist",
		"**/lib",
		"**/out",

		"/scripts",
	],
	"rules": {
		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				"prefer": "type-imports"
			}
		],
		"@typescript-eslint/prefer-for-of": "warn",
		"@typescript-eslint/prefer-readonly": "warn",
		"@typescript-eslint/no-floating-promises": [
			"error",
			{
				"allowForKnownSafeCalls": [
					// https://github.com/nodejs/node/issues/51292#issuecomment-2241761056
					{
						from: "package",
						package: "node:test",
						name: ["describe", "it", "only", "skip", "todo"],
					},
				],
			},
		],
		"curly": "warn",
		"eqeqeq": "warn",
		"import/no-duplicates": "error",
		"indent": "off",
		"no-fallthrough": "warn",
		"no-restricted-properties": [
			"warn",
			{
				"object": "describe",
				"property": "only",
				"message": "Use for local testing only. Remember to remove it before merging to main.",
			},
			{
				"object": "it",
				"property": "only",
				"message": "Use for local testing only. Remember to remove it before merging to main.",
			},
		],
		"no-restricted-syntax": [
			"warn",
			// https://astexplorer.net/
			// https://eslint.org/docs/developer-guide/selectors
			{
				"selector": `:matches(
					TSNullKeyword,
					:not(
						CallExpression[callee.object.name="Object"][callee.property.name="create"]
					) > Literal[raw=null]
				)`.replace(/\s/g, ''),
				"message": "Use `undefined` instead of `null` when possible."
			},
			{
				"selector": 'ImportDeclaration > Literal[value=/\\bsrc\\b/]',
				"message": "Import from the `lib` dir instead of the `src` dir."
			},
			{
				"selector": 'CallExpression[callee.name=/describe|it/] > ObjectExpression > Property[key.name="only"][value.raw="true"]',
				"message": "Use { only: true } for local testing only. Remember to remove it before merging to main."
			},
		],
		"object-shorthand": "warn",
		"prefer-const": "warn",
		"prefer-object-spread": "warn",
	}
}
