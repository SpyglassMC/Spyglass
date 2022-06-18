module.exports = {
	"env": {
		"es6": true,
		"node": true
	},
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"tsconfigRootDir": __dirname,
		"project": "./packages/**/tsconfig.json"
	},
	"plugins": [
		"@typescript-eslint"
	],
	"ignorePatterns": [
		"**/*.js",
		"**/*.cjs",
		"**/*.mjs",

		"**/node_modules",

		"**/dist",
		"**/lib",
		"**/out",
		"**/test-out",

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
		"@typescript-eslint/quotes": [
			"warn",
			"single",
			{
				"avoidEscape": true
			}
		],
		"@typescript-eslint/semi": [
			"warn",
			"never"
		],
		"@typescript-eslint/indent": [
			"warn",
			"tab"
		],
		"@typescript-eslint/member-delimiter-style": [
			"warn",
			{
				"multiline": {
					"delimiter": "comma",
					"requireLast": true
				},
				"singleline": {
					"delimiter": "comma",
					"requireLast": false
				},
				"overrides": {
					"interface": {
						"multiline": {
							"delimiter": undefined
						}
					}
				}
			}
		],
		"@typescript-eslint/no-floating-promises": "error",
		"comma-dangle": "off",
		"@typescript-eslint/comma-dangle": ["warn", "always-multiline"],
		"indent": "off",
		"eol-last": "warn",
		"no-fallthrough": "warn",
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
				"selector": 'ImportDeclaration > Literal[value=/src/]',
				"message": "Import from the `lib` dir instead of the `src` dir."
			},
		],
		"prefer-const": "warn",
		"prefer-object-spread": "warn",
		"quote-props": [
			"warn",
			"as-needed"
		],
	}
}
