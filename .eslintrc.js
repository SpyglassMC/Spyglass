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

		"**/node_modules",

		"**/dist",
		"**/lib",
		"**/out",
		"**/test-out",

		"packages/mcschema",
	],
	"rules": {
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
		"comma-dangle": "off",
		"@typescript-eslint/comma-dangle": ["warn", "always-multiline"],
		"indent": "off",
		"eol-last": "warn",
		"no-fallthrough": "warn",
		"prefer-const": "warn",
		"prefer-object-spread": "warn",
		"quote-props": [
			"warn",
			"as-needed"
		],
	}
}
