const {
	defineConfig,
	globalIgnores,
} = require("eslint/config");

const globals = require("globals");
const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const _import = require("eslint-plugin-import");

const {
	fixupPluginRules,
} = require("@eslint/compat");

const js = require("@eslint/js");

const {
	FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

module.exports = defineConfig([{
	extends: compat.extends("prettier"),

	languageOptions: {
		globals: {
			...globals.node,
		},

		parser: tsParser,
		// Avoid Out of Memory error
		// https://github.com/typescript-eslint/typescript-eslint/issues/1192
		parserOptions: {
			"tsconfigRootDir": __dirname,
			"project": "./packages/tsconfig-eslint.json",
		},
	},

	plugins: {
		"@typescript-eslint": typescriptEslint,
		import: fixupPluginRules(_import),
	},

	files: ["packages/*/{src,test}/**/*.{cts,mts,ts}"],

	rules: {
		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				"prefer": "type-imports",
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
					}
				],
			}
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
			}
		],

		"no-restricted-syntax": [
			"warn",
			// https://astexplorer.net/
			// https://eslint.org/docs/developer-guide/selectors
			{
				selector: `:matches(
					TSNullKeyword,
					:not(
						CallExpression[callee.object.name="Object"][callee.property.name="create"]
					) > Literal[raw=null]
				)`.replace(/\s/g, ""),
				message: "Use `undefined` instead of `null` when possible.",
			},
			{
				selector: "ImportDeclaration > Literal[value=/\\bsrc\\b/]",
				message: "Import from the `lib` dir instead of the `src` dir.",
			},
			{
				selector: "CallExpression[callee.name=/describe|it/] > ObjectExpression > Property[key.name=\"only\"][value.raw=\"true\"]",
				message: "Use { only: true } for local testing only. Remember to remove it before merging to main.",
			}
		],

		"object-shorthand": "warn",
		"prefer-const": "warn",
		"prefer-object-spread": "warn"
	},
}, globalIgnores([
	"**/*.js",
	"**/*.cjs",
	"**/*.mjs",
	"**/node_modules",
	"**/dist",
	"**/lib",
	"**/out",
	"scripts",
])]);
